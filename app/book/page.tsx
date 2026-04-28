import type { Metadata } from "next";
import { Suspense } from "react";
import BookingWizard from "@/components/BookingWizard";
import { getVerifiableTrustSignals, isSameDayEnabled, siteConfig, formatPhone } from "@/lib/siteConfig";
import { CheckCircle } from "lucide-react";
import { createPageMetadata } from "@/lib/seo";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;

export const metadata: Metadata = createPageMetadata({
    title: `Book Junk Removal in ${siteConfig.city}`,
    description: `Book junk removal near you in ${cityState} with ${siteConfig.companyName}. Schedule a pickup online and confirm the final price before loading.`,
    path: "/book",
});

export default function BookPage() {
    return (
        <main>
            {/* Server-rendered SEO content */}
            <section style={{ background: "var(--hero-bg)", padding: "9rem 1.5rem 2rem", textAlign: "center" }}>
                <div style={{ maxWidth: 640, margin: "0 auto" }}>
                    <h1 style={{ fontSize: "2.25rem", fontWeight: 900, color: "var(--hero-text)", marginBottom: "0.75rem", fontFamily: "var(--heading-font)" }}>
                        Book Junk Removal in {siteConfig.city}
                    </h1>
                    <p style={{ color: "var(--hero-muted, #94A3B8)", fontSize: "1.05rem", lineHeight: 1.6 }}>
                        Schedule your pickup online in minutes. {siteConfig.companyName} serves {cityState} and surrounding areas. {isSameDayEnabled() ? "Same-day and next-day windows may be available when route capacity allows." : "Pickup windows depend on route availability."}
                    </p>
                </div>
            </section>

            {/* Trust signals */}
            <div style={{ background: "var(--brand)", padding: "1rem 1.5rem" }}>
                <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "2rem" }}>
                    {getVerifiableTrustSignals().map((label) => (
                        <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff", fontSize: 14, fontWeight: 600 }}>
                            <CheckCircle size={18} />
                            <span>{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Booking wizard */}
            <Suspense><BookingWizard /></Suspense>

            {/* FAQ section for SEO */}
            <section style={{ background: "var(--card)", padding: "4rem 1.5rem" }}>
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "2rem", textAlign: "center", fontFamily: "var(--heading-font)" }}>
                        Booking FAQ
                    </h2>
                    {[
                        {
                            q: `How do I book junk removal in ${siteConfig.city}?`,
                            a: `Use the form above to select your items, choose a date and time, and confirm your booking. It takes less than 5 minutes. You can also call us at ${formatPhone(siteConfig.phoneNumber)} to book over the phone with our 24/7 AI assistant.`,
                        },
                        {
                            q: "How quickly can you pick up my junk?",
                            a: isSameDayEnabled() ? `Same-day and next-day windows may be available in ${cityState} when route capacity allows.` : `Pickup windows in ${cityState} depend on route availability.`,
                        },
                        {
                            q: "What happens after I book?",
                            a: "Our team reviews your booking and confirms your date, time, and estimated price. On the day of your pickup, the crew arrives, confirms the final price on-site, and handles everything — loading, hauling, and cleanup.",
                        },
                        {
                            q: "Is there a minimum charge?",
                            a: `Our minimum starts at $${siteConfig.pricing?.tiers?.[0]?.min ?? 75}. Pricing is based on how much space your items take in our truck. You'll always see a price range before you book, and the crew confirms the final price on-site.`,
                        },
                    ].map((faq, i) => (
                        <details key={i} style={{ borderBottom: "1px solid var(--border)", padding: "1rem 0" }}>
                            <summary style={{ fontWeight: 700, fontSize: "1rem", cursor: "pointer", color: "var(--foreground)" }}>
                                {faq.q}
                            </summary>
                            <p style={{ marginTop: "0.75rem", color: "var(--muted)", lineHeight: 1.6, fontSize: "0.95rem" }}>
                                {faq.a}
                            </p>
                        </details>
                    ))}
                </div>
            </section>
        </main>
    );
}
