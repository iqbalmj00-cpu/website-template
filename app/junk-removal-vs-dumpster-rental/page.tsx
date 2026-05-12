import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle, Container, Truck } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { breadcrumbJsonLd, createPageMetadata, faqPageJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

const path = "/junk-removal-vs-dumpster-rental";
const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Junk Removal vs Dumpster Rental", href: path },
];
const FAQS = [
    { q: "Is junk removal cheaper than dumpster rental?", a: "It depends on the job. Junk removal can be better for smaller or labor-heavy jobs because loading is included. Dumpster rental can be better for multi-day projects with steady debris and enough space for a container." },
    { q: "Which option is better for furniture and appliances?", a: "Full-service junk removal is usually simpler for furniture, mattresses, appliances, and mixed household junk because the crew loads and hauls the items in one visit." },
    { q: "Which option is better for remodeling debris?", a: "Dumpster rental is often useful for ongoing remodeling debris because you can load over several days. For a smaller finished pile, junk removal may be enough." },
    { q: "Do I need room for a dumpster?", a: "Yes. Dumpster rental requires a safe placement area and may require a permit if placed on a public street or right-of-way. Junk removal usually only requires crew and truck access." },
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
                dangerouslySetInnerHTML={{ __html: JSON.stringify([
                    breadcrumbJsonLd(breadcrumbs.map(item => ({ name: item.label, path: item.href }))),
                    faqPageJsonLd(FAQS, path),
                ]) }}
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

            <section style={{ padding: "4.5rem 1.5rem", background: "var(--card)", borderTop: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 1050, margin: "0 auto" }}>
                    <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900, marginBottom: "1rem" }}>
                        Side-by-Side Comparison
                    </h2>
                    <p style={{ color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: 760, marginBottom: "2rem" }}>
                        The best option comes down to labor, time, space, and material type. Use this comparison before choosing junk removal or dumpster rental in {siteConfig.city}.
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: "1rem" }}>
                        {[
                            { label: "Labor", junk: "Crew loads the approved items.", dumpster: "You load the container." },
                            { label: "Timeline", junk: "Usually one scheduled visit.", dumpster: "Useful for multi-day projects." },
                            { label: "Space needed", junk: "Truck access and safe carry path.", dumpster: "Clear placement area for container." },
                            { label: "Best materials", junk: "Furniture, appliances, clutter, mixed junk.", dumpster: "Construction debris, roofing, large cleanouts." },
                            { label: "Price factors", junk: "Volume, weight, access, item handling.", dumpster: "Size, days, weight allowance, overages." },
                            { label: "Permits", junk: "Usually no placement permit.", dumpster: "May need a permit for street placement." },
                        ].map((row) => (
                            <div key={row.label} className="card">
                                <h3 style={{ fontSize: "0.9rem", fontWeight: 850, color: "var(--brand)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>{row.label}</h3>
                                <p style={{ color: "var(--foreground)", fontWeight: 750, marginBottom: "0.35rem" }}>Junk removal</p>
                                <p style={{ color: "var(--muted)", lineHeight: 1.6, marginBottom: "0.85rem" }}>{row.junk}</p>
                                <p style={{ color: "var(--foreground)", fontWeight: 750, marginBottom: "0.35rem" }}>Dumpster rental</p>
                                <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>{row.dumpster}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section style={{ padding: "4.5rem 1.5rem", background: "var(--background)", borderTop: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 900, margin: "0 auto" }}>
                    <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.35rem)", fontWeight: 900, marginBottom: "1rem" }}>
                        Quick Decision Guide
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "1rem" }}>
                        <div className="card">
                            <h3 style={{ fontSize: "1.05rem", fontWeight: 850, marginBottom: "0.75rem" }}>Choose junk removal for speed</h3>
                            <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>Use junk removal when you have a clear pile or item list and want the hauling finished during one appointment.</p>
                        </div>
                        <div className="card">
                            <h3 style={{ fontSize: "1.05rem", fontWeight: 850, marginBottom: "0.75rem" }}>Choose dumpster rental for control</h3>
                            <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>Use a dumpster when the debris will build up over time and you want to load at your own pace during a confirmed rental period.</p>
                        </div>
                        <div className="card">
                            <h3 style={{ fontSize: "1.05rem", fontWeight: 850, marginBottom: "0.75rem" }}>Check prohibited items first</h3>
                            <p style={{ color: "var(--muted)", lineHeight: 1.7, marginBottom: "0.75rem" }}>Hazardous, flammable, medical, and regulated materials are not accepted in either option.</p>
                            <Link href="/items-we-dont-take" style={{ color: "var(--brand)", fontWeight: 800, textDecoration: "none" }}>Review prohibited items →</Link>
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ padding: "4.5rem 1.5rem", background: "var(--card)", borderTop: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 760, margin: "0 auto" }}>
                    <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.3rem)", fontWeight: 900, textAlign: "center", marginBottom: "2rem" }}>
                        Comparison FAQ
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {FAQS.map((faq) => (
                            <details key={faq.q} style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--background)", overflow: "hidden" }}>
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
