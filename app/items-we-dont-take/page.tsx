import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import type { Metadata } from "next";
import { PROHIBITED_ITEMS } from "@/lib/prohibitedItems";
import { createPageMetadata, faqPageJsonLd } from "@/lib/seo";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;

export const metadata: Metadata = createPageMetadata({
    title: `Items We Don't Take in ${siteConfig.city}`,
    description: `For safety and legal reasons, ${siteConfig.companyName} in ${cityState} cannot transport certain hazardous or regulated materials.`,
    path: "/items-we-dont-take",
});
const FAQS = [
    { q: "Why can't junk removal companies take hazardous materials?", a: "Hazardous and regulated materials can require special licensing, containment, transport rules, or disposal facilities. They should be handled by municipal or specialized disposal programs." },
    { q: "Can you take paint cans?", a: "Liquid paint is not accepted. Some dried empty cans may be acceptable depending on local rules and the condition of the container. Ask before booking if paint is involved." },
    { q: "Can prohibited items go in a dumpster?", a: "No. Hazardous, flammable, medical, and regulated materials should not be loaded into a junk removal truck or dumpster." },
    { q: "What should I do with restricted items?", a: "Contact your local municipal waste department, hazardous waste collection site, retailer take-back program, or specialized disposal company for safe handling." },
];

export default function ItemsWeDontTakePage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(FAQS, "/items-we-dont-take")) }}
            />
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

            <section style={{ padding: "4rem 1.5rem", background: "var(--card)", borderTop: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 900, margin: "0 auto" }}>
                    <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 900, marginBottom: "1rem" }}>How to Handle Restricted Items</h2>
                    <p style={{ color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>
                        Restricted items are not refused because of size. They are refused because they may require special handling, permits, containment, or disposal facilities. Before booking, separate anything hazardous or regulated from the rest of the junk pile.
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: "1rem" }}>
                        <div className="card">
                            <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "0.5rem" }}>Use local hazardous waste programs</h3>
                            <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>Municipal programs are usually the right path for chemicals, paint, pesticides, solvents, and similar materials.</p>
                        </div>
                        <div className="card">
                            <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "0.5rem" }}>Check retailer take-back</h3>
                            <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>Some batteries, electronics, bulbs, and tires may qualify for retailer or manufacturer take-back programs.</p>
                        </div>
                        <div className="card">
                            <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "0.5rem" }}>Separate before pickup</h3>
                            <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>Keep restricted materials away from accepted junk so the crew can load approved items without unsafe mixing.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ padding: "4rem 1.5rem", background: "var(--background)", borderTop: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 760, margin: "0 auto" }}>
                    <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 900, textAlign: "center", marginBottom: "2rem" }}>Restricted Item FAQ</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {FAQS.map((faq) => (
                            <details key={faq.q} style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", background: "var(--card)" }}>
                                <summary style={{ padding: "1rem 1.5rem", fontWeight: 750, cursor: "pointer" }}>{faq.q}</summary>
                                <div style={{ padding: "0 1.5rem 1rem", color: "var(--muted)", lineHeight: 1.7 }}>{faq.a}</div>
                            </details>
                        ))}
                    </div>
                    <div style={{ textAlign: "center", marginTop: "2rem" }}>
                        <Link href="/items-we-take" style={{ color: "var(--brand)", fontWeight: 800, textDecoration: "none" }}>
                            See accepted items →
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
