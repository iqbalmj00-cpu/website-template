"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";

export default function Footer() {
    const year = new Date().getFullYear();

    const services = siteConfig.services.slice(0, 6);
    const quickLinks = [
        { label: "Book a Pickup", href: "/book" },
        { label: "Services", href: "/services" },
        { label: "Locations", href: "/locations" },
        { label: "How It Works", href: "/how-it-works" },
        { label: "Reviews", href: "/reviews" },
        { label: "Items We Take", href: "/items-we-take" },
        { label: "Commercial", href: "/commercial" },
        { label: "About Us", href: "/about" },
        { label: "FAQ", href: "/faq" },
        { label: "Contact", href: "/contact" },
    ];

    return (
        <footer style={{ background: "var(--navy)", color: "#e2e8f0" }}>
            <div
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    padding: "4rem 1.5rem 2rem",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "3rem",
                }}
            >
                {/* Brand column */}
                <div>
                    <p
                        style={{
                            fontFamily: "var(--font-space-grotesk)",
                            fontWeight: 800,
                            fontSize: "1.25rem",
                            color: "var(--brand)",
                            marginBottom: "0.75rem",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        {siteConfig.companyName}
                    </p>
                    <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "#94a3b8", marginBottom: "1.25rem" }}>
                        {siteConfig.tagline}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <a
                            href={`tel:${siteConfig.phoneNumber.replace(/\D/g, "")}`}
                            style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#e2e8f0", textDecoration: "none", fontSize: "0.9rem" }}
                        >
                            <Phone size={14} style={{ color: "var(--brand)" }} />
                            {siteConfig.phoneNumber}
                        </a>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "#94a3b8" }}>
                            <MapPin size={14} style={{ color: "var(--brand)" }} />
                            {siteConfig.serviceArea}
                        </span>
                    </div>
                </div>

                {/* Services */}
                <div>
                    <p style={{ fontWeight: 700, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand)", marginBottom: "1rem" }}>
                        Services
                    </p>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {services.map((s) => {
                            const slug = s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                            return (
                                <li key={s}>
                                    <Link href={`/services/${slug}`} style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.15s" }}
                                        onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#e2e8f0")}
                                        onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#94a3b8")}
                                    >
                                        {s}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Quick links */}
                <div>
                    <p style={{ fontWeight: 700, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand)", marginBottom: "1rem" }}>
                        Quick Links
                    </p>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {quickLinks.map((l) => (
                            <li key={l.href}>
                                <Link href={l.href} style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.9rem" }}
                                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#e2e8f0")}
                                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#94a3b8")}
                                >
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* CTA column */}
                <div>
                    <p style={{ fontWeight: 700, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand)", marginBottom: "1rem" }}>
                        Ready to haul?
                    </p>
                    <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                        Book online in 2 minutes. Same-day pickup available in {siteConfig.city}.
                    </p>
                    <Link href="/book" className="btn-primary" style={{ fontSize: "0.9rem", padding: "0.7rem 1.5rem" }}>
                        Book Now →
                    </Link>
                </div>
            </div>

            {/* Bottom bar */}
            <div
                style={{
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    maxWidth: 1200,
                    margin: "0 auto",
                    padding: "1.25rem 1.5rem",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.75rem",
                    fontSize: "0.8rem",
                    color: "#64748b",
                }}
            >
                <span>© {year} {siteConfig.companyName}. All rights reserved.</span>
                <div style={{ display: "flex", gap: "1.5rem" }}>
                    <Link href="/legal" style={{ color: "#64748b", textDecoration: "none" }}>Privacy Policy</Link>
                    <Link href="/legal" style={{ color: "#64748b", textDecoration: "none" }}>Terms</Link>
                </div>
            </div>
        </footer>
    );
}
