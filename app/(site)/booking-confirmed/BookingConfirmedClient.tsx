"use client";

import Link from "next/link";
import { siteConfig, telHref } from "@/lib/siteConfig";
import BookingReceipt from "@/components/BookingReceipt";
import type { ServiceLeg } from "@/lib/bookingIntent";
import { readBookingConfirmation, type BookingConfirmation } from "@/lib/bookingConfirmation";
import { Phone } from "lucide-react";
import { useEffect, useState } from "react";

function ConfirmationContent({ data }: { data: BookingConfirmation }) {
    const services: ServiceLeg[] = data.serviceType === "both" ? ["junk", "dumpster"] : data.serviceType === "dumpster" ? ["dumpster"] : ["junk"];
    return <main style={{ maxWidth: 680, margin: "48px auto", padding: 24 }}>
        <h1 style={{ fontSize: 32, marginBottom: 16 }}>Your booking receipt</h1>
        <p style={{ marginBottom: 24 }}>Thank you{data.name ? `, ${data.name}` : ""}. These are the saved responses for each service.</p>
        <BookingReceipt outcomes={data.outcomes || {}} services={services} requestedDate={data.date} requestedTime={data.time} phone={siteConfig.phoneNumber} cardIssue={data.cardIssue} />
        {data.address && <p style={{ marginTop: 16 }}>{data.address}</p>}
        {data.debrisType && <p>Debris: {data.debrisType}</p>}
        {data.rentalDuration && <p>Requested duration: {data.rentalDuration}</p>}
        <Link href="/book" className="btn-primary" style={{ marginTop: 24, minHeight: 44 }}>Review saved booking</Link>
    </main>;
}

/**
 * Shown when there is no payload to render: a shared or bookmarked link, a new
 * tab, or a different browser. The confirmation lives in sessionStorage, which
 * none of those carry — and inventing a booking for whoever opened the link
 * would be worse than saying so.
 */
function NoConfirmation() {
    return (
        <main>
            <section style={{ background: "var(--hero-bg)", padding: "7rem 1.5rem 5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 600, margin: "0 auto" }}>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--hero-text)", marginBottom: "0.75rem" }}>
                        Booking <span style={{ color: "var(--brand)" }}>Confirmation</span>
                    </h1>
                    <p style={{ color: "var(--hero-muted)", fontSize: "1.1rem" }}>
                        Your confirmation is only shown in the tab where you booked. If you&apos;ve already
                        submitted a request, please contact us to check its status before booking again.
                    </p>
                </div>
            </section>
            <section style={{ padding: "3rem 1.5rem", background: "var(--card)" }}>
                <div style={{ maxWidth: 500, margin: "0 auto", display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
                    <Link href="/book" className="btn-primary" style={{ flex: 1, justifyContent: "center", padding: "0.875rem" }}>
                        Book Now
                    </Link>
                    <a href={telHref(siteConfig.phoneNumber)} className="btn-secondary"
                        style={{ flex: 1, justifyContent: "center", padding: "0.875rem" }}
                    >
                        <Phone size={16} /> Call Us
                    </a>
                </div>
            </section>
        </main>
    );
}

export default function BookingConfirmedClient() {
    // Three states: `undefined` until the effect has run (sessionStorage cannot
    // be read while rendering on the server, and guessing would flash the wrong
    // page), then either the payload or `null` for "nothing stored".
    const [data, setData] = useState<BookingConfirmation | null | undefined>(undefined);
    useEffect(() => { setData(readBookingConfirmation()); }, []);

    if (data === undefined) return <div style={{ minHeight: "50vh" }} />;
    if (data === null) return <NoConfirmation />;
    return <ConfirmationContent data={data} />;
}
