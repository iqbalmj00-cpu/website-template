import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BadgeDollarSign, CheckCircle, Phone } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { breadcrumbJsonLd, createPageMetadata, faqPageJsonLd } from "@/lib/seo";
import { formatCostRange, getCostGuideBySlug, getCostGuides } from "@/lib/costData";
import { formatPhone, siteConfig, telHref } from "@/lib/siteConfig";
import { getClientServices } from "@/lib/serviceData";

type PageProps = {
    params: {
        itemSlug: string;
    };
};

export const dynamicParams = false;

export function generateStaticParams() {
    return getCostGuides().map((item) => ({ itemSlug: item.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
    const guide = getCostGuideBySlug(params.itemSlug);
    if (!guide) {
        return createPageMetadata({
            title: "Cost Guide Not Found",
            description: "This cost guide is not available.",
            path: `/cost/${params.itemSlug}`,
            noIndex: true,
        });
    }

    return createPageMetadata({
        title: `${guide.title} in ${siteConfig.city}`,
        description: guide.metaDescription,
        path: `/cost/${guide.slug}`,
    });
}

export default function CostGuidePage({ params }: PageProps) {
    const guide = getCostGuideBySlug(params.itemSlug);
    if (!guide) notFound();

    const relatedService = guide.serviceSlug ? getClientServices().find(service => service.slug === guide.serviceSlug) : undefined;
    const range = formatCostRange(guide);
    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Cost Guide", href: "/cost" },
        { label: guide.title, href: `/cost/${guide.slug}` },
    ];
    const faqItems = [
        { q: `How much does ${guide.item} removal cost in ${siteConfig.city}?`, a: range ? `Smaller ${guide.item} removal jobs often use the lower pricing tiers. This guide uses ${range} as a planning range before the final on-site quote.` : `Pricing for ${guide.item} removal depends on volume, access, weight, and local handling requirements. The crew confirms the final price before loading begins.` },
        { q: `What affects ${guide.item} removal pricing?`, a: `Common factors include ${guide.factors.slice(0, 4).join(", ").toLowerCase()}. The crew confirms the final price before loading begins.` },
        { q: `What is included with ${guide.item} removal?`, a: `${guide.included.join(", ")} are included when the item is approved for hauling and the final quote is accepted.` },
        { q: "Is the online range a final price?", a: "No. The online range is a planning guide. Final pricing depends on item volume, weight, access, and disposal requirements seen at the pickup." },
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([
                    breadcrumbJsonLd(breadcrumbs.map(item => ({ name: item.label, path: item.href }))),
                    faqPageJsonLd(faqItems, `/cost/${guide.slug}`),
                ]) }}
            />
            <Breadcrumbs items={breadcrumbs} />

            <section style={{ background: "var(--hero-bg)", padding: "5rem 1.5rem 4rem" }}>
                <div style={{ maxWidth: 980, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "2rem", alignItems: "center" }}>
                    <div>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.4rem 0.85rem", borderRadius: "var(--btn-radius)", background: "var(--hero-badge-bg)", border: "1px solid var(--hero-badge-border)", color: "var(--brand)", fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1.25rem" }}>
                            <BadgeDollarSign size={15} /> Local Cost Guide
                        </span>
                        <h1 style={{ fontSize: "clamp(2.1rem, 5vw, 3.6rem)", lineHeight: 1.05, fontWeight: 900, color: "var(--hero-text)", marginBottom: "1rem" }}>
                            {guide.title} in {siteConfig.city}
                        </h1>
                        <p style={{ color: "var(--hero-muted)", fontSize: "1.1rem", lineHeight: 1.75 }}>
                            {guide.metaDescription} Final pricing is confirmed before work begins so you can approve or decline the job.
                        </p>
                    </div>

                    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "1.5rem", boxShadow: "var(--shadow-soft)" }}>
                        <h2 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "0.5rem" }}>{range ? "Estimated Smaller-Job Range" : "Pricing Factors"}</h2>
                        <div style={{ color: "var(--brand)", fontSize: "2.4rem", fontWeight: 900, lineHeight: 1.05, marginBottom: "0.75rem" }}>
                            {range || "Quote review"}
                        </div>
                        <p style={{ color: "var(--muted)", lineHeight: 1.6, fontSize: "0.95rem" }}>
                            {range
                                ? "Based on the current load pricing ranges. Large or unusually heavy jobs may require a higher on-site estimate."
                                : "The job details are reviewed for volume, access, material type, and local handling requirements before the final quote is confirmed."}
                        </p>
                    </div>
                </div>
            </section>

            <section style={{ padding: "4.5rem 1.5rem", background: "var(--background)" }}>
                <div style={{ maxWidth: 980, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "2rem" }}>
                    <div>
                        <h2 className="section-title" style={{ marginBottom: "1rem" }}>What Affects {guide.item} Removal Cost?</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                            {guide.factors.map((factor) => (
                                <div key={factor} style={{ display: "flex", alignItems: "flex-start", gap: "0.7rem" }}>
                                    <CheckCircle size={18} style={{ color: "var(--brand)", flexShrink: 0, marginTop: 3 }} />
                                    <span style={{ color: "var(--muted)", lineHeight: 1.6 }}>{factor}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="section-title" style={{ marginBottom: "1rem" }}>What Is Included?</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                            {guide.included.map((item) => (
                                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.7rem" }}>
                                    <CheckCircle size={18} style={{ color: "var(--brand)", flexShrink: 0, marginTop: 3 }} />
                                    <span style={{ color: "var(--muted)", lineHeight: 1.6 }}>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ padding: "4.5rem 1.5rem", background: "var(--card)", borderTop: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 980, margin: "0 auto" }}>
                    <h2 className="section-title" style={{ marginBottom: "1rem" }}>How to Prepare for {guide.item} Removal</h2>
                    <p style={{ color: "var(--muted)", lineHeight: 1.75, fontSize: "1.05rem", maxWidth: 760, marginBottom: "2rem" }}>
                        Good preparation helps the crew quote the job accurately and remove the item safely. Separate anything you want to keep, clear a path when possible, and mention stairs, elevators, gates, or parking limits when booking.
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: "1rem" }}>
                        <div className="card">
                            <h3 style={{ fontSize: "1rem", fontWeight: 850, marginBottom: "0.5rem" }}>Describe access</h3>
                            <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>Tell the company if the item is upstairs, in a basement, behind a gate, inside a storage unit, or far from truck parking.</p>
                        </div>
                        <div className="card">
                            <h3 style={{ fontSize: "1rem", fontWeight: 850, marginBottom: "0.5rem" }}>Mention heavy materials</h3>
                            <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>Dense materials, oversized items, and specialty disposal needs can change the estimate.</p>
                        </div>
                        <div className="card">
                            <h3 style={{ fontSize: "1rem", fontWeight: 850, marginBottom: "0.5rem" }}>Check restrictions</h3>
                            <p style={{ color: "var(--muted)", lineHeight: 1.7, marginBottom: "0.75rem" }}>Hazardous or regulated materials are not accepted with standard junk removal.</p>
                            <Link href="/items-we-dont-take" style={{ color: "var(--brand)", fontWeight: 800, textDecoration: "none" }}>Review restricted items →</Link>
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ padding: "4.5rem 1.5rem", background: "var(--background)", borderTop: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 760, margin: "0 auto" }}>
                    <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 900, textAlign: "center", marginBottom: "2rem" }}>{guide.title} FAQ</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {faqItems.map((faq) => (
                            <details key={faq.q} style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", background: "var(--card)" }}>
                                <summary style={{ padding: "1rem 1.5rem", fontWeight: 750, cursor: "pointer" }}>{faq.q}</summary>
                                <div style={{ padding: "0 1.5rem 1rem", color: "var(--muted)", lineHeight: 1.7 }}>{faq.a}</div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            <section style={{ padding: "4.5rem 1.5rem", background: "var(--card)", borderTop: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
                    <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", fontWeight: 900, marginBottom: "1rem" }}>
                        Get A Firm Quote For {guide.item} Removal
                    </h2>
                    <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: "1.05rem", marginBottom: "2rem" }}>
                        Book online with photos or item details. The crew confirms the final price before loading anything.
                    </p>
                    <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
                        <Link href="/book" className="btn-primary">
                            Book Online <ArrowRight size={18} />
                        </Link>
                        <a href={telHref(siteConfig.phoneNumber)} className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                            <Phone size={18} /> {formatPhone(siteConfig.phoneNumber)}
                        </a>
                    </div>
                    {relatedService && (
                        <p style={{ color: "var(--muted)", marginTop: "1.5rem", fontSize: "0.95rem" }}>
                            Related service:{" "}
                            <Link href={`/services/${relatedService.slug}`} style={{ color: "var(--brand)", fontWeight: 800 }}>
                                {relatedService.title}
                            </Link>
                        </p>
                    )}
                </div>
            </section>
        </>
    );
}
