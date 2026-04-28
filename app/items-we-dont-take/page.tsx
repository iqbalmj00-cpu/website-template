import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import type { Metadata } from "next";
import { PROHIBITED_ITEMS } from "@/lib/prohibitedItems";
import { createPageMetadata } from "@/lib/seo";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;

export const metadata: Metadata = createPageMetadata({
    title: `Items We Don't Take in ${siteConfig.city}`,
    description: `For safety and legal reasons, ${siteConfig.companyName} in ${cityState} cannot transport certain hazardous or regulated materials.`,
    path: "/items-we-dont-take",
});

export default function ItemsWeDontTakePage() {
    return (
        <>
            {/* Hero */}
            <section style={{ background: "var(--hero-bg)", padding: "9rem 1.5rem 4rem", textAlign: "center" }}>
                <div style={{ maxWidth: 800, margin: "0 auto" }}>
                    <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "var(--hero-text)", lineHeight: 1.1, marginBottom: "1rem" }}>
                        Items We <span style={{ color: "#ef4444" }}>Don&apos;t</span> Take
                    </h1>
                    <p style={{ fontSize: "1.1rem", color: "var(--hero-muted)", maxWidth: 550, margin: "0 auto" }}>
                        For the safety of our crew and your community in {cityState}, we cannot transport certain hazardous or regulated materials. Below is a list of restricted items and suggestions for safe disposal.
                    </p>
                </div>
            </section>

            {/* List */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--background)" }}>
                <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {PROHIBITED_ITEMS.map((p) => (
                        <div key={p.item} style={{ background: "var(--card)", borderRadius: 12, padding: "1.5rem 2rem", border: "1px solid var(--border)", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444", flexShrink: 0, marginTop: 6 }} />
                            <div>
                                <h3 style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.25rem" }}>{p.item}</h3>
                                <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.5 }}>{p.detail}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ maxWidth: 600, margin: "3rem auto 0", padding: "1.5rem", background: "var(--card)", borderRadius: 12, border: "1px solid var(--border)", textAlign: "center" }}>
                    <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>
                        <strong>Need to dispose of restricted items?</strong> Contact your local municipal hazardous waste facility for safe disposal options.
                    </p>
                    <Link href="/items-we-take" style={{ display: "inline-block", marginTop: "1rem", color: "var(--brand)", fontWeight: 600, textDecoration: "none" }}>
                        ← See items we DO take
                    </Link>
                </div>
            </section>
        </>
    );
}
