"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { getClientServices } from "@/lib/serviceData";
import { useState } from "react";

function ServiceCard({
    icon,
    title,
    slug,
    shortDesc,
    fullDesc,
}: {
    icon: string;
    title: string;
    slug: string;
    shortDesc: string;
    fullDesc: string;
}) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            style={{
                background: "var(--card)",
                borderRadius: 16,
                padding: "2rem",
                border: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                transition: "box-shadow 0.3s, transform 0.3s",
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.transform = "none";
            }}
        >
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{icon}</div>
            <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--foreground)", marginBottom: "0.5rem" }}>
                {title}
            </h3>
            <p style={{ color: "var(--muted)", lineHeight: 1.6, flex: 1 }}>{shortDesc}</p>

            {expanded && (
                <p style={{ color: "#555", lineHeight: 1.6, marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border)" }}>
                    {fullDesc}
                </p>
            )}

            <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <button
                    onClick={() => setExpanded((e) => !e)}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--foreground)",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                    }}
                >
                    {expanded ? "Show Less ↑" : "Learn More →"}
                </button>
                <Link
                    href={`/services/${slug}`}
                    style={{ color: "var(--brand)", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none" }}
                >
                    View Details →
                </Link>
            </div>
        </div>
    );
}

export default function ServicesPage() {
    const services = getClientServices();
    const { companyName, phoneNumber } = siteConfig;

    return (
        <>
            <Navbar />
            <main>
                {/* Hero */}
                <section
                    style={{
                        background: "var(--hero-bg)",
                        padding: "7rem 1.5rem 5rem",
                        textAlign: "center",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
                        <span
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                padding: "0.4rem 1rem",
                                borderRadius: "var(--btn-radius)",
                                background: "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                color: "var(--brand)",
                                fontSize: "0.8rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                marginBottom: "2rem",
                            }}
                        >
                            🛡️ Licensed & Insured
                        </span>
                        <h1
                            style={{
                                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                                fontWeight: 900,
                                color: "var(--hero-text)",
                                lineHeight: 1.1,
                                marginBottom: "1.5rem",
                            }}
                        >
                            OUR PROFESSIONAL{" "}
                            <span style={{ color: "var(--brand)" }}>SERVICES</span>
                        </h1>
                        <p style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.65)", maxWidth: 600, margin: "0 auto 2.5rem" }}>
                            {companyName} provides efficient, reliable junk removal for homes, construction sites, and businesses.
                        </p>
                        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                            <Link href="/locations" className="btn-primary" style={{ padding: "1rem 2rem", fontSize: "1rem" }}>
                                📍 View Coverage Area
                            </Link>
                            <Link
                                href="/commercial"
                                style={{
                                    padding: "1rem 2rem",
                                    fontSize: "1rem",
                                    borderRadius: "var(--btn-radius)",
                                    border: "2px solid rgba(255,255,255,0.3)",
                                    color: "var(--hero-text)",
                                    textDecoration: "none",
                                    fontWeight: 700,
                                    transition: "all 0.2s",
                                }}
                            >
                                🏢 Business Solutions
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Service Cards */}
                <section style={{ padding: "5rem 1.5rem", background: "var(--background)" }}>
                    <div
                        style={{
                            maxWidth: 1200,
                            margin: "0 auto",
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                            gap: "2rem",
                        }}
                    >
                        {services.map((svc) => (
                            <ServiceCard
                                key={svc.slug}
                                icon={svc.icon}
                                title={svc.title}
                                slug={svc.slug}
                                shortDesc={svc.shortDesc}
                                fullDesc={svc.fullDesc}
                            />
                        ))}
                    </div>
                </section>

                {/* Items We Don't Accept */}
                <section style={{ padding: "5rem 1.5rem", background: "var(--card)", borderTop: "1px solid var(--border)" }}>
                    <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚫</div>
                        <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "2rem" }}>Items We Do Not Accept</h2>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                                gap: "0.75rem",
                                textAlign: "left",
                            }}
                        >
                            {[
                                "Hazardous Chemicals",
                                "Paint & Solvents",
                                "Asbestos",
                                "Car Batteries",
                                "Medical Waste",
                                "Oil Drums / Tanks",
                                "Propane Tanks",
                                "Explosives / Ammunition",
                            ].map((item) => (
                                <div
                                    key={item}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.75rem",
                                        padding: "0.75rem",
                                        borderRadius: 8,
                                    }}
                                >
                                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444", flexShrink: 0 }} />
                                    <span style={{ fontWeight: 600, color: "var(--foreground)" }}>{item}</span>
                                </div>
                            ))}
                        </div>
                        <p style={{ marginTop: "2rem", color: "var(--muted)", fontSize: "0.9rem" }}>
                            * For safety and legal reasons, we cannot transport these materials. Contact your local municipal waste management for disposal.
                        </p>
                    </div>
                </section>

                {/* CTA */}
                <section
                    style={{
                        background: "var(--hero-bg)",
                        padding: "5rem 1.5rem",
                        textAlign: "center",
                    }}
                >
                    <div style={{ maxWidth: 700, margin: "0 auto" }}>
                        <h2 style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--hero-text)", marginBottom: "1rem" }}>
                            Ready to clear the clutter?
                        </h2>
                        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.15rem", marginBottom: "2.5rem" }}>
                            Book your free estimate today. Same-day service available.
                        </p>
                        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                            <Link href="/book" className="btn-primary" style={{ padding: "1rem 2.5rem", fontSize: "1.1rem" }}>
                                📋 Get an Instant Quote
                            </Link>
                            <a
                                href={`tel:${phoneNumber.replace(/\D/g, "")}`}
                                style={{
                                    padding: "1rem 2rem",
                                    borderRadius: "var(--btn-radius)",
                                    border: "2px solid rgba(255,255,255,0.3)",
                                    color: "var(--hero-text)",
                                    textDecoration: "none",
                                    fontWeight: 700,
                                    fontSize: "1.1rem",
                                }}
                            >
                                📞 {phoneNumber}
                            </a>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
