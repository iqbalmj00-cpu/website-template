"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    const links = [
        { label: "Services", href: "/services" },
        { label: "About", href: "/about" },
        { label: "FAQ", href: "/faq" },
        { label: "Contact", href: "/contact" },
    ];

    return (
        <header
            style={{
                position: "sticky",
                top: 0,
                zIndex: 50,
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid var(--border)",
            }}
        >
            <div
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    padding: "0 1.5rem",
                    height: 68,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                }}
            >
                {/* Logo / Brand */}
                <Link
                    href="/"
                    style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}
                >
                    {siteConfig.logoUrl ? (
                        <Image
                            src={siteConfig.logoUrl}
                            alt={siteConfig.companyName}
                            width={120}
                            height={40}
                            style={{ objectFit: "contain", height: 40, width: "auto" }}
                        />
                    ) : (
                        <span
                            style={{
                                fontFamily: "var(--font-space-grotesk)",
                                fontWeight: 800,
                                fontSize: "1.25rem",
                                color: "var(--brand)",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            {siteConfig.companyName}
                        </span>
                    )}
                </Link>

                {/* Desktop nav */}
                <nav
                    style={{ display: "flex", alignItems: "center", gap: "2rem" }}
                    className="hidden md:flex"
                >
                    {links.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            style={{
                                color: "var(--foreground)",
                                fontWeight: 500,
                                fontSize: "0.95rem",
                                textDecoration: "none",
                                transition: "color 0.15s",
                            }}
                            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--brand)")}
                            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--foreground)")}
                        >
                            {l.label}
                        </Link>
                    ))}
                </nav>

                {/* CTA + Phone */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <a
                        href={`tel:${siteConfig.phoneNumber.replace(/\D/g, "")}`}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.375rem",
                            color: "var(--muted)",
                            fontWeight: 500,
                            fontSize: "0.9rem",
                            textDecoration: "none",
                        }}
                        className="hidden sm:flex"
                    >
                        <Phone size={15} />
                        {siteConfig.phoneNumber}
                    </a>
                    <Link href="/book" className="btn-primary" style={{ padding: "0.6rem 1.25rem", fontSize: "0.9rem" }}>
                        Book Now
                    </Link>
                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setOpen((o) => !o)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--foreground)" }}
                        className="flex md:hidden"
                        aria-label="Toggle menu"
                    >
                        {open ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div
                    style={{
                        background: "#fff",
                        borderTop: "1px solid var(--border)",
                        padding: "1rem 1.5rem 1.5rem",
                    }}
                    className="md:hidden"
                >
                    {links.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            style={{
                                display: "block",
                                padding: "0.75rem 0",
                                color: "var(--foreground)",
                                fontWeight: 500,
                                textDecoration: "none",
                                borderBottom: "1px solid var(--border)",
                            }}
                        >
                            {l.label}
                        </Link>
                    ))}
                    <a
                        href={`tel:${siteConfig.phoneNumber.replace(/\D/g, "")}`}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.75rem 0",
                            color: "var(--brand)",
                            fontWeight: 600,
                            textDecoration: "none",
                        }}
                    >
                        <Phone size={16} />
                        {siteConfig.phoneNumber}
                    </a>
                </div>
            )}
        </header>
    );
}
