import Link from "next/link";
import { siteConfig, formatPhone, telHref } from "@/lib/siteConfig";
import type { Metadata } from "next";
import { Smartphone, Truck, CircleCheckBig, BadgeDollarSign, Clock, Recycle, ShieldCheck, CalendarDays, Phone } from "lucide-react";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;

export const metadata: Metadata = {
    title: `How Junk Removal Works in ${siteConfig.city} | ${siteConfig.companyName}`,
    description: `Book junk removal in ${cityState} in 3 easy steps with ${siteConfig.companyName}. Schedule online, we show up with a free quote, and your junk is gone. Same-day service available.`,
    alternates: { canonical: "/how-it-works" },
};

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
            desc: "Our team reviews your booking details and confirms your date, time, and estimated price. You'll get a confirmation with everything you need to know — no guesswork, no surprises.",
        },
        {
            num: "03",
            Icon: Truck,
            title: "We Show Up & Haul It Away",
            desc: "Our uniformed, insured crew arrives within your time window. We confirm the final price on-site, load everything up, sweep the area clean, and haul it all away. Usable items are donated, the rest is recycled or disposed of responsibly.",
        },
    ];

    return (
        <>
            {/* Hero */}
            <section style={{ background: "var(--hero-bg)", padding: "9rem 1.5rem 5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 800, margin: "0 auto" }}>
                    <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900, color: "var(--hero-text)", lineHeight: 1.1, marginBottom: "1.5rem" }}>
                        How Junk Removal Works in{" "}
                        <span style={{ color: "var(--brand)" }}>{siteConfig.city}</span>
                    </h1>
                    <p style={{ fontSize: "1.2rem", color: "var(--hero-muted)", maxWidth: 550, margin: "0 auto" }}>
                        Junk removal in {cityState} shouldn&apos;t be complicated. {companyName} makes it fast, fair, and hands-free — from booking to cleanup.
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

            {/* Guarantees */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--card)", borderTop: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
                    <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "3rem" }}>Our Guarantee</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem" }}>
                        {[
                            { Icon: BadgeDollarSign, title: "No Hidden Fees", desc: "The price we quote is the price you pay. Period. No extra charges for loading, hauling, or disposal." },
                            { Icon: Clock, title: "On-Time Arrival", desc: `We show up within your scheduled window, every time. Same-day service often available in ${siteConfig.city}.` },
                            { Icon: Recycle, title: "Eco-Friendly", desc: "We donate usable items to local charities and recycle everything we can. Landfill is our last resort." },
                            { Icon: ShieldCheck, title: "Fully Insured", desc: "Licensed and insured with comprehensive liability coverage, so you have zero risk when we're on your property." },
                        ].map((g) => (
                            <div key={g.title} style={{ padding: "2rem", background: "var(--background)", borderRadius: 16, border: "1px solid var(--border)" }}>
                                <div style={{ marginBottom: "0.75rem" }}><g.Icon size={28} color="var(--brand)" /></div>
                                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>{g.title}</h3>
                                <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{g.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ background: "var(--brand)", padding: "4rem 1.5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "var(--hero-text)", marginBottom: "1rem" }}>Ready to Get Started?</h2>
                    <p style={{ color: "var(--hero-text)", fontSize: "1.1rem", marginBottom: "2rem" }}>Book online in 2 minutes. Same-day service available in {city}{state ? `, ${state}` : ""}.</p>
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <Link href="/book" style={{ padding: "1rem 2rem", borderRadius: "var(--btn-radius)", background: "var(--card)", color: "var(--brand)", fontWeight: 700, fontSize: "1rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}><CalendarDays size={18} /> Book Online Now</Link>
                        <a href={telHref(phoneNumber)} style={{ padding: "1rem 2rem", borderRadius: "var(--btn-radius)", border: "2px solid var(--hero-text)", color: "var(--hero-text)", textDecoration: "none", fontWeight: 700, fontSize: "1rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}><Phone size={18} /> {formatPhone(phoneNumber)}</a>
                    </div>
                </div>
            </section>
        </>
    );
}
