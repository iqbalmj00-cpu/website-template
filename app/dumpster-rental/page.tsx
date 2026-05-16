import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasInsurance, hasLicense, isSameDayEnabled, siteConfig, formatDumpsterPrice } from "@/lib/siteConfig";
import type { DumpsterPriceTier } from "@/lib/siteConfig";
import { CONTAINER_SIZES, DEBRIS_TYPES } from "@/lib/wizardData";
import ServiceIcon from "@/components/ServiceIcon";
import FAQAccordion from "@/components/FAQAccordion";
import { Phone, ArrowRight, Truck, Clock, CheckCircle, ShieldCheck } from "lucide-react";
import { telHref } from "@/lib/siteConfig";
import { createPageMetadata, faqPageJsonLd, serviceJsonLd } from "@/lib/seo";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;

export const metadata: Metadata = createPageMetadata({
    title: `Dumpster Rental in ${cityState}`,
    description: `Rent a dumpster in ${cityState}. Containers for construction debris, cleanouts, yard waste, and household junk from ${siteConfig.companyName}.`,
    path: "/dumpster-rental",
    noIndex: !siteConfig.offersDumpsterRental,
});

const STEPS = [
    { icon: "ClipboardList", title: "Contact and project details", desc: "Enter contact information, debris type, placement notes, and project details." },
    { icon: "Truck", title: "Choose container details", desc: "Select the dumpster size and rental details that best match the job." },
    { icon: "Package", title: "Schedule delivery", desc: "Pick an available delivery window and review placement requirements." },
    { icon: "Recycle", title: "Review and submit", desc: "Review the quote and submit the booking request." },
];

const FAQ_ITEMS = [
    { question: "How long can I keep the dumpster?", answer: "The rental period is confirmed when booking and may vary by container size and local availability." },
    { question: "What can I put in the dumpster?", answer: "Most household junk, construction debris, yard waste, and roofing materials. Hazardous materials, tires, batteries, and paint are not allowed." },
    { question: "How is dumpster rental pricing calculated?", answer: "Pricing can depend on container size, included rental days, included weight, local disposal costs, delivery distance, and any overage or extension fees shown during booking." },
    { question: "What size dumpster do I need?", answer: "Small cleanouts often fit a 10-yard container, room renovations often fit a 20-yard container, and larger cleanouts or construction projects may need 30-yard or 40-yard containers." },
    { question: "Where will the dumpster be placed?", answer: "We typically place dumpsters on driveways, but we can work with you on placement. Just make sure the area is clear and accessible for our truck." },
    { question: "Do I need a permit?", answer: "If the dumpster will be placed on a public street or right-of-way, you may need a permit from your local city. Driveway placement typically doesn't require one." },
    { question: "Should I rent a dumpster or book junk removal?", answer: "Rent a dumpster when you want to load over several days. Book junk removal when you want a crew to load everything and haul it away in one visit." },
    { question: "What should not go in the dumpster?", answer: "Do not load hazardous chemicals, paint, batteries, tires, asbestos, medical waste, flammable liquids, or other regulated materials." },
];

