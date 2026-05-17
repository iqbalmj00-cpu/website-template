import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/redesign/PageHero";
import StaticFAQ from "@/components/redesign/StaticFAQ";
import CtaBand from "@/components/redesign/CtaBand";
import { DispatchCardSection } from "@/components/redesign/DispatchBlocks";
import { breadcrumbJsonLd, createPageMetadata, faqPageJsonLd, serviceJsonLd } from "@/lib/seo";
import { hasConfiguredPricing, siteConfig } from "@/lib/siteConfig";
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

    const pricingCards = [
        {
            eyebrow: "Pricing snapshot",
            title: configuredPricing && minPrice && maxPrice ? `$${minPrice} - $${maxPrice}` : "Quote review",
            desc: configuredPricing && minPrice && maxPrice
                ? `Smaller ${service.title.toLowerCase()} jobs may start near $${minPrice}. Larger pickups are quoted by volume and may fall around $${minPrice}-$${maxPrice} before any applicable surcharges.`
                : `${service.title} pricing depends on volume, access, item weight, and local handling requirements. The crew confirms the final price before loading begins.`,
            href: "/pricing",
        },
    ];
    const serviceCards = service.items.slice(0, 6).map((item) => ({
        title: item.title,
        desc: item.desc,
    }));
    const localCards = [
        {
            title: "Local coverage",
            desc: activeLocation?.localInfo || `${siteConfig.companyName} lists ${location.name} as a public service area. Appointment availability depends on the pickup address, item details, and schedule capacity.`,
        },
        ...(synonyms.length > 0 ? [{
            title: "Related search terms",
            desc: `${service.title} in ${location.name} may also be searched as ${synonyms.join(", ")}.`,
        }] : []),
    ];
    const relatedCards = [
        {
            title: `Main ${service.title} page`,
            desc: `Review full ${service.title.toLowerCase()} details, accepted items, pricing factors, and common questions.`,
            href: `/services/${service.slug}`,
        },
        ...nearbyLocations.map((nearby) => ({
            title: `Junk removal in ${nearby.name}`,
            desc: `View the public location page for ${nearby.name}.`,
            href: `/locations/${nearby.slug}`,
        })),
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
            <PageHero
                crumbs={breadcrumbs}
                eyebrow={`${location.name}, ${location.state}`}
                titleStart={service.title}
                titleAccent={` in ${location.name}.`}
                lede={`${siteConfig.companyName} provides ${service.title.toLowerCase()} for customers in ${location.name}. Use the booking flow with service type, load details, pickup address, access notes, schedule window, and quote review.`}
                coverageMap
                coverageMapFocus={{ name: location.name, state: location.state }}
                primaryCta={{ label: "Book Now", href: "/book" }}
            />
            <DispatchCardSection
                eyebrow="Pricing"
                heading={`${service.title} pricing in ${location.name}.`}
                body="The planning range depends on configured pricing and the final quote is confirmed before loading begins."
                cards={pricingCards}
                variant="fact-grid"
            />
            <DispatchCardSection
                eyebrow="Service details"
                heading={`${service.title} details for ${location.name}.`}
                body={`${service.fullDesc} For ${location.name}, service is scheduled based on route availability, access, item volume, and disposal requirements.`}
                cards={serviceCards}
                variant="detail-grid"
                alt
            />
            <DispatchCardSection
                eyebrow="Local context"
                heading={`Coverage notes for ${location.name}.`}
                cards={localCards}
                variant="coverage-cards"
            />
            <DispatchCardSection
                eyebrow="Related pages"
                heading="Continue with the closest public pages."
                cards={relatedCards}
                variant="service-links"
                alt
            />
            <StaticFAQ eyebrow="Local FAQ" heading={`${service.title} questions in ${location.name}.`} items={service.faqs} />
            <CtaBand
                heading={{ lead: `Ready to book`, accent: `${service.title.toLowerCase()}?` }}
                lede={`Start with service type, load details, pickup address, access notes, schedule window, and quote review for ${location.name}.`}
            />
        </>
    );
}
