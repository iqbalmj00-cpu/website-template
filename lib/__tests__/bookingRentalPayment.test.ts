import assert from "node:assert/strict";
import { readOutcome, readSavedOutcomes, restoreIntent, saveIntent } from "../bookingIntent";
import { parseBookingConfirmation } from "../bookingConfirmation";
import { readRentalCardGrant, newRentalPaymentRecovery, readRentalPaymentRecovery, readRentalPaymentCommand, runRentalPaymentCommand,
    type RentalPaymentRecovery, type RentalPaymentCommand } from "../bookingRentalPayment";
const grant = { status: "available" as const, rentalId: "r1", expiresAt: "2035-01-01T00:00:00.000Z", grant: "eyJhbGciOiJIUzI1NiJ9.eyJmaXh0dXJlIjp0cnVlfQ.signature" };
const quote = { rentalId: "r1", rentalNumber: 1, address: "10 Fixture Street", subtotalCents: 10000, taxRate: 10, taxCents: 1000, totalCents: 11000, paidCents: 1000, depositCents: 500, amountCents: 9500, currency: "usd" };
const review = { mode: "selected_rental", quote, reviewToken: grant.grant, expiresAt: grant.expiresAt, stripeAccountId: "acct_fixture", payment: { status: "not_requested", amountCents: 9500 } };
const setup = { mode: "selected_rental", setupIntentId: "seti_fixture", receiptId: `pcs_${"a".repeat(64)}`, stripeAccountId: "acct_fixture", clientSecret: "seti_fixture_secret_never_store", payment: { status: "not_requested" } };
const outcome = { contractVersion: 2, service: "dumpster", outcome: "scheduled", success: true, leadId: "lead1", jobId: "job1", rentalId: "r1", customerId: "customer1", rentalCard: grant };
async function main() {
    assert.deepEqual(readRentalCardGrant(grant, "r1"), grant);
    for (const malformed of [{ ...grant, rentalId: "other" }, { ...grant, expiresAt: "tomorrow" }, { ...grant, grant: "bad" }, { ...grant, clientSecret: "secret" }]) assert.equal(readRentalCardGrant(malformed, "r1"), undefined);
    const ack = readOutcome({ status: 200, data: outcome }, "dumpster");
    assert.deepEqual(ack.rentalCard, grant);
    assert.deepEqual(readSavedOutcomes({ dumpster: ack }).dumpster?.rentalCard, grant);
    assert.equal(readOutcome({ status: 200, data: { ...outcome, outcome: "pending_approval" } }, "dumpster").rentalCard, undefined);
    assert.equal(readOutcome({ status: 200, data: outcome }, "junk").rentalCard, undefined);
    let state = newRentalPaymentRecovery(grant)!;
    let dispatches = 0;
    const persist = (s: RentalPaymentRecovery) => { state = JSON.parse(JSON.stringify(s)); return true; };
    const calls: RentalPaymentCommand[] = [];
    const send = async (c: RentalPaymentCommand) => { dispatches++; calls.push(c); assert.notEqual(state.stage, "idle"); return c.action === "review" ? review : c.action === "setup" ? setup : { mode: "selected_rental", rentalId: "r1", quote, receiptId: setup.receiptId, card: { status: "saved" }, payment: { status: "applied", operationId: "col_original", amountCents: 9500, collectedCents: 9500, appliedCents: 9500 } }; };
    await assert.rejects(runRentalPaymentCommand(state, "review", () => false, send)); assert.equal(dispatches, 0);
    await runRentalPaymentCommand(state, "review", persist, send);
    assert.equal(state.stage, "reviewed"); assert.equal(state.review?.quote.amountCents, 9500);
    await assert.rejects(runRentalPaymentCommand(state, "confirm", persist, send)); assert.equal(dispatches, 1);
    await runRentalPaymentCommand(state, "setup", persist, send);
    assert.equal(state.setup?.receiptId, setup.receiptId); assert.ok(!JSON.stringify(state).includes("secret"));
    await runRentalPaymentCommand(state, "confirm", persist, send, true);
    assert.equal(state.result?.card?.status, "saved"); assert.equal(state.result?.payment.appliedCents, 9500);
    const original = JSON.stringify(state); await runRentalPaymentCommand(state, "status", persist, send);
    assert.equal(calls.at(-1)?.action, "status"); assert.equal(calls.at(-1)?.receiptId, setup.receiptId); assert.equal(calls.at(-1)?.consent, undefined);
    const confirmation = parseBookingConfirmation(JSON.stringify({ serviceType: "dumpster", outcomes: { dumpster: ack }, rentalPayment: state }));
    assert.deepEqual(confirmation?.rentalPayment, state); assert.deepEqual(confirmation?.outcomes?.dumpster?.rentalCard, grant);
    const session = "11000000-0000-4000-8000-000000000001";
    const restored = restoreIntent({ intent: { version: 1, bookingSessionId: session, attempts: { dumpster: { payload: { name: "Fixture", phone: "3125550101", bookingSessionId: session }, acknowledgement: ack } }, rentalPayment: state } });
    assert.deepEqual(restored.rentalPayment, state);
    const values = new Map<string, string>(); Object.assign(globalThis, { sessionStorage: { getItem: (k: string) => values.get(k) ?? null, setItem: (k: string, v: string) => values.set(k, v) } });
    assert.equal(saveIntent("fixture", restored), true); assert.ok(!values.get("fixture")?.includes("secret"));
    for (const malformed of [{ ...state, clientSecret: "secret" }, { ...state, rentalId: "sibling" }, { ...state, review: { ...state.review, expiresAt: 12 } }, { ...state, setup: { ...state.setup, receiptId: "not-original" } }]) {
        assert.equal(readRentalPaymentRecovery(malformed, "r1"), undefined);
        assert.equal(parseBookingConfirmation(JSON.stringify({ serviceType: "dumpster", outcomes: { dumpster: ack }, rentalPayment: malformed })), null);
    }
    const retained: RentalPaymentRecovery = { ...state, stage: "reviewed", setup: undefined, result: undefined };
    await assert.rejects(runRentalPaymentCommand(retained, "setup", persist, async () => { assert.equal(state.stage, "setup_pending"); assert.ok(state.review?.reviewToken); throw Error("lost setup response"); }));
    assert.equal(state.setup, undefined); assert.equal(state.stage, "setup_pending");
    await runRentalPaymentCommand(state, "status", persist, async c => { assert.equal(c.action, "status"); assert.equal(c.reviewToken, review.reviewToken); assert.equal(c.receiptId, undefined); return { ...setup, requiresFreshReview: true, nextAction: "authenticated_portal", canContinue: false }; });
    assert.equal(state.result?.requiresFreshReview, true); assert.equal(state.result?.canContinue, false);
    for (const action of ["review", "setup", "confirm", "status", "reconcile", "continue"] as const) {
        const c = { action, grant: grant.grant, ...(action !== "review" ? { reviewToken: grant.grant } : {}), ...(["confirm", "status", "reconcile"].includes(action) ? { setupIntentId: setup.setupIntentId, receiptId: setup.receiptId } : {}), ...(action === "continue" ? { receiptId: setup.receiptId } : {}), ...(["confirm", "continue"].includes(action) ? { consent: true } : {}) };
        assert.ok(readRentalPaymentCommand(c)); assert.equal(readRentalPaymentCommand({ ...c, customerId: "raw-id" }), undefined); assert.equal(readRentalPaymentCommand({ ...c, url: "https://other.invalid" }), undefined);
    }
    assert.equal(readRentalPaymentCommand({ action: "status", grant: grant.grant }), undefined);
    assert.ok(original.includes("col_original"));
    console.log("PASS typed grant/quote/receipt/operation recovery; pre-dispatch storage refusal, lost setup proof, strict command shapes and original-only status");
}
main().catch(e => { console.error(e); process.exitCode = 1; });
