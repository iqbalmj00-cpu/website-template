import { NextResponse } from "next/server";
import { readRentalPaymentCommand } from "@/lib/bookingRentalPayment";
const headers = { "Cache-Control": "no-store" };
export async function POST(req: Request) {
    try {
        const body = await req.text();
        if (body.length > 40_000) return NextResponse.json({ error: "Invalid rental-card command." }, { status: 400, headers });
        const command = readRentalPaymentCommand(JSON.parse(body));
        if (!command) return NextResponse.json({ error: "Invalid rental-card command." }, { status: 400, headers });
        const dashboardUrl = process.env.DASHBOARD_URL;
        if (!dashboardUrl) return NextResponse.json({ error: "Rental payment is unavailable." }, { status: 503, headers });
        const response = await fetch(`${dashboardUrl}/api/booking/rental-card`, {
            method: "POST", headers: { "Content-Type": "application/json" }, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(15_000), body: JSON.stringify(command),
        });
        let data: unknown;
        try { data = await response.json(); } catch { return NextResponse.json({ error: "Recover the original rental payment request." }, { status: 502, headers }); }
        // The signed grant alone conveys authority. No credentials or caller-supplied target are forwarded.
        return NextResponse.json(data, { status: response.status, headers: { ...headers, ...(response.headers.get("Retry-After") ? { "Retry-After": response.headers.get("Retry-After")! } : {}) } });
    } catch {
        return NextResponse.json({ error: "The original result is unconfirmed. Recover the same request." }, { status: 502, headers });
    }
}
