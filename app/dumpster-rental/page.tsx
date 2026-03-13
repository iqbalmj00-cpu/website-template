import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig, formatDumpsterPrice } from "@/lib/siteConfig";
import type { DumpsterPriceTier } from "@/lib/siteConfig";
import { CONTAINER_SIZES, DEBRIS_TYPES } from "@/lib/wizardData";
import ServiceIcon from "@/components/ServiceIcon";
import FAQAccordion from "@/components/FAQAccordion";
import { Phone, ArrowRight, Truck, Clock, CheckCircle, ShieldCheck } from "lucide-react";
import { formatPhone, telHref } from "@/lib/siteConfig";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;

export const metadata: Metadata = {
    title: `Dumpster Rental in ${cityState} | ${siteConfig.companyName}`,
    description: `Rent a dumpster in ${cityState}. 10–40 yard containers for construction, cleanouts, and more. Fast delivery from ${siteConfig.companyName}. Book online today.`,
    alternates: { canonical: "/dumpster-rental" },
};

const STEPS = [
    { icon: "ClipboardList", title: "Request", desc: "Tell us your project details and pick a container size." },
    { icon: "Truck", title: "Delivery", desc: "We deliver the dumpster right to your driveway or job site." },
    { icon: "Package", title: "Fill It Up", desc: "Take your time filling it — keep it for up to 2 weeks." },
    { icon: "Recycle", title: "Pickup", desc: "Call us when you're done. We haul it away and handle disposal." },
];

const FAQ_ITEMS = [
    { question: "How long can I keep the dumpster?", answer: "Standard rental periods are 1–2 weeks. Need it longer? Just let us know and we can extend your rental." },
    { question: "What can I put in the dumpster?", answer: "Most household junk, construction debris, yard waste, and roofing materials. Hazardous materials, tires, batteries, and paint are not allowed." },
    { question: "Where will the dumpster be placed?", answer: "We typically place dumpsters on driveways, but we can work with you on placement. Just make sure the area is clear and accessible for our truck." },
    { question: "Do I need a permit?", answer: "If the dumpster will be placed on a public street or right-of-way, you may need a permit from your local city. Driveway placement typically doesn't require one." },
    { question: "How do I know what size I need?", answer: "A 10-yard is great for small cleanouts, 20-yard for room renovations, 30-yard for large projects, and 40-yard for full house cleanouts or major construction." },
];

