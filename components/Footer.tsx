"use client";

import Link from "next/link";
import { Phone, MapPin, Clock } from "lucide-react";
import { getCredentials, isSameDayEnabled, siteConfig, formatPhone, telHref, groupBusinessHours } from "@/lib/siteConfig";
import { getClientServices } from "@/lib/serviceData";

export default function Footer() {
    const year = new Date().getFullYear();

    const services = getClientServices().slice(0, 6);
    const quickLinks = [
        { label: "Book a Pickup", href: "/book" },
        { label: "Services", href: "/services" },
        { label: "Locations", href: "/locations" },
        { label: "How It Works", href: "/how-it-works" },
        { label: "Cost Guide", href: "/cost" },
        { label: "Best Junk Removal Guide", href: "/best-junk-removal" },
        ...(isSameDayEnabled() ? [{ label: "Same-Day Junk Removal", href: "/same-day-junk-removal" }] : []),
        ...(siteConfig.offersDumpsterRental ? [{ label: "Dumpster Rental", href: "/dumpster-rental" }] : []),
        ...(siteConfig.offersDumpsterRental ? [{ label: "Junk Removal vs Dumpster Rental", href: "/junk-removal-vs-dumpster-rental" }] : []),
        { label: "Pricing", href: "/pricing" },
        { label: "Reviews", href: "/reviews" },
        { label: "Items We Take", href: "/items-we-take" },
        { label: "Commercial", href: "/commercial" },
        { label: "About Us", href: "/about" },
        { label: "FAQ", href: "/faq" },
        { label: "Contact", href: "/contact" },
        ...(siteConfig.enableBlog ? [{ label: "Blog", href: "/blog" }] : []),
        { label: "Customer Portal", href: "/customer-portal" },
    ];

    const hoursGroups = siteConfig.businessHours ? groupBusinessHours(siteConfig.businessHours) : null;
    const credentialLine = getCredentials().map(item => `${item.label}: ${item.value}`).join(" · ");

    return (
        <footer style={{ background: "var(--footer-bg)", color: "var(--footer-text)" }}>
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
                            fontFamily: "var(--heading-font)",
                            fontWeight: 800,
                            fontSize: "1.25rem",
                            color: "var(--brand)",
                            marginBottom: "0.75rem",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        {siteConfig.companyName}
                    </p>
                    <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--footer-muted)", marginBottom: "1.25rem" }}>
                        {siteConfig.tagline}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <a
                            href={telHref(siteConfig.phoneNumber)}
                            style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--footer-text)", textDecoration: "none", fontSize: "0.9rem" }}
                        >
                            <Phone size={14} style={{ color: "var(--brand)" }} />
                            {formatPhone(siteConfig.phoneNumber)}
                        </a>
                        {siteConfig.streetAddress && (
                            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "var(--footer-muted)" }}>
                                <MapPin size={14} style={{ color: "var(--brand)" }} />
                                {siteConfig.streetAddress}, {siteConfig.city}{siteConfig.state ? `, ${siteConfig.state}` : ""}
                            </span>
                        )}
                        {credentialLine && (
                            <span style={{ fontSize: "0.8rem", lineHeight: 1.5, color: "var(--footer-muted)" }}>
                                {credentialLine}
                            </span>
                        )}
                        {siteConfig.gbpUrl && (
                            <a
                                href={siteConfig.gbpUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--footer-text)", textDecoration: "none", fontSize: "0.85rem" }}
                            >
                                <span style={{ color: "var(--brand)", fontWeight: 800, fontSize: "0.85rem" }}>G</span>
                                View us on Google
                            </a>
                        )}
                    </div>

                    {/* Business Hours */}
                    {hoursGroups && hoursGroups.length > 0 && (
                        <div style={{ marginTop: "1.25rem" }}>
                            <p style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", fontWeight: 700, color: "var(--footer-text)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                <Clock size={13} style={{ color: "var(--brand)" }} />
                                Business Hours
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                                {hoursGroups.map(g => (
                                    <div key={g.days} style={{ display: "flex", gap: "1rem", fontSize: "0.82rem", color: "var(--footer-muted)" }}>
                                        <span style={{ fontWeight: 600, color: "var(--footer-text)", minWidth: 65 }}>{g.days}</span>
                                        <span>{g.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Services */}
                <div>
                    <p style={{ fontWeight: 700, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand)", marginBottom: "1rem" }}>
                        Services
                    </p>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {services.map((s) => (
                                <li key={s.slug}>
                                    <Link href={`/services/${s.slug}`} style={{ color: "var(--footer-muted)", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.15s" }}
                                        onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--footer-text)")}
                                        onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--footer-muted)")}
                                    >
                                        {s.title}
                                    </Link>
                                </li>
                            ))}
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
                                <Link
                                    href={l.href}
                                    // Customer Portal redirects through to a URL containing the
                                    // siteToken. Suppress Referer here so the dashboard doesn't
                                    // see the previous page in its access logs.
                                    {...(l.href === "/customer-portal" ? { referrerPolicy: "no-referrer" as const } : {})}
                                    style={{ color: "var(--footer-muted)", textDecoration: "none", fontSize: "0.9rem" }}
                                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--footer-text)")}
                                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--footer-muted)")}
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
                    <p style={{ color: "var(--footer-muted)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                        Book online in minutes. {isSameDayEnabled() ? `Same-day pickup may be available in ${siteConfig.city}.` : "Pickup windows depend on route availability."}
                    </p>
                    <Link href="/book" className="btn-primary" style={{ fontSize: "0.9rem", padding: "0.7rem 1.5rem" }}>
                        Book Junk Removal in {siteConfig.city} →
                    </Link>
                </div>
            </div>

            {/* Bottom bar */}
            <div
                style={{
                    borderTop: "1px solid var(--border)",
                    maxWidth: 1200,
                    margin: "0 auto",
                    padding: "1.25rem 1.5rem",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.75rem",
                    fontSize: "0.8rem",
                    color: "var(--footer-muted)",
                    opacity: 0.7,
                }}
            >
                <span>© {year} {siteConfig.companyName}. All rights reserved.</span>
                <div style={{ display: "flex", gap: "1.5rem" }}>
                    <Link href="/privacy" style={{ color: "var(--footer-muted)", textDecoration: "none" }}>Privacy Policy</Link>
                    <Link href="/terms" style={{ color: "var(--footer-muted)", textDecoration: "none" }}>Terms</Link>
                </div>
            </div>
        </footer>
    );
}
