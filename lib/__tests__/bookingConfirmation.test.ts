/**
 * Phase 6 (item 1): the confirmation payload no longer travels in the URL, and
 * Google Analytics no longer reports a URL nobody looked at.
 *
 * Website-only. The widget hands the same fields to its confirmation view in
 * memory and loads no analytics of its own.
 *
 * Run with: npm test
 */

import assert from "assert";
import { parseBookingConfirmation } from "../bookingConfirmation";
import { analyticsPageLocation } from "../analytics";

/* ── Payload handover ─────────────────────────────────────────────── */

const full = {
    name: "Dana Reyes",
    date: "Monday, September 8",
    time: "8:00 AM – 11:00 AM",
    price: "$245 – $310",
    serviceType: "both",
    address: "1234 Main St Unit 4B, Springfield, IL 62704",
    dumpsterPrice: "20 Yard — Starting at $395",
    debrisType: "Household Junk",
    rentalDuration: "About a week",
    autoBooked: true,
    dumpsterError: "",
    cardIssue: "already_on_file",
};

// Everything the page renders survives the round trip unchanged.
assert.deepStrictEqual(parseBookingConfirmation(JSON.stringify(full)), full);

// The minimum the wizard ever writes; absent fields read as empty, exactly as
// `params.get(...) || ""` did.
assert.deepStrictEqual(
    parseBookingConfirmation(JSON.stringify({ serviceType: "junk" })),
    {
        name: "", date: "", time: "", price: "", serviceType: "junk",
        address: "", dumpsterPrice: "", debrisType: "", rentalDuration: "",
        autoBooked: false, dumpsterError: "", cardIssue: "",
    },
);

// autoBooked drove the heading and message; it must not be truthy by accident.
assert.strictEqual(parseBookingConfirmation(JSON.stringify({ serviceType: "both", autoBooked: "true" }))!.autoBooked, false);
assert.strictEqual(parseBookingConfirmation(JSON.stringify({ serviceType: "both", autoBooked: 1 }))!.autoBooked, false);
assert.strictEqual(parseBookingConfirmation(JSON.stringify({ serviceType: "both", autoBooked: true }))!.autoBooked, true);

// A non-string field is dropped rather than rendered as "[object Object]".
assert.strictEqual(parseBookingConfirmation(JSON.stringify({ serviceType: "junk", name: { first: "Dana" } }))!.name, "");
assert.strictEqual(parseBookingConfirmation(JSON.stringify({ serviceType: "junk", price: 245 }))!.price, "");

// Nothing to show → null, and the page falls back rather than crashing. These
// are the shared-link, new-tab and cleared-storage cases.
assert.strictEqual(parseBookingConfirmation(null), null, "no key stored");
assert.strictEqual(parseBookingConfirmation(undefined), null);
assert.strictEqual(parseBookingConfirmation(""), null);
assert.strictEqual(parseBookingConfirmation("{not json"), null, "a truncated write must not throw");
assert.strictEqual(parseBookingConfirmation("null"), null);
assert.strictEqual(parseBookingConfirmation('"a string"'), null);
assert.strictEqual(parseBookingConfirmation("[]"), null, "an array is not a payload");
assert.strictEqual(parseBookingConfirmation("{}"), null, "no serviceType — not ours");

/* ── What Google Analytics is told ────────────────────────────────── */

// The regression: this URL put a customer's name and service address into the
// operator's GA property. Even now that the wizard no longer builds it, an
// explicit page_view must not report one.
assert.strictEqual(
    analyticsPageLocation("https://example.com/booking-confirmed?name=Dana+Reyes&address=1234+Main+St&price=%24245"),
    "https://example.com/booking-confirmed",
);

// Ordinary pages pass through untouched.
assert.strictEqual(analyticsPageLocation("https://example.com/"), "https://example.com/");
assert.strictEqual(analyticsPageLocation("https://example.com/book"), "https://example.com/book");

// Campaign parameters survive — GA4 reads acquisition source from them, and the
// phone agent's SMS links are the reason utm_source exists on this site.
assert.strictEqual(
    analyticsPageLocation("https://example.com/book?utm_source=phone_agent"),
    "https://example.com/book?utm_source=phone_agent",
);
assert.strictEqual(
    analyticsPageLocation("https://example.com/book?promo=FALL20&utm_medium=sms"),
    "https://example.com/book?utm_medium=sms&promo=FALL20",
);
// Kept and dropped parameters in the same URL.
assert.strictEqual(
    analyticsPageLocation("https://example.com/book?utm_source=sms&email=dana%40example.com"),
    "https://example.com/book?utm_source=sms",
);

// An allowlist fails closed: a parameter nobody has thought about is dropped.
assert.strictEqual(
    analyticsPageLocation("https://example.com/x?some_future_param=whatever"),
    "https://example.com/x",
);
// The fragment goes too — nothing reads it, and it is one more place to hide.
assert.strictEqual(
    analyticsPageLocation("https://example.com/book#name=Dana"),
    "https://example.com/book",
);
// Port and protocol are preserved, so localhost and staging still report right.
assert.strictEqual(analyticsPageLocation("http://localhost:3000/book?x=1"), "http://localhost:3000/book");

// An unparseable value is returned as-is rather than throwing inside analytics.
assert.strictEqual(analyticsPageLocation("not a url"), "not a url");

console.log("bookingConfirmation: all assertions passed");
