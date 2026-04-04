import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Leaf, Shield, Users, Truck, MapPin, Star, Recycle, CheckCircle } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";
import SafeImage from "@/components/SafeImage";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;
const areas = (siteConfig.serviceArea || "").split(",").map(s => s.trim()).filter(Boolean);

export const metadata: Metadata = {
    title: `About ${siteConfig.companyName} — Junk Removal in ${cityState}`,
    description: `Learn about ${siteConfig.companyName} — your trusted, licensed & insured junk removal team serving ${cityState}. Eco-friendly disposal, upfront pricing, and same-day service.`,
    alternates: { canonical: "/about" },
};

export default function AboutPage() {
    const values = [
        { icon: Shield, title: "Fully Insured", desc: "Every job is covered by our comprehensive liability insurance. You have zero risk when our crew is on your property." },
        { icon: Leaf, title: "Eco-Friendly", desc: "We donate usable items to local charities and recycle everything we can. The landfill is always our last resort." },
        { icon: Users, title: "Professional Crews", desc: "Our team members are background-checked, trained, and always respectful of your home and belongings." },
        { icon: Truck, title: "On-Time Guaranteed", desc: "We show up within your scheduled window — every time, no excuses. Your time matters to us." },
    ];

    return (
        <>
            <section style={{ background: "var(--hero-bg)", padding: "7rem 1.5rem 4rem", textAlign: "center" }}>
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--hero-text)", marginBottom: "1rem" }}>
                        About {siteConfig.companyName} — Junk Removal in {siteConfig.city}
                    </h1>
                    <p style={{ color: "var(--hero-muted)", fontSize: "1.1rem", lineHeight: 1.7 }}>
                        {siteConfig.tagline}
                    </p>
                </div>
            </section>

            {/* Our Story */}
            <section className="section">
                <div style={{ maxWidth: 700 }}>
                    <h2 className="section-title">Our Story</h2>
                    <p style={{ color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.8, marginBottom: "1.5rem" }}>
                        We started {siteConfig.companyName} because getting rid of junk shouldn&apos;t be complicated.
                        No confusing pricing, no hidden fees, no unreliable crews. Just honest service, fair prices,
                        and the peace of mind that comes from a clean space.
                    </p>
                    <p style={{ color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.8, marginBottom: "1.5rem" }}>
                        Based right here in {cityState}, we know the community we serve. Whether it&apos;s a garage
                        cleanout in {areas[0] || siteConfig.city} or a full estate cleanout across town, our crew shows up
                        on time, quotes you upfront, and gets the job done right. We&apos;ve built our reputation one
                        satisfied customer at a time.
                    </p>
                    <p style={{ color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.8 }}>
                        We proudly serve {siteConfig.serviceArea} and are committed to responsible disposal.
                        Everything we pick up is sorted — usable items are donated, recyclables go to the proper facilities,
                        and only what&apos;s left goes to the landfill.
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

            {/* Stats Bar */}
            <section style={{ background: "var(--brand)", padding: "2rem 1.5rem" }}>
                <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "2rem", textAlign: "center" }}>
                    {[
                        { icon: CheckCircle, value: "500+", label: "Jobs Completed" },
                        { icon: Star, value: "5.0 ★", label: "Average Rating" },
                        { icon: Recycle, value: "70%", label: "Recycled & Donated" },
                        { icon: MapPin, value: `${areas.length}+`, label: "Areas Served" },
                    ].map((stat) => (
                        <div key={stat.label} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <stat.icon size={24} color="#fff" style={{ marginBottom: "0.5rem" }} />
                            <span style={{ fontSize: "1.75rem", fontWeight: 900, color: "#fff" }}>{stat.value}</span>
                            <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{stat.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Our Values */}
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

            {/* Areas We Serve */}
            {areas.length > 1 && (
                <section style={{ padding: "5rem 1.5rem", background: "var(--background)" }}>
                    <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
                        <h2 className="section-title" style={{ textAlign: "center" }}>Areas We Serve</h2>
                        <p className="section-subtitle" style={{ textAlign: "center", margin: "0.75rem auto 2rem" }}>
                            Proudly serving {siteConfig.city} and surrounding communities.
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.5rem" }}>
                            {areas.map((area) => (
                                <span key={area} style={{
                                    display: "inline-flex", alignItems: "center", gap: "0.35rem",
                                    padding: "0.4rem 0.85rem", borderRadius: "var(--btn-radius)",
                                    background: "var(--card)", border: "1px solid var(--border)",
                                    color: "var(--foreground)", fontSize: "0.85rem", fontWeight: 600,
                                }}>
                                    <MapPin size={12} color="var(--brand)" /> {area}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
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