export default function DumpsterRentalPage() {
    // Gate the page on the client's offering — sitemap, navbar, and footer
    // already exclude it when offersDumpsterRental is false; this closes the
    // direct-URL gap so visitors can't see dumpster info on a non-offering site.
    if (!siteConfig.offersDumpsterRental) notFound();
    const whyRent = [
        { icon: <Truck size={28} color="var(--brand)" />, title: "Scheduled Delivery", desc: "Delivery timing is confirmed based on route capacity and container availability." },
        { icon: <Clock size={28} color="var(--brand)" />, title: "Confirmed Rental Period", desc: "The rental period and extension options are confirmed before booking." },
        { icon: <CheckCircle size={28} color="var(--brand)" />, title: "Clear Pricing", desc: "Container pricing, included days, and overage terms are reviewed before checkout when available." },
        ...((hasLicense() || hasInsurance()) ? [{ icon: <ShieldCheck size={28} color="var(--brand)" />, title: "Verified Credentials", desc: [hasLicense() ? "license on file" : "", hasInsurance() ? "insurance carrier on file" : ""].filter(Boolean).join(" and ") }] : []),
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        serviceJsonLd({
                            service: {
                                title: "Dumpster Rental",
                                shortDesc: `Dumpster rental in ${cityState} for cleanouts, construction debris, and household junk.`,
                            },
                            path: "/dumpster-rental",
                            description: `Dumpster rental in ${cityState} for cleanouts, construction debris, and household junk.`,
                            offers: false,
                        }),
                        faqPageJsonLd(FAQ_ITEMS.map(item => ({ q: item.question, a: item.answer })), "/dumpster-rental"),
                    ]),
                }}
            />
            {/* ── Hero ── */}
            <section style={{ background: "var(--hero-bg)", padding: "9rem 1.5rem 5rem", textAlign: "center" }}>
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
                            Book Now <ArrowRight size={18} style={{ marginLeft: 6 }} />
                        </Link>
                        <a href={telHref(siteConfig.phoneNumber)} className="btn-secondary" style={{ padding: "0.875rem 2rem", fontSize: "1rem" }}>
                            <Phone size={18} /> Call Us
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
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 250px), 1fr))", gap: "1.5rem" }}>
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

            {/* ── Rental Planning ── */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--card)", borderTop: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 1050, margin: "0 auto" }}>
                    <div style={{ maxWidth: 760, marginBottom: "2.5rem" }}>
                        <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 800, marginBottom: "0.75rem" }}>How Dumpster Rental Works in {cityState}</h2>
                        <p style={{ color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.7 }}>
                            Dumpster rental is best when you need flexible loading time. The key decisions are container size, placement, material type, rental period, and weight allowance.
                        </p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "1rem" }}>
                        <div className="card">
                            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, marginBottom: "0.75rem" }}>Choose by project size</h3>
                            <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>Small decluttering jobs usually need less space than remodeling, roofing, or full-home cleanouts. When in doubt, choose enough room to avoid overfilling.</p>
                        </div>
                        <div className="card">
                            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, marginBottom: "0.75rem" }}>Confirm material rules</h3>
                            <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>Construction debris, household junk, and yard waste may have different weight and disposal rules. Hazardous or regulated materials are not accepted.</p>
                        </div>
                        <div className="card">
                            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, marginBottom: "0.75rem" }}>Compare your options</h3>
                            <p style={{ color: "var(--muted)", lineHeight: 1.7, marginBottom: "0.75rem" }}>If you want the loading handled, full-service junk removal may be the better fit.</p>
                            <Link href="/junk-removal-vs-dumpster-rental" style={{ color: "var(--brand)", fontWeight: 700, textDecoration: "none" }}>Compare junk removal and dumpster rental →</Link>
                        </div>
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
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 200px), 1fr))", gap: "2rem" }}>
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
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 200px), 1fr))", gap: "1rem" }}>
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
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                        <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 800, color: "var(--foreground)" }}>
                            Why Rent With <span style={{ color: "var(--brand)" }}>{siteConfig.companyName}</span>
                        </h2>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
                        {whyRent.map((item, i) => (
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
                        Use the booking flow or call to confirm container availability. {isSameDayEnabled() ? "Same-day windows may be available when route capacity allows." : ""}
                    </p>
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <Link href="/book" className="btn-primary" style={{ padding: "1rem 2.5rem", fontSize: "1.05rem" }}>
                            Book Now <ArrowRight size={18} style={{ marginLeft: 6 }} />
                        </Link>
                        <a href={telHref(siteConfig.phoneNumber)} className="btn-secondary" style={{ padding: "1rem 2.5rem", fontSize: "1.05rem" }}>
                            <Phone size={18} /> Call Us
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
