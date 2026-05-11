import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-template-preview-route", "1");

    const response = request.nextUrl.pathname === "/__preview"
        ? NextResponse.rewrite(
            new URL(`/preview${request.nextUrl.search}`, request.url),
            {
                request: {
                    headers: requestHeaders,
                },
            },
        )
        : NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    response.headers.set("X-Robots-Tag", "noindex, nofollow");

    return response;
}

export const config = {
    matcher: ["/preview", "/__preview"],
};
