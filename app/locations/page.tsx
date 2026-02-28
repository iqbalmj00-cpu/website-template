import Link from "next/link";
import { siteConfig, formatPhone, telHref } from "@/lib/siteConfig";
import { getLocations } from "@/lib/locationData";
import { getClientServices } from "@/lib/serviceData";
import type { Metadata } from "next";
import ServiceIcon from "@/components/ServiceIcon";
import { MapPin, Truck, ShieldCheck, Recycle, Phone } from "lucide-react";

export const metadata: Metadata = {
    title: `Service Locations | ${siteConfig.companyName}`,
    description: `${siteConfig.companyName} serves the ${siteConfig.serviceArea || siteConfig.city} area. Find junk removal services near you.`,
};

export default function LocationsPage() {
    const locations = getLocations();
    const services = getClientServices();
    const { companyName, phoneNumber, city, state, serviceArea } = siteConfig;

    return (
        <>
            {/* Hero */}
            <section
                style={{
                    background: "var(--hero-bg)",
                    padding: "7rem 1.5rem 5rem",
                    textAlign: "center",
                }}
            >
                <div style={{ maxWidth: 900, margin: "0 auto" }}>
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
                        <MapPin size={16} style={{ color: "var(--brand)" }} /> Serving {serviceArea || city}
                    </span>
                    <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900, color: "var(--hero-text)", lineHeight: 1.1, marginBottom: "1.5rem" }}>
                        Service <span style={{ color: "var(--brand)" }}>Locations</span>
                    </h1>
                    <p style={{ fontSize: "1.2rem", color: "var(--hero-muted)", maxWidth: 600, margin: "0 auto" }}>
                        We proudly serve {city}{state ? `, ${state}` : ""} and surrounding communities. Find your neighborhood and book today.
                    </p>
                </div>
            </section>

            {/* Trust Metrics */}
            <section style={{ background: "var(--card)", borderBottom: "1px solid var(--border)", padding: "2rem 1.5rem" }}>
                <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "2rem", textAlign: "center" }}>
                    {[
                        { Icon: Truck, label: "Same Day", sub: "Service Available" },
                        { Icon: ShieldCheck, label: "Licensed", sub: "& Fully Insured" },
                        { Icon: Recycle, label: "Eco-Friendly", sub: "Disposal" },
                        { Icon: Phone, label: "Free", sub: "Estimates" },
                    ].map((m) => (
                        <div key={m.label} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <span style={{ marginBottom: "0.5rem" }}><m.Icon size={28} color="var(--brand)" /></span>
                            <span style={{ fontWeight: 800, fontSize: "1.15rem" }}>{m.label}</span>
                            <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>{m.sub}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Location Cards */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--background)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                        <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Choose Your Area</h2>
                        <div style={{ width: 60, height: 4, borderRadius: "var(--btn-radius)", background: "var(--brand)", margin: "1rem auto 0" }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
                        {locations.map((loc) => (
                            <Link
                                key={loc.slug}
                                href={`/locations/${loc.slug}`}
                                style={{
                                    background: "var(--card)",
                                    borderRadius: 16,
                                    padding: "2rem",
                                    border: "1px solid var(--border)",
                                    textDecoration: "none",
                                    color: "inherit",
                                    transition: "box-shadow 0.3s, transform 0.3s",
                                    display: "block",
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                    <span style={{ fontSize: "2rem" }}><MapPin size={28} color="var(--brand)" /></span>
                                    <span style={{ color: "var(--muted)" }}>→</span>
                                </div>
                                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "0.5rem" }}>
                                    {loc.name}, {loc.state}
                                </h3>
                                <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1rem", lineHeight: 1.5 }}>
                                    {loc.heroDescription.slice(0, 100)}…
                                </p>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                    {loc.neighborhoods.slice(0, 4).map((hood) => (
                                        <span key={hood} style={{ fontSize: "0.75rem", background: "var(--background)", padding: "0.3rem 0.6rem", borderRadius: "var(--btn-radius)", fontWeight: 500 }}>
                                            {hood}
                                        </span>
                                    ))}
                                    {loc.neighborhoods.length > 4 && (
                                        <span style={{ fontSize: "0.75rem", background: "rgba(var(--brand-rgb, 249, 115, 22), 0.1)", color: "var(--brand)", padding: "0.3rem 0.6rem", borderRadius: "var(--btn-radius)", fontWeight: 600 }}>
                                            +{loc.neighborhoods.length - 4} more
                                        </span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Overview */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--card)", borderTop: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                        <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Our Services</h2>
                        <div style={{ width: 60, height: 4, borderRadius: "var(--btn-radius)", background: "var(--brand)", margin: "1rem auto 0" }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
                        {services.slice(0, 8).map((svc) => (
                            <Link
                                key={svc.slug}
                                href={`/services/${svc.slug}`}
                                style={{
                                    padding: "2rem",
                                    background: "var(--background)",
                                    border: "1px solid var(--border)",
                                    borderRadius: 16,
                                    textDecoration: "none",
                                    color: "inherit",
                                    textAlign: "center",
                                    transition: "transform 0.2s",
                                }}
                            >
                                <div style={{ marginBottom: "0.75rem" }}><ServiceIcon name={svc.icon} size={28} color="var(--brand)" /></div>
                                <h3 style={{ fontSize: "1rem", fontWeight: 700, textTransform: "uppercase" }}>{svc.title}</h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ background: "var(--hero-bg)", padding: "5rem 1.5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "var(--hero-text)", marginBottom: "1rem" }}>
                        Don&apos;t See Your Exact Neighborhood?
                    </h2>
                    <p style={{ color: "var(--hero-muted)", fontSize: "1.1rem", marginBottom: "2rem" }}>
                        We cover more areas than we can list. Give us a call and chances are we're already serving your community.
                    </p>
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <Link href="/book" className="btn-primary" style={{ padding: "1rem 2rem", fontSize: "1rem" }}>
                            <Truck size={18} /> Book Your Pickup
                        </Link>
                        <a href={telHref(phoneNumber)} style={{ padding: "1rem 2rem", borderRadius: "var(--btn-radius)", border: "2px solid #fff", color: "var(--hero-text)", textDecoration: "none", fontWeight: 700, fontSize: "1rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                            <Phone size={18} /> {formatPhone(phoneNumber)}
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
