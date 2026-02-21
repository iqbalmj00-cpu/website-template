import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { getLocations, getLocationBySlug } from "@/lib/locationData";
import { getClientServices } from "@/lib/serviceData";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
    return getLocations().map((loc) => ({ slug: loc.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const loc = getLocationBySlug(slug);
    if (!loc) return { title: "Location Not Found" };
    return { title: loc.metaTitle, description: loc.metaDescription };
}

export default async function LocationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const location = getLocationBySlug(slug);
    if (!location) notFound();

    const { companyName, phoneNumber } = siteConfig;
    const services = getClientServices().slice(0, 4);
    const locations = getLocations().filter((l) => l.slug !== slug);

    return (
        <>
            <Navbar />
            <main>
                {/* Hero */}
                <section style={{ background: "var(--navy, #0f172a)", padding: "7rem 1.5rem 5rem", overflow: "hidden" }}>
                    <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: siteConfig.locationImages[slug] ? "1fr 1fr" : "1fr", gap: "2rem", alignItems: "center" }}>
                        <div>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 1rem", borderRadius: "var(--btn-radius)", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "var(--brand)", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1.5rem" }}>
                                📍 {location.heroBadge}
                            </span>
                            <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: "1.5rem" }}>
                                Junk Removal in <span style={{ color: "var(--brand)" }}>{location.name}, {location.state}</span>
                            </h1>
                            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.65)", maxWidth: 600, marginBottom: "2rem", lineHeight: 1.6 }}>
                                {location.heroDescription}
                            </p>
                            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                                <Link href="/book" className="btn-primary" style={{ padding: "1rem 2rem", fontSize: "1rem" }}>
                                    🚛 Get A Free Quote
                                </Link>
                                <a href={`tel:${phoneNumber.replace(/\D/g, "")}`} style={{ padding: "1rem 2rem", borderRadius: "var(--btn-radius)", border: "2px solid rgba(255,255,255,0.3)", color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: "1rem" }}>
                                    📞 {phoneNumber}
                                </a>
                            </div>
                        </div>
                        {siteConfig.locationImages[slug] && (
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <img
                                    src={siteConfig.locationImages[slug]}
                                    alt={`Junk removal in ${location.name}, ${location.state}`}
                                    style={{ width: "100%", maxWidth: 500, borderRadius: 16, objectFit: "cover", aspectRatio: "4/3", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}
                                />
                            </div>
                        )}
                    </div>
                </section>

                {/* About */}
                <section style={{ padding: "4rem 1.5rem", background: "var(--background)", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ maxWidth: 800, margin: "0 auto" }}>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1rem" }}>About Junk Removal in {location.name}</h2>
                        <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: "1.05rem" }}>
                            {companyName} provides fast, professional junk removal services across {location.name}, {location.state} and the surrounding area.
                            Whether you need a single item picked up or a full property cleanout, our licensed and insured crew handles it all — from furniture and appliances to yard waste and construction debris.
                            We donate reusable items to local charities and recycle whenever possible.
                        </p>
                    </div>
                </section>

                {/* Services */}
                <section style={{ padding: "4rem 1.5rem", background: "var(--card)", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                            <h2 style={{ fontSize: "2rem", fontWeight: 800, textTransform: "uppercase" }}>Our Services in {location.name}</h2>
                            <div style={{ width: 60, height: 4, borderRadius: "var(--btn-radius)", background: "var(--brand)", margin: "1rem auto 0" }} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
                            {services.map((svc) => (
                                <Link key={svc.slug} href={`/services/${svc.slug}`} style={{ padding: "2rem", background: "var(--background)", border: "1px solid var(--border)", borderRadius: 16, textDecoration: "none", color: "inherit", transition: "transform 0.2s" }}>
                                    <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{svc.icon}</div>
                                    <h3 style={{ fontSize: "1rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.5rem" }}>{svc.title}</h3>
                                    <p style={{ color: "var(--muted)", fontSize: "0.85rem", lineHeight: 1.5 }}>{svc.shortDesc}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Neighborhoods */}
                <section style={{ padding: "4rem 1.5rem", background: "var(--background)" }}>
                    <div style={{ maxWidth: 900, margin: "0 auto" }}>
                        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                            <h2 style={{ fontSize: "2rem", fontWeight: 800, textTransform: "uppercase" }}>Neighborhoods We Serve</h2>
                            <div style={{ width: 60, height: 4, borderRadius: "var(--btn-radius)", background: "var(--brand)", margin: "1rem auto 0" }} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.75rem", maxWidth: 800, margin: "0 auto" }}>
                            {location.neighborhoods.map((hood) => (
                                <div key={hood} style={{ background: "var(--card)", borderRadius: 8, padding: "0.75rem 1rem", textAlign: "center", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: 600 }}>
                                    📍 {hood}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQs */}
                <section style={{ padding: "4rem 1.5rem", background: "var(--card)", borderTop: "1px solid var(--border)" }}>
                    <div style={{ maxWidth: 700, margin: "0 auto" }}>
                        <h2 style={{ fontSize: "2rem", fontWeight: 800, textAlign: "center", marginBottom: "2rem" }}>Frequently Asked Questions</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {location.faqs.map((faq) => (
                                <details key={faq.q} style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
                                    <summary style={{ padding: "1rem 1.5rem", fontWeight: 600, cursor: "pointer", background: "var(--card)", fontSize: "1rem" }}>{faq.q}</summary>
                                    <div style={{ padding: "1rem 1.5rem", background: "var(--background)", color: "var(--muted)", lineHeight: 1.6, borderTop: "1px solid var(--border)" }}>{faq.a}</div>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Other Locations */}
                {locations.length > 0 && (
                    <section style={{ padding: "3rem 1.5rem", background: "var(--card)", borderTop: "1px solid var(--border)" }}>
                        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: "1rem" }}>Other Service Areas</h3>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                {locations.map((l) => (
                                    <Link key={l.slug} href={`/locations/${l.slug}`} style={{ padding: "0.5rem 1rem", borderRadius: "var(--btn-radius)", background: "var(--background)", border: "1px solid var(--border)", textDecoration: "none", color: "var(--foreground)", fontWeight: 500, fontSize: "0.85rem" }}>
                                        {l.name}, {l.state} →
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* CTA */}
                <section style={{ background: "var(--navy, #0f172a)", padding: "5rem 1.5rem", textAlign: "center" }}>
                    <div style={{ maxWidth: 700, margin: "0 auto" }}>
                        <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "#fff", marginBottom: "1rem" }}>
                            Ready to Clear Out Your Space in <span style={{ color: "var(--brand)" }}>{location.name}</span>?
                        </h2>
                        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.1rem", marginBottom: "2rem" }}>
                            Book online in 2 minutes or call for an instant estimate.
                        </p>
                        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                            <Link href="/book" className="btn-primary" style={{ padding: "1rem 2rem", fontSize: "1rem" }}>🚛 Get Instant Quote</Link>
                            <a href={`tel:${phoneNumber.replace(/\D/g, "")}`} style={{ padding: "1rem 2rem", borderRadius: "var(--btn-radius)", border: "2px solid #fff", color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: "1rem" }}>📞 {phoneNumber}</a>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
