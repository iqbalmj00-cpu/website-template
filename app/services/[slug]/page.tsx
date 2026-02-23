import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import SafeImage from "@/components/SafeImage";
import { ALL_SERVICES, getServiceBySlug, getClientServices } from "@/lib/serviceData";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
    return ALL_SERVICES.map((svc) => ({ slug: svc.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const svc = getServiceBySlug(slug);
    if (!svc) return { title: "Service Not Found" };
    return {
        title: `${svc.title} in ${siteConfig.city}, ${siteConfig.state} | ${siteConfig.companyName}`,
        description: `${svc.shortDesc} Professional ${svc.title.toLowerCase()} service in ${siteConfig.city} by ${siteConfig.companyName}. Book your free estimate today.`,
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
            <Navbar />
            <main>
                {/* Hero */}
                <section
                    style={{
                        background: "var(--hero-bg)",
                        padding: "7rem 1.5rem 5rem",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <div data-image-grid style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "center" }}>
                        <div>
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
                                    marginBottom: "1.5rem",
                                }}
                            >
                                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                                Available for same-day pickup
                            </span>
                            <h1
                                style={{
                                    fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                                    fontWeight: 900,
                                    color: "var(--hero-text)",
                                    lineHeight: 1.1,
                                    marginBottom: "1.5rem",
                                    textTransform: "uppercase",
                                }}
                            >
                                {svc.title.split(" ").slice(0, -1).join(" ")}{" "}
                                <span style={{ color: "var(--brand)" }}>{svc.title.split(" ").pop()}</span>
                            </h1>
                            <p style={{ fontSize: "1.15rem", color: "var(--hero-muted)", maxWidth: 600, marginBottom: "2rem", lineHeight: 1.6 }}>
                                {svc.heroSubtitle}
                            </p>
                            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                                <Link href="/book" className="btn-primary" style={{ padding: "1rem 2rem", fontSize: "1rem" }}>
                                    Get a Free Quote →
                                </Link>
                                <a
                                    href={`tel:${phoneNumber.replace(/\D/g, "")}`}
                                    style={{
                                        padding: "1rem 2rem",
                                        borderRadius: "var(--btn-radius)",
                                        border: "2px solid var(--hero-border)",
                                        color: "var(--hero-text)",
                                        textDecoration: "none",
                                        fontWeight: 700,
                                        fontSize: "1rem",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                    }}
                                >
                                    📞 {phoneNumber}
                                </a>
                            </div>
                            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                                {["Upfront Pricing", "Fully Insured", "Eco-Friendly"].map((t) => (
                                    <span key={t} style={{ color: "var(--hero-muted)", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                        <span style={{ color: "var(--brand)" }}>✓</span> {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <SafeImage
                                src={siteConfig.serviceImages[slug] || `/images/generated/services/${slug}.png`}
                                alt={`${svc.title} in ${city}`}
                                collapseParentGrid
                                style={{ width: "100%", maxWidth: 500, borderRadius: 16, objectFit: "cover", aspectRatio: "4/3", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}
                            />
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

                {/* Other Services */}
                {otherServices.length > 0 && (
                    <section style={{ padding: "4rem 1.5rem", background: "var(--background)", borderTop: "1px solid var(--border)" }}>
                        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                                Other Services
                            </h3>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
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
                                        }}
                                    >
                                        {s.icon} {s.title} →
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
                                📅 Book Online Now
                            </Link>
                            <a
                                href={`tel:${phoneNumber.replace(/\D/g, "")}`}
                                style={{
                                    padding: "1rem 2rem",
                                    borderRadius: "var(--btn-radius)",
                                    border: "2px solid #fff",
                                    color: "var(--hero-text)",
                                    fontWeight: 700,
                                    fontSize: "1rem",
                                    textDecoration: "none",
                                }}
                            >
                                📞 Call {phoneNumber}
                            </a>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
