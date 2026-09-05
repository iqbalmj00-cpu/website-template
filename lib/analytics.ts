/**
 * analytics.ts — what Google Analytics is allowed to see of a URL.
 *
 * `gtag('config', id)` sends an automatic page_view whose `page_location` is
 * whatever `window.location.href` happens to be. That is how customer names
 * and service addresses from the old `/booking-confirmed?name=…&address=…`
 * redirect reached each operator's GA property. The redirect no longer carries
 * them (see lib/bookingConfirmation.ts); this stops the browser reporting a URL
 * we have not looked at, on that page or any other.
 */

/**
 * Query parameters worth keeping. Everything else is dropped, so a parameter
 * added to some future page cannot leak by default — an allowlist fails closed,
 * a denylist fails open.
 *
 * Campaign parameters have to survive: GA4 reads acquisition source from the
 * first page_view of a session, and the phone agent's SMS links arrive as
 * `?utm_source=phone_agent`. Dropping them would blind the operator's
 * attribution reporting, which is most of what they use GA for.
 */
const ALLOWED_QUERY_PARAMS = [
    "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
    "gclid", "fbclid", "msclkid",
    "promo",
];

/**
 * Rebuild a URL from its origin, path and allowlisted query parameters only.
 * The fragment is dropped outright — nothing reads it, and it is one more place
 * a value could hide.
 *
 * Falls back to the input on an unparseable URL rather than throwing: losing a
 * page_view is not worth an exception inside an analytics call.
 */
export function analyticsPageLocation(href: string): string {
    let url: URL;
    try {
        url = new URL(href);
    } catch {
        return href;
    }
    const kept = new URLSearchParams();
    for (const key of ALLOWED_QUERY_PARAMS) {
        const value = url.searchParams.get(key);
        if (value) kept.set(key, value);
    }
    const query = kept.toString();
    return `${url.origin}${url.pathname}${query ? `?${query}` : ""}`;
}
