import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeDollarSign } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { breadcrumbJsonLd, createPageMetadata, faqPageJsonLd } from "@/lib/seo";
import { formatCostRange, getCostGuides } from "@/lib/costData";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = createPageMetadata({
    title: `Junk Removal Cost in ${siteConfig.city}`,
    description: `Compare junk removal cost guides in ${siteConfig.city} for couches, mattresses, appliances, cleanouts, construction debris, and more.`,
    path: "/cost",
});
const FAQS = [
    { q: "What is the main factor in junk removal cost?", a: "Truck volume is usually the main factor. Weight, stairs, long carry distance, item handling, and disposal requirements can also change the final price." },
    { q: "Are these cost guides final quotes?", a: "No. They are planning guides based on template pricing factors. The final price is confirmed before loading begins." },
    { q: "Can one item cost less than a full truckload?", a: "Yes. Smaller single-item pickups usually fall near the lower pricing tiers, but the minimum charge still applies." },
    { q: "Why do heavy materials cost more?", a: "Heavy materials can fill the truck by weight before they fill it by volume and may carry additional local disposal or handling costs." },
];

export default function CostGuideIndexPage() {
    const guides = getCostGuides();
    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Cost Guide", href: "/cost" },
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([
                    breadcrumbJsonLd(breadcrumbs.map(item => ({ name: item.label, path: item.href }))),
                    faqPageJsonLd(FAQS, "/cost"),
                ]) }}
            />
            <Breadcrumbs items={breadcrumbs} />

            <section style={{ background: "var(--hero-bg)", padding: "5rem 1.5rem 4rem", textAlign: "center" }}>
                <div style={{ maxWidth: 780, margin: "0 auto" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.4rem 0.85rem", borderRadius: "var(--btn-radius)", background: "var(--hero-badge-bg)", border: "1px solid var(--hero-badge-border)", color: "var(--brand)", fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1.25rem" }}>
                        <BadgeDollarSign size={15} /> Cost Guides
                    </span>
                    <h1 style={{ fontSize: "clamp(2.1rem, 5vw, 3.6rem)", lineHeight: 1.05, fontWeight: 900, color: "var(--hero-text)", marginBottom: "1rem" }}>
                        Junk Removal Cost Guides in {siteConfig.city}
                    </h1>
                    <p style={{ color: "var(--hero-muted)", fontSize: "1.1rem", lineHeight: 1.75 }}>
                        Pricing depends on item volume, access, weight, and local disposal requirements. These guides explain the main cost factors before you book.
                    </p>
                </div>
            </section>

            <section style={{ padding: "4.5rem 1.5rem", background: "var(--background)" }}>
                <div style={{ maxWidth: 1050, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "1rem" }}>
                    {guides.map((guide) => {
                        const range = formatCostRange(guide);
                        return (
                            <Link
                                key={guide.slug}
                                href={`/cost/${guide.slug}`}
                                style={{
                                    background: "var(--card)",
                                    border: "1px solid var(--border)",
                                    borderRadius: 10,
                                    color: "inherit",
                                    padding: "1.35rem",
                                    textDecoration: "none",
                                }}
                            >
                                <h2 style={{ fontSize: "1.1rem", fontWeight: 850, marginBottom: "0.5rem" }}>{guide.title}</h2>
                                <p style={{ color: "var(--muted)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1rem" }}>
                                    {range
                                        ? `Typical smaller-job range: ${range} before final on-site quote.`
                                        : "Review common cost factors before the final quote is confirmed."}
                                </p>
                                <span style={{ color: "var(--brand)", display: "inline-flex", alignItems: "center", gap: "0.35rem", fontWeight: 800 }}>
                                    Read guide <ArrowRight size={15} />
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </section>

            <section style={{ padding: "4.5rem 1.5rem", background: "var(--card)", borderTop: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                    <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.35rem)", fontWeight: 900, marginBottom: "1rem" }}>How to Estimate Junk Removal Cost</h2>
                    <p style={{ color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.75, maxWidth: 760, marginBottom: "2rem" }}>
                        These guides help customers understand why one pickup costs more than another. A small curbside item is usually simpler than a basement cleanout, heavy construction debris, or a multi-room estate cleanout.
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: "1rem" }}>
                        <div className="card">
                            <h3 style={{ fontSize: "1rem", fontWeight: 850, marginBottom: "0.5rem" }}>Volume</h3>
                            <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>Most junk removal pricing starts with the space your items take in the truck.</p>
                        </div>
                        <div className="card">
                            <h3 style={{ fontSize: "1rem", fontWeight: 850, marginBottom: "0.5rem" }}>Access</h3>
                            <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>Stairs, elevators, tight hallways, parking limits, and long carry distance can affect the quote.</p>
                        </div>
                        <div className="card">
                            <h3 style={{ fontSize: "1rem", fontWeight: 850, marginBottom: "0.5rem" }}>Material type</h3>
                            <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>Appliances, heavy debris, and regulated disposal streams may need different handling than general household junk.</p>
                        </div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "2rem" }}>
                        <Link href="/pricing" style={{ color: "var(--brand)", fontWeight: 800, textDecoration: "none" }}>View pricing details</Link>
                        <Link href="/items-we-take" style={{ color: "var(--brand)", fontWeight: 800, textDecoration: "none" }}>Items we take</Link>
                        <Link href="/faq" style={{ color: "var(--brand)", fontWeight: 800, textDecoration: "none" }}>Junk removal FAQ</Link>
                    </div>
                </div>
            </section>

            <section style={{ padding: "4.5rem 1.5rem", background: "var(--background)", borderTop: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 760, margin: "0 auto" }}>
                    <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 900, textAlign: "center", marginBottom: "2rem" }}>Junk Removal Cost FAQ</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {FAQS.map((faq) => (
                            <details key={faq.q} style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", background: "var(--card)" }}>
                                <summary style={{ padding: "1rem 1.5rem", fontWeight: 750, cursor: "pointer" }}>{faq.q}</summary>
                                <div style={{ padding: "0 1.5rem 1rem", color: "var(--muted)", lineHeight: 1.7 }}>{faq.a}</div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
