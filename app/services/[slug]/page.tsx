import Link from "next/link";
import { siteConfig, formatPhone, telHref, roundTo5, getVerifiableTrustSignals, hasInsurance, hasLicense, isSameDayEnabled } from "@/lib/siteConfig";
import { getServiceBySlug, getClientServices, getServiceSynonyms } from "@/lib/serviceData";
import { getIndexableLocations } from "@/lib/locationData";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ServiceIcon from "@/components/ServiceIcon";
import { Phone, CalendarDays, CheckCircle, Shield, Clock, Recycle, MapPin } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { breadcrumbJsonLd, createPageMetadata, serviceJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
    // Only generate pages for services the client actually offers (per siteConfig.services).
    return getClientServices().map((svc) => ({ slug: svc.slug }));
}

// Reject any slug not in generateStaticParams at runtime — required because
// getServiceBySlug() looks across ALL_SERVICES, so without this Next.js would
// happily render a service the client doesn't offer when visited directly.
// Old indexed URLs for disabled services will 404, which is the correct
// de-indexing signal to Google.
export const dynamicParams = false;

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
    const svc = getClientServices().find((service) => service.slug === params.slug);
    if (!svc) {
        return createPageMetadata({
            title: "Service Not Found",
            description: "This service is not available.",
            path: `/services/${params.slug}`,
            noIndex: true,
        });
    }

    const pageDesc = `${svc.shortDesc} ${siteConfig.companyName} provides ${svc.title.toLowerCase()} in ${siteConfig.city}.`;
    return createPageMetadata({
        title: `${svc.title} in ${siteConfig.city}`,
        description: pageDesc,
        path: `/services/${svc.slug}`,
        image: siteConfig.serviceImages?.[svc.slug] || null,
    });
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
    const svc = getClientServices().find((service) => service.slug === params.slug) || getServiceBySlug(params.slug);
    if (!svc || !getClientServices().some((service) => service.slug === svc.slug)) notFound();

    const { companyName, city, state, phoneNumber } = siteConfig;
    const otherServices = getClientServices().filter((s) => s.slug !== svc.slug).slice(0, 4);
    const titleParts = svc.title.split(" ");
    const titleAccent = titleParts.pop() || svc.title;
    const titlePrefix = titleParts.join(" ");
    const trustSignals = getVerifiableTrustSignals();
    const synonyms = getServiceSynonyms(svc).slice(0, 3);
    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Services", href: "/services" },
        { label: svc.title, href: `/services/${svc.slug}` },
    ];
    const whyChoose = [
        { icon: CheckCircle, title: "Upfront Pricing", desc: `We confirm your ${svc.title.toLowerCase()} price before loading begins.` },
        ...(isSameDayEnabled() ? [{ icon: Clock, title: "Same-Day Availability", desc: `Same-day ${svc.title.toLowerCase()} may be available in ${city} when route capacity allows.` }] : []),
        ...(siteConfig.recyclingRate !== null ? [{ icon: Recycle, title: "Recycling Target", desc: `${companyName} has a ${siteConfig.recyclingRate}% recycling target for eligible materials.` }] : []),
        ...((hasLicense() || hasInsurance()) ? [{ icon: Shield, title: "Verified Credentials", desc: [hasLicense() ? "license on file" : "", hasInsurance() ? "insurance carrier on file" : ""].filter(Boolean).join(" and ") }] : []),
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        breadcrumbJsonLd(breadcrumbs.map(item => ({ name: item.label, path: item.href }))),
                        serviceJsonLd({
                            service: svc,
                            path: `/services/${svc.slug}`,
                            description: `${svc.shortDesc} ${companyName} provides ${svc.title.toLowerCase()} in ${city}.`,
                        }),
                    ]),
                }}
            />
            <Breadcrumbs items={breadcrumbs} />
            {/* Hero */}
            <section style={{ background: "var(--hero-bg)", padding: "5rem 1.5rem 5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 800, margin: "0 auto" }}>
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
                        <ServiceIcon name={svc.icon} size={16} color="var(--brand)" /> {isSameDayEnabled() ? "Same-day may be available" : "Online booking available"}
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
                        {titlePrefix && `${titlePrefix} `}
                        <span style={{ color: "var(--brand)" }}>{titleAccent}</span>
                        <span style={{ display: "block", fontSize: "clamp(1rem, 2.5vw, 1.3rem)", fontWeight: 400, color: "var(--hero-muted)", marginTop: "0.5rem", textTransform: "none" }}>
                            in {city}{state ? `, ${state}` : ""}
                        </span>
                    </h1>
                    <p style={{ fontSize: "1.15rem", color: "var(--hero-muted)", maxWidth: 600, margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
                        {svc.heroSubtitle}
                    </p>
                    {synonyms.length > 0 && (
                        <p style={{ color: "var(--hero-muted)", fontSize: "0.95rem", lineHeight: 1.6, margin: "-1.5rem auto 2rem", maxWidth: 620 }}>
                            Also available for: {synonyms.join(", ")}.
                        </p>
                    )}
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2rem" }}>
                        <Link href="/book" className="btn-primary" style={{ padding: "1rem 2.5rem", fontSize: "1.05rem" }}>
                            Get a Free Quote →
                        </Link>
                        <a
                            href={telHref(phoneNumber)}
                            className="hero-outline-btn"
                        >
                            <Phone size={16} /> {formatPhone(phoneNumber)}
                        </a>
                    </div>
                    <div style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap" }}>
                        {trustSignals.map((t) => (
                            <span key={t} style={{ color: "var(--hero-muted)", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                <span style={{ color: "var(--brand)" }}>✓</span> {t}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Items Grid */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--card)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                        <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                            What We Remove
                        </h2>
                        <p style={{ color: "var(--muted)", fontSize: "1.05rem" }}>
                            Whether it&apos;s a single item or a full property, we&apos;re ready to help.
                        </p>
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                            gap: "1.5rem",
                        }}
                    >
                        {svc.items.map((item) => (
                            <div
                                key={item.title}
                                style={{
                                    background: "var(--background)",
                                    border: "1px solid var(--border)",
                                    borderRadius: 16,
                                    padding: "2rem",
                                    transition: "box-shadow 0.3s",
                                }}
                            >
                                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem" }}>{item.title}</h3>
                                <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.5 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Steps */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--background)" }}>
                <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
                    <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>Simple 3-Step Process</h2>
                    <p style={{ color: "var(--muted)", marginBottom: "3rem" }}>No stress, no mess.</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
                        {svc.procesSteps.map((step, i) => (
                            <div key={step.title} style={{ textAlign: "center" }}>
                                <div
                                    style={{
                                        width: 72,
                                        height: 72,
                                        borderRadius: 16,
                                        background: "rgba(var(--brand-rgb, 249, 115, 22), 0.1)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0 auto 1rem",
                                        fontSize: "1.75rem",
                                        fontWeight: 900,
                                        color: "var(--brand)",
                                    }}
                                >
                                    {i + 1}
                                </div>
                                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem" }}>{step.title}</h3>
                                <p style={{ color: "var(--muted)", fontSize: "0.9rem", maxWidth: 280, margin: "0 auto" }}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--card)", borderTop: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <h2 style={{ fontSize: "2rem", fontWeight: 800, textAlign: "center", marginBottom: "2rem" }}>
                        Frequently Asked Questions
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {svc.faqs.map((faq) => (
                            <details
                                key={faq.q}
                                style={{
                                    border: "1px solid var(--border)",
                                    borderRadius: 12,
                                    overflow: "hidden",
                                }}
                            >
                                <summary
                                    style={{
                                        padding: "1rem 1.5rem",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        background: "var(--card)",
                                        fontSize: "1rem",
                                    }}
                                >
                                    {faq.q}
                                </summary>
                                <div
                                    style={{
                                        padding: "1rem 1.5rem",
                                        background: "var(--background)",
                                        color: "var(--muted)",
                                        lineHeight: 1.6,
                                        borderTop: "1px solid var(--border)",
                                    }}
                                >
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            {siteConfig.pricing?.tiers?.length > 0 && (
                <section style={{ padding: "5rem 1.5rem", background: "var(--background)", borderTop: "1px solid var(--border)" }}>
                    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>
                                How Much Does {svc.title} Cost in {city}?
                            </h2>
                            <p style={{ color: "var(--muted)", fontSize: "1.05rem", marginTop: "0.75rem", maxWidth: 600, margin: "0.75rem auto 0" }}>
                                {svc.title} pricing is based on volume — how much space your items take up in our truck. Here are our standard rates for {city}{state ? `, ${state}` : ""}.
                            </p>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem" }}>
                            {siteConfig.pricing.tiers.filter(t => t.id !== "multi").map((tier) => (
                                <div key={tier.id} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "1.25rem", textAlign: "center", minWidth: 150, flex: "0 1 170px" }}>
                                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>{tier.label}</div>
                                    <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--foreground)" }}>${roundTo5(tier.min)} – ${roundTo5(tier.max)}</div>
                                </div>
                            ))}
                        </div>
                        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--muted)" }}>
                            Every job includes loading, hauling, disposal, and cleanup. Our crew confirms the exact price on-site before starting. <Link href="/pricing" style={{ color: "var(--brand)", fontWeight: 600 }}>See full pricing details</Link>.
                        </p>
                    </div>
                </section>
            )}

            {/* Why Choose Us */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--card)", borderTop: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                        <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>
                            Why Choose {companyName} for {svc.title}?
                        </h2>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
                        {whyChoose.map((item) => (
                            <div key={item.title} style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: 16, padding: "1.5rem" }}>
                                <item.icon size={28} color="var(--brand)" style={{ marginBottom: "0.75rem" }} />
                                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>{item.title}</h3>
                                <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Service Area */}
            {(() => {
                const locations = getIndexableLocations();
                const serviceLocations = locations.slice(0, 8);
                return serviceLocations.length > 1 ? (
                    <section style={{ padding: "4rem 1.5rem", background: "var(--background)", borderTop: "1px solid var(--border)" }}>
                        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
                            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "1rem" }}>
                                {svc.title} Across {city} &amp; Surrounding Areas
                            </h2>
                            <p style={{ color: "var(--muted)", fontSize: "1rem", lineHeight: 1.7, marginBottom: "1.5rem", maxWidth: 600, margin: "0 auto 1.5rem" }}>
                                {companyName} provides professional {svc.title.toLowerCase()} services throughout {city}{state ? `, ${state}` : ""} and the configured surrounding communities. {isSameDayEnabled() ? "Same-day windows may be available when route capacity allows." : "Book online or call to find the next available pickup window."}
                            </p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
                                {serviceLocations.map((location) => (
                                    <Link key={location.slug} href={`/locations/${location.slug}/${svc.slug}`} style={{
                                        display: "inline-flex", alignItems: "center", gap: "0.3rem",
                                        padding: "0.4rem 0.75rem", borderRadius: "var(--btn-radius)",
                                        background: "var(--card)", border: "1px solid var(--border)",
                                        fontSize: "0.85rem", fontWeight: 600, color: "var(--foreground)",
                                        textDecoration: "none",
                                    }}>
                                        <MapPin size={12} color="var(--brand)" /> {location.name}
                                    </Link>
                                ))}
                            </div>
                            <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
                                <Link href="/locations" style={{ color: "var(--brand)", fontWeight: 600 }}>View all service areas →</Link>
                            </p>
                        </div>
                    </section>
                ) : null;
            })()}

            {/* Other Services */}
            {otherServices.length > 0 && (
                <section style={{ padding: "4rem 1.5rem", background: "var(--background)", borderTop: "1px solid var(--border)" }}>
                    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem", textTransform: "uppercase", letterSpacing: "0.03em", textAlign: "center" }}>
                            Other Services
                        </h3>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
                            {otherServices.map((s) => (
                                <Link
                                    key={s.slug}
                                    href={`/services/${s.slug}`}
                                    style={{
                                        padding: "0.6rem 1.25rem",
                                        borderRadius: "var(--btn-radius)",
                                        background: "var(--card)",
                                        border: "1px solid var(--border)",
                                        textDecoration: "none",
                                        color: "var(--foreground)",
                                        fontWeight: 600,
                                        fontSize: "0.9rem",
                                        transition: "all 0.2s",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                    }}
                                >
                                    <ServiceIcon name={s.icon} size={16} color="var(--brand)" /> {s.title} →
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Bottom CTA */}
            <section
                style={{
                    background: "var(--brand)",
                    padding: "4rem 1.5rem",
                    textAlign: "center",
                }}
            >
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "var(--hero-text)", marginBottom: "1rem" }}>
                        Ready to Reclaim Your Space?
                    </h2>
                    <p style={{ color: "var(--hero-text)", fontSize: "1.05rem", marginBottom: "2rem" }}>
                        Get an estimate today for {svc.title.toLowerCase()} in {city}{state ? `, ${state}` : ""}.
                    </p>
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <Link
                            href="/book"
                            style={{
                                padding: "1rem 2rem",
                                borderRadius: "var(--btn-radius)",
                                background: "var(--card)",
                                color: "var(--brand)",
                                fontWeight: 700,
                                fontSize: "1rem",
                                textDecoration: "none",
                            }}
                        >
                            <CalendarDays size={18} /> Book Online Now
                        </Link>
                        <a
                            href={telHref(phoneNumber)}
                            style={{
                                padding: "1rem 2rem",
                                borderRadius: "var(--btn-radius)",
                                border: "2px solid var(--hero-text)",
                                color: "var(--hero-text)",
                                fontWeight: 700,
                                fontSize: "1rem",
                                textDecoration: "none",
                            }}
                        >
                            <Phone size={18} /> Call {formatPhone(phoneNumber)}
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
