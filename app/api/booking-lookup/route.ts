import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const phone = searchParams.get("phone");
        const dashboardUrl = process.env.DASHBOARD_URL;
        const siteToken = process.env.SITE_TOKEN;

        if (!dashboardUrl || !siteToken || !phone) {
            return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        }

        const response = await fetch(`${dashboardUrl}/api/booking-lookup?phone=${encodeURIComponent(phone)}`, {
            headers: { "x-site-token": siteToken },
        });

        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json({ error: data.error || "Lookup failed" }, { status: response.status });
        }

        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
    }
}
