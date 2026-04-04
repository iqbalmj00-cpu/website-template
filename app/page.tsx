import Link from "next/link";
import type { Metadata } from "next";
import { Phone, Star, CheckCircle, ArrowRight, Truck, Clock, Shield, Leaf, MapPin } from "lucide-react";
import { siteConfig, formatPhone, telHref } from "@/lib/siteConfig";
import { getClientServices, ALL_SERVICES } from "@/lib/serviceData";
import ServiceIcon from "@/components/ServiceIcon";
import SafeImage from "@/components/SafeImage";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;

export const metadata: Metadata = {
    title: `Junk Removal in ${cityState} | ${siteConfig.companyName}`,
    description: `${siteConfig.companyName} offers fast, affordable junk removal in ${cityState}. Furniture, appliances, yard waste & more. Same-day service available. Book online in minutes.`,
    alternates: { canonical: "/" },
};

export default function HomePage() {
    const howItWorks = [
        {
            step: "1",
            title: "Book & Get Your Estimate",
            desc: "Book online in 2 minutes — select your items, see your price range instantly. Or call our 24/7 AI phone agent.",
        },
        {
            step: "2",
            title: "We Confirm",
            desc: "Our team reviews your booking and confirms your date, time, and price. You'll get a confirmation with all the details.",
        },
        {
            step: "3",
            title: "We Show Up & Haul",
            desc: "Our crew arrives on time, confirms the final price, and gets to work. We load, sweep up, and haul everything away.",
        },
    ];

    const trustItems = [
        { icon: Shield, label: "Fully Insured" },
        { icon: CheckCircle, label: "Upfront Pricing" },
        { icon: Clock, label: "Same-Day Available" },
        { icon: Leaf, label: "Eco-Friendly" },
    ];

    const whyUs = [
        {
            title: "No Hidden Fees",
            desc: "We give you a firm price before we start — no surprises on the invoice.",
        },
        {
            title: "Fast & Reliable",
            desc: "We show up on time, every time. Many jobs completed the same day you call.",
        },
        {
            title: "We Donate & Recycle",
            desc: "Items in good condition are donated to local charities. We keep landfill waste to a minimum.",
        },
        {
            title: "Licensed & Insured",
            desc: "Fully licensed and insured so you have zero liability when we work on your property.",
        },
    ];

    const baseUrl = siteConfig.subdomain
        ? `https://${siteConfig.subdomain}.scaleyourjunk.com`
        : "https://scaleyourjunk.com";

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
                    padding: "7rem 1.5rem 6rem",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Decorative blob */}
                <div
                    style={{
                        position: "absolute",
                        top: "-10%",
                        right: "-5%",
                        width: 500,
                        height: 500,
                        borderRadius: "50%",
                        background: "var(--brand)",
                        opacity: 0.07,
                        filter: "blur(80px)",
                        pointerEvents: "none",
                    }}
                />
                <div data-image-grid style={{ maxWidth: 1200, margin: "0 auto", position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
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
                            {siteConfig.tagline} Looking for junk removal near you? We serve {cityState} and surrounding areas with same-day pickup available.
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
                        {siteConfig.services.map((service) => {
                            const slug = service.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                            const svcData = getClientServices().find(s => s.slug === slug) || ALL_SERVICES.find(s => s.slug === slug);
                            const iconName = svcData?.icon || "Truck";
                            return (
                                <Link
                                    key={service}
                                    href={`/services/${slug}`}
                                    className="card"
                                    style={{ textAlign: "center", padding: "1.5rem 1rem", textDecoration: "none", color: "inherit" }}
                                >
                                    <div style={{ marginBottom: "0.75rem", display: "flex", justifyContent: "center" }}><ServiceIcon name={iconName} size={32} color="var(--brand)" /></div>
                                    <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--foreground)" }}>
                                        {service}
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
                </div>
            </section>

            {/* ── Why Choose Us ─────────────────────────────────────────────────── */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--card)" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <div style={{ marginBottom: "3rem" }}>
                        <h2 className="section-title">Why {siteConfig.companyName}?</h2>
                        <p className="section-subtitle">
                            We're your local junk removal experts in {siteConfig.city}. Here's why customers keep coming back.
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
                        Book your pickup online in 2 minutes. Same-day service available in {siteConfig.city}.
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
