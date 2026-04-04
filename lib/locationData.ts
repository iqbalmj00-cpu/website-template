/**
 * locationData.ts — Auto-generates location page data from siteConfig.
 * Creates a dedicated page for the main city AND every neighborhood/area
 * listed in siteConfig.serviceArea (comma or semicolon separated).
 */

import { siteConfig } from "./siteConfig";

export interface LocationData {
    slug: string;
    name: string;
    state: string;
    isMainCity: boolean;
    metaTitle: string;
    metaDescription: string;
    heroBadge: string;
    heroDescription: string;
    neighborhoods: string[];
    localInfo: string;
    faqs: { q: string; a: string }[];
}

/** Parse serviceArea into individual neighborhood/city names */
function parseNeighborhoods(serviceArea: string, mainCity: string): string[] {
    if (!serviceArea) return [];

    // If serviceArea contains commas or semicolons, split them
    if (serviceArea.includes(",") || serviceArea.includes(";")) {
        return serviceArea
            .split(/[,;]+/)
            .map((s) => s.trim())
            .filter((s) => s.length > 0 && s.toLowerCase() !== mainCity.toLowerCase());
    }

    // If it's a single phrase like "Greater Dallas Fort-Worth Area", generate generic neighborhoods
    return [
        `Downtown ${mainCity}`,
        `North ${mainCity}`,
        `South ${mainCity}`,
        `East ${mainCity}`,
        `West ${mainCity}`,
    ];
}

function toSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

