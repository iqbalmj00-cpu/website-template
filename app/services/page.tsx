import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig, formatPhone, telHref } from "@/lib/siteConfig";
import { getClientServices } from "@/lib/serviceData";
import ServiceIcon from "@/components/ServiceIcon";
import ServiceCard from "./ServiceCard";
import { ShieldCheck, MapPin, Building2, Ban, ClipboardList, Phone, DollarSign, FileText } from "lucide-react";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;

export const metadata: Metadata = {
    title: `Junk Removal Services in ${cityState} | ${siteConfig.companyName}`,
    description: `${siteConfig.companyName} offers professional junk removal services in ${cityState}. Furniture, appliances, yard waste, construction debris & more. Licensed & insured. Book online today.`,
    alternates: { canonical: "/services" },
};

export default function ServicesPage() {
    const services = getClientServices();
    const { companyName, phoneNumber } = siteConfig;

    return (
        <>
            {/* Hero */}
            <section
                style={{
                    background: "var(--hero-bg)",
                    padding: "9rem 1.5rem 5rem",
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
                            background: "var(--hero-badge-bg)",
                            border: "1px solid var(--hero-badge-border)",
                            color: "var(--brand)",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            marginBottom: "2rem",
                        }}
                    >
                        <ShieldCheck size={16} style={{ color: "var(--brand)" }} /> Licensed & Insured
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
                        Junk Removal Services in{" "}
                        <span style={{ color: "var(--brand)" }}>{siteConfig.city}</span>
                    </h1>
                    <p style={{ fontSize: "1.25rem", color: "var(--hero-muted)", maxWidth: 600, margin: "0 auto 2.5rem" }}>
                        {companyName} provides efficient, reliable junk removal for homes, construction sites, and businesses across {cityState}.
                    </p>
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <Link href="/locations" className="btn-primary" style={{ padding: "1rem 2rem", fontSize: "1rem" }}>
                            <MapPin size={16} /> View Coverage Area
                        </Link>
                        <Link
                            href="/commercial"
                            style={{
                                padding: "1rem 2rem",
                                fontSize: "1rem",
                                borderRadius: "var(--btn-radius)",
                                border: "2px solid var(--hero-border)",
                                color: "var(--hero-text)",
                                textDecoration: "none",
                                fontWeight: 700,
                                transition: "all 0.2s",
                            }}
                        >
                            <Building2 size={16} /> Business Solutions
                        </Link>
                    </div>
                </div>
            </section>

            {/* Intro */}
            <section style={{ padding: "4rem 1.5rem 0", background: "var(--background)" }}>
                <div style={{ maxWidth: 750, margin: "0 auto", textAlign: "center" }}>
                    <p style={{ color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.8 }}>
                        Whether you&apos;re clearing out a garage, renovating a kitchen, or managing a commercial cleanout,
                        {companyName} has the crew and equipment to get it done fast. We serve all of {cityState} with same-day
                        and next-day availability. Every job includes eco-friendly disposal — we donate usable items to local
                        charities, recycle what we can, and only landfill what&apos;s left.
                    </p>
                </div>
            </section>

            {/* Service Cards */}
            <section style={{ padding: "4rem 1.5rem 5rem", background: "var(--background)" }}>
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
                            iconName={svc.icon}
                            title={svc.title}
                            slug={svc.slug}
                            shortDesc={svc.shortDesc}
                            fullDesc={svc.fullDesc}
                        />
                    ))}
                </div>
            </section>

            {/* How Pricing Works */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--card)", borderTop: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 900, margin: "0 auto" }}>
                    <h2 className="section-title" style={{ textAlign: "center", marginBottom: "1rem" }}>How Pricing Works</h2>
                    <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "1rem", maxWidth: 600, margin: "0 auto 3rem", lineHeight: 1.7 }}>
                        No hourly rates, no hidden fees. You pay based on how much space your items take in our truck.
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
                        <div className="card" style={{ textAlign: "center" }}>
                            <DollarSign size={32} style={{ color: "var(--brand)", marginBottom: "1rem" }} />
                            <h3 style={{ fontSize: "1.1rem", color: "var(--foreground)", marginBottom: "0.5rem" }}>Volume-Based Pricing</h3>
                            <p style={{ color: "var(--muted)", fontSize: "0.925rem", lineHeight: 1.65 }}>
                                We quote based on how much space your items take in our {siteConfig.pricing.truckSize} truck.
                                See exactly what you&apos;ll pay before we start — starting at just ${siteConfig.pricing.tiers[0]?.min ?? 75}.
                            </p>
                            <Link href="/pricing" style={{ display: "inline-block", marginTop: "1rem", color: "var(--brand)", fontWeight: 600, textDecoration: "none", fontSize: "0.9rem" }}>
                                View Full Pricing →
                            </Link>
                        </div>
                        <div className="card" style={{ textAlign: "center" }}>
                            <FileText size={32} style={{ color: "var(--brand)", marginBottom: "1rem" }} />
                            <h3 style={{ fontSize: "1.1rem", color: "var(--foreground)", marginBottom: "0.5rem" }}>Free Estimates</h3>
                            <p style={{ color: "var(--muted)", fontSize: "0.925rem", lineHeight: 1.65 }}>
                                Book online and our crew will give you a firm quote on-site before any work begins.
                                No obligation — if the price doesn&apos;t work for you, there&apos;s no charge.
                            </p>
                            <Link href="/book" style={{ display: "inline-block", marginTop: "1rem", color: "var(--brand)", fontWeight: 600, textDecoration: "none", fontSize: "0.9rem" }}>
                                Get Your Free Quote →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Items We Don't Accept */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--background)", borderTop: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
                    <Ban size={40} style={{ color: "#ef4444", marginBottom: "1rem" }} />
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
                    <p style={{ color: "var(--hero-muted)", fontSize: "1.15rem", marginBottom: "2.5rem" }}>
                        Book your free estimate today. Same-day service available in {cityState}.
                    </p>
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <Link href="/book" className="btn-primary" style={{ padding: "1rem 2.5rem", fontSize: "1.1rem" }}>
                            <ClipboardList size={18} /> Get an Instant Quote
                        </Link>
                        <a
                            href={telHref(phoneNumber)}
                            style={{
                                padding: "1rem 2rem",
                                borderRadius: "var(--btn-radius)",
                                border: "2px solid var(--hero-border)",
                                color: "var(--hero-text)",
                                textDecoration: "none",
                                fontWeight: 700,
                                fontSize: "1.1rem",
                            }}
                        >
                            <Phone size={18} /> {formatPhone(phoneNumber)}
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
