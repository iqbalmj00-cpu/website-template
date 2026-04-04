import Link from "next/link";
import { siteConfig, formatPhone, telHref, roundTo5 } from "@/lib/siteConfig";
import { ALL_SERVICES, getServiceBySlug, getClientServices } from "@/lib/serviceData";
import { getLocations } from "@/lib/locationData";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ServiceIcon from "@/components/ServiceIcon";
import { Phone, CalendarDays, CheckCircle, Shield, Clock, Recycle, MapPin } from "lucide-react";

export async function generateStaticParams() {
    return ALL_SERVICES.map((svc) => ({ slug: svc.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const svc = getServiceBySlug(slug);
    if (!svc) return { title: "Service Not Found" };
    const pageTitle = `${svc.title} in ${siteConfig.city}, ${siteConfig.state} | ${siteConfig.companyName}`;
    const pageDesc = `${svc.shortDesc} Professional ${svc.title.toLowerCase()} service in ${siteConfig.city} by ${siteConfig.companyName}. Book your free estimate today.`;
    const svcImage = siteConfig.serviceImages?.[slug] || null;
    return {
        title: pageTitle,
        description: pageDesc,
        alternates: { canonical: `/services/${slug}` },
        openGraph: {
            title: pageTitle,
            description: pageDesc,
            type: "article",
            ...(svcImage ? { images: [{ url: svcImage, width: 1200, height: 630, alt: `${svc.title} in ${siteConfig.city}` }] } : {}),
        },
    };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const svc = getServiceBySlug(slug);
    if (!svc) notFound();

    const { companyName, city, state, phoneNumber } = siteConfig;
    const otherServices = getClientServices().filter((s) => s.slug !== slug).slice(0, 4);

    return (
        <>
            {/* JSON-LD: Service schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Service",
                        name: `${svc.title} in ${city}, ${state}`,
                        description: `${svc.shortDesc} Professional ${svc.title.toLowerCase()} service in ${city} by ${companyName}.`,
                        provider: {
                            "@type": "LocalBusiness",
                            name: companyName,
                            telephone: phoneNumber,
                            address: { "@type": "PostalAddress", addressLocality: city, addressRegion: state, addressCountry: "US" },
                        },
                        areaServed: { "@type": "City", name: city },
                        ...(siteConfig.subdomain ? { url: `https://${siteConfig.subdomain}.scaleyourjunk.com/services/${slug}` } : {}),
                    }),
                }}
            />
            {/* JSON-LD: BreadcrumbList */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        itemListElement: [
                            { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.subdomain ? `https://${siteConfig.subdomain}.scaleyourjunk.com` : "/" },
                            { "@type": "ListItem", position: 2, name: "Services", item: siteConfig.subdomain ? `https://${siteConfig.subdomain}.scaleyourjunk.com/services` : "/services" },
                            { "@type": "ListItem", position: 3, name: svc.title },
                        ],
                    }),
                }}
            />
            {/* JSON-LD: FAQPage */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        mainEntity: svc.faqs.map((faq: { q: string; a: string }) => ({
                            "@type": "Question",
                            name: faq.q,
                            acceptedAnswer: { "@type": "Answer", text: faq.a },
                        })),
                    }),
                }}
            />
            {/* Hero */}
            <section style={{ background: "var(--hero-bg)", padding: "9rem 1.5rem 5rem", textAlign: "center" }}>
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
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                        <ServiceIcon name={svc.icon} size={16} color="var(--brand)" /> Available for same-day pickup
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
                        {svc.title.split(" ").slice(0, -1).join(" ")}{" "}
                        <span style={{ color: "var(--brand)" }}>{svc.title.split(" ").pop()}</span>
                        <span style={{ display: "block", fontSize: "clamp(1rem, 2.5vw, 1.3rem)", fontWeight: 400, color: "var(--hero-muted)", marginTop: "0.5rem", textTransform: "none" }}>
                            in {city}{state ? `, ${state}` : ""}
                        </span>
                    </h1>
                    <p style={{ fontSize: "1.15rem", color: "var(--hero-muted)", maxWidth: 600, margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
                        {svc.heroSubtitle}
                    </p>
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
                        {["Upfront Pricing", "Fully Insured", "Eco-Friendly"].map((t) => (
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
                        {[
                            { icon: CheckCircle, title: "Upfront Pricing", desc: `No hidden fees on your ${svc.title.toLowerCase()} job. We give you a firm price before we start — what we quote is what you pay.` },
                            { icon: Clock, title: "Same-Day Service", desc: `Need ${svc.title.toLowerCase()} today? We frequently have same-day availability in ${city} and surrounding areas.` },
                            { icon: Recycle, title: "Eco-Friendly Disposal", desc: `We donate and recycle items from every ${svc.title.toLowerCase()} job whenever possible. Landfill is always our last resort.` },
                            { icon: Shield, title: "Licensed & Insured", desc: `${companyName} is fully licensed and insured. Your property is protected when our crew handles your ${svc.title.toLowerCase()}.` },
                        ].map((item) => (
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
                const locations = getLocations();
                const areaNames = locations.slice(0, 8).map(l => l.name);
                return areaNames.length > 1 ? (
                    <section style={{ padding: "4rem 1.5rem", background: "var(--background)", borderTop: "1px solid var(--border)" }}>
                        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
                            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "1rem" }}>
                                {svc.title} Across {city} &amp; Surrounding Areas
                            </h2>
                            <p style={{ color: "var(--muted)", fontSize: "1rem", lineHeight: 1.7, marginBottom: "1.5rem", maxWidth: 600, margin: "0 auto 1.5rem" }}>
                                {companyName} provides professional {svc.title.toLowerCase()} services throughout {city}{state ? `, ${state}` : ""} and the surrounding communities. No matter where you are in the area, our crew can be there — often the same day.
                            </p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
                                {areaNames.map((name) => (
                                    <span key={name} style={{
                                        display: "inline-flex", alignItems: "center", gap: "0.3rem",
                                        padding: "0.4rem 0.75rem", borderRadius: "var(--btn-radius)",
                                        background: "var(--card)", border: "1px solid var(--border)",
                                        fontSize: "0.85rem", fontWeight: 600, color: "var(--foreground)",
                                    }}>
                                        <MapPin size={12} color="var(--brand)" /> {name}
                                    </span>
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
                        Get a free estimate today. Same-day service available in {city}{state ? `, ${state}` : ""}.
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
