"use client";

import Link from "next/link";
import { siteConfig, formatPhone, telHref } from "@/lib/siteConfig";
import { deriveDumpsterNote, cardConfirmationNotice, type CardConfirmation } from "@/lib/bookingLogic";
import { readBookingConfirmation, type BookingConfirmation } from "@/lib/bookingConfirmation";
import { CheckCircle, Phone, Calendar, MapPin, DollarSign, Truck, Box, HardHat, Clock } from "lucide-react";
import { useEffect, useState } from "react";

// Only outcomes the wizard actually writes; anything else stored is noise.
const CARD_ISSUES: CardConfirmation[] = ["already_on_file", "not_saved_actionable", "not_saved_unactionable", "not_saved_pending_approval"];

function ConfirmationContent({ data }: { data: BookingConfirmation }) {
    const name = data.name || "there";
    const date = data.date || "";
    const time = data.time || "";
    const price = data.price || "";
    const st = data.serviceType || "junk";
    const address = data.address || "";
    const dumpsterPrice = data.dumpsterPrice || "";
    const debrisType = data.debrisType || "";
    const rentalDuration = data.rentalDuration || "";
    const autoBooked = !!data.autoBooked;
    const dumpsterError = data.dumpsterError || "";
    const cardIssue = data.cardIssue || "";
    const hasDumpster = st === "dumpster" || st === "both";
    const hasJunk = st === "junk" || st === "both";

    const serviceLabel = st === "both" ? "Junk Removal + Dumpster Rental"
        : st === "dumpster" ? "Dumpster Rental"
        : "Junk Removal";

    // Determine heading and message based on service type + auto-booking result
    const getHeading = () => {
        if (hasDumpster && !hasJunk && !autoBooked) return (<>Request <span style={{ color: "var(--brand)" }}>Received!</span></>);
        return (<>Booking <span style={{ color: "var(--brand)" }}>Confirmed!</span></>);
    };

    // On a combined booking the junk leg can succeed while the dumpster leg
    // fails; the wizard records that as `dumpsterError`. Without it this page
    // promised to confirm availability for a rental request nobody holds.
    // Derivation shared with the widget — see lib/bookingLogic.ts.
    const dumpsterNote = deriveDumpsterNote({ serviceType: st, autoBooked, dumpsterError });

    // Saving the card can fail after the booking itself succeeded. Every
    // response used to be treated as success; a card that did not save now says
    // so, without implying the booking is at risk — it is not.
    const cardNotice = CARD_ISSUES.includes(cardIssue as CardConfirmation)
        ? cardConfirmationNotice(cardIssue as CardConfirmation)
        : null;

    const getMessage = () => {
        if (st === "both" && autoBooked) return `Thanks, ${name}! Your junk removal is scheduled and your dumpster is confirmed for delivery on ${date}!`;
        if (st === "both") return dumpsterError
            ? `Thanks, ${name}! Your junk removal is scheduled. ${dumpsterNote}`
            : `Thanks, ${name}! Your junk removal is scheduled. We'll confirm dumpster availability shortly.`;
        if (hasDumpster && autoBooked) return `Thanks, ${name}! Your dumpster is confirmed for delivery on ${date}! We'll notify you when the crew is en route.`;
        if (hasDumpster) return `Thanks, ${name}! We've received your dumpster rental request. We'll confirm availability and reach out shortly.`;
        return `Thanks, ${name}! Your junk removal has been scheduled.`;
    };

    return (
        <main>
            <section style={{ background: "var(--hero-bg)", padding: "7rem 1.5rem 5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 600, margin: "0 auto" }}>
                    <div style={{
                        width: 80, height: 80, borderRadius: "50%",
                        background: "rgba(34,197,94,0.15)", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        margin: "0 auto 1.5rem",
                    }}>
                        <CheckCircle size={40} color="#22c55e" />
                    </div>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--hero-text)", marginBottom: "0.75rem" }}>
                        {getHeading()}
                    </h1>
                    <p style={{ color: "var(--hero-muted)", fontSize: "1.1rem" }}>
                        {getMessage()}
                    </p>
                </div>
            </section>

            <section style={{ padding: "3rem 1.5rem", background: "var(--card)" }}>
                <div style={{ maxWidth: 500, margin: "0 auto" }}>
                    <div style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: 16, padding: "2rem", marginBottom: "2rem" }}>
                        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem" }}>Booking Details</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <Truck size={20} style={{ color: "var(--brand)", flexShrink: 0 }} />
                                <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>{serviceLabel}</p>
                            </div>
                            {date && (
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    <Calendar size={20} style={{ color: "var(--brand)", flexShrink: 0 }} />
                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>{date}</p>
                                        {time && <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>{time}</p>}
                                    </div>
                                </div>
                            )}
                            {price && (
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    <DollarSign size={20} style={{ color: "var(--brand)", flexShrink: 0 }} />
                                    <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>{dumpsterPrice ? "Junk Removal: " : "Estimated: "}{price}</p>
                                </div>
                            )}
                            {dumpsterPrice && (
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    <Box size={20} style={{ color: "var(--brand)", flexShrink: 0 }} />
                                    <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>{price ? "Dumpster: " : ""}{dumpsterPrice}</p>
                                </div>
                            )}
                            {debrisType && (
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    <HardHat size={20} style={{ color: "var(--brand)", flexShrink: 0 }} />
                                    <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>{debrisType}</p>
                                </div>
                            )}
                            {rentalDuration && (
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    <Clock size={20} style={{ color: "var(--brand)", flexShrink: 0 }} />
                                    <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>Duration: {rentalDuration}</p>
                                </div>
                            )}
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <MapPin size={20} style={{ color: "var(--brand)", flexShrink: 0 }} />
                                <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>{address || `${siteConfig.city}${siteConfig.state ? `, ${siteConfig.state}` : ""}`}</p>
                            </div>
                        </div>
                    </div>

                    {cardNotice && (
                        <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "2rem", textAlign: "center" }}>
                            {cardNotice}
                        </p>
                    )}

                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
                        <Link href="/" className="btn-primary" style={{ flex: 1, justifyContent: "center", padding: "0.875rem" }}>
                            Back to Home
                        </Link>
                        <a href={telHref(siteConfig.phoneNumber)} className="btn-secondary"
                            style={{ flex: 1, justifyContent: "center", padding: "0.875rem" }}
                        >
                            <Phone size={16} /> Call Us
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
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
                        booked with us, you&apos;re all set — we&apos;ll confirm by text and email. Otherwise,
                        you can book below.
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
