import Link from "next/link";
import type { Metadata } from "next";
import { Phone, Star, CheckCircle, ArrowRight } from "lucide-react";
import { getSiteBaseUrl, getVerifiableTrustSignals, hasInsurance, hasLicense, isSameDayEnabled, siteConfig, formatPhone, telHref } from "@/lib/siteConfig";
import { getClientServices } from "@/lib/serviceData";
import ServiceIcon from "@/components/ServiceIcon";
import SafeImage from "@/components/SafeImage";
import { createPageMetadata } from "@/lib/seo";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;

export const metadata: Metadata = createPageMetadata({
    title: `Junk Removal in ${cityState}`,
    description: `${siteConfig.companyName} provides junk removal in ${cityState}: furniture, appliances, yard waste, cleanouts, construction debris, and more.`,
    path: "/",
});

export default function HomePage() {
    const howItWorks = [
        {
            step: "1",
            title: "Book & Get Your Estimate",
            desc: "Book online, select your items, and see an estimated price range. You can also call with questions before scheduling.",
        },
        {
            step: "2",
            title: "We Confirm",
            desc: "Our team reviews your booking and confirms your date, time, and estimated price.",
        },
        {
            step: "3",
            title: "We Show Up & Haul",
            desc: "The crew confirms the final price before loading, then hauls away the approved items.",
        },
    ];

    const trustItems = getVerifiableTrustSignals().map((label) => ({ icon: CheckCircle, label }));

    const whyUs = [
        {
            title: "Upfront Pricing",
            desc: "The crew confirms the final price before loading begins.",
        },
        ...(isSameDayEnabled() ? [{ title: "Same-Day Availability", desc: "Same-day pickup may be available when route capacity allows." }] : []),
        ...(siteConfig.recyclingRate !== null ? [{ title: "Recycling Target", desc: `${siteConfig.recyclingRate}% recycling target for eligible materials.` }] : []),
        ...((hasLicense() || hasInsurance()) ? [{ title: "Verified Credentials", desc: [hasLicense() ? "license on file" : "", hasInsurance() ? "insurance carrier on file" : ""].filter(Boolean).join(" and ") }] : []),
    ];

    const baseUrl = getSiteBaseUrl();
    const clientServices = getClientServices();

    return (
        <>
            {/* ── JSON-LD: WebSite + Organization ── */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        name: siteConfig.companyName,
                        url: baseUrl,
                        potentialAction: {
                            "@type": "SearchAction",
                            target: `${baseUrl}/services/{search_term_string}`,
                            "query-input": "required name=search_term_string",
                        },
                    }),
                }}
            />

            {/* ── Hero ──────────────────────────────────────────────────────────── */}
            <section
                style={{
                    background: "var(--hero-bg)",
                    padding: "9rem 1.5rem 6rem",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div data-image-grid style={{ maxWidth: 1200, margin: "0 auto", position: "relative", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "3rem", alignItems: "center" }}>
                    <div style={{ maxWidth: 700 }}>
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                background: "var(--hero-badge-bg)",
                                border: "1px solid var(--hero-badge-border)",
                                borderRadius: "var(--btn-radius)",
                                padding: "0.375rem 1rem",
                                marginBottom: "1.5rem",
                            }}
                        >
                            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--brand)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                Serving {siteConfig.city} &amp; the Surrounding Areas
                            </span>
                        </div>
                        <h1
                            style={{
                                fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
                                color: "var(--hero-text)",
                                lineHeight: 1.1,
                                marginBottom: "1.5rem",
                            }}
                        >
                            Junk Removal in {siteConfig.city} Made{" "}
                            <span style={{ color: "var(--brand)" }}>Easy.</span>
                        </h1>
                        <p
                            style={{
                                fontSize: "clamp(1.1rem, 2.5vw, 1.3rem)",
                                color: "var(--hero-muted)",
                                lineHeight: 1.7,
                                marginBottom: "2.5rem",
                                maxWidth: 560,
                            }}
                        >
                            {siteConfig.tagline}
                        </p>
                        <p
                            style={{
                                fontSize: "1rem",
                                color: "var(--hero-muted)",
                                lineHeight: 1.7,
                                marginBottom: "2.5rem",
                                maxWidth: 560,
                                opacity: 0.85,
                            }}
                        >
                            Serving {cityState} and surrounding areas. {isSameDayEnabled() ? "Same-day pickup may be available when route capacity allows." : "Book online or call to find the next available pickup window."}
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
                            <Link href="/book" className="btn-primary" style={{ fontSize: "1.1rem", padding: "1rem 2.25rem" }}>
                                Book My Pickup <ArrowRight size={18} />
                            </Link>
                            <a
                                href={telHref(siteConfig.phoneNumber)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    color: "var(--hero-text)",
                                    textDecoration: "none",
                                    fontWeight: 500,
                                    fontSize: "1rem",
                                }}
                            >
                                <Phone size={18} style={{ color: "var(--brand)" }} />
                                {formatPhone(siteConfig.phoneNumber)}
                            </a>
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <SafeImage
                            src={siteConfig.heroImageUrl || "/images/generated/hero.png"}
                            fallbackSrc="/images/default-hero.png"
                            alt={`${siteConfig.companyName} junk removal in ${siteConfig.city}`}
                            collapseParentGrid
                            loading="eager"
                            style={{ width: "100%", maxWidth: 520, borderRadius: 20, objectFit: "cover", aspectRatio: "4/3", boxShadow: "0 25px 80px rgba(0,0,0,0.5)" }}
                        />
                    </div>
                </div>
            </section>

            {/* ── Trust bar ─────────────────────────────────────────────────────── */}
            <section style={{ background: "var(--brand)", padding: "1.25rem 1.5rem" }}>
                <div
                    style={{
                        maxWidth: 1200,
                        margin: "0 auto",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: "2rem",
                    }}
                >
                    {trustItems.map(({ icon: Icon, label }) => (
                        <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <Icon size={18} color="#fff" />
                            <span style={{ color: "var(--hero-text)", fontWeight: 600, fontSize: "0.925rem" }}>{label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Services ──────────────────────────────────────────────────────── */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--card)" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                        <h2 className="section-title" style={{ textAlign: "center" }}>What We Haul Away</h2>
                        <p className="section-subtitle" style={{ textAlign: "center", margin: "0.75rem auto 0" }}>
                            From single items to full property cleanouts — we handle it all in {siteConfig.city}.
                        </p>
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                            gap: "1rem",
                        }}
                    >
                        {clientServices.map((service) => {
                            return (
                                <Link
                                    key={service.slug}
                                    href={`/services/${service.slug}`}
                                    className="card"
                                    style={{ textAlign: "center", padding: "1.5rem 1rem", textDecoration: "none", color: "inherit" }}
                                >
                                    <div style={{ marginBottom: "0.75rem", display: "flex", justifyContent: "center" }}><ServiceIcon name={service.icon} size={32} color="var(--brand)" /></div>
                                    <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--foreground)" }}>
                                        {service.title}
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                    <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
                        <Link href="/services" className="btn-secondary">
                            View All Services
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── How It Works ──────────────────────────────────────────────────── */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--background)" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
                        <h2 className="section-title" style={{ textAlign: "center" }}>How It Works</h2>
                        <p className="section-subtitle" style={{ textAlign: "center", margin: "0.75rem auto 0" }}>
                            Three simple steps to a cleaner space.
                        </p>
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                            gap: "2rem",
                        }}
                    >
                        {howItWorks.map((item) => (
                            <div key={item.step} style={{ textAlign: "center" }}>
                                <div
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: "50%",
                                        background: "var(--brand)",
                                        color: "var(--hero-text)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "1.5rem",
                                        fontWeight: 800,
                                        margin: "0 auto 1.25rem",
                                        fontFamily: "var(--heading-font)",
                                    }}
                                >
                                    {item.step}
                                </div>
                                <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "var(--foreground)" }}>
                                    {item.title}
                                </h3>
                                <p style={{ color: "var(--muted)", lineHeight: 1.65, fontSize: "0.95rem" }}>
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: "center", marginTop: "2rem" }}>
                        <Link href="/how-it-works" style={{ color: "var(--brand)", fontWeight: 800, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                            Learn more <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Why Choose Us ─────────────────────────────────────────────────── */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--card)" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <div style={{ marginBottom: "3rem" }}>
                        <h2 className="section-title">Why {siteConfig.companyName}?</h2>
                        <p className="section-subtitle">
                            Local junk removal in {siteConfig.city} with clear pricing and online booking.
                        </p>
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                            gap: "1.5rem",
                        }}
                    >
                        {whyUs.map((item) => (
                            <div key={item.title} className="card">
                                <CheckCircle size={22} style={{ color: "var(--brand)", marginBottom: "0.75rem" }} />
                                <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem", color: "var(--foreground)" }}>
                                    {item.title}
                                </h3>
                                <p style={{ color: "var(--muted)", lineHeight: 1.65, fontSize: "0.925rem" }}>
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Testimonials ──────────────────────────────────────────────────── */}
            {siteConfig.testimonials.length > 0 && (
                <section style={{ padding: "5rem 1.5rem", background: "var(--background)" }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                            <h2 className="section-title" style={{ textAlign: "center" }}>What Customers Say</h2>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                                gap: "1.5rem",
                            }}
                        >
                            {siteConfig.testimonials.map((t) => (
                                <div key={t.name} className="card">
                                    <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1rem" }}>
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} fill="var(--brand)" color="var(--brand)" />
                                        ))}
                                    </div>
                                    <p style={{ color: "var(--foreground)", lineHeight: 1.7, marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                                        &ldquo;{t.text}&rdquo;
                                    </p>
                                    <div>
                                        <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--foreground)" }}>{t.name}</p>
                                        <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{t.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Final CTA ─────────────────────────────────────────────────────── */}
            <section
                style={{
                    padding: "5rem 1.5rem",
                    background: "var(--hero-bg)",
                    textAlign: "center",
                }}
            >
                <div style={{ maxWidth: 640, margin: "0 auto" }}>
                    <h2
                        style={{
                            fontSize: "clamp(2rem, 5vw, 3rem)",
                            color: "var(--hero-text)",
                            marginBottom: "1rem",
                        }}
                    >
                        Ready to reclaim your space?
                    </h2>
                    <p style={{ color: "var(--hero-muted)", fontSize: "1.1rem", lineHeight: 1.7, marginBottom: "2.5rem" }}>
                        Book your pickup online in minutes. {isSameDayEnabled() ? `Same-day windows may be available in ${siteConfig.city}.` : "Pickup windows depend on route availability."}
                    </p>
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <Link href="/book" className="btn-primary" style={{ fontSize: "1.1rem", padding: "1rem 2.25rem" }}>
                            Book My Pickup <ArrowRight size={18} />
                        </Link>
                        <a
                            href={telHref(siteConfig.phoneNumber)}
                            className="btn-secondary"
                            style={{ fontSize: "1rem", borderColor: "var(--hero-border)", color: "var(--hero-text)" }}
                        >
                            <Phone size={16} /> {formatPhone(siteConfig.phoneNumber)}
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
