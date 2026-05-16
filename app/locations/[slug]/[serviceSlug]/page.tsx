import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BadgeDollarSign, MapPin, PackageCheck, Phone } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { breadcrumbJsonLd, createPageMetadata, faqPageJsonLd, serviceJsonLd } from "@/lib/seo";
import { formatPhone, hasConfiguredPricing, siteConfig, telHref } from "@/lib/siteConfig";
import { getClientServices, getServiceSynonyms } from "@/lib/serviceData";
import { getIndexableLocations, getLocationBySlug } from "@/lib/locationData.server";

type PageProps = {
    params: {
        slug: string;
        serviceSlug: string;
    };
};

export const dynamicParams = false;

export function generateStaticParams() {
    return getIndexableLocations().flatMap((location) =>
        getClientServices().map((service) => ({
            slug: location.slug,
            serviceSlug: service.slug,
        })),
    );
}

export function generateMetadata({ params }: PageProps): Metadata {
    const location = getIndexableLocations().find((entry) => entry.slug === params.slug);
    const service = getClientServices().find((entry) => entry.slug === params.serviceSlug);

    if (!location || !service) {
        return createPageMetadata({
            title: "Service Not Found",
            description: "This service location page is not available.",
            path: `/locations/${params.slug}/${params.serviceSlug}`,
            noIndex: true,
        });
    }

    return createPageMetadata({
        title: `${service.title} in ${location.name}`,
        description: `${service.title} in ${location.name}, ${location.state}. ${siteConfig.companyName} provides local junk hauling with online booking and final price confirmation before loading.`,
        path: `/locations/${location.slug}/${service.slug}`,
        image: siteConfig.serviceImages[service.slug] || siteConfig.locationImages[location.slug] || siteConfig.heroImageUrl,
        noIndex: true,
        follow: true,
    });
}

