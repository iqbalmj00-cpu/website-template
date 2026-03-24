import { NextResponse } from "next/server";
import { safeJson } from "@/lib/safeJson";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const phone = searchParams.get("phone");
        const dashboardUrl = process.env.DASHBOARD_URL;
        const siteToken = process.env.SITE_TOKEN;
        const ingestApiKey = process.env.INGEST_API_KEY;

        if (!dashboardUrl || !siteToken || !ingestApiKey || !phone) {
            return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        }

        const response = await fetch(`${dashboardUrl}/api/booking-lookup?phone=${encodeURIComponent(phone)}`, {
            headers: { "x-api-key": ingestApiKey, "x-site-token": siteToken },
        });

        const { data, parseError } = await safeJson(response, "booking-lookup");

        if (parseError || !response.ok) {
            return NextResponse.json({ error: (data as Record<string, unknown>).error || "Lookup failed" }, { status: response.ok ? 502 : response.status });
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error("Booking lookup proxy error:", err);
        return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
    }
}
