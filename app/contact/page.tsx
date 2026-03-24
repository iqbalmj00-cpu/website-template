import type { Metadata } from "next";
import Link from "next/link";
import { Phone, MapPin, Clock, CalendarDays, MessageSquare, Truck } from "lucide-react";
import { siteConfig, formatPhone, telHref } from "@/lib/siteConfig";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;
const areas = (siteConfig.serviceArea || "").split(",").map(s => s.trim()).filter(Boolean);

function formatHoursDisplay(): string {
    const hours = siteConfig.businessHours;
    if (!hours) return "Mon – Sat, 7am – 7pm";
    const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    const dayLabels: Record<string, string> = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" };
    const open = days.filter(d => hours[d] && !hours[d].closed);
    if (open.length === 0) return "By appointment only";
    const firstDay = open[0];
    const lastDay = open[open.length - 1];
    const sample = hours[firstDay];
    if (!sample) return "Mon – Sat, 7am – 7pm";
    const fmt = (t: string | undefined) => { if (!t) return "?"; const [h] = t.split(":").map(Number); return h > 12 ? `${h - 12}pm` : `${h}am`; };
    return `${dayLabels[firstDay]} – ${dayLabels[lastDay]}, ${fmt(sample.start)} – ${fmt(sample.end)}`;
}

export const metadata: Metadata = {
    title: `Contact ${siteConfig.companyName} — Junk Removal in ${cityState}`,
    description: `Get in touch with ${siteConfig.companyName} for junk removal in ${cityState}. Call for a free quote, book online, or send us a message. Same-day service available.`,
    alternates: { canonical: "/contact" },
};

export default function ContactPage() {
    const contactInfo = [
        { icon: Phone, label: "Phone", value: formatPhone(siteConfig.phoneNumber), href: telHref(siteConfig.phoneNumber) },
        { icon: MapPin, label: "Service Area", value: siteConfig.serviceArea, href: undefined },
        { icon: Clock, label: "Hours", value: formatHoursDisplay(), href: undefined },
    ];

    return (
        <>
            <section style={{ background: "var(--hero-bg)", padding: "5rem 1.5rem 4rem", textAlign: "center" }}>
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--hero-text)", marginBottom: "1rem" }}>
                        Contact {siteConfig.companyName} in {siteConfig.city}
                    </h1>
                    <p style={{ color: "var(--hero-muted)", fontSize: "1.1rem", lineHeight: 1.7 }}>
                        Need junk removed in {cityState}? We&apos;re here to help. Get a free quote in minutes — online or by phone.
                    </p>
                </div>
            </section>

            <section className="section">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
                    {/* Contact info cards */}
                    <div>
                        <h2 style={{ fontSize: "1.5rem", color: "var(--foreground)", marginBottom: "1.5rem" }}>Contact Info</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {contactInfo.map(({ icon: Icon, label, value, href }) => (
                                <div key={label} className="card" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(var(--brand-rgb, 249, 115, 22), 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <Icon size={22} style={{ color: "var(--brand)" }} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: "0.8rem", color: "var(--muted)", fontWeight: 500 }}>{label}</div>
                                        {href ? (
                                            <a href={href} style={{ fontWeight: 600, color: "var(--foreground)", textDecoration: "none" }}>{value}</a>
                                        ) : (
                                            <div style={{ fontWeight: 600, color: "var(--foreground)" }}>{value}</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick message */}
                    <div>
                        <h2 style={{ fontSize: "1.5rem", color: "var(--foreground)", marginBottom: "1.5rem" }}>Send a Message</h2>
                        <div className="card">
                            <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                                The fastest way to get a quote is to{" "}
                                <a href="/book" style={{ color: "var(--brand)", fontWeight: 600, textDecoration: "none" }}>book online</a>
                                {" "}— it takes about 2 minutes and you&apos;ll get an instant estimate.
                            </p>
                            <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.7 }}>
                                For general inquiries, give us a call at{" "}
                                <a href={telHref(siteConfig.phoneNumber)} style={{ color: "var(--brand)", fontWeight: 600, textDecoration: "none" }}>
                                    {formatPhone(siteConfig.phoneNumber)}
                                </a>
                                . Our AI assistant is available 24/7 and our crew is ready to help during business hours.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* What to Expect */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--card)", borderTop: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                    <h2 className="section-title" style={{ textAlign: "center", marginBottom: "1rem" }}>What to Expect</h2>
                    <p style={{ textAlign: "center", color: "var(--muted)", maxWidth: 600, margin: "0 auto 3rem", lineHeight: 1.7 }}>
                        Getting junk removed in {siteConfig.city} is quick and easy with {siteConfig.companyName}.
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2rem" }}>
                        {[
                            { icon: CalendarDays, step: "1", title: "Book & Get Your Estimate", desc: `Book online in 2 minutes — select your items and see your price range instantly. Or call us at ${formatPhone(siteConfig.phoneNumber)}. Our 24/7 AI phone agent can book your pickup anytime.` },
                            { icon: MessageSquare, step: "2", title: "We Confirm Your Appointment", desc: `Our team reviews your booking and confirms your date, time, and estimated price. You'll get a confirmation with all the details — no guesswork.` },
                            { icon: Truck, step: "3", title: "We Show Up & Haul It Away", desc: "Our crew arrives on time, confirms the final price on-site, and gets to work. We load, sweep up, and haul everything away. Most jobs take under an hour." },
                        ].map((item) => (
                            <div key={item.step} style={{ textAlign: "center" }}>
                                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--brand)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: 800, margin: "0 auto 1rem" }}>
                                    {item.step}
                                </div>
                                <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem", color: "var(--foreground)" }}>{item.title}</h3>
                                <p style={{ color: "var(--muted)", lineHeight: 1.65, fontSize: "0.925rem" }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Service Area */}
            {areas.length > 1 && (
                <section style={{ padding: "4rem 1.5rem", background: "var(--background)", borderTop: "1px solid var(--border)" }}>
                    <div style={{ maxWidth: 800, margin: "0 auto" }}>
                        <div className="card" style={{ textAlign: "center", padding: "2.5rem" }}>
                            <MapPin size={32} style={{ color: "var(--brand)", marginBottom: "1rem" }} />
                            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1rem" }}>Our Service Area</h2>
                            <p style={{ color: "var(--muted)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                                We serve all of {siteConfig.city} and surrounding areas including:
                            </p>
                            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.5rem" }}>
                                {areas.map((area) => (
                                    <span key={area} style={{
                                        display: "inline-flex", alignItems: "center", gap: "0.3rem",
                                        padding: "0.35rem 0.75rem", borderRadius: "var(--btn-radius)",
                                        background: "var(--background)", border: "1px solid var(--border)",
                                        fontSize: "0.8rem", fontWeight: 600,
                                    }}>
                                        <MapPin size={11} color="var(--brand)" /> {area}
                                    </span>
                                ))}
                            </div>
                            <Link href="/locations" style={{ display: "inline-block", marginTop: "1.5rem", color: "var(--brand)", fontWeight: 600, textDecoration: "none" }}>
                                View All Locations →
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
