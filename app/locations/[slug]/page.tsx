import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
    DispatchAreaSection,
    DispatchCardSection,
    DispatchFaqBoard,
    DispatchFinalCta,
    DispatchIntroGrid,
    DispatchLoadPricingCards,
    DispatchMetricStrip,
    DispatchPageHero,
    DispatchServiceMosaic,
} from "@/components/redesign/DispatchBlocks";
import { getLocationBySlug, getLocations } from "@/lib/locationData.server";
import { breadcrumbJsonLd, createPageMetadata, faqPageJsonLd, localBusinessJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";
import { resolveJunkRemovalImage } from "@/lib/templateAssets/junkRemoval";

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
        title: loc.isMainCity
            ? `Junk Removal Company Serving ${loc.name}, ${loc.state}`
            : `Junk Removal in ${loc.name}, ${loc.state}`,
        description: loc.metaDescription,
        path: `/locations/${loc.slug}`,
        image: resolveJunkRemovalImage({
            config: siteConfig,
            role: "locationNeighborhood",
            routeKey: `location-meta-${loc.slug}`,
            overrideSrc: siteConfig.locationImages?.[loc.slug],
            locationName: loc.name,
        }).src,
        noIndex: !loc.isMainCity && !loc.isExplicit,
        follow: true,
    });
}

export default function LocationDetailPage({ params }: { params: { slug: string } }) {
    const location = getLocationBySlug(params.slug);
    if (!location) notFound();

    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Locations", href: "/locations" },
        { label: `${location.name}, ${location.state}`, href: `/locations/${location.slug}` },
    ];
    const localAreaItems = [
        ...location.neighborhoods.map((name) => ({ eyebrow: "Neighborhood", title: name, desc: "Source-backed local reference for this page." })),
        ...location.landmarks.map((name) => ({ eyebrow: "Landmark", title: name, desc: "Source-backed local reference for this page." })),
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
                                location.name,
                                ...location.neighborhoods,
                            ],
                        }),
                        ...(location.faqs.length > 0 ? [faqPageJsonLd(location.faqs, `/locations/${location.slug}`)] : []),
                    ]),
                }}
            />
            <DispatchPageHero
                config={siteConfig}
                crumbs={[
                    { label: "Home", href: "/" },
                    { label: "Locations", href: "/locations" },
                    { label: location.name },
                ]}
                eyebrow="Location overview"
                title={<>Junk removal in {location.name}, {location.state}.</>}
                lede={location.heroDescription}
                coverageMap
                primaryCta={{ label: "Check my address", href: "/book" }}
                secondaryCta={{ label: "View service page", href: "/services/junk-removal" }}
            />
            <DispatchLoadPricingCards config={siteConfig} localLabel={location.name} />
            <DispatchMetricStrip
                items={[
                    { label: "Page type", value: location.isMainCity ? "Main city" : "Area" },
                    { label: "SEO status", value: location.isMainCity || location.isExplicit ? "Indexable" : "Noindex" },
                    { label: "Address", value: "Checked" },
                    { label: "Local facts", value: "Proof only" },
                ]}
            />
            <DispatchIntroGrid
                eyebrow="Local overview"
                heading={`${siteConfig.companyName} serves approved junk removal jobs in ${location.name}.`}
                boardEyebrow="Location details"
                boardHeading={`Coverage around ${location.name}.`}
                rows={[
                    { n: "01", title: location.isMainCity ? "Main city" : "Configured area", desc: `${location.name}, ${location.state}` },
                    { n: "02", title: "Pickup address", desc: "Confirmed during booking" },
                    { n: "03", title: "Nearby details", desc: location.hasSourcedLocalContent ? "Listed when available" : "Ask about exact coverage" },
                    { n: "04", title: "Service match", desc: "Routes depend on job details" },
                ]}
            >
                <p>{location.localInfo}</p>
                <p>
                    Book online with the pickup address, item list, photos when available, and access notes.
                    The final price is confirmed before loading begins.
                </p>
            </DispatchIntroGrid>
            <DispatchAreaSection config={siteConfig} />
            <DispatchServiceMosaic
                config={siteConfig}
                eyebrow="Available services"
                heading={`Services available in ${location.name}.`}
            />
            {localAreaItems.length > 0 && (
                <DispatchCardSection
                    eyebrow="Local signals"
                    heading={`Areas referenced for ${location.name}.`}
                    body="Neighborhoods and landmarks appear only when source-backed local content exists."
                    cards={localAreaItems}
                    variant="coverage-cards"
                    alt
                />
            )}
            {location.localFacts.length > 0 && (
                <DispatchCardSection
                    eyebrow="Source-backed notes"
                    heading="Local details should be earned."
                    body="These facts come from validated location content, not invented route claims."
                    cards={location.localFacts.map((fact) => ({ eyebrow: "Validated fact", title: location.name, desc: fact }))}
                    variant="fact-grid"
                />
            )}
            {location.faqs.length > 0 && (
                <DispatchFaqBoard
                    eyebrow="Location FAQ"
                    heading={`Questions about ${location.name}.`}
                    body="Location FAQs render only from safe default or source-backed local content."
                    items={location.faqs}
                />
            )}
            <DispatchFinalCta config={siteConfig} />
        </>
    );
}
