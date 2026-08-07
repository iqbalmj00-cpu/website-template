import { NextResponse, type NextRequest } from "next/server";

/**
 * Preview routes: rewrite /__preview → /preview, and keep every preview URL out
 * of caches and out of search results.
 *
 * This no longer sets `x-template-preview-route`. Preview and the public site
 * have separate root layouts now (`app/(preview)` and `app/(site)`), so nothing
 * needs a request header to tell them apart. That mattered twice over:
 *
 *   - Reading that header meant calling `headers()` in the root layout, which
 *     forced every page on the site to render per request instead of being
 *     statically generated and served from the CDN.
 *   - This matcher only covers preview paths, so on every OTHER path the header
 *     was simply whatever the client sent. Anyone could add
 *     `x-template-preview-route: 1` to a request and render the site without the
 *     "Website Setup Required" gate.
 */
export function middleware(request: NextRequest) {
    const response = request.nextUrl.pathname === "/__preview"
        ? NextResponse.rewrite(new URL(`/preview${request.nextUrl.search}`, request.url))
        : NextResponse.next();

    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    response.headers.set("X-Robots-Tag", "noindex, nofollow");

    return response;
}

export const config = {
    matcher: ["/preview", "/__preview", "/volume-estimator-preview"],
};
