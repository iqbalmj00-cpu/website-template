import { NextRequest, NextResponse } from "next/server";
import { safeJson } from "@/lib/safeJson";

/**
 * GET /api/container-availability?size=20
 * Proxy to dashboard's container-availability endpoint.
 * Adds x-api-key + x-site-token headers for auth.
 */
export async function GET(req: NextRequest) {
    try {
        const siteToken = process.env.SITE_TOKEN;
        const dashboardUrl = process.env.DASHBOARD_URL;
        const ingestApiKey = process.env.INGEST_API_KEY;

        if (!siteToken || !dashboardUrl || !ingestApiKey) {
            return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
        }

        const size = req.nextUrl.searchParams.get("size");
        if (!size) {
            return NextResponse.json({ error: "size parameter is required" }, { status: 400 });
        }

        const qs = new URLSearchParams({ size });
        const date = req.nextUrl.searchParams.get("date");
        const days = req.nextUrl.searchParams.get("days");
        if (date) qs.set("date", date);
        if (days) qs.set("days", days);

        const response = await fetch(
            `${dashboardUrl}/api/booking/container-availability?${qs.toString()}`,
            {
                headers: {
                    "x-api-key": ingestApiKey,
                    "x-site-token": siteToken,
                },
            },
        );

        const { data, parseError } = await safeJson(response, "container-availability");

        if (parseError || !response.ok) {
            return NextResponse.json({ error: (data as Record<string, unknown>).error || "Availability check failed" }, { status: response.ok ? 502 : response.status });
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error("Container availability proxy error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