export default function DumpsterRentalPage() {
    return (
        <main>
            {/* FAQ JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        mainEntity: FAQ_ITEMS.map(f => ({
                            "@type": "Question",
                            name: f.question,
                            acceptedAnswer: { "@type": "Answer", text: f.answer },
                        })),
                    }),
                }}
            />
            {/* ── Hero ── */}
            <section style={{ background: "var(--hero-bg)", padding: "7rem 1.5rem 5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--brand)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
                        Dumpster Rental
                    </p>
                    <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", fontWeight: 900, color: "var(--hero-text)", lineHeight: 1.15, marginBottom: "1.25rem" }}>
                        Dumpster Rental in <span style={{ color: "var(--brand)" }}>{siteConfig.city}</span>
                    </h1>
                    <p style={{ color: "var(--hero-muted)", fontSize: "1.1rem", lineHeight: 1.7, maxWidth: 550, margin: "0 auto 2rem" }}>
                        From small cleanouts to major renovations — we deliver the right size dumpster to your door, on your schedule.
                    </p>
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <Link href="/book" className="btn-primary" style={{ padding: "0.875rem 2rem", fontSize: "1rem" }}>
                            Book a Dumpster <ArrowRight size={18} style={{ marginLeft: 6 }} />
                        </Link>
                        <a href={telHref(siteConfig.phoneNumber)} className="btn-secondary" style={{ padding: "0.875rem 2rem", fontSize: "1rem" }}>
                            <Phone size={18} /> Call {formatPhone(siteConfig.phoneNumber)}
                        </a>
                    </div>
                </div>
            </section>

            {/* ── Container Sizes ── */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--background)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                        <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 800, color: "var(--foreground)", marginBottom: "0.75rem" }}>
                            Choose Your <span style={{ color: "var(--brand)" }}>Container Size</span>
                        </h2>
                        <p style={{ color: "var(--muted)", fontSize: "1.05rem", maxWidth: 550, margin: "0 auto" }}>
                            Not sure which size? Give us a call and we&apos;ll help you pick the perfect fit.
                        </p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1.5rem" }}>
                        {CONTAINER_SIZES.map(cs => {
                            const sizeNum = parseInt(cs.id);
                            const tier: DumpsterPriceTier | undefined = siteConfig.dumpsterPricing?.tiers.find(t => t.sizeCuYd === sizeNum);
                            const hasPrice = tier && (tier.baseRate > 0 || (tier.baseRateMin != null && tier.baseRateMin > 0));
                            return (
                                <div key={cs.id} className="card" style={{ padding: "2rem 1.5rem", textAlign: "center", display: "flex", flexDirection: "column" }}>
                                    <ServiceIcon name={cs.icon} size={40} color="var(--brand)" />
                                    <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--brand)", margin: "0.5rem 0" }}>{cs.yards}</div>
                                    <h3 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem" }}>{cs.label}</h3>
                                    {/* Price */}
                                    {hasPrice ? (
                                        <div style={{ margin: "0.25rem 0 0.75rem" }}>
                                            <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--foreground)" }}>{formatDumpsterPrice(tier)}</div>
                                            <div style={{ fontSize: "0.75rem", color: "var(--muted)", lineHeight: 1.5, marginTop: 4 }}>
                                                {tier.includedDays}-day rental · {tier.weightAllowanceTons}T included · ${tier.overageRatePerTon}/ton overage{tier.extendedDailyRate ? ` · $${tier.extendedDailyRate}/day extended` : ""}
                                            </div>
                                        </div>
                                    ) : siteConfig.dumpsterPricing ? (
                                        <div style={{ margin: "0.25rem 0 0.75rem", fontSize: "1rem", fontWeight: 700, color: "var(--brand)" }}>Call for Pricing</div>
                                    ) : null}
                                    <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1rem" }}>{cs.desc}</p>
                                    <div style={{ background: "var(--background)", borderRadius: 10, padding: "0.75rem 1rem", fontSize: "0.85rem", lineHeight: 1.5, marginTop: "auto" }}>
                                        <strong>Good for:</strong> {cs.goodFor}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--card)" }}>
                <div style={{ maxWidth: 900, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                        <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 800, color: "var(--foreground)", marginBottom: "0.75rem" }}>
                            How It <span style={{ color: "var(--brand)" }}>Works</span>
                        </h2>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "2rem" }}>
                        {STEPS.map((s, i) => (
                            <div key={i} style={{ textAlign: "center" }}>
                                <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(249,115,22,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", border: "2px solid var(--brand)" }}>
                                    <span style={{ fontWeight: 900, fontSize: "1.25rem", color: "var(--brand)" }}>{i + 1}</span>
                                </div>
                                <h3 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem" }}>{s.title}</h3>
                                <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── What Can Go In ── */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--background)" }}>
                <div style={{ maxWidth: 800, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                        <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 800, color: "var(--foreground)", marginBottom: "0.75rem" }}>
                            What Can Go in Our <span style={{ color: "var(--brand)" }}>Dumpsters</span>
                        </h2>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
                        {DEBRIS_TYPES.map(dt => (
                            <div key={dt.id} className="card" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1.25rem 1.5rem" }}>
                                <ServiceIcon name={dt.icon} size={28} color="var(--brand)" />
                                <span style={{ fontWeight: 600, fontSize: "1rem" }}>{dt.label}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: "1.5rem", padding: "1rem 1.5rem", background: "#FFFBEB", border: "1px solid #FEF3C7", borderRadius: 12, fontSize: "0.9rem", color: "#92400E" }}>
                        <strong>Not accepted:</strong> Hazardous materials, paint, batteries, tires, asbestos, medical waste, or any flammable liquids.
                    </div>
                </div>
            </section>

            {/* ── Why Choose Us ── */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--card)" }}>
                <div style={{ maxWidth: 800, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                        <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 800, color: "var(--foreground)" }}>
                            Why Rent With <span style={{ color: "var(--brand)" }}>{siteConfig.companyName}</span>
                        </h2>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem" }}>
                        {[
                            { icon: <Truck size={28} color="var(--brand)" />, title: "Fast Delivery", desc: "Same-day or next-day delivery available in most areas." },
                            { icon: <Clock size={28} color="var(--brand)" />, title: "Flexible Rentals", desc: "Keep it for a week, two weeks, or longer — your timeline." },
                            { icon: <CheckCircle size={28} color="var(--brand)" />, title: "Transparent Pricing", desc: "No hidden fees. We quote the full price upfront." },
                            { icon: <ShieldCheck size={28} color="var(--brand)" />, title: "Fully Licensed", desc: "Licensed, insured, and ready to handle your project." },
                        ].map((item, i) => (
                            <div key={i} className="card" style={{ padding: "1.5rem", textAlign: "center" }}>
                                <div style={{ marginBottom: "0.75rem" }}>{item.icon}</div>
                                <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.5rem" }}>{item.title}</h3>
                                <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--background)" }}>
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                        <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 800, color: "var(--foreground)" }}>
                            Frequently Asked <span style={{ color: "var(--brand)" }}>Questions</span>
                        </h2>
                    </div>
                    <FAQAccordion items={FAQ_ITEMS} />
                </div>
            </section>

            {/* ── CTA ── */}
            <section style={{ background: "var(--hero-bg)", padding: "5rem 1.5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 600, margin: "0 auto" }}>
                    <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 900, color: "var(--hero-text)", marginBottom: "1rem" }}>
                        Ready to Rent a <span style={{ color: "var(--brand)" }}>Dumpster</span>?
                    </h2>
                    <p style={{ color: "var(--hero-muted)", fontSize: "1.1rem", marginBottom: "2rem" }}>
                        Book online in 2 minutes or call us for immediate assistance.
                    </p>
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <Link href="/book" className="btn-primary" style={{ padding: "1rem 2.5rem", fontSize: "1.05rem" }}>
                            Book Now <ArrowRight size={18} style={{ marginLeft: 6 }} />
                        </Link>
                        <a href={telHref(siteConfig.phoneNumber)} className="btn-secondary" style={{ padding: "1rem 2.5rem", fontSize: "1.05rem" }}>
                            <Phone size={18} /> {formatPhone(siteConfig.phoneNumber)}
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