export default function ServiceLocationPage({ params }: PageProps) {
    const location = getIndexableLocations().find((entry) => entry.slug === params.slug);
    const service = getClientServices().find((entry) => entry.slug === params.serviceSlug);

    if (!location || !service) notFound();

    const activeLocation = getLocationBySlug(location.slug);
    const nearbyLocations = getIndexableLocations().filter((entry) => entry.slug !== location.slug).slice(0, 5);
    const synonyms = getServiceSynonyms(service).slice(0, 3);
    const configuredPricing = hasConfiguredPricing();
    const minPrice = siteConfig.pricing.tiers[0]?.min;
    const maxPrice = siteConfig.pricing.tiers[Math.min(2, siteConfig.pricing.tiers.length - 1)]?.max;
    const path = `/locations/${location.slug}/${service.slug}`;
    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Locations", href: "/locations" },
        { label: location.name, href: `/locations/${location.slug}` },
        { label: service.title, href: path },
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        breadcrumbJsonLd(breadcrumbs.map(item => ({ name: item.label, path: item.href }))),
                        serviceJsonLd({
                            service,
                            path,
                            areas: [location.name],
                            description: `${service.title} in ${location.name}, ${location.state} with online booking and final price confirmation before loading.`,
                        }),
                        faqPageJsonLd(service.faqs, path),
                    ]),
                }}
            />

            <Breadcrumbs items={breadcrumbs} />

            <section style={{ background: "var(--hero-bg)", padding: "5rem 1.5rem 4rem" }}>
                <div style={{ maxWidth: 1050, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "2rem", alignItems: "center" }}>
                    <div>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.4rem 0.85rem", borderRadius: "var(--btn-radius)", background: "var(--hero-badge-bg)", border: "1px solid var(--hero-badge-border)", color: "var(--brand)", fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1.25rem" }}>
                            <MapPin size={15} /> {location.name}, {location.state}
                        </span>
                        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)", lineHeight: 1.05, fontWeight: 900, color: "var(--hero-text)", marginBottom: "1.25rem" }}>
                            {service.title} in <span style={{ color: "var(--brand)" }}>{location.name}</span>
                        </h1>
                        <p style={{ color: "var(--hero-muted)", fontSize: "1.1rem", lineHeight: 1.75, maxWidth: 680 }}>
                            {siteConfig.companyName} provides {service.title.toLowerCase()} for customers in {location.name}. Use the booking flow with service type, load details, pickup address, access notes, schedule window, and quote review.
                        </p>
                        {synonyms.length > 0 && (
                            <p style={{ color: "var(--hero-muted)", fontSize: "0.98rem", lineHeight: 1.6, marginTop: "1rem" }}>
                                Also searched as: {synonyms.join(", ")}.
                            </p>
                        )}
                        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "2rem" }}>
                            <Link href="/book" className="btn-primary">
                                Book Now <ArrowRight size={18} />
                            </Link>
                            <a href={telHref(siteConfig.phoneNumber)} className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                                <Phone size={18} /> Call Us
                            </a>
                        </div>
                    </div>

                    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "1.5rem", boxShadow: "var(--shadow-soft)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                            <BadgeDollarSign size={24} style={{ color: "var(--brand)" }} />
                            <h2 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Pricing Snapshot</h2>
                        </div>
                        <p style={{ color: "var(--muted)", lineHeight: 1.65, marginBottom: "1rem" }}>
                            {configuredPricing && minPrice && maxPrice
                                ? `Smaller ${service.title.toLowerCase()} jobs may start near $${minPrice}. Larger pickups are quoted by volume and may fall around $${minPrice}-$${maxPrice} before any applicable surcharges.`
                                : `${service.title} pricing depends on volume, access, item weight, and local handling requirements. The crew confirms the final price before loading begins.`}
                        </p>
                        <Link href="/pricing" style={{ color: "var(--brand)", fontWeight: 800, textDecoration: "none" }}>
                            View pricing details <ArrowRight size={16} style={{ display: "inline", verticalAlign: "middle" }} />
                        </Link>
                    </div>
                </div>
            </section>

            <section style={{ padding: "4.5rem 1.5rem", background: "var(--background)" }}>
                <div style={{ maxWidth: 1050, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "2rem" }}>
                    <div>
                        <h2 className="section-title" style={{ marginBottom: "1rem" }}>{service.title} Details</h2>
                        <p style={{ color: "var(--muted)", lineHeight: 1.75, fontSize: "1.03rem", marginBottom: "2rem" }}>
                            {service.fullDesc} For {location.name}, service is scheduled based on route availability, access, item volume, and disposal requirements.
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
                            {service.items.slice(0, 6).map((item) => (
                                <div key={item.title} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "1.25rem" }}>
                                    <PackageCheck size={20} style={{ color: "var(--brand)", marginBottom: "0.75rem" }} />
                                    <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "0.4rem" }}>{item.title}</h3>
                                    <p style={{ color: "var(--muted)", fontSize: "0.92rem", lineHeight: 1.6 }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <aside style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "1.25rem" }}>
                            <h2 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "0.75rem" }}>Local Coverage</h2>
                            <p style={{ color: "var(--muted)", lineHeight: 1.6, fontSize: "0.93rem" }}>
                                {activeLocation?.localInfo || `${siteConfig.companyName} lists ${location.name} as a public service area. Appointment availability depends on the pickup address, item details, and schedule capacity.`}
                            </p>
                        </div>
                        {nearbyLocations.length > 0 && (
                            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "1.25rem" }}>
                                <h2 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "0.75rem" }}>Related Public Pages</h2>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                                    <Link href={`/services/${service.slug}`} style={{ color: "var(--brand)", fontWeight: 700, textDecoration: "none" }}>
                                        Main {service.title} page
                                    </Link>
                                    {nearbyLocations.map((nearby) => (
                                        <Link key={nearby.slug} href={`/locations/${nearby.slug}`} style={{ color: "var(--brand)", fontWeight: 700, textDecoration: "none" }}>
                                            Junk removal in {nearby.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </section>

            <section style={{ padding: "4.5rem 1.5rem", background: "var(--card)", borderTop: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 760, margin: "0 auto" }}>
                    <h2 className="section-title" style={{ textAlign: "center", marginBottom: "2rem" }}>
                        {service.title} Questions in {location.name}
                    </h2>
                    <div>
                        {service.faqs.map((faq) => (
                            <details key={faq.q} style={{ borderBottom: "1px solid var(--border)" }}>
                                <summary style={{ padding: "1.2rem 0", fontWeight: 700, cursor: "pointer" }}>{faq.q}</summary>
                                <div style={{ color: "var(--muted)", lineHeight: 1.7, paddingBottom: "1.2rem" }}>{faq.a}</div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
