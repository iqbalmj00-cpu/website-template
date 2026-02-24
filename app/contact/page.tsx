import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { siteConfig, formatPhone, telHref } from "@/lib/siteConfig";

export const metadata: Metadata = {
    title: `Contact Us | ${siteConfig.companyName}`,
    description: `Get in touch with ${siteConfig.companyName}. Serving ${siteConfig.serviceArea}.`,
};

export default function ContactPage() {
    const contactInfo = [
        { icon: Phone, label: "Phone", value: formatPhone(siteConfig.phoneNumber), href: telHref(siteConfig.phoneNumber) },
        { icon: MapPin, label: "Service Area", value: siteConfig.serviceArea, href: undefined },
        { icon: Clock, label: "Hours", value: "Mon – Sat, 7am – 7pm", href: undefined },
    ];

    return (
        <>
            <section style={{ background: "var(--hero-bg)", padding: "5rem 1.5rem 4rem", textAlign: "center" }}>
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--hero-text)", marginBottom: "1rem" }}>
                        Get In Touch
                    </h1>
                    <p style={{ color: "var(--hero-muted)", fontSize: "1.1rem", lineHeight: 1.7 }}>
                        Have a question or need a quote? We&rsquo;d love to hear from you.
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
                                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(249,115,22,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
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
                                {" "}— it takes about 2 minutes and you&rsquo;ll get an instant estimate.
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
        </>
    );
}
