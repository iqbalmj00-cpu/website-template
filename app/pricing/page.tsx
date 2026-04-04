import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, Truck, Phone, Package, Armchair, Home, HardHat, Container, BadgeDollarSign } from "lucide-react";
import { siteConfig, formatPhone, telHref } from "@/lib/siteConfig";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;

const PRICING_FAQS = [
    { q: "Do you charge for stairs or basements?", a: `${siteConfig.pricing.surcharges.find(s => s.id === "stairs")?.enabled ? `Yes, there's a $${siteConfig.pricing.surcharges.find(s => s.id === "stairs")?.amount} surcharge for items that need to be carried from upstairs or basements. This covers the extra time and effort for our crew.` : "No extra charge for stairs or basements — it's all included in your quote."}` },
    { q: "Is there a minimum charge?", a: `Yes, our minimum is $${siteConfig.pricing.tiers[0]?.min ?? 75}. This covers a few small items like a chair, some boxes, or a microwave — plus our trip, crew time, and disposal fees.` },
    { q: "Can I get an exact quote before you arrive?", a: "We provide estimated ranges based on your description. When our crew arrives, they'll give you a firm, exact price before doing any work. No surprises." },
    { q: "Do you price match?", a: "We are confident our pricing is already competitive. If you've received a lower written quote from a licensed hauler for the same scope of work, let us know and we'll do our best to match it." },
];

export const metadata: Metadata = {
    title: `Junk Removal Pricing in ${cityState} | ${siteConfig.companyName}`,
    description: `Transparent, volume-based junk removal pricing from ${siteConfig.companyName} in ${cityState}. Starting at $${siteConfig.pricing.tiers[0]?.min ?? 75}. Free on-site estimates, no hidden fees.`,
    alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
    const { tiers, surcharges, truckSize } = siteConfig.pricing;
    const enabledSurcharges = surcharges.filter(s => s.enabled);

    const volumes = [
        { id: "few", Icon: Package, desc: "A few small items — a chair, some boxes, a microwave" },
        { id: "quarter", Icon: Armchair, desc: "A room's worth of clutter — small furniture, bags, and odds & ends" },
        { id: "half", Icon: Home, desc: "Multiple rooms or a garage half-full of junk" },
        { id: "three_quarter", Icon: HardHat, desc: "A full garage cleanout or small estate cleanout" },
        { id: "full", Icon: Truck, desc: "The works — whole-house cleanout, major renovation debris" },
        { id: "multi", Icon: Container, desc: "More than one full truck load" },
    ];

    const included = [
        "Loading & hauling",
        "Labor (our crew does all the lifting)",
        "Disposal & dump fees",
        "Sweeping up after we're done",
        "Donation drop-off for usable items",
        "Same-day & next-day availability",
    ];

    return (
        <>
            {/* Hero */}
            <section style={{ background: "var(--hero-bg)", padding: "9rem 1.5rem 4rem", textAlign: "center" }}>
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <span style={{ display: "inline-block", padding: "0.4rem 1rem", borderRadius: "var(--btn-radius)", background: "var(--hero-badge-bg)", border: "1px solid var(--hero-badge-border)", color: "var(--brand)", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1.5rem" }}>
                        <BadgeDollarSign size={16} style={{ color: "var(--brand)" }} /> Simple Pricing
                    </span>
                    <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--hero-text)", marginBottom: "1rem" }}>
                        Junk Removal Pricing in {siteConfig.city}
                    </h1>
                    <p style={{ color: "var(--hero-muted)", fontSize: "1.1rem", lineHeight: 1.7 }}>
                        No hidden fees, no surprises. You only pay for the space your junk takes up in our {truckSize} truck.
                        Our crew will give you an exact quote on-site before we lift a finger. Serving all of {cityState}.
                    </p>
                </div>
            </section>

            {/* Pricing Tiers */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--background)" }}>
                <div style={{ maxWidth: 900, margin: "0 auto" }}>
                    <h2 className="section-title" style={{ textAlign: "center", marginBottom: "1rem" }}>How Our Pricing Works</h2>
                    <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "1.05rem", maxWidth: 600, margin: "0 auto 3rem", lineHeight: 1.7 }}>
                        We price by <strong>how much space your items take up</strong> in our truck — not by the hour, not by weight. It&apos;s the fairest way to charge.
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {volumes.map((v, i) => {
                            const tier = tiers.find(t => t.id === v.id);
                            const isMulti = v.id === "multi";
                            return (
                                <div key={v.id} style={{
                                    background: "var(--card)", borderRadius: 12, padding: "1.5rem",
                                    border: "1px solid var(--border)",
                                    display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "1.25rem", alignItems: "center",
                                }}>
                                    <div style={{
                                        width: 56, height: 56, borderRadius: 12,
                                        background: `rgba(var(--brand-rgb, 249, 115, 22), ${0.06 + i * 0.04})`,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                        <v.Icon size={24} color="var(--brand)" />
                                    </div>
                                    <div>
                                        <h3 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.25rem" }}>
                                            {isMulti ? "1+ Truck Loads" : (tier?.label || v.id)} {tier && !isMulti && <span style={{ fontSize: "0.8rem", color: "var(--muted)", fontWeight: 500 }}>({tier.fraction} truck)</span>}
                                        </h3>
                                        <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.5 }}>{v.desc}</p>
                                    </div>
                                    <div style={{ textAlign: "right", minWidth: 120 }}>
                                        {isMulti ? (
                                            <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--muted)", fontStyle: "italic" }}>
                                                On-site estimate required
                                            </div>
                                        ) : tier ? (
                                            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--brand)" }}>
                                                ${tier.min} – ${tier.max}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Surcharges */}
            {enabledSurcharges.length > 0 && (
                <section style={{ padding: "3rem 1.5rem 5rem", background: "var(--background)" }}>
                    <div style={{ maxWidth: 700, margin: "0 auto" }}>
                        <h2 className="section-title" style={{ textAlign: "center", marginBottom: "2rem" }}>Additional Fees</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {enabledSurcharges.map(s => (
                                <div key={s.id} style={{
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                    padding: "1rem 1.25rem", background: "var(--card)", borderRadius: 10, border: "1px solid var(--border)",
                                }}>
                                    <span style={{ fontWeight: 600 }}>{s.label}</span>
                                    <span style={{ fontWeight: 700, color: "var(--brand)" }}>+${s.amount}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* What's Included */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--card)", borderTop: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <h2 className="section-title" style={{ textAlign: "center", marginBottom: "3rem" }}>Everything&apos;s Included</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
                        {included.map((item) => (
                            <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <CheckCircle size={20} style={{ color: "var(--brand)", flexShrink: 0 }} />
                                <span style={{ fontSize: "1rem" }}>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Free Estimate CTA */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--background)" }}>
                <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
                    <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)", fontWeight: 800, marginBottom: "1rem", display: "inline-flex", alignItems: "center", gap: "0.75rem" }}>
                        <Truck size={36} style={{ color: "var(--brand)" }} /> Free On-Site Estimates
                    </h2>
                    <p style={{ color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "2rem" }}>
                        Not sure how much it&apos;ll cost? No problem. Book a pickup and our crew will give you an
                        exact price before any work begins. If it doesn&apos;t work for you, you pay nothing.
                    </p>
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <Link href="/book" className="btn-primary" style={{ fontSize: "1.05rem", padding: "1rem 2rem" }}>
                            Book a Pickup <ArrowRight size={18} />
                        </Link>
                        <a href={telHref(siteConfig.phoneNumber)} style={{
                            display: "flex", alignItems: "center", gap: "0.5rem",
                            color: "var(--foreground)", textDecoration: "none", fontWeight: 700, fontSize: "1.1rem",
                        }}>
                            <Phone size={18} /> {formatPhone(siteConfig.phoneNumber)}
                        </a>
                    </div>
                </div>
            </section>

            {/* Pricing FAQ */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--card)", borderTop: "1px solid var(--border)" }}>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            mainEntity: PRICING_FAQS.map(f => ({
                                "@type": "Question",
                                name: f.q,
                                acceptedAnswer: { "@type": "Answer", text: f.a },
                            })),
                        }),
                    }}
                />
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <h2 className="section-title" style={{ textAlign: "center", marginBottom: "2rem" }}>Pricing FAQ</h2>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {PRICING_FAQS.map((faq) => (
                            <details key={faq.q} style={{ borderBottom: "1px solid var(--border)" }}>
                                <summary style={{ padding: "1.25rem 0", fontWeight: 600, cursor: "pointer", fontSize: "1rem", color: "var(--foreground)" }}>{faq.q}</summary>
                                <div style={{ paddingBottom: "1.25rem", color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.7 }}>{faq.a}</div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
