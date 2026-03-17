import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/validate-promo?code=SUMMER20
 * Proxy to dashboard's promo validation endpoint.
 * Auth: x-api-key + x-site-token headers (same as other ingest proxies).
 */
export async function GET(req: NextRequest) {
    try {
        const siteToken = process.env.SITE_TOKEN;
        const dashboardUrl = process.env.DASHBOARD_URL;
        const ingestApiKey = process.env.INGEST_API_KEY;

        if (!siteToken || !dashboardUrl || !ingestApiKey) {
            return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
        }

        const code = req.nextUrl.searchParams.get("code");
        if (!code) {
            return NextResponse.json({ valid: false, reason: "no_code_provided" }, { status: 400 });
        }

        const response = await fetch(
            `${dashboardUrl}/api/promo/validate?code=${encodeURIComponent(code)}`,
            {
                headers: {
                    "x-api-key": ingestApiKey,
                    "x-site-token": siteToken,
                },
            },
        );

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error("Promo validate proxy error:", err);
        return NextResponse.json({ valid: false, reason: "server_error" }, { status: 500 });
    }
}
