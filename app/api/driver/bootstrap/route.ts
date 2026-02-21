import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        const dashboardUrl = process.env.DASHBOARD_URL;
        const siteToken = process.env.SITE_TOKEN;

        if (!dashboardUrl || !siteToken || !authHeader) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const response = await fetch(`${dashboardUrl}/api/driver/bootstrap`, {
            headers: {
                Authorization: authHeader,
                "x-site-token": siteToken,
            },
        });

        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json({ error: data.error || "Failed" }, { status: response.status });
        }

        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
    }
}
