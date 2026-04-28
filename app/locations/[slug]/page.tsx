import Link from "next/link";
import { siteConfig, formatPhone, telHref, roundTo5, hasInsurance, hasLicense, isSameDayEnabled } from "@/lib/siteConfig";
import SafeImage from "@/components/SafeImage";
import { getIndexableLocations, getLocations, getLocationBySlug } from "@/lib/locationData";
import { getClientServices } from "@/lib/serviceData";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ServiceIcon from "@/components/ServiceIcon";
import { MapPin, Truck, Phone, CheckCircle, Shield, Clock, Recycle } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { breadcrumbJsonLd, createPageMetadata, localBusinessJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
    return getLocations().map((loc) => ({ slug: loc.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
    const loc = getLocationBySlug(params.slug);
    if (!loc) {
        return createPageMetadata({
            title: "Location Not Found",
            description: "This location page is not available.",
            path: `/locations/${params.slug}`,
            noIndex: true,
        });
    }

    return createPageMetadata({
        title: `Junk Removal in ${loc.name}`,
        description: loc.metaDescription,
        path: `/locations/${loc.slug}`,
        image: siteConfig.locationImages?.[loc.slug] || null,
        noIndex: !loc.isMainCity && !loc.isExplicit,
    });
}

export default function LocationDetailPage({ params }: { params: { slug: string } }) {
    const location = getLocationBySlug(params.slug);
    if (!location) notFound();

    const { companyName, phoneNumber } = siteConfig;
    const services = getClientServices().slice(0, 4);
    const locations = getIndexableLocations().filter((l) => l.slug !== location.slug);
    const isIndexableLocation = location.isMainCity || location.isExplicit;
    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Locations", href: "/locations" },
        { label: `${location.name}, ${location.state}`, href: `/locations/${location.slug}` },
    ];
    const whyChoose = [
        { icon: CheckCircle, title: "Upfront Pricing", desc: `We confirm the price before loading begins for jobs in ${location.name}.` },
        ...(isSameDayEnabled() ? [{ icon: Clock, title: "Same-Day Availability", desc: `Same-day windows may be available in ${location.name} when route capacity allows.` }] : []),
        ...(siteConfig.recyclingRate !== null ? [{ icon: Recycle, title: "Recycling Target", desc: `${companyName} has a ${siteConfig.recyclingRate}% recycling target for eligible materials.` }] : []),
        ...((hasLicense() || hasInsurance()) ? [{ icon: Shield, title: "Verified Credentials", desc: [hasLicense() ? "license on file" : "", hasInsurance() ? "insurance carrier on file" : ""].filter(Boolean).join(" and ") }] : []),
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        breadcrumbJsonLd(breadcrumbs.map(item => ({ name: item.label, path: item.href }))),
                        localBusinessJsonLd({
                            areaServed: [
                                { "@type": "City", name: location.name },
                                ...location.neighborhoods.map(n => ({ "@type": "Place", name: n })),
                            ],
                        }),
                    ]),
                }}
            />
            <Breadcrumbs items={breadcrumbs} />
            {/* Hero */}
            <section style={{ background: "var(--hero-bg)", padding: "7rem 1.5rem 5rem", overflow: "hidden" }}>
                <div data-image-grid style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "2rem", alignItems: "center" }}>
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
                            src={siteConfig.locationImages[location.slug] || `/images/generated/locations/${location.slug}.png`}
                            alt={`Junk removal in ${location.name}, ${location.state}`}
                            collapseParentGrid
                            loading="eager"
                            style={{ width: "100%", maxWidth: 500, borderRadius: 16, objectFit: "cover", aspectRatio: "4/3", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}
                        />
                    </div>
                </div>
            </section>

            {/* About */}
            <section style={{ padding: "4rem 1.5rem", background: "var(--background)", borderBottom: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 800, margin: "0 auto" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1rem" }}>About Junk Removal in {location.name}</h2>
                    <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: "1.05rem", marginBottom: "1rem" }}>
                        {location.localInfo}
                    </p>
                    <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: "1.05rem", marginBottom: "1rem" }}>
                        Whether you&apos;re clearing out a garage, renovating a room, or handling an estate cleanout, {companyName} provides full-service junk removal in {location.name} and the surrounding {siteConfig.city} area. The crew handles loading, hauling, and cleanup so you do not have to lift a finger.
                    </p>
                    <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: "1.05rem" }}>
                        Usable or recyclable items are routed responsibly when local options are available. {location.neighborhoods.length > 0 && `We also serve nearby areas including ${location.neighborhoods.slice(0, 4).join(", ")}, and more.`}
                    </p>
                </div>
            </section>

            {/* Per-location service highlight — pulls from client's configured services
                so this paragraph differs across clients AND across neighborhoods. */}
            {location.serviceHighlight && (
                <section style={{ padding: "2rem 1.5rem", background: "var(--background)", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
                        <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: "1.05rem", fontStyle: "italic" }}>
                            {location.serviceHighlight}
                        </p>
                    </div>
                </section>
            )}

            {/* What We Haul Away — short summary linking to dedicated items page (avoids duplicate content across all location pages) */}
            <section style={{ padding: "3rem 1.5rem", background: "var(--card)", borderBottom: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
                    <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "1rem" }}>What We Haul Away in {location.name}</h2>
                    <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: "1.05rem", marginBottom: "1.25rem" }}>
                        Furniture, appliances, e-waste, yard waste, construction debris, and general junk — our crew handles it all in {location.name}, from single-item pickups to full property cleanouts.
                    </p>
                    <Link href="/items-we-take" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "var(--btn-radius)", background: "var(--background)", border: "2px solid var(--brand)", color: "var(--brand)", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none" }}>
                        See the full list of items we take in {location.name} →
                    </Link>
                </div>
            </section>

            {/* Pricing */}
            {siteConfig.pricing?.tiers?.length > 0 && (
                <section style={{ padding: "4rem 1.5rem", background: "var(--background)", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Junk Removal Pricing in {location.name}</h2>
                            <p style={{ color: "var(--muted)", fontSize: "1.05rem", marginTop: "0.75rem", maxWidth: 600, margin: "0.75rem auto 0" }}>
                                Pricing is based on the space your items take up in the truck. The crew confirms the final price before loading begins.
                            </p>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem" }}>
                            {siteConfig.pricing.tiers.filter(t => t.id !== "multi").map((tier) => (
                                <div key={tier.id} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "1.25rem", textAlign: "center", minWidth: 150, flex: "0 1 170px" }}>
                                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>{tier.label}</div>
                                    <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--foreground)" }}>${roundTo5(tier.min)} – ${roundTo5(tier.max)}</div>
                                </div>
                            ))}
                        </div>
                        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--muted)" }}>
                            Every job includes loading, hauling, disposal, and cleanup. <Link href="/pricing" style={{ color: "var(--brand)", fontWeight: 600 }}>See full pricing details</Link>.
                        </p>
                    </div>
                </section>
            )}

            {/* How It Works — short summary linking to dedicated page (avoids duplicate content across all location pages) */}
            <section style={{ padding: "3rem 1.5rem", background: "var(--card)", borderBottom: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
                    <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "1rem" }}>How Junk Removal Works in {location.name}</h2>
                    <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: "1.05rem", marginBottom: "1.25rem" }}>
                        Booking is a simple 3-step process: pick your date, we confirm, and the crew arrives in {location.name} to review the final price before loading begins. {isSameDayEnabled() ? "Same-day windows may be available when route capacity allows." : "Pickup windows depend on route availability."}
                    </p>
                    <Link href="/how-it-works" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "var(--btn-radius)", background: "var(--background)", border: "2px solid var(--brand)", color: "var(--brand)", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none" }}>
                        See how junk removal works step-by-step →
                    </Link>
                </div>
            </section>

            {/* Why Choose Us */}
            <section style={{ padding: "4rem 1.5rem", background: "var(--background)", borderBottom: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                        <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Why Choose {companyName} in {location.name}?</h2>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
                        {whyChoose.map((item) => (
                            <div key={item.title} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: "1.5rem" }}>
                                <item.icon size={28} color="var(--brand)" style={{ marginBottom: "0.75rem" }} />
                                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>{item.title}</h3>
                                <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
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
                            <Link key={svc.slug} href={isIndexableLocation ? `/locations/${location.slug}/${svc.slug}` : `/services/${svc.slug}`} style={{ padding: "2rem", background: "var(--background)", border: "1px solid var(--border)", borderRadius: 16, textDecoration: "none", color: "inherit", transition: "transform 0.2s" }}>
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
                        <Link href="/book" className="btn-primary" style={{ padding: "1rem 2rem", fontSize: "1rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}><Truck size={18} /> Book Junk Removal in {location.name}</Link>
                        <a href={telHref(phoneNumber)} style={{ padding: "1rem 2rem", borderRadius: "var(--btn-radius)", border: "2px solid #fff", color: "var(--hero-text)", textDecoration: "none", fontWeight: 700, fontSize: "1rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}><Phone size={18} /> {formatPhone(phoneNumber)}</a>
                    </div>
                </div>
            </section>
        </>
    );
}
