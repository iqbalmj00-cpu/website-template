import Link from "next/link";
import { getVerifiableTrustSignals, isSameDayEnabled, siteConfig, formatPhone, telHref } from "@/lib/siteConfig";
import type { Metadata } from "next";
import { Smartphone, Truck, CircleCheckBig, BadgeDollarSign, CalendarDays, Phone } from "lucide-react";
import { createPageMetadata, howToJsonLd } from "@/lib/seo";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;

export const metadata: Metadata = createPageMetadata({
    title: `How Junk Removal Works in ${siteConfig.city}`,
    description: `Book junk removal in ${cityState} in 3 steps with ${siteConfig.companyName}: share item details, confirm the appointment, and approve the final quote before loading.`,
    path: "/how-it-works",
});

export default function HowItWorksPage() {
    const { companyName, phoneNumber, city, state } = siteConfig;

    const steps = [
        {
            num: "01",
            Icon: Smartphone,
            title: "Book & Get Your Estimate",
            desc: `Book online in under 2 minutes through our website — tell us what you need hauled, select your items, and see your estimated price range instantly. Prefer to talk? Call us at ${formatPhone(phoneNumber)} — our 24/7 AI phone agent can book your pickup and answer questions anytime.`,
        },
        {
            num: "02",
            Icon: CircleCheckBig,
            title: "We Confirm Your Appointment",
            desc: "Our team reviews your booking details and confirms your date, time, and estimated price. You get a confirmation with the details needed for pickup.",
        },
        {
            num: "03",
            Icon: Truck,
            title: "We Show Up & Haul It Away",
            desc: "The crew arrives within the scheduled window, confirms the final price on-site, loads the approved items, sweeps the area, and hauls everything away. Usable or recyclable items are routed responsibly when local options are available.",
        },
    ];
    const trustSignals = getVerifiableTrustSignals();

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(howToJsonLd({
                        name: `How junk removal works with ${companyName}`,
                        description: `Book junk removal in ${cityState}, confirm the appointment, and approve the final quote before loading.`,
                        steps: steps.map((step) => ({
                            name: step.title,
                            text: step.desc,
                            url: "/how-it-works",
                        })),
                    })),
                }}
            />
            {/* Hero */}
            <section style={{ background: "var(--hero-bg)", padding: "9rem 1.5rem 5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 800, margin: "0 auto" }}>
                    <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900, color: "var(--hero-text)", lineHeight: 1.1, marginBottom: "1.5rem" }}>
                        How Junk Removal Works in{" "}
                        <span style={{ color: "var(--brand)" }}>{siteConfig.city}</span>
                    </h1>
                    <p style={{ fontSize: "1.2rem", color: "var(--hero-muted)", maxWidth: 550, margin: "0 auto" }}>
                        Junk removal in {cityState} should be straightforward. {companyName} keeps the process clear from booking to final quote.
                    </p>
                </div>
            </section>

            {/* Steps */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--background)" }}>
                <div style={{ maxWidth: 900, margin: "0 auto" }}>
                    {steps.map((step, i) => (
                        <div
                            key={step.num}
                            style={{
                                display: "flex",
                                gap: "2rem",
                                alignItems: "flex-start",
                                marginBottom: i < steps.length - 1 ? "3rem" : 0,
                                paddingBottom: i < steps.length - 1 ? "3rem" : 0,
                                borderBottom: i < steps.length - 1 ? "1px solid var(--border)" : "none",
                            }}
                        >
                            <div style={{ flexShrink: 0, width: 80, height: 80, borderRadius: 16, background: "rgba(var(--brand-rgb, 249, 115, 22), 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <step.Icon size={36} color="var(--brand)" />
                            </div>
                            <div>
                                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--brand)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Step {step.num}</span>
                                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginTop: "0.25rem", marginBottom: "0.75rem" }}>{step.title}</h2>
                                <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: "1.05rem" }}>{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Trust Signals */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--card)", borderTop: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
                    <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "3rem" }}>What To Expect</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem" }}>
                        {trustSignals.map((signal) => (
                            <div key={signal} style={{ padding: "2rem", background: "var(--background)", borderRadius: 16, border: "1px solid var(--border)" }}>
                                <div style={{ marginBottom: "0.75rem" }}><BadgeDollarSign size={28} color="var(--brand)" /></div>
                                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>{signal}</h3>
                                <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{trustSignalDescription(signal)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ background: "var(--brand)", padding: "4rem 1.5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "var(--hero-text)", marginBottom: "1rem" }}>Ready to Get Started?</h2>
                    <p style={{ color: "var(--hero-text)", fontSize: "1.1rem", marginBottom: "2rem" }}>
                        Book online in minutes. {isSameDayEnabled() ? `Same-day windows may be available in ${city}${state ? `, ${state}` : ""}.` : "Pickup windows depend on route availability."}
                    </p>
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <Link href="/book" style={{ padding: "1rem 2rem", borderRadius: "var(--btn-radius)", background: "var(--card)", color: "var(--brand)", fontWeight: 700, fontSize: "1rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}><CalendarDays size={18} /> Book Online Now</Link>
                        <a href={telHref(phoneNumber)} style={{ padding: "1rem 2rem", borderRadius: "var(--btn-radius)", border: "2px solid var(--hero-text)", color: "var(--hero-text)", textDecoration: "none", fontWeight: 700, fontSize: "1rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}><Phone size={18} /> {formatPhone(phoneNumber)}</a>
                    </div>
                </div>
            </section>
        </>
    );
}

function trustSignalDescription(signal: string): string {
    if (signal.includes("Same-day")) return "Pickup may be available today when schedule capacity allows.";
    if (signal.includes("Licensed")) return "A license number is available for this operator.";
    if (signal.includes("Insured")) return "Insurance carrier information is available for this operator.";
    if (signal.includes("recycling")) return "Eligible materials are routed with this target in mind.";
    if (signal.includes("pricing")) return "The crew confirms the final price before loading begins.";
    return "Local junk removal service for the configured service area.";
}
