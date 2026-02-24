"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { siteConfig, formatPhone, telHref } from "@/lib/siteConfig";
import { CheckCircle, Phone, Calendar, MapPin } from "lucide-react";
import { Suspense } from "react";

function ConfirmationContent() {
    const params = useSearchParams();
    const name = params.get("name") || "there";
    const date = params.get("date") || "";
    const time = params.get("time") || "";
    const price = params.get("price") || "";

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
                        Booking <span style={{ color: "var(--brand)" }}>Confirmed!</span>
                    </h1>
                    <p style={{ color: "var(--hero-muted)", fontSize: "1.1rem" }}>
                        Thanks, {name}! Your junk removal has been scheduled.
                    </p>
                </div>
            </section>

            <section style={{ padding: "3rem 1.5rem", background: "var(--card)" }}>
                <div style={{ maxWidth: 500, margin: "0 auto" }}>
                    <div style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: 16, padding: "2rem", marginBottom: "2rem" }}>
                        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem" }}>Booking Details</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
                                    <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>💰</span>
                                    <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>Estimated: {price}</p>
                                </div>
                            )}
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <MapPin size={20} style={{ color: "var(--brand)", flexShrink: 0 }} />
                                <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>{siteConfig.city}{siteConfig.state ? `, ${siteConfig.state}` : ""}</p>
                            </div>
                        </div>
                    </div>

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

export default function BookingConfirmedPage() {
    return (
        <>
            <Suspense fallback={<div style={{ minHeight: "50vh" }} />}>
                <ConfirmationContent />
            </Suspense>
        </>
    );
}
