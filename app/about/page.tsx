import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeDollarSign, Leaf, Shield, Users, MapPin, Star } from "lucide-react";
import { getCredentials, hasInsurance, hasLicense, siteConfig } from "@/lib/siteConfig";
import { fetchReviews } from "@/lib/reviewData";
import SafeImage from "@/components/SafeImage";
import { createPageMetadata } from "@/lib/seo";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;
const areas = (siteConfig.serviceArea || "").split(",").map(s => s.trim()).filter(Boolean);

export const revalidate = 3600;

export const metadata: Metadata = createPageMetadata({
    title: `About ${siteConfig.companyName}`,
    description: `Learn about ${siteConfig.companyName}, a junk removal service serving ${cityState} with online booking and upfront pricing.`,
    path: "/about",
});

export default async function AboutPage() {
    // Real stats only — fabricated "500+ jobs", "5.0 ★", "70% recycled" were removed.
    // Average Rating shows only when real Google reviews exist; Areas Served is real from siteConfig.
    const { stats } = await fetchReviews(1);
    const hasRealRating = stats !== null && stats.totalCount > 0;
    const realStats = [
        ...(hasRealRating ? [{ icon: Star, value: `${stats.averageRating} ★`, label: "Average Rating" }] : []),
        ...(areas.length > 0 ? [{ icon: MapPin, value: `${areas.length}+`, label: "Areas Served" }] : []),
        ...(siteConfig.yearFounded ? [{ icon: Users, value: siteConfig.yearFounded, label: "Year Founded" }] : []),
        ...(siteConfig.recyclingRate !== null ? [{ icon: Leaf, value: `${siteConfig.recyclingRate}%`, label: "Recycling Target" }] : []),
    ];
    const values = [
        { icon: BadgeDollarSign, title: "Upfront Pricing", desc: "The crew confirms the final price before loading begins." },
        { icon: Users, title: "Local Service", desc: `${siteConfig.companyName} serves ${cityState} and the configured service area.` },
        ...(siteConfig.recyclingRate !== null ? [{ icon: Leaf, title: "Recycling Target", desc: `Eligible materials are routed with a ${siteConfig.recyclingRate}% recycling target in mind.` }] : []),
        ...((hasLicense() || hasInsurance()) ? [{ icon: Shield, title: "Credentials", desc: getCredentials().map(item => `${item.label}: ${item.value}`).join(" · ") }] : []),
    ];
    const storyParagraphs = siteConfig.aboutStory
        ? siteConfig.aboutStory.split(/\n+/).map((paragraph) => paragraph.trim()).filter(Boolean)
        : [];
    const founderLine = [
        siteConfig.founderName ? `Founder: ${siteConfig.founderName}` : "",
        siteConfig.yearFounded ? `Founded: ${siteConfig.yearFounded}` : "",
    ].filter(Boolean).join(" · ");

    return (
        <>
            <section style={{ background: "var(--hero-bg)", padding: "9rem 1.5rem 4rem", textAlign: "center" }}>
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--hero-text)", marginBottom: "1rem" }}>
                        About {siteConfig.companyName} — Junk Removal in {siteConfig.city}
                    </h1>
                    <p style={{ color: "var(--hero-muted)", fontSize: "1.1rem", lineHeight: 1.7 }}>
                        {siteConfig.tagline}
                    </p>
                </div>
            </section>

            {/* Our Story only renders when operator-provided story/founder/year facts exist */}
            {(storyParagraphs.length > 0 || founderLine) && (
                <section className="section">
                    <div style={{ maxWidth: 700 }}>
                        <h2 className="section-title">Our Story</h2>
                        {founderLine && (
                            <p style={{ color: "var(--foreground)", fontSize: "1rem", fontWeight: 800, lineHeight: 1.7, marginBottom: "1rem" }}>
                                {founderLine}
                            </p>
                        )}
                        {storyParagraphs.map((paragraph) => (
                            <p key={paragraph} style={{ color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.8, marginBottom: "1.5rem" }}>
                                {paragraph}
                            </p>
                        ))}
                        <div style={{ marginTop: "2rem" }}>
                            <SafeImage
                                src={siteConfig.aboutImageUrl || "/images/generated/about.png"}
                                alt={`${siteConfig.companyName} team`}
                                // aspect-ratio reserves space before the image loads,
                                // preventing Cumulative Layout Shift (CWV signal).
                                style={{ width: "100%", borderRadius: 16, objectFit: "cover", maxHeight: 400, aspectRatio: "16 / 9" }}
                                loading="lazy"
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* Stats Bar — only renders when at least one real stat is available */}
            {realStats.length > 0 && (
                <section style={{ background: "var(--brand)", padding: "2rem 1.5rem" }}>
                    <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "2rem", textAlign: "center" }}>
                        {realStats.map((stat) => (
                            <div key={stat.label} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <stat.icon size={24} color="#fff" style={{ marginBottom: "0.5rem" }} />
                                <span style={{ fontSize: "1.75rem", fontWeight: 900, color: "#fff" }}>{stat.value}</span>
                                <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Our Values */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--card)" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <h2 className="section-title" style={{ textAlign: "center", marginBottom: "3rem" }}>Our Values</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
                        {values.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="card" style={{ textAlign: "center" }}>
                                <Icon size={32} style={{ color: "var(--brand)", marginBottom: "1rem" }} />
                                <h3 style={{ fontSize: "1.1rem", color: "var(--foreground)", marginBottom: "0.5rem" }}>{title}</h3>
                                <p style={{ color: "var(--muted)", fontSize: "0.925rem", lineHeight: 1.65 }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Areas We Serve */}
            {areas.length > 1 && (
                <section style={{ padding: "5rem 1.5rem", background: "var(--background)" }}>
                    <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
                        <h2 className="section-title" style={{ textAlign: "center" }}>Areas We Serve</h2>
                        <p className="section-subtitle" style={{ textAlign: "center", margin: "0.75rem auto 2rem" }}>
                            Proudly serving {siteConfig.city} and surrounding communities.
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.5rem" }}>
                            {areas.map((area) => (
                                <span key={area} style={{
                                    display: "inline-flex", alignItems: "center", gap: "0.35rem",
                                    padding: "0.4rem 0.85rem", borderRadius: "var(--btn-radius)",
                                    background: "var(--card)", border: "1px solid var(--border)",
                                    color: "var(--foreground)", fontSize: "0.85rem", fontWeight: 600,
                                }}>
                                    <MapPin size={12} color="var(--brand)" /> {area}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--hero-bg)", textAlign: "center" }}>
                <div style={{ maxWidth: 600, margin: "0 auto" }}>
                    <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "var(--hero-text)", marginBottom: "1rem" }}>
                        Let us do the heavy lifting.
                    </h2>
                    <Link href="/book" className="btn-primary" style={{ fontSize: "1.05rem", padding: "1rem 2rem" }}>
                        Book a Pickup <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </>
    );
}
