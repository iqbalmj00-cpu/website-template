import { NextResponse } from "next/server";
import { safeJson } from "@/lib/safeJson";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Honeypot. The field name must match the one the dashboard validates
        // (`website_honeypot`) — three different names were in use across the
        // form, this proxy and the receiver, so no two ever agreed and only the
        // browser-side check ever fired. A bot posting straight to this route
        // walked through.
        //
        // The field is forwarded below as well as checked here, so the
        // receiver's own check still applies to anything posted directly to it.
        if (typeof body.website_honeypot === "string" && body.website_honeypot.trim()) {
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
        // "WEBSITE" is invisible in the dashboard's own attribution report — its
        // source filter is case-sensitive and matches lowercase tokens. Default
        // to the one the booking wizard already sends.
        if (!body.leadId) payload.source = payload.source || "website_form";


        const response = await fetch(crmEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": ingestApiKey,
                "x-site-token": siteToken,
            },
            body: JSON.stringify(payload),
        });

        const { data, parseError } = await safeJson(response, "crm");

        if (parseError || !response.ok) {
            console.error("CRM proxy error:", data);
            return NextResponse.json({ error: (data as Record<string, unknown>).error || "CRM error" }, { status: response.ok ? 502 : response.status });
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error("CRM proxy exception:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
