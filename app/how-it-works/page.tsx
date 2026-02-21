import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: `How It Works | ${siteConfig.companyName}`,
    description: `Book junk removal in 3 easy steps with ${siteConfig.companyName}. Schedule online, we show up, and your junk is gone.`,
};

export default function HowItWorksPage() {
    const { companyName, phoneNumber, city, state } = siteConfig;

    const steps = [
        {
            num: "01",
            icon: "📱",
            title: "Book Online or Call",
            desc: `Schedule your pickup in under 2 minutes through our website or call us at ${phoneNumber}. Pick a date and time window that works for you — same-day appointments often available.`,
        },
        {
            num: "02",
            icon: "🚛",
            title: "We Show Up & Quote",
            desc: "Our uniformed, insured crew arrives within your time window. We look at what needs to go and give you a firm, upfront price before we touch anything. No surprises, no hidden fees.",
        },
        {
            num: "03",
            icon: "✅",
            title: "We Haul It Away",
            desc: "Once you approve the price, we get to work immediately. We load, sweep up, and haul everything away. Usable items are donated, the rest is recycled or disposed of responsibly.",
        },
    ];

    return (
        <>
            <Navbar />
            <main>
                {/* Hero */}
                <section style={{ background: "var(--hero-bg)", padding: "7rem 1.5rem 5rem", textAlign: "center" }}>
                    <div style={{ maxWidth: 800, margin: "0 auto" }}>
                        <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900, color: "var(--hero-text)", lineHeight: 1.1, marginBottom: "1.5rem" }}>
                            How It <span style={{ color: "var(--brand)" }}>Works</span>
                        </h1>
                        <p style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.65)", maxWidth: 550, margin: "0 auto" }}>
                            Junk removal shouldn&apos;t be complicated. {companyName} makes it fast, fair, and hands-free.
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
                                <div style={{ flexShrink: 0, width: 80, height: 80, borderRadius: 16, background: "rgba(var(--brand-rgb, 249, 115, 22), 0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>
                                    {step.icon}
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
                    <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
                        <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "3rem" }}>Our Guarantee</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem" }}>
                            {[
                                { icon: "💰", title: "No Hidden Fees", desc: "The price we quote is the price you pay. Period." },
                                { icon: "⏰", title: "On-Time Arrival", desc: "We show up within your scheduled window, every time." },
                                { icon: "♻️", title: "Eco-Friendly", desc: "We donate and recycle first. Landfill is the last resort." },
                                { icon: "🛡️", title: "Fully Insured", desc: "Licensed and insured so you have zero liability." },
                            ].map((g) => (
                                <div key={g.title} style={{ padding: "2rem", background: "var(--background)", borderRadius: 16, border: "1px solid var(--border)" }}>
                                    <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{g.icon}</div>
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
                        <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.1rem", marginBottom: "2rem" }}>Book online in 2 minutes. Same-day service available in {city}{state ? `, ${state}` : ""}.</p>
                        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                            <Link href="/book" style={{ padding: "1rem 2rem", borderRadius: "var(--btn-radius)", background: "var(--card)", color: "var(--brand)", fontWeight: 700, fontSize: "1rem", textDecoration: "none" }}>📅 Book Online Now</Link>
                            <a href={`tel:${phoneNumber.replace(/\D/g, "")}`} style={{ padding: "1rem 2rem", borderRadius: "var(--btn-radius)", border: "2px solid #fff", color: "var(--hero-text)", textDecoration: "none", fontWeight: 700, fontSize: "1rem" }}>📞 {phoneNumber}</a>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
