import Link from "next/link";
import { siteConfig, formatPhone, telHref } from "@/lib/siteConfig";
import SafeImage from "@/components/SafeImage";
import { getLocations, getLocationBySlug } from "@/lib/locationData";
import { getClientServices } from "@/lib/serviceData";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ServiceIcon from "@/components/ServiceIcon";
import { MapPin, Truck, Phone } from "lucide-react";

export async function generateStaticParams() {
    return getLocations().map((loc) => ({ slug: loc.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const loc = getLocationBySlug(slug);
    if (!loc) return { title: "Location Not Found" };
    const locImage = siteConfig.locationImages?.[slug] || null;
    return {
        title: loc.metaTitle,
        description: loc.metaDescription,
        alternates: { canonical: `/locations/${slug}` },
        openGraph: {
            title: loc.metaTitle,
            description: loc.metaDescription,
            type: "article",
            ...(locImage ? { images: [{ url: locImage, width: 1200, height: 630, alt: `Junk removal in ${loc.name}, ${loc.state}` }] } : {}),
        },
    };
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
            {/* JSON-LD: Location-specific LocalBusiness */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "LocalBusiness",
                        name: `${companyName} — ${location.name}, ${location.state}`,
                        description: location.heroDescription,
                        telephone: phoneNumber,
                        address: {
                            "@type": "PostalAddress",
                            addressLocality: location.name,
                            addressRegion: location.state,
                            addressCountry: "US",
                        },
                        areaServed: [
                            { "@type": "City", name: location.name },
                            ...location.neighborhoods.map(n => ({ "@type": "Place", name: n })),
                        ],
                        ...(siteConfig.subdomain ? { url: `https://${siteConfig.subdomain}.scaleyourjunk.com/locations/${slug}` } : {}),
                    }),
                }}
            />
            {/* JSON-LD: BreadcrumbList */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        itemListElement: [
                            { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.subdomain ? `https://${siteConfig.subdomain}.scaleyourjunk.com` : "/" },
                            { "@type": "ListItem", position: 2, name: "Locations", item: siteConfig.subdomain ? `https://${siteConfig.subdomain}.scaleyourjunk.com/locations` : "/locations" },
                            { "@type": "ListItem", position: 3, name: `${location.name}, ${location.state}` },
                        ],
                    }),
                }}
            />
            {/* Hero */}
            <section style={{ background: "var(--hero-bg)", padding: "7rem 1.5rem 5rem", overflow: "hidden" }}>
                <div data-image-grid style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "center" }}>
                    <div>
                        {(() => {
                            const badgeNames = (location.heroBadge || location.name).split(",").map(s => s.trim()).filter(Boolean);
                            const maxShow = 10;
                            const visible = badgeNames.slice(0, maxShow);
                            const remaining = badgeNames.length - maxShow;
                            return (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.5rem" }}>
                                    {visible.map((name) => (
                                        <span key={name} style={{
                                            display: "inline-flex", alignItems: "center", gap: "0.3rem",
                                            padding: "0.3rem 0.65rem", borderRadius: "var(--btn-radius)",
                                            background: "var(--hero-badge-bg)", border: "1px solid var(--hero-badge-border)",
                                            color: "var(--brand)", fontSize: "0.7rem", fontWeight: 600,
                                            textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap",
                                        }}>
                                            <MapPin size={10} /> {name}
                                        </span>
                                    ))}
                                    {remaining > 0 && (
                                        <span style={{
                                            display: "inline-flex", alignItems: "center",
                                            padding: "0.3rem 0.65rem", borderRadius: "var(--btn-radius)",
                                            background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)",
                                            color: "var(--brand)", fontSize: "0.7rem", fontWeight: 700,
                                            textTransform: "uppercase", letterSpacing: "0.04em",
                                        }}>
                                            +{remaining} more
                                        </span>
                                    )}
                                </div>
                            );
                        })()}
                        <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 900, color: "var(--hero-text)", lineHeight: 1.1, marginBottom: "1.5rem" }}>
                            Junk Removal in <span style={{ color: "var(--brand)" }}>{location.name}, {location.state}</span>
                        </h1>
                        <p style={{ fontSize: "1.15rem", color: "var(--hero-muted)", maxWidth: 600, marginBottom: "2rem", lineHeight: 1.6 }}>
                            {location.heroDescription}
                        </p>
                        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                            <Link href="/book" className="btn-primary" style={{ padding: "1rem 2rem", fontSize: "1rem" }}>
                                <Truck size={18} /> Get A Free Quote
                            </Link>
                            <a href={telHref(phoneNumber)} style={{ padding: "1rem 2rem", borderRadius: "var(--btn-radius)", border: "2px solid var(--hero-border)", color: "var(--hero-text)", textDecoration: "none", fontWeight: 700, fontSize: "1rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                                <Phone size={18} /> {formatPhone(phoneNumber)}
                            </a>
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <SafeImage
                            src={siteConfig.locationImages[slug] || `/images/generated/locations/${slug}.png`}
                            alt={`Junk removal in ${location.name}, ${location.state}`}
                            collapseParentGrid
                            style={{ width: "100%", maxWidth: 500, borderRadius: 16, objectFit: "cover", aspectRatio: "4/3", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}
                        />
                    </div>
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
                                <div style={{ marginBottom: "0.75rem" }}><ServiceIcon name={svc.icon} size={28} color="var(--brand)" /></div>
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
                                <MapPin size={14} color="var(--brand)" style={{ display: "inline" }} /> {hood}
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
            <section style={{ background: "var(--hero-bg)", padding: "5rem 1.5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "var(--hero-text)", marginBottom: "1rem" }}>
                        Ready to Clear Out Your Space in <span style={{ color: "var(--brand)" }}>{location.name}</span>?
                    </h2>
                    <p style={{ color: "var(--hero-muted)", fontSize: "1.1rem", marginBottom: "2rem" }}>
                        Book online in 2 minutes or call for an instant estimate.
                    </p>
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <Link href="/book" className="btn-primary" style={{ padding: "1rem 2rem", fontSize: "1rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}><Truck size={18} /> Get Instant Quote</Link>
                        <a href={telHref(phoneNumber)} style={{ padding: "1rem 2rem", borderRadius: "var(--btn-radius)", border: "2px solid #fff", color: "var(--hero-text)", textDecoration: "none", fontWeight: 700, fontSize: "1rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}><Phone size={18} /> {formatPhone(phoneNumber)}</a>
                    </div>
                </div>
            </section>
        </>
    );
}
