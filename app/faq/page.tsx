"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";

const FAQS = [
    { q: "How much does junk removal cost?", a: `Our pricing starts at $75 and depends on how much space your items take in our truck. We give you a firm quote before we start — no hidden fees, no surprises.` },
    { q: "Do I need to be home?", a: "We prefer someone to be there so we can confirm exactly what goes, but curbside pickups don't always require it. Just let us know when booking." },
    { q: "What items do you NOT take?", a: "We can't take hazardous waste (chemicals, paint, asbestos), medical waste, or anything that requires special permits. If you're unsure, just ask!" },
    { q: "How quickly can you come?", a: `We offer same-day and next-day service in ${siteConfig.city} depending on availability. Book online and pick your preferred window.` },
    { q: "Do you recycle or donate items?", a: "Absolutely. We sort everything we pick up. Usable furniture and goods go to local charities, recyclables go to the proper facility, and only what's left goes to the landfill." },
    { q: "Is there a minimum charge?", a: "Yes, our minimum is $75 for a few small items that fit in a pickup bed. This covers our trip, crew time, and disposal costs." },
    { q: "Can I reschedule my pickup?", a: "Of course! You can reschedule at any time by contacting us. We'll find a new time that works for you." },
    { q: "Are you insured?", a: `Yes. ${siteConfig.companyName} is fully licensed and insured for your peace of mind. You have zero liability when we work on your property.` },
];

function FAQItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ borderBottom: "1px solid var(--border)" }}>
            <button onClick={() => setOpen(o => !o)}
                style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "1.25rem 0", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
                    textAlign: "left",
                }}>
                <span style={{ fontWeight: 600, fontSize: "1rem", color: "var(--foreground)", paddingRight: "1rem" }}>{q}</span>
                <ChevronDown size={20} style={{ color: "var(--muted)", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0)", flexShrink: 0 }} />
            </button>
            {open && (
                <div style={{ paddingBottom: "1.25rem", color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.7 }}>
                    {a}
                </div>
            )}
        </div>
    );
}

export default function FAQPage() {
    return (
        <>
            {/* FAQPage JSON-LD for rich snippets in Google */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        mainEntity: FAQS.map((faq) => ({
                            "@type": "Question",
                            name: faq.q,
                            acceptedAnswer: {
                                "@type": "Answer",
                                text: faq.a,
                            },
                        })),
                    }),
                }}
            />
            <section style={{ background: "var(--hero-bg)", padding: "5rem 1.5rem 4rem", textAlign: "center" }}>
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--hero-text)", marginBottom: "1rem" }}>
                        Frequently Asked Questions
                    </h1>
                    <p style={{ color: "var(--hero-muted)", fontSize: "1.1rem", lineHeight: 1.7 }}>
                        Everything you need to know about our junk removal service.
                    </p>
                </div>
            </section>

            <section className="section" style={{ maxWidth: 700 }}>
                {FAQS.map((faq) => (
                    <FAQItem key={faq.q} q={faq.q} a={faq.a} />
                ))}
            </section>

            <section style={{ padding: "5rem 1.5rem", background: "var(--hero-bg)", textAlign: "center" }}>
                <div style={{ maxWidth: 600, margin: "0 auto" }}>
                    <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "var(--hero-text)", marginBottom: "1rem" }}>
                        Still have questions?
                    </h2>
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <Link href="/contact" className="btn-primary" style={{ fontSize: "1rem", padding: "0.875rem 2rem" }}>
                            Contact Us
                        </Link>
                        <Link href="/book" className="btn-secondary" style={{ fontSize: "1rem", borderColor: "var(--hero-border)", color: "var(--hero-text)" }}>
                            Book a Pickup <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
