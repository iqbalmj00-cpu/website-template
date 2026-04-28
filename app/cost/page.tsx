import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeDollarSign } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";
import { formatCostRange, getCostGuides } from "@/lib/costData";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = createPageMetadata({
    title: `Junk Removal Cost in ${siteConfig.city}`,
    description: `Compare junk removal cost guides in ${siteConfig.city} for couches, mattresses, appliances, cleanouts, construction debris, and more.`,
    path: "/cost",
});

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
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs.map(item => ({ name: item.label, path: item.href })))) }}
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
                        Pricing depends on item volume, access, weight, and local disposal requirements. These guides explain the most common cost factors before you book.
                    </p>
                </div>
            </section>

            <section style={{ padding: "4.5rem 1.5rem", background: "var(--background)" }}>
                <div style={{ maxWidth: 1050, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "1rem" }}>
                    {guides.map((guide) => (
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
                                Typical smaller-job range: {formatCostRange(guide)} before final on-site quote.
                            </p>
                            <span style={{ color: "var(--brand)", display: "inline-flex", alignItems: "center", gap: "0.35rem", fontWeight: 800 }}>
                                Read guide <ArrowRight size={15} />
                            </span>
                        </Link>
                    ))}
                </div>
            </section>
        </>
    );
}
