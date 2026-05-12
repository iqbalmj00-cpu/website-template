import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, ClipboardCheck, Phone } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";
import { formatPhone, getVerifiableTrustSignals, siteConfig, telHref } from "@/lib/siteConfig";
import { hasVerifiedPublicReviews } from "@/lib/reviewData";

const path = "/best-junk-removal";
const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Best Junk Removal Guide", href: path },
];

export const metadata: Metadata = createPageMetadata({
    title: `Best Junk Removal in ${siteConfig.city}`,
    description: `A practical guide to comparing junk removal companies in ${siteConfig.city}: pricing, accepted items, reviews, insurance, scheduling, and responsible disposal questions.`,
    path,
});

export default async function BestJunkRemovalPage() {
    const trustSignals = getVerifiableTrustSignals();
    const showReviews = await hasVerifiedPublicReviews();
    const comparisonCriteria = [
        "Clear, volume-based pricing before loading starts.",
        "A published list of accepted and prohibited items.",
        "Easy online booking or a phone path for urgent questions.",
        "Real Google review data when it is available.",
        "Insurance, licensing, or credentials shown only when the company provides them.",
        "A straightforward explanation of disposal, donation, and recycling limitations.",
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs.map(item => ({ name: item.label, path: item.href })))) }}
            />
            <Breadcrumbs items={breadcrumbs} />

            <section style={{ background: "var(--hero-bg)", padding: "5rem 1.5rem 4rem" }}>
                <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.4rem 0.85rem", borderRadius: "var(--btn-radius)", background: "var(--hero-badge-bg)", border: "1px solid var(--hero-badge-border)", color: "var(--brand)", fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1.25rem" }}>
                        <ClipboardCheck size={15} /> Comparison Guide
                    </span>
                    <h1 style={{ fontSize: "clamp(2.1rem, 5vw, 3.8rem)", lineHeight: 1.05, fontWeight: 900, color: "var(--hero-text)", marginBottom: "1rem" }}>
                        How To Choose The Best Junk Removal Company in {siteConfig.city}
                    </h1>
                    <p style={{ color: "var(--hero-muted)", fontSize: "1.1rem", lineHeight: 1.75, maxWidth: 720, margin: "0 auto" }}>
                        This guide explains what to compare before booking junk removal, including pricing, accepted items, scheduling, and service expectations.
                    </p>
                </div>
            </section>

            <section style={{ padding: "4.5rem 1.5rem", background: "var(--background)" }}>
                <div style={{ maxWidth: 980, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "2rem" }}>
                    <div>
                        <h2 className="section-title" style={{ marginBottom: "1.2rem" }}>What To Compare</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                            {comparisonCriteria.map((criterion) => (
                                <div key={criterion} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                                    <CheckCircle size={19} style={{ color: "var(--brand)", flexShrink: 0, marginTop: 3 }} />
                                    <p style={{ color: "var(--muted)", lineHeight: 1.65 }}>{criterion}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "1.5rem", height: "fit-content" }}>
                        <h2 style={{ fontSize: "1.2rem", fontWeight: 850, marginBottom: "0.9rem" }}>{siteConfig.companyName} At A Glance</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {trustSignals.map((signal) => (
                                <div key={signal} style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                                    <CheckCircle size={17} style={{ color: "var(--brand)", flexShrink: 0 }} />
                                    <span style={{ color: "var(--muted)", lineHeight: 1.5 }}>{signal}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", marginTop: "1.4rem" }}>
                            <Link href="/pricing" style={{ color: "var(--brand)", fontWeight: 800, textDecoration: "none" }}>
                                View pricing <ArrowRight size={15} style={{ display: "inline", verticalAlign: "middle" }} />
                            </Link>
                            {showReviews && (
                                <Link href="/reviews" style={{ color: "var(--brand)", fontWeight: 800, textDecoration: "none" }}>
                                    View reviews <ArrowRight size={15} style={{ display: "inline", verticalAlign: "middle" }} />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ padding: "4.5rem 1.5rem", background: "var(--card)", borderTop: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
                    <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", fontWeight: 900, marginBottom: "1rem" }}>
                        Ready To Compare A Real Quote?
                    </h2>
                    <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: "1.05rem", marginBottom: "2rem" }}>
                        Share your item list and pickup details. You will get an estimate range online and a final quote before work starts.
                    </p>
                    <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
                        <Link href="/book" className="btn-primary">
                            Book Online <ArrowRight size={18} />
                        </Link>
                        <a href={telHref(siteConfig.phoneNumber)} className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                            <Phone size={18} /> {formatPhone(siteConfig.phoneNumber)}
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
