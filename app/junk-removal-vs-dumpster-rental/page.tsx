import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle, Container, Truck } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

const path = "/junk-removal-vs-dumpster-rental";
const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Junk Removal vs Dumpster Rental", href: path },
];

export const metadata: Metadata = createPageMetadata({
    title: `Junk Removal vs Dumpster Rental in ${siteConfig.city}`,
    description: `Compare full-service junk removal and dumpster rental in ${siteConfig.city}. Learn which option fits cleanouts, remodeling debris, heavy material, and flexible timelines.`,
    path,
    noIndex: !siteConfig.offersDumpsterRental,
});

export default function JunkRemovalVsDumpsterRentalPage() {
    if (!siteConfig.offersDumpsterRental) notFound();

    const junkRemovalBestFor = [
        "You want the loading handled for you.",
        "The job is mostly furniture, appliances, clutter, or mixed household junk.",
        "You need a clear pickup window and same-visit haul away.",
        "You want a final quote before work begins.",
    ];

    const dumpsterBestFor = [
        "You want to load over several days.",
        "You are doing a remodel, roof, or large cleanup with ongoing debris.",
        "You have space for a container and local placement is allowed.",
        "You prefer a fixed rental period with a weight allowance.",
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs.map(item => ({ name: item.label, path: item.href })))) }}
            />
            <Breadcrumbs items={breadcrumbs} />

            <section style={{ background: "var(--hero-bg)", padding: "5rem 1.5rem 4rem", textAlign: "center" }}>
                <div style={{ maxWidth: 840, margin: "0 auto" }}>
                    <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.7rem)", lineHeight: 1.05, fontWeight: 900, color: "var(--hero-text)", marginBottom: "1rem" }}>
                        Junk Removal vs Dumpster Rental in {siteConfig.city}
                    </h1>
                    <p style={{ color: "var(--hero-muted)", fontSize: "1.12rem", lineHeight: 1.75 }}>
                        Both options can work. The right choice depends on who loads the material, how long the cleanup takes, what you are throwing away, and whether you have room for a container.
                    </p>
                </div>
            </section>

            <section style={{ padding: "4.5rem 1.5rem", background: "var(--background)" }}>
                <div style={{ maxWidth: 1050, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "1.25rem" }}>
                    <ComparisonCard
                        title="Choose Junk Removal When"
                        Icon={Truck}
                        items={junkRemovalBestFor}
                        href="/book"
                        cta="Book junk removal"
                    />
                    <ComparisonCard
                        title="Choose Dumpster Rental When"
                        Icon={Container}
                        items={dumpsterBestFor}
                        href="/dumpster-rental"
                        cta="View dumpster rentals"
                    />
                </div>
            </section>
        </>
    );
}

function ComparisonCard({
    title,
    Icon,
    items,
    href,
    cta,
}: {
    title: string;
    Icon: typeof Truck;
    items: string[];
    href: string;
    cta: string;
}) {
    return (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "1.5rem" }}>
            <Icon size={30} style={{ color: "var(--brand)", marginBottom: "1rem" }} />
            <h2 style={{ fontSize: "1.35rem", fontWeight: 850, marginBottom: "1rem" }}>{title}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "1.4rem" }}>
                {items.map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem" }}>
                        <CheckCircle size={18} style={{ color: "var(--brand)", flexShrink: 0, marginTop: 3 }} />
                        <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>{item}</p>
                    </div>
                ))}
            </div>
            <Link href={href} style={{ color: "var(--brand)", display: "inline-flex", alignItems: "center", gap: "0.35rem", fontWeight: 850, textDecoration: "none" }}>
                {cta} <ArrowRight size={16} />
            </Link>
        </div>
    );
}
