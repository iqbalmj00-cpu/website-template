import { NextResponse } from "next/server";
import { safeJson } from "@/lib/safeJson";

/**
 * POST /api/waiver — Proxy the signed booking waiver to the dashboard.
 * Sends the signature data URL + leadId so the dashboard can create
 * a Document record linked to the correct job/customer.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();

        const siteToken = process.env.SITE_TOKEN;
        const dashboardUrl = process.env.DASHBOARD_URL;
        const ingestApiKey = process.env.INGEST_API_KEY;

        if (!siteToken || !dashboardUrl || !ingestApiKey) {
            console.error("Waiver proxy: missing SITE_TOKEN, DASHBOARD_URL, or INGEST_API_KEY");
            return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
        }

        const response = await fetch(`${dashboardUrl}/api/booking/waiver`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": ingestApiKey,
                "x-site-token": siteToken,
            },
            body: JSON.stringify(body),
        });

        const { data, parseError } = await safeJson(response, "waiver");

        if (parseError || !response.ok) {
            console.error("Waiver proxy error:", data);
            return NextResponse.json({ error: (data as Record<string, unknown>).error || "Waiver upload failed" }, { status: response.ok ? 502 : response.status });
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error("Waiver proxy exception:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
