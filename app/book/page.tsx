import type { Metadata } from "next";
import { Suspense } from "react";
import BookingWizard from "@/components/BookingWizard";
import { siteConfig, formatPhone, telHref } from "@/lib/siteConfig";
import { Shield, Clock, CheckCircle, Leaf } from "lucide-react";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;

export const metadata: Metadata = {
    title: `Book Junk Removal in ${siteConfig.city} | ${siteConfig.companyName}`,
    description: `Schedule junk removal or rent a dumpster with ${siteConfig.companyName} in ${cityState}. Fast, easy online booking. Same-day service available. Book in minutes.`,
    alternates: { canonical: "/book" },
};

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
                        Schedule your pickup online in minutes. {siteConfig.companyName} serves {cityState} and surrounding areas with same-day and next-day junk removal near you.
                    </p>
                </div>
            </section>

            {/* Trust signals */}
            <div style={{ background: "var(--brand)", padding: "1rem 1.5rem" }}>
                <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "2rem" }}>
                    {[
                        { icon: Shield, label: "Fully Insured" },
                        { icon: CheckCircle, label: "Upfront Pricing" },
                        { icon: Clock, label: "Same-Day Available" },
                        { icon: Leaf, label: "Eco-Friendly" },
                    ].map((item) => (
                        <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff", fontSize: 14, fontWeight: 600 }}>
                            <item.icon size={18} />
                            <span>{item.label}</span>
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
                            a: `We frequently offer same-day and next-day junk removal in ${cityState}. Book before noon for the best chance of same-day service.`,
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
