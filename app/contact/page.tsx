import type { Metadata } from "next";
import Link from "next/link";
import { Phone, MapPin, Clock } from "lucide-react";
import { siteConfig, formatPhone, telHref, groupBusinessHours, isSameDayEnabled } from "@/lib/siteConfig";
import { createPageMetadata, localBusinessJsonLd } from "@/lib/seo";
import ContactForm from "./ContactForm";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;
const areas = (siteConfig.serviceArea || "").split(",").map(s => s.trim()).filter(Boolean);

const hoursGroups = siteConfig.businessHours ? groupBusinessHours(siteConfig.businessHours) : null;

export const metadata: Metadata = createPageMetadata({
    title: `Contact ${siteConfig.companyName}`,
    description: `Get in touch with ${siteConfig.companyName} for junk removal near you in ${cityState}. Call, book online, or send a message.`,
    path: "/contact",
});

export default function ContactPage() {
    const contactCards = [
        { icon: Phone, label: "Phone", content: <a href={telHref(siteConfig.phoneNumber)} style={{ fontWeight: 600, color: "var(--foreground)", textDecoration: "none" }}>{formatPhone(siteConfig.phoneNumber)}</a> },
        { icon: MapPin, label: "Service Area", content: <div style={{ fontWeight: 600, color: "var(--foreground)" }}>{siteConfig.serviceArea}</div> },
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
            />
            <section style={{ background: "var(--hero-bg)", padding: "9rem 1.5rem 4rem", textAlign: "center" }}>
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
                            {contactCards.map(({ icon: Icon, label, content }) => (
                                <div key={label} className="card" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(var(--brand-rgb, 249, 115, 22), 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <Icon size={22} style={{ color: "var(--brand)" }} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: "0.8rem", color: "var(--muted)", fontWeight: 500 }}>{label}</div>
                                        {content}
                                    </div>
                                </div>
                            ))}
                            {/* Hours card — shows grouped hours like the footer */}
                            <div className="card" style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                                <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(var(--brand-rgb, 249, 115, 22), 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <Clock size={22} style={{ color: "var(--brand)" }} />
                                </div>
                                <div>
                                    <div style={{ fontSize: "0.8rem", color: "var(--muted)", fontWeight: 500 }}>Hours</div>
                                    {hoursGroups ? (
                                        <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                                            {hoursGroups.map(g => (
                                                <div key={g.days} style={{ fontWeight: 600, color: "var(--foreground)", fontSize: "0.95rem" }}>
                                                    {g.days}: {g.label}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{ fontWeight: 600, color: "var(--foreground)" }}>Mon – Sat, 7am – 7pm</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick message */}
                    <div>
                        <h2 style={{ fontSize: "1.5rem", color: "var(--foreground)", marginBottom: "1.5rem" }}>Send a Message</h2>
                        <ContactForm />
                        <p style={{ color: "var(--muted)", fontSize: "0.92rem", lineHeight: 1.65, marginTop: "1rem" }}>
                            For the fastest quote,{" "}
                            <Link href="/book" style={{ color: "var(--brand)", fontWeight: 700, textDecoration: "none" }}>book online</Link>
                            {" "}and include your item details.
                        </p>
                    </div>
                </div>
            </section>

            {/* What to Expect — short summary linking to dedicated page (avoids duplicating /how-it-works content) */}
            <section style={{ padding: "3rem 1.5rem", background: "var(--card)", borderTop: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
                    <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "1rem" }}>What to Expect</h2>
                    <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: "1.05rem", marginBottom: "1.25rem" }}>
                        Getting junk removed in {siteConfig.city} is straightforward — book online or call, we confirm your appointment, and the crew reviews the final price before loading begins.
                    </p>
                    <Link href="/how-it-works" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "var(--btn-radius)", background: "var(--background)", border: "2px solid var(--brand)", color: "var(--brand)", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none" }}>
                        See how junk removal works step-by-step →
                    </Link>
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
                            {/* ZIP codes covered — uses serviceAreaZips from siteConfig.
                                Helps customers verify coverage and gives Google a richer
                                local-area signal (was previously only used for booking validation). */}
                            {siteConfig.serviceAreaZips.length > 0 && (
                                <div style={{ marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border)" }}>
                                    <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--muted)", marginBottom: "0.6rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                        ZIP Codes We Cover
                                    </p>
                                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.4rem" }}>
                                        {siteConfig.serviceAreaZips.map((zip) => (
                                            <span key={zip} style={{
                                                padding: "0.3rem 0.65rem", borderRadius: "var(--btn-radius)",
                                                background: "var(--card)", border: "1px solid var(--border)",
                                                fontSize: "0.75rem", fontWeight: 600, color: "var(--foreground)",
                                                fontFamily: "var(--mono, monospace)",
                                            }}>
                                                {zip}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <Link href="/locations" style={{ display: "inline-block", marginTop: "1.5rem", color: "var(--brand)", fontWeight: 600, textDecoration: "none" }}>
                                View All Locations →
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {isSameDayEnabled() && (
                <section style={{ padding: "3rem 1.5rem", background: "var(--card)", borderTop: "1px solid var(--border)" }}>
                    <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.75rem" }}>Need Pickup Today?</h2>
                        <p style={{ color: "var(--muted)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                            Same-day windows may be available when route capacity allows.
                        </p>
                        <Link href="/same-day-junk-removal" style={{ color: "var(--brand)", fontWeight: 800, textDecoration: "none" }}>
                            View same-day details →
                        </Link>
                    </div>
                </section>
            )}

            {/* Embedded Google Map — only renders when operator has provided their GBP Place ID + Maps key.
                Helps SEO (LocalBusiness map presence) and gives customers a quick visual of the service area. */}
            {siteConfig.gbpPlaceId && siteConfig.googleMapsKey && (
                <section style={{ padding: "0 0 4rem", background: "var(--background)" }}>
                    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem" }}>
                        <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--border)", boxShadow: "0 10px 40px rgba(0,0,0,0.08)" }}>
                            <iframe
                                title={`${siteConfig.companyName} on Google Maps`}
                                src={`https://www.google.com/maps/embed/v1/place?key=${siteConfig.googleMapsKey}&q=place_id:${siteConfig.gbpPlaceId}`}
                                width="100%"
                                height="400"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                style={{ border: 0, display: "block" }}
                                allowFullScreen
                            />
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
