import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const siteToken = process.env.SITE_TOKEN;
        const dashboardUrl = process.env.DASHBOARD_URL;
        const ingestApiKey = process.env.INGEST_API_KEY;

        if (!siteToken || !dashboardUrl || !ingestApiKey) {
            console.error("confirm-card proxy: missing SITE_TOKEN, DASHBOARD_URL, or INGEST_API_KEY");
            return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
        }

        const response = await fetch(`${dashboardUrl}/api/booking/confirm-card`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": ingestApiKey,
                "x-site-token": siteToken,
            },
            body: JSON.stringify({
                customerId: body.customerId,
                paymentMethodId: body.paymentMethodId,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("confirm-card proxy error:", data);
            return NextResponse.json({ error: data.error || "Confirm card failed" }, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error("confirm-card proxy exception:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
