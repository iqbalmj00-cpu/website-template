import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { pin } = await req.json();
        const dashboardUrl = process.env.DASHBOARD_URL;
        const siteToken = process.env.SITE_TOKEN;

        if (!dashboardUrl || !siteToken) {
            return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
        }

        const response = await fetch(`${dashboardUrl}/api/driver/pin-login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-site-token": siteToken,
            },
            body: JSON.stringify({ pin }),
        });

        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json({ error: data.error || "Invalid PIN" }, { status: response.status });
        }

        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: "Login failed" }, { status: 500 });
    }
}
