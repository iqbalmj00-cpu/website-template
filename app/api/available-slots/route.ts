import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/available-slots?date=2026-03-25
 * Proxy to dashboard's available-slots endpoint.
 * Returns dynamically-generated time slots with capacity info.
 */
export async function GET(req: NextRequest) {
    try {
        const siteToken = process.env.SITE_TOKEN;
        const dashboardUrl = process.env.DASHBOARD_URL;
        const ingestApiKey = process.env.INGEST_API_KEY;

        if (!siteToken || !dashboardUrl || !ingestApiKey) {
            return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
        }

        const date = req.nextUrl.searchParams.get("date");
        if (!date) {
            return NextResponse.json({ error: "date parameter is required (e.g. ?date=2026-03-25)" }, { status: 400 });
        }

        const response = await fetch(
            `${dashboardUrl}/api/public/available-slots?date=${encodeURIComponent(date)}`,
            {
                headers: {
                    "x-api-key": ingestApiKey,
                    "x-site-token": siteToken,
                },
            },
        );

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data.error || "Slot check failed" }, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error("Available slots proxy error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
