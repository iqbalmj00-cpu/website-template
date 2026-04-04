import Link from "next/link";
import { siteConfig, formatPhone, telHref, roundTo5 } from "@/lib/siteConfig";
import SafeImage from "@/components/SafeImage";
import { getLocations, getLocationBySlug } from "@/lib/locationData";
import { getClientServices } from "@/lib/serviceData";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ServiceIcon from "@/components/ServiceIcon";
import { MapPin, Truck, Phone, CheckCircle, Shield, Clock, Leaf, Recycle, Armchair, Plug, TreePine, HardHat, Monitor, Package } from "lucide-react";

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
            {/* JSON-LD: FAQPage */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        mainEntity: location.faqs.map((faq: { q: string; a: string }) => ({
                            "@type": "Question",
                            name: faq.q,
                            acceptedAnswer: { "@type": "Answer", text: faq.a },
                        })),
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
                    <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: "1.05rem", marginBottom: "1rem" }}>
                        {location.localInfo}
                    </p>
                    <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: "1.05rem", marginBottom: "1rem" }}>
                        Whether you&apos;re clearing out a garage, renovating a room, or handling an estate cleanout, {companyName} provides full-service junk removal in {location.name} and the surrounding {siteConfig.city} area. Our licensed and insured crew handles everything — loading, hauling, and cleanup — so you don&apos;t have to lift a finger.
                    </p>
                    <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: "1.05rem" }}>
                        We proudly donate reusable items to local charities and recycle materials whenever possible, keeping as much as we can out of the landfill. {location.neighborhoods.length > 0 && `We also serve nearby areas including ${location.neighborhoods.slice(0, 4).join(", ")}, and more.`}
                    </p>
                </div>
            </section>

            {/* What We Haul Away */}
            <section style={{ padding: "4rem 1.5rem", background: "var(--card)", borderBottom: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                        <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>What We Haul Away in {location.name}</h2>
                        <p style={{ color: "var(--muted)", fontSize: "1.05rem", marginTop: "0.75rem", maxWidth: 600, margin: "0.75rem auto 0" }}>
                            From a single piece of furniture to a full property cleanout, our crew handles it all. Here&apos;s what we commonly pick up in {location.name}.
                        </p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
                        {[
                            { icon: Armchair, title: "Furniture Removal", items: ["Sofas & couches", "Mattresses & box springs", "Tables & chairs", "Dressers & bookshelves", "Patio furniture"] },
                            { icon: Plug, title: "Appliance Removal", items: ["Refrigerators & freezers", "Washers & dryers", "Ovens & dishwashers", "Water heaters", "A/C units"] },
                            { icon: TreePine, title: "Yard Waste Removal", items: ["Branches & tree limbs", "Soil & sod", "Fencing & lattice", "Swing sets & trampolines", "Hot tub removal"] },
                            { icon: HardHat, title: "Construction Debris", items: ["Drywall & lumber", "Tile & carpet", "Roofing shingles", "Concrete (small amounts)", "Renovation debris"] },
                            { icon: Monitor, title: "Electronics & E-Waste", items: ["TVs & monitors", "Computers & printers", "Speakers & stereos", "Gaming consoles", "Cables & peripherals"] },
                            { icon: Package, title: "General Junk", items: ["Boxes & packing materials", "Exercise equipment", "Tires & bikes", "Old paint cans (dried)", "Books & clothing"] },
                        ].map((cat) => (
                            <div key={cat.title} style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: 16, padding: "1.5rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                                    <cat.icon size={24} color="var(--brand)" />
                                    <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>{cat.title}</h3>
                                </div>
                                <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--muted)", lineHeight: 1.8, fontSize: "0.9rem" }}>
                                    {cat.items.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--muted)" }}>
                        Not sure if we can take it? <Link href="/items-we-take" style={{ color: "var(--brand)", fontWeight: 600 }}>See the full list</Link> or <a href={telHref(phoneNumber)} style={{ color: "var(--brand)", fontWeight: 600 }}>call us</a> — we&apos;re happy to help.
                    </p>
                </div>
            </section>

            {/* Pricing */}
            {siteConfig.pricing?.tiers?.length > 0 && (
                <section style={{ padding: "4rem 1.5rem", background: "var(--background)", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Junk Removal Pricing in {location.name}</h2>
                            <p style={{ color: "var(--muted)", fontSize: "1.05rem", marginTop: "0.75rem", maxWidth: 600, margin: "0.75rem auto 0" }}>
                                Our pricing is simple — you only pay for the space your items take up in our truck. No hidden fees, no surprises.
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

            {/* How It Works */}
            <section style={{ padding: "4rem 1.5rem", background: "var(--card)", borderBottom: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 900, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                        <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>How Junk Removal Works in {location.name}</h2>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "2rem" }}>
                        {[
                            { step: "1", title: "Book Your Pickup", desc: `Schedule online in minutes or call ${formatPhone(phoneNumber)}. Pick a date and time that works for you — same-day service is often available in ${location.name}.` },
                            { step: "2", title: "We Confirm", desc: "Our team reviews your booking and confirms your appointment. You'll receive a confirmation with your date, time window, and estimated price range." },
                            { step: "3", title: "We Show Up & Haul", desc: `Our insured crew arrives on time, confirms the final price, and handles everything — loading, hauling, sweeping up, and responsible disposal. You don't lift a finger.` },
                        ].map((s) => (
                            <div key={s.step} style={{ textAlign: "center" }}>
                                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--brand)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: 800, margin: "0 auto 1rem" }}>{s.step}</div>
                                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>{s.title}</h3>
                                <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section style={{ padding: "4rem 1.5rem", background: "var(--background)", borderBottom: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                        <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Why Choose {companyName} in {location.name}?</h2>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
                        {[
                            { icon: CheckCircle, title: "Upfront Pricing", desc: `No hidden fees or surprise charges. We give you a firm price before we start any work in ${location.name}. What we quote is what you pay.` },
                            { icon: Clock, title: "Same-Day Service", desc: `Need junk removed today? We frequently have same-day availability in ${location.name} and the surrounding ${siteConfig.city} area. Book before noon for the best chance.` },
                            { icon: Recycle, title: "Eco-Friendly Disposal", desc: "We donate usable items to local charities and recycle materials whenever possible. We're committed to keeping as much as we can out of the landfill." },
                            { icon: Shield, title: "Licensed & Insured", desc: `${companyName} is fully licensed and insured, so you have zero liability when we work on your property. Your home and belongings are protected.` },
                        ].map((item) => (
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