/** Build ALL location entries — main city + every neighborhood */
export function getLocations(): LocationData[] {
    const { city, state, serviceArea, companyName } = siteConfig;
    if (!city) return [];

    const neighborhoods = parseNeighborhoods(serviceArea, city);
    const allNeighborhoodNames = neighborhoods.length > 0 ? neighborhoods : [
        `Downtown ${city}`,
        `North ${city}`,
        `South ${city}`,
        `East ${city}`,
        `West ${city}`,
    ];

    // 1. Main city page
    const mainLocation: LocationData = {
        slug: toSlug(city),
        name: city,
        state,
        isMainCity: true,
        metaTitle: `Junk Removal in ${city}, ${state} | ${companyName}`,
        metaDescription: `Professional junk removal services in ${city}, ${state}. ${companyName} serves the ${serviceArea || city} area. Book your free estimate today.`,
        heroBadge: `Serving ${serviceArea || city}`,
        heroDescription: `Fast, professional junk removal across ${city} and the ${serviceArea || "surrounding"} area. We help you reclaim your space without lifting a finger.`,
        neighborhoods: allNeighborhoodNames,
        localInfo: `${companyName} is proud to serve the ${city}, ${state} community. We know the local neighborhoods, traffic patterns, and disposal regulations.`,
        faqs: [
            { q: `Do you offer same-day service in ${city}?`, a: `Yes! We frequently have same-day availability for ${city} residents. Call before 11 AM for the best chance of same-day pickup.` },
            { q: `What areas do you cover?`, a: `We cover all of ${city} and the greater ${serviceArea || city} area, including ${allNeighborhoodNames.slice(0, 4).join(", ")}, and more.` },
            { q: `How is pricing calculated?`, a: `Our pricing is based on volume — how much space your items take up in our truck. We provide free, no-obligation estimates before we start any work.` },
            { q: `Do you take construction debris?`, a: `Absolutely. We handle drywall, wood, tile, and other renovation debris.` },
            { q: `Do you donate usable items?`, a: `Yes! Items in good condition are donated to local charities. We provide donation receipts upon request.` },
        ],
    };

    // 2. Individual neighborhood pages — varied content per location
    const heroVariants = [
        (hood: string) => `Looking for junk removal near ${hood}? ${companyName} offers fast, same-day service throughout ${hood} and the surrounding ${city} area. From single-item pickups to full property cleanouts, we handle it all.`,
        (hood: string) => `${companyName} is the trusted junk removal team in ${hood}. We haul away furniture, appliances, yard waste, construction debris, and more — with upfront pricing and eco-friendly disposal.`,
        (hood: string) => `Need junk hauled away in ${hood}? ${companyName} provides reliable, affordable junk removal with same-day availability. Our crew handles loading, hauling, and cleanup so you don't have to.`,
        (hood: string) => `Reclaim your space with professional junk removal in ${hood}. ${companyName} serves homeowners and businesses across ${hood} and neighboring communities with fast, insured service.`,
        (hood: string) => `${hood} residents trust ${companyName} for hassle-free junk removal. We offer transparent volume-based pricing, same-day pickup, and responsible disposal with donation and recycling whenever possible.`,
    ];

    const localInfoVariants = [
        (hood: string, nearby: string[]) => `${companyName} proudly serves ${hood} and nearby areas including ${nearby.slice(0, 3).join(", ")}. Our local crew knows the area well and can navigate HOA requirements, gated communities, and narrow streets with ease.`,
        (hood: string, nearby: string[]) => `Our ${city}-based team provides junk removal across ${hood} and the surrounding neighborhoods of ${nearby.slice(0, 3).join(", ")}. We're familiar with local disposal regulations and recycling options to keep costs down.`,
        (hood: string, nearby: string[]) => `${companyName} operates throughout ${hood} and neighboring communities like ${nearby.slice(0, 3).join(", ")}. Whether you're decluttering, renovating, or moving, our insured crew gets the job done quickly.`,
        (hood: string, nearby: string[]) => `Serving ${hood} and the greater ${city} area, ${companyName} provides licensed and insured junk removal with a focus on responsible disposal. We donate usable items and recycle whenever possible.`,
    ];

    const neighborhoodPages: LocationData[] = allNeighborhoodNames.map((hood, idx) => {
        const nearby = allNeighborhoodNames.filter((n) => n !== hood);
        const heroFn = heroVariants[idx % heroVariants.length];
        const localFn = localInfoVariants[idx % localInfoVariants.length];

        return {
            slug: toSlug(hood),
            name: hood,
            state,
            isMainCity: false,
            metaTitle: `Junk Removal in ${hood}, ${state} | ${companyName}`,
            metaDescription: `Professional junk removal in ${hood}, ${state}. Fast, affordable, and eco-friendly service by ${companyName}. Book your free estimate.`,
            heroBadge: `Serving ${hood} & Surrounding Areas`,
            heroDescription: heroFn(hood),
            neighborhoods: nearby.slice(0, 6),
            localInfo: localFn(hood, nearby),
            faqs: [
                { q: `Do you offer junk removal near ${hood}?`, a: `Yes! ${hood} is one of our core service areas in ${city}. We're familiar with the neighborhoods and can typically offer same-day or next-day pickup. Book online or call us anytime.` },
                { q: `How fast can you get to ${hood}?`, a: `We usually have same-day availability for ${hood} and the surrounding ${city} area. Book online or call before noon for the best chance of a same-day pickup.` },
                { q: `What does junk removal cost in ${hood}?`, a: `Pricing is based on volume — how much space your items take up in our truck. Most jobs in ${hood} range from $${siteConfig.pricing?.tiers?.[0]?.min ?? 75} to $${siteConfig.pricing?.tiers?.[5]?.max ?? 800}. We'll give you a firm price before we start.` },
                { q: `Do you handle estate cleanouts in ${hood}?`, a: `Absolutely. We do full property cleanouts, garage cleanouts, and estate cleanouts throughout ${hood} and the greater ${city} area. Our crew handles everything from start to finish.` },
                { q: `What items can you haul away in ${hood}?`, a: `We remove furniture, appliances, mattresses, yard waste, construction debris, electronics, and much more. Visit our items we take page for the full list.` },
            ],
        };
    });

    return [mainLocation, ...neighborhoodPages];
}

export function getLocationBySlug(slug: string): LocationData | undefined {
    return getLocations().find((loc) => loc.slug === slug);
}
