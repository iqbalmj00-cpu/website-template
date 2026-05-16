import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import PageHero from "@/components/redesign/PageHero";
import PageIntro from "@/components/redesign/PageIntro";
import RelatedSvc from "@/components/redesign/RelatedSvc";
import PricingTeaser from "@/components/redesign/PricingTeaser";
import PricingTierCards from "@/components/redesign/PricingTierCards";
import NearbyAreas from "@/components/redesign/NearbyAreas";
import CtaBand from "@/components/redesign/CtaBand";
import { getLocationBySlug, getLocations } from "@/lib/locationData.server";
import { breadcrumbJsonLd, createPageMetadata, faqPageJsonLd, localBusinessJsonLd } from "@/lib/seo";
import { hasConfiguredPricing, siteConfig } from "@/lib/siteConfig";
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
        ...location.neighborhoods.map((name) => ({ type: "Neighborhood", name })),
        ...location.landmarks.map((name) => ({ type: "Landmark", name })),
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
            <PageHero
                crumbs={[
                    { label: "Home", href: "/" },
                    { label: "Locations", href: "/locations" },
                    { label: location.name },
                ]}
                titleStart="Junk removal in "
                titleAccent={`${location.name}, ${location.state}.`}
                lede={location.heroDescription}
                media={{
                    role: "locationNeighborhood",
                    src: siteConfig.locationImages?.[location.slug],
                    routeKey: `location-${location.slug}`,
                    locationName: location.name,
                    caption: "Local coverage",
                }}
            />
            {hasConfiguredPricing(siteConfig) && (
                <section className="bg-paper px-[clamp(20px,4vw,64px)] py-10 border-b border-line">
                    <div className="mx-auto" style={{ maxWidth: 1180 }}>
                        <div className="mb-5 flex flex-col gap-2">
                            <div className="eyebrow">Configured load pricing</div>
                            <h2 className="font-display text-[clamp(28px,3.4vw,40px)] font-extrabold leading-tight text-ink">
                                Review the common load ranges before booking in {location.name}.
                            </h2>
                        </div>
                        <PricingTierCards config={siteConfig} limit={4} compact />
                    </div>
                </section>
            )}
            <PageIntro
                eyebrow="Local overview"
                headline={`${siteConfig.companyName} serves approved junk removal jobs in ${location.name}.`}
                body={
                    <>
                        <p>{location.localInfo}</p>
                        <p>
                            Book online with the pickup address, item list, photos when available, and access notes.
                            The final price is confirmed before loading begins.
                        </p>
                    </>
                }
                rightEyebrow="Location details"
                rightHeading={`Coverage around ${location.name}`}
                rightRows={[
                    { n: "01", t: location.isMainCity ? "Main city" : "Configured area", d: `${location.name}, ${location.state}` },
                    { n: "02", t: "Pickup address", d: "Confirmed during booking" },
                    { n: "03", t: "Nearby details", d: location.hasSourcedLocalContent ? "Listed when available" : "Ask about exact coverage" },
                ]}
            />
            {localAreaItems.length > 0 && (
                <section className="bg-paper-2 py-[100px] px-[clamp(20px,4vw,64px)]">
                    <div className="mx-auto" style={{ maxWidth: 1180 }}>
                        <div className="mb-9 text-center">
                            <div className="eyebrow inline-flex">Local signals</div>
                            <h2 className="mt-3 font-display text-[clamp(34px,4.5vw,52px)] font-extrabold leading-[1.03] tracking-normal text-ink">
                                Areas referenced for {location.name}.
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {localAreaItems.map((item) => (
                                <div key={`${item.type}-${item.name}`} className="flex items-center gap-3 rounded-[14px] border border-line bg-paper p-5">
                                    <MapPin className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                                    <div>
                                        <div className="font-display text-[17px] font-bold text-ink">{item.name}</div>
                                        <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{item.type}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
            {location.localFacts.length > 0 && (
                <section className="bg-paper py-[100px] px-[clamp(20px,4vw,64px)] border-y border-line">
                    <div className="mx-auto" style={{ maxWidth: 980 }}>
                        <div className="mb-7 text-center">
                            <div className="eyebrow inline-flex">Source-backed notes</div>
                            <h2 className="mt-3 font-display text-[clamp(34px,4.5vw,52px)] font-extrabold leading-[1.03] tracking-normal text-ink">
                                Local details used for this page.
                            </h2>
                        </div>
                        <div className="grid gap-3">
                            {location.localFacts.map((fact) => (
                                <p key={fact} className="rounded-[14px] border border-line bg-paper-2 p-5 text-[15.5px] leading-[1.6] text-muted">
                                    {fact}
                                </p>
                            ))}
                        </div>
                    </div>
                </section>
            )}
            <RelatedSvc eyebrow="Available services" heading={`Services available in ${location.name}.`} />
            <PricingTeaser />
            {location.faqs.length > 0 && (
                <section className="bg-paper-2 py-[100px] px-[clamp(20px,4vw,64px)]">
                    <div className="mx-auto" style={{ maxWidth: 980 }}>
                        <div className="mb-7 text-center">
                            <div className="eyebrow inline-flex">Location FAQ</div>
                            <h2 className="mt-3 font-display text-[clamp(34px,4.5vw,52px)] font-extrabold leading-[1.03] tracking-normal text-ink">
                                Questions about {location.name}.
                            </h2>
                        </div>
                        <div className="overflow-hidden rounded-[14px] border border-line bg-paper">
                            {location.faqs.map((faq) => (
                                <details key={faq.q} className="border-b border-line last:border-b-0">
                                    <summary className="cursor-pointer px-6 py-5 font-display text-[19px] font-semibold text-ink">
                                        {faq.q}
                                    </summary>
                                    <div className="px-6 pb-6 text-[15.5px] leading-[1.6] text-muted">{faq.a}</div>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>
            )}
            <NearbyAreas currentSlug={location.slug} heading={`Other configured areas near ${siteConfig.city}.`} />
            <CtaBand />
        </>
    );
}
