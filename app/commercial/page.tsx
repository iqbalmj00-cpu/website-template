import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: `Commercial Junk Removal | ${siteConfig.companyName}`,
    description: `Commercial junk removal for offices, warehouses, retail spaces, and construction sites. ${siteConfig.companyName} handles it all.`,
};

export default function CommercialPage() {
    const { companyName, phoneNumber, city, state } = siteConfig;

    return (
        <>
            <Navbar />
            <main>
                <section style={{ background: "var(--hero-bg)", padding: "7rem 1.5rem 5rem", overflow: "hidden" }}>
                    <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: siteConfig.commercialImageUrl ? "1fr 1fr" : "1fr", gap: "2rem", alignItems: "center" }}>
                        <div style={{ textAlign: siteConfig.commercialImageUrl ? "left" : "center", maxWidth: siteConfig.commercialImageUrl ? undefined : 800, margin: siteConfig.commercialImageUrl ? undefined : "0 auto" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 1rem", borderRadius: "var(--btn-radius)", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "var(--brand)", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "2rem" }}>
                                🏢 Business Solutions
                            </span>
                            <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 3.5rem)", fontWeight: 900, color: "var(--hero-text)", lineHeight: 1.1, marginBottom: "1.5rem" }}>
                                Commercial <span style={{ color: "var(--brand)" }}>Junk Removal</span>
                            </h1>
                            <p style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.65)", maxWidth: 600 }}>
                                Offices, warehouses, retail spaces, restaurants — {companyName} clears commercial properties quickly and professionally.
                            </p>
                        </div>
                        {siteConfig.commercialImageUrl && (
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <img
                                    src={siteConfig.commercialImageUrl}
                                    alt={`${companyName} commercial junk removal`}
                                    style={{ width: "100%", maxWidth: 500, borderRadius: 16, objectFit: "cover", aspectRatio: "4/3", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}
                                />
                            </div>
                        )}
                    </div>
                </section>

                {/* Services */}
                <section style={{ padding: "5rem 1.5rem", background: "var(--background)" }}>
                    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                        <h2 style={{ fontSize: "2rem", fontWeight: 800, textAlign: "center", marginBottom: "3rem" }}>What We Handle</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
                            {[
                                { icon: "🏢", title: "Office Cleanouts", desc: "Desks, chairs, cubicles, filing cabinets, and full floor clearings. We work after hours to minimize disruption." },
                                { icon: "🏭", title: "Warehouse Clearing", desc: "Pallets, racking, old inventory, and industrial equipment removed efficiently." },
                                { icon: "🏪", title: "Retail Spaces", desc: "Store fixtures, signage, shelving, and display cases removed before your next tenant moves in." },
                                { icon: "🍽️", title: "Restaurant Equipment", desc: "Commercial kitchen equipment, seating, bar fixtures, and walk-in coolers." },
                                { icon: "🏗️", title: "Construction Sites", desc: "Ongoing debris removal for contractors. Scheduled pickups available weekly or bi-weekly." },
                                { icon: "🏥", title: "Property Management", desc: "Turnover cleanouts, tenant moveout junk, and ongoing building maintenance support." },
                            ].map((svc) => (
                                <div key={svc.title} style={{ background: "var(--card)", borderRadius: 16, padding: "2rem", border: "1px solid var(--border)" }}>
                                    <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{svc.icon}</div>
                                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>{svc.title}</h3>
                                    <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>{svc.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Us */}
                <section style={{ padding: "5rem 1.5rem", background: "var(--card)", borderTop: "1px solid var(--border)" }}>
                    <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
                        <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "3rem" }}>Why Businesses Choose Us</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem" }}>
                            {[
                                { icon: "🌙", title: "After-Hours Service", desc: "We work evenings and weekends to avoid disrupting your business." },
                                { icon: "📋", title: "Volume Pricing", desc: "Discounted rates for recurring cleanouts and large-scale projects." },
                                { icon: "🛡️", title: "Fully Insured", desc: "Commercial liability insurance protects your property." },
                                { icon: "♻️", title: "Compliance", desc: "We follow all local disposal regulations and provide documentation." },
                            ].map((f) => (
                                <div key={f.title}>
                                    <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{f.icon}</div>
                                    <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.25rem" }}>{f.title}</h3>
                                    <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section style={{ background: "var(--brand)", padding: "4rem 1.5rem", textAlign: "center" }}>
                    <div style={{ maxWidth: 700, margin: "0 auto" }}>
                        <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "var(--hero-text)", marginBottom: "1rem" }}>Get a Commercial Quote</h2>
                        <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.1rem", marginBottom: "2rem" }}>
                            Serving businesses across {city}{state ? `, ${state}` : ""}. Contact us for volume pricing.
                        </p>
                        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                            <Link href="/contact" style={{ padding: "1rem 2rem", borderRadius: "var(--btn-radius)", background: "var(--card)", color: "var(--brand)", fontWeight: 700, fontSize: "1rem", textDecoration: "none" }}>📧 Request a Quote</Link>
                            <a href={`tel:${phoneNumber.replace(/\D/g, "")}`} style={{ padding: "1rem 2rem", borderRadius: "var(--btn-radius)", border: "2px solid #fff", color: "var(--hero-text)", textDecoration: "none", fontWeight: 700, fontSize: "1rem" }}>📞 {phoneNumber}</a>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
