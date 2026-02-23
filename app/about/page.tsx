import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Leaf, Shield, Users, Truck } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";
import SafeImage from "@/components/SafeImage";

export const metadata: Metadata = {
    title: `About Us | ${siteConfig.companyName}`,
    description: `Learn about ${siteConfig.companyName} — your trusted junk removal team in ${siteConfig.serviceArea}.`,
};

export default function AboutPage() {
    const values = [
        { icon: Shield, title: "Fully Insured", desc: "Every job is covered. Zero liability for you." },
        { icon: Leaf, title: "Eco-Friendly", desc: "We donate and recycle — landfill is always our last resort." },
        { icon: Users, title: "Professional Crews", desc: "Background-checked, trained, and always respectful." },
        { icon: Truck, title: "On-Time Guaranteed", desc: "We show up in your window — every time, no excuses." },
    ];

    return (
        <>
            <section style={{ background: "var(--hero-bg)", padding: "5rem 1.5rem 4rem", textAlign: "center" }}>
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--hero-text)", marginBottom: "1rem" }}>
                        About {siteConfig.companyName}
                    </h1>
                    <p style={{ color: "var(--hero-muted)", fontSize: "1.1rem", lineHeight: 1.7 }}>
                        {siteConfig.tagline}
                    </p>
                </div>
            </section>

            <section className="section">
                <div style={{ maxWidth: 700 }}>
                    <h2 className="section-title">Our Mission</h2>
                    <p style={{ color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.8, marginBottom: "1.5rem" }}>
                        We started {siteConfig.companyName} because getting rid of junk shouldn't be complicated.
                        No confusing pricing, no hidden fees, no unreliable crews. Just honest service, fair prices,
                        and the peace of mind that comes from a clean space.
                    </p>
                    <p style={{ color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.8 }}>
                        We proudly serve {siteConfig.serviceArea} and are committed to responsible disposal.
                        Everything we pick up is sorted — usable items are donated, recyclables go to the proper facilities,
                        and only what's left goes to the landfill.
                    </p>
                    <div style={{ marginTop: "2rem" }}>
                        <SafeImage
                            src={siteConfig.aboutImageUrl || "/images/generated/about.png"}
                            alt={`${siteConfig.companyName} team`}
                            style={{ width: "100%", borderRadius: 16, objectFit: "cover", maxHeight: 400 }}
                        />
                    </div>
                </div>
            </section>

            <section style={{ padding: "5rem 1.5rem", background: "var(--card)" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <h2 className="section-title" style={{ textAlign: "center", marginBottom: "3rem" }}>Our Values</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
                        {values.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="card" style={{ textAlign: "center" }}>
                                <Icon size={32} style={{ color: "var(--brand)", marginBottom: "1rem" }} />
                                <h3 style={{ fontSize: "1.1rem", color: "var(--foreground)", marginBottom: "0.5rem" }}>{title}</h3>
                                <p style={{ color: "var(--muted)", fontSize: "0.925rem", lineHeight: 1.65 }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section style={{ padding: "5rem 1.5rem", background: "var(--hero-bg)", textAlign: "center" }}>
                <div style={{ maxWidth: 600, margin: "0 auto" }}>
                    <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "var(--hero-text)", marginBottom: "1rem" }}>
                        Let us do the heavy lifting.
                    </h2>
                    <Link href="/book" className="btn-primary" style={{ fontSize: "1.05rem", padding: "1rem 2rem" }}>
                        Book a Pickup <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </>
    );
}
