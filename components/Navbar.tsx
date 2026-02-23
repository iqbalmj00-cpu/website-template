"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Phone, Menu, X, ChevronDown, Calendar } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";
import { getClientServices } from "@/lib/serviceData";
import { getLocations } from "@/lib/locationData";

/* ── Build dynamic dropdown data from siteConfig ──────────────────────── */
function buildServiceLinks() {
    const services = getClientServices();
    // Group into categories
    const residential = services.filter(s => ["furniture-removal", "appliance-removal", "mattress-disposal", "yard-waste-removal", "e-waste-recycling"].includes(s.slug));
    const cleanouts = services.filter(s => ["estate-cleanout", "garage-cleanout", "hoarder-cleanout", "foreclosure-cleanout", "storage-unit-cleanout"].includes(s.slug));
    const demolition = services.filter(s => ["hot-tub-removal", "shed-demolition", "deck-removal"].includes(s.slug));
    const commercial = services.filter(s => ["commercial-cleanout", "office-furniture-removal", "construction-debris"].includes(s.slug));

    const cats: { title: string; links: { name: string; href: string }[] }[] = [];
    if (residential.length) cats.push({ title: "Residential", links: residential.map(s => ({ name: s.title, href: `/services/${s.slug}` })) });
    if (cleanouts.length) cats.push({ title: "Cleanouts", links: cleanouts.map(s => ({ name: s.title, href: `/services/${s.slug}` })) });
    if (demolition.length) cats.push({ title: "Demolition", links: demolition.map(s => ({ name: s.title, href: `/services/${s.slug}` })) });
    if (commercial.length) cats.push({ title: "Commercial", links: commercial.map(s => ({ name: s.title, href: `/services/${s.slug}` })) });

    // Fallback: if nothing categorized, just list all
    if (cats.length === 0 && services.length > 0) {
        cats.push({ title: "Our Services", links: services.map(s => ({ name: s.title, href: `/services/${s.slug}` })) });
    }
    return cats;
}

function buildLocationLinks() {
    return getLocations().map(loc => ({ name: loc.name, href: `/locations/${loc.slug}` }));
}

