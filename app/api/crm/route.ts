import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Honeypot check
        if (body._hp) {
            return NextResponse.json({ ok: true, leadId: "hp" });
        }

        const siteToken = process.env.SITE_TOKEN;
        const dashboardUrl = process.env.DASHBOARD_URL;
        const ingestApiKey = process.env.INGEST_API_KEY;

        if (!siteToken || !dashboardUrl || !ingestApiKey) {
            console.error("CRM proxy: missing SITE_TOKEN, DASHBOARD_URL, or INGEST_API_KEY");
            return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
        }

        const crmEndpoint = `${dashboardUrl}/api/ingest/website`;

        // Build payload – forward all fields, apply source default for new leads
        const payload: Record<string, unknown> = { ...body };
        if (!body.leadId) payload.source = payload.source || "WEBSITE";


        const response = await fetch(crmEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": ingestApiKey,
                "x-site-token": siteToken,
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("CRM proxy error:", data);
            return NextResponse.json({ error: data.error || "CRM error" }, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error("CRM proxy exception:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
