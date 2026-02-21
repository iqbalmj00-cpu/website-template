import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        const dashboardUrl = process.env.DASHBOARD_URL;
        const siteToken = process.env.SITE_TOKEN;

        if (!dashboardUrl || !siteToken || !authHeader) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        const response = await fetch(`${dashboardUrl}/api/driver/update-status`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: authHeader,
                "x-site-token": siteToken,
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json({ error: data.error || "Update failed" }, { status: response.status });
        }

        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: "Status update failed" }, { status: 500 });
    }
}
