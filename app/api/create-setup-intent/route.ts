import { NextResponse } from "next/server";
import { safeJson } from "@/lib/safeJson";

export async function POST() {
    try {
        const siteToken = process.env.SITE_TOKEN;
        const dashboardUrl = process.env.DASHBOARD_URL;
        const ingestApiKey = process.env.INGEST_API_KEY;

        if (!siteToken || !dashboardUrl || !ingestApiKey) {
            console.error("create-setup-intent proxy: missing SITE_TOKEN, DASHBOARD_URL, or INGEST_API_KEY");
            return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
        }

        // Proxy to SYJ dashboard — keeps the platform Stripe secret key on SYJ infrastructure.
        // Empty body = "bare" SetupIntent (no customer attached yet); card gets linked to
        // a customer later via /api/confirm-card after booking succeeds.
        const response = await fetch(`${dashboardUrl}/api/booking/setup-card`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": ingestApiKey,
                "x-site-token": siteToken,
            },
            body: JSON.stringify({}),
        });

        const { data, parseError } = await safeJson(response, "create-setup-intent");

        if (parseError || !response.ok) {
            console.error("create-setup-intent proxy error:", data);
            return NextResponse.json(
                { error: (data as Record<string, unknown>).error || "Failed to create setup intent" },
                { status: response.ok ? 502 : response.status }
            );
        }

        // SYJ response shape: { clientSecret, connectedAccountId }
        // Matches the previous direct-Stripe response shape — BookingWizard needs no changes.
        return NextResponse.json(data);
    } catch (err) {
        console.error("create-setup-intent proxy exception:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