/* ── Component ─────────────────────────────────────────────────────────── */
export default function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const servicesRef = useRef<HTMLDivElement>(null);
    const locationsRef = useRef<HTMLDivElement>(null);

    const serviceCategories = buildServiceLinks();
    const locationLinks = buildLocationLinks();

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Services", href: "/services", hasDropdown: true, isMega: true },
        { name: "Locations", href: "/locations", hasDropdown: true },
        { name: "How It Works", href: "/how-it-works" },
        { name: "Reviews", href: "/reviews" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
    ];

    const isActive = (path: string) => pathname === path || (path !== "/" && pathname.startsWith(path));

    // Close dropdowns on click outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const t = e.target as Node;
            if (!servicesRef.current?.contains(t) && !locationsRef.current?.contains(t)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const toggle = (name: string) => setActiveDropdown(prev => (prev === name ? null : name));

    return (
        <nav style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
            background: "var(--nav-bg)",
            borderBottom: "1px solid var(--border)",
            boxShadow: "0 4px 30px rgba(0,0,0,0.15)",
        }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 80 }}>

                {/* Logo */}
                <Link href="/" style={{ fontFamily: "var(--heading-font)", fontWeight: 900, fontSize: "1.4rem", color: "var(--nav-hover)", textDecoration: "none", letterSpacing: "-0.04em", flexShrink: 0 }}>
                    {siteConfig.logoUrl ? (
                        <img src={siteConfig.logoUrl} alt={siteConfig.companyName} style={{ height: 40, objectFit: "contain" }} />
                    ) : (
                        <span><span style={{ color: "var(--brand)" }}>{siteConfig.companyName.split(" ")[0]}</span>{siteConfig.companyName.split(" ").length > 1 ? " " + siteConfig.companyName.split(" ").slice(1).join(" ") : ""}</span>
                    )}
                </Link>

                {/* Desktop Nav */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }} className="desktop-nav">
                    {navLinks.map(link =>
                        link.hasDropdown ? (
                            <div key={link.name} ref={link.name === "Services" ? servicesRef : locationsRef} style={{ position: "relative" }}>
                                <button
                                    onClick={() => toggle(link.name)}
                                    style={{
                                        background: "none", border: "none", cursor: "pointer",
                                        display: "flex", alignItems: "center", gap: "0.25rem",
                                        padding: "0.5rem 0.75rem",
                                        fontSize: "0.95rem", fontWeight: 700,
                                        color: isActive(link.href) ? "var(--nav-hover)" : "var(--nav-text)",
                                        borderBottom: isActive(link.href) ? "3px solid var(--brand)" : "3px solid transparent",
                                        transition: "color 0.15s",
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.color = "var(--nav-hover)")}
                                    onMouseLeave={e => { if (!isActive(link.href)) e.currentTarget.style.color = "var(--nav-text)"; }}
                                >
                                    {link.name}
                                    <ChevronDown size={14} style={{ transition: "transform 0.2s", transform: activeDropdown === link.name ? "rotate(180deg)" : "none" }} />
                                </button>

                                {/* ── Services Mega Dropdown ─────────────────── */}
                                {activeDropdown === "Services" && link.name === "Services" && (
                                    <div style={{
                                        position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
                                        marginTop: 12, minWidth: serviceCategories.length > 2 ? 680 : 340,
                                        background: "var(--card)", border: "1px solid var(--border)",
                                        borderRadius: "var(--card-radius)", boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                                        padding: "1.5rem", zIndex: 60,
                                    }}>
                                        <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(serviceCategories.length, 4)}, 1fr)`, gap: "1.5rem" }}>
                                            {serviceCategories.map(cat => (
                                                <div key={cat.title}>
                                                    <p style={{ color: "var(--brand)", fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--border)" }}>
                                                        {cat.title}
                                                    </p>
                                                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                                        {cat.links.map(sl => (
                                                            <li key={sl.href}>
                                                                <Link href={sl.href} onClick={() => setActiveDropdown(null)}
                                                                    style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500, transition: "color 0.15s" }}
                                                                    onMouseEnter={e => (e.currentTarget.style.color = "var(--foreground)")}
                                                                    onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
                                                                >
                                                                    {sl.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border)", textAlign: "center" }}>
                                            <Link href="/services" onClick={() => setActiveDropdown(null)}
                                                style={{ color: "var(--nav-hover)", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", textDecoration: "none", letterSpacing: "0.05em" }}
                                                onMouseEnter={e => (e.currentTarget.style.color = "var(--brand)")}
                                                onMouseLeave={e => (e.currentTarget.style.color = "var(--nav-hover)")}
                                            >
                                                View All Services →
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {/* ── Locations Dropdown ──────────────────────── */}
                                {activeDropdown === "Locations" && link.name === "Locations" && (
                                    <div style={{
                                        position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
                                        marginTop: 12, width: 260,
                                        background: "var(--card)", border: "1px solid var(--border)",
                                        borderRadius: "var(--card-radius)", boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                                        zIndex: 60, overflow: "hidden",
                                    }}>
                                        <Link href="/locations" onClick={() => setActiveDropdown(null)}
                                            style={{ display: "block", padding: "0.75rem 1.25rem", color: "var(--brand)", fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", textDecoration: "none", borderBottom: "1px solid var(--border)" }}
                                        >
                                            All Locations
                                        </Link>
                                        <div style={{ maxHeight: 300, overflowY: "auto", padding: "0.25rem 0" }}>
                                            {locationLinks.map(loc => (
                                                <Link key={loc.href} href={loc.href} onClick={() => setActiveDropdown(null)}
                                                    style={{
                                                        display: "block", padding: "0.5rem 1.25rem", fontSize: "0.875rem", fontWeight: 500, textDecoration: "none",
                                                        color: pathname === loc.href ? "var(--brand)" : "var(--muted)",
                                                        background: pathname === loc.href ? "rgba(0,0,0,0.03)" : "transparent",
                                                        transition: "all 0.15s",
                                                    }}
                                                    onMouseEnter={e => { e.currentTarget.style.color = "var(--foreground)"; e.currentTarget.style.background = "rgba(0,0,0,0.03)"; }}
                                                    onMouseLeave={e => { if (pathname !== loc.href) { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.background = "transparent"; } }}
                                                >
                                                    {loc.name}{siteConfig.state ? `, ${siteConfig.state}` : ""}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link key={link.name} href={link.href}
                                style={{
                                    padding: "0.5rem 0.75rem", fontSize: "0.95rem", fontWeight: 700, textDecoration: "none",
                                    color: isActive(link.href) ? "var(--nav-hover)" : "var(--nav-text)",
                                    borderBottom: isActive(link.href) ? "3px solid var(--brand)" : "3px solid transparent",
                                    transition: "color 0.15s",
                                }}
                                onMouseEnter={e => (e.currentTarget.style.color = "var(--nav-hover)")}
                                onMouseLeave={e => { if (!isActive(link.href)) e.currentTarget.style.color = "var(--nav-text)"; }}
                            >
                                {link.name}
                            </Link>
                        )
                    )}
                </div>

                {/* Phone + Book Now */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }} className="desktop-nav">
                    <a href={`tel:${siteConfig.phoneNumber.replace(/\D/g, "")}`}
                        style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--nav-hover)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 600 }}
                    >
                        <Phone size={16} style={{ color: "var(--brand)" }} />
                        {siteConfig.phoneNumber}
                    </a>
                    <Link href="/book" className="btn-primary" style={{ fontSize: "0.9rem", padding: "0.6rem 1.25rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <Calendar size={16} /> Book Now
                    </Link>
                </div>

                {/* Mobile hamburger */}
                <button className="mobile-nav-toggle" onClick={() => setMobileOpen(!mobileOpen)} style={{ background: "none", border: "none", color: "var(--nav-hover)", cursor: "pointer", padding: 8 }}>
                    {mobileOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* ── Mobile Menu ──────────────────────────────────────────────────── */}
            {mobileOpen && (
                <div style={{ background: "var(--nav-bg)", borderTop: "1px solid var(--border)", maxHeight: "calc(100vh - 80px)", overflowY: "auto", padding: "0.5rem 1rem 1rem" }}>
                    {navLinks.map(link =>
                        link.hasDropdown ? (
                            <div key={link.name}>
                                <button onClick={() => toggle(link.name)} style={{
                                    width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                                    background: "none", border: "none", cursor: "pointer",
                                    padding: "0.75rem 0.5rem", fontSize: "1rem", fontWeight: 600,
                                    color: isActive(link.href) ? "var(--nav-hover)" : "var(--nav-text)",
                                }}>
                                    {link.name}
                                    <ChevronDown size={16} style={{ transform: activeDropdown === link.name ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                                </button>
                                {activeDropdown === link.name && (
                                    <div style={{ paddingLeft: "1rem", marginBottom: "0.5rem", borderLeft: "2px solid var(--brand)" }}>
                                        {link.name === "Services" ? (
                                            <>
                                                {serviceCategories.map(cat => (
                                                    <div key={cat.title} style={{ marginBottom: "0.75rem" }}>
                                                        <p style={{ color: "var(--brand)", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>{cat.title}</p>
                                                        {cat.links.map(sl => (
                                                            <Link key={sl.href} href={sl.href} onClick={() => { setMobileOpen(false); setActiveDropdown(null); }}
                                                                style={{ display: "block", padding: "0.35rem 0.5rem", color: "var(--muted)", textDecoration: "none", fontSize: "0.9rem" }}
                                                            >{sl.name}</Link>
                                                        ))}
                                                    </div>
                                                ))}
                                                <Link href="/services" onClick={() => { setMobileOpen(false); setActiveDropdown(null); }}
                                                    style={{ display: "block", padding: "0.5rem", color: "var(--nav-hover)", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none" }}
                                                >View All Services →</Link>
                                            </>
                                        ) : (
                                            <>
                                                <Link href="/locations" onClick={() => { setMobileOpen(false); setActiveDropdown(null); }}
                                                    style={{ display: "block", padding: "0.4rem 0.5rem", color: "var(--brand)", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none" }}
                                                >All Locations</Link>
                                                {locationLinks.map(loc => (
                                                    <Link key={loc.href} href={loc.href} onClick={() => { setMobileOpen(false); setActiveDropdown(null); }}
                                                        style={{ display: "block", padding: "0.35rem 0.5rem", color: "var(--muted)", textDecoration: "none", fontSize: "0.9rem" }}
                                                    >{loc.name}{siteConfig.state ? `, ${siteConfig.state}` : ""}</Link>
                                                ))}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link key={link.name} href={link.href} onClick={() => setMobileOpen(false)}
                                style={{ display: "block", padding: "0.75rem 0.5rem", color: isActive(link.href) ? "var(--nav-hover)" : "var(--nav-text)", textDecoration: "none", fontSize: "1rem", fontWeight: 600 }}
                            >{link.name}</Link>
                        )
                    )}
                    <div style={{ padding: "0.75rem 0.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        <a href={`tel:${siteConfig.phoneNumber.replace(/\D/g, "")}`}
                            style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--nav-hover)", textDecoration: "none", fontWeight: 600 }}
                        >
                            <Phone size={16} style={{ color: "var(--brand)" }} /> {siteConfig.phoneNumber}
                        </a>
                        <Link href="/book" onClick={() => setMobileOpen(false)} className="btn-primary" style={{ textAlign: "center", padding: "0.75rem" }}>
                            Book Now
                        </Link>
                    </div>
                </div>
            )}

            <style>{`
                .desktop-nav { display: none !important; }
                .mobile-nav-toggle { display: block !important; }
                @media (min-width: 1024px) {
                    .desktop-nav { display: flex !important; }
                    .mobile-nav-toggle { display: none !important; }
                }
            `}</style>
        </nav>
    );
}
