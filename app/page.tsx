"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Star, CheckCircle, ArrowRight, Truck, Clock, Shield, Leaf } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";

export default function HomePage() {
    const howItWorks = [
        {
            step: "1",
            title: "Book Online",
            desc: "Pick your date and time in 2 minutes. No phone tag, no waiting.",
        },
        {
            step: "2",
            title: "We Show Up",
            desc: "Our crew arrives on time, quotes you upfront, then gets to work.",
        },
        {
            step: "3",
            title: "It's Gone",
            desc: "We haul everything away. You don't lift a finger. Simple as that.",
        },
    ];

    const trustItems = [
        { icon: Shield, label: "Fully Insured" },
        { icon: CheckCircle, label: "Upfront Pricing" },
        { icon: Clock, label: "Same-Day Available" },
        { icon: Leaf, label: "Eco-Friendly" },
    ];

    const whyUs = [
        {
            title: "No Hidden Fees",
            desc: "We give you a firm price before we start — no surprises on the invoice.",
        },
        {
            title: "Fast & Reliable",
            desc: "We show up on time, every time. Many jobs completed the same day you call.",
        },
        {
            title: "We Donate & Recycle",
            desc: "Items in good condition are donated to local charities. We keep landfill waste to a minimum.",
        },
        {
            title: "Licensed & Insured",
            desc: "Fully licensed and insured so you have zero liability when we work on your property.",
        },
    ];

    return (
        <>
            {/* ── Hero ──────────────────────────────────────────────────────────── */}
            <section
                style={{
                    background: "var(--hero-bg)",
                    padding: "7rem 1.5rem 6rem",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Decorative blob */}
                <div
                    style={{
                        position: "absolute",
                        top: "-10%",
                        right: "-5%",
                        width: 500,
                        height: 500,
                        borderRadius: "50%",
                        background: "var(--brand)",
                        opacity: 0.07,
                        filter: "blur(80px)",
                        pointerEvents: "none",
                    }}
                />
                <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", display: "grid", gridTemplateColumns: siteConfig.heroImageUrl ? "1fr 1fr" : "1fr", gap: "3rem", alignItems: "center" }}>
                    <div style={{ maxWidth: 700 }}>
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                background: "rgba(249,115,22,0.12)",
                                border: "1px solid rgba(249,115,22,0.25)",
                                borderRadius: "var(--btn-radius)",
                                padding: "0.375rem 1rem",
                                marginBottom: "1.5rem",
                            }}
                        >
                            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--brand)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                Serving {siteConfig.serviceArea}
                            </span>
                        </div>
                        <h1
                            style={{
                                fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
                                color: "var(--hero-text)",
                                lineHeight: 1.1,
                                marginBottom: "1.5rem",
                            }}
                        >
                            Junk Removal Made{" "}
                            <span style={{ color: "var(--brand)" }}>Easy.</span>
                        </h1>
                        <p
                            style={{
                                fontSize: "clamp(1.1rem, 2.5vw, 1.3rem)",
                                color: "var(--hero-muted)",
                                lineHeight: 1.7,
                                marginBottom: "2.5rem",
                                maxWidth: 560,
                            }}
                        >
                            {siteConfig.tagline}
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
                            <Link href="/book" className="btn-primary" style={{ fontSize: "1.1rem", padding: "1rem 2.25rem" }}>
                                Book My Pickup <ArrowRight size={18} />
                            </Link>
                            <a
                                href={`tel:${siteConfig.phoneNumber.replace(/\D/g, "")}`}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    color: "#e2e8f0",
                                    textDecoration: "none",
                                    fontWeight: 500,
                                    fontSize: "1rem",
                                }}
                            >
                                <Phone size={18} style={{ color: "var(--brand)" }} />
                                {siteConfig.phoneNumber}
                            </a>
                        </div>
                    </div>
                    {siteConfig.heroImageUrl && (
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <img
                                src={siteConfig.heroImageUrl}
                                alt={`${siteConfig.companyName} junk removal in ${siteConfig.city}`}
                                style={{ width: "100%", maxWidth: 520, borderRadius: 20, objectFit: "cover", aspectRatio: "4/3", boxShadow: "0 25px 80px rgba(0,0,0,0.5)" }}
                            />
                        </div>
                    )}
                </div>
            </section>

            {/* ── Trust bar ─────────────────────────────────────────────────────── */}
            <section style={{ background: "var(--brand)", padding: "1.25rem 1.5rem" }}>
                <div
                    style={{
                        maxWidth: 1200,
                        margin: "0 auto",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: "2rem",
                    }}
                >
                    {trustItems.map(({ icon: Icon, label }) => (
                        <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <Icon size={18} color="#fff" />
                            <span style={{ color: "var(--hero-text)", fontWeight: 600, fontSize: "0.925rem" }}>{label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Services ──────────────────────────────────────────────────────── */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--card)" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                        <h2 className="section-title" style={{ textAlign: "center" }}>What We Haul Away</h2>
                        <p className="section-subtitle" style={{ textAlign: "center", margin: "0.75rem auto 0" }}>
                            From single items to full property cleanouts — we handle it all in {siteConfig.city}.
                        </p>
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                            gap: "1rem",
                        }}
                    >
                        {siteConfig.services.map((service) => {
                            const slug = service.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                            const imageUrl = siteConfig.serviceImages[slug];
                            return (
                                <Link
                                    key={service}
                                    href={`/services/${slug}`}
                                    className="card"
                                    style={{ textAlign: "center", padding: imageUrl ? "0" : "1.5rem 1rem", textDecoration: "none", color: "inherit", overflow: "hidden" }}
                                >
                                    {imageUrl ? (
                                        <>
                                            <img src={imageUrl} alt={service} style={{ width: "100%", height: 120, objectFit: "cover" }} />
                                            <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--foreground)", padding: "0.75rem 0.5rem" }}>
                                                {service}
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <Truck size={28} style={{ color: "var(--brand)", marginBottom: "0.75rem" }} />
                                            <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--foreground)" }}>
                                                {service}
                                            </p>
                                        </>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                    <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
                        <Link href="/services" className="btn-secondary">
                            View All Services
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── How It Works ──────────────────────────────────────────────────── */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--background)" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
                        <h2 className="section-title" style={{ textAlign: "center" }}>How It Works</h2>
                        <p className="section-subtitle" style={{ textAlign: "center", margin: "0.75rem auto 0" }}>
                            Three simple steps to a cleaner space.
                        </p>
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                            gap: "2rem",
                        }}
                    >
                        {howItWorks.map((item) => (
                            <div key={item.step} style={{ textAlign: "center" }}>
                                <div
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: "50%",
                                        background: "var(--brand)",
                                        color: "var(--hero-text)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "1.5rem",
                                        fontWeight: 800,
                                        margin: "0 auto 1.25rem",
                                        fontFamily: "var(--heading-font)",
                                    }}
                                >
                                    {item.step}
                                </div>
                                <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "var(--foreground)" }}>
                                    {item.title}
                                </h3>
                                <p style={{ color: "var(--muted)", lineHeight: 1.65, fontSize: "0.95rem" }}>
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Why Choose Us ─────────────────────────────────────────────────── */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--card)" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <div style={{ marginBottom: "3rem" }}>
                        <h2 className="section-title">Why {siteConfig.companyName}?</h2>
                        <p className="section-subtitle">
                            We're your local junk removal experts in {siteConfig.city}. Here's why customers keep coming back.
                        </p>
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                            gap: "1.5rem",
                        }}
                    >
                        {whyUs.map((item) => (
                            <div key={item.title} className="card">
                                <CheckCircle size={22} style={{ color: "var(--brand)", marginBottom: "0.75rem" }} />
                                <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem", color: "var(--foreground)" }}>
                                    {item.title}
                                </h3>
                                <p style={{ color: "var(--muted)", lineHeight: 1.65, fontSize: "0.925rem" }}>
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Testimonials ──────────────────────────────────────────────────── */}
            {siteConfig.testimonials.length > 0 && (
                <section style={{ padding: "5rem 1.5rem", background: "var(--background)" }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                            <h2 className="section-title" style={{ textAlign: "center" }}>What Customers Say</h2>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                                gap: "1.5rem",
                            }}
                        >
                            {siteConfig.testimonials.map((t) => (
                                <div key={t.name} className="card">
                                    <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1rem" }}>
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} fill="var(--brand)" color="var(--brand)" />
                                        ))}
                                    </div>
                                    <p style={{ color: "var(--foreground)", lineHeight: 1.7, marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                                        &ldquo;{t.text}&rdquo;
                                    </p>
                                    <div>
                                        <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--foreground)" }}>{t.name}</p>
                                        <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{t.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Final CTA ─────────────────────────────────────────────────────── */}
            <section
                style={{
                    padding: "5rem 1.5rem",
                    background: "var(--hero-bg)",
                    textAlign: "center",
                }}
            >
                <div style={{ maxWidth: 640, margin: "0 auto" }}>
                    <h2
                        style={{
                            fontSize: "clamp(2rem, 5vw, 3rem)",
                            color: "var(--hero-text)",
                            marginBottom: "1rem",
                        }}
                    >
                        Ready to reclaim your space?
                    </h2>
                    <p style={{ color: "var(--hero-muted)", fontSize: "1.1rem", lineHeight: 1.7, marginBottom: "2.5rem" }}>
                        Book your pickup online in 2 minutes. Same-day service available in {siteConfig.city}.
                    </p>
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <Link href="/book" className="btn-primary" style={{ fontSize: "1.1rem", padding: "1rem 2.25rem" }}>
                            Book My Pickup <ArrowRight size={18} />
                        </Link>
                        <a
                            href={`tel:${siteConfig.phoneNumber.replace(/\D/g, "")}`}
                            className="btn-secondary"
                            style={{ fontSize: "1rem", borderColor: "rgba(255,255,255,0.3)", color: "#e2e8f0" }}
                        >
                            <Phone size={16} /> {siteConfig.phoneNumber}
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
