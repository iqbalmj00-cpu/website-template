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

    // 2. Individual neighborhood pages
    const neighborhoodPages: LocationData[] = allNeighborhoodNames.map((hood) => {
        // Other neighborhoods to show on this page (exclude current)
        const nearby = allNeighborhoodNames.filter((n) => n !== hood);

        return {
            slug: toSlug(hood),
            name: hood,
            state,
            isMainCity: false,
            metaTitle: `Junk Removal in ${hood}, ${state} | ${companyName}`,
            metaDescription: `Professional junk removal in ${hood}, ${state}. Fast, affordable, and eco-friendly service by ${companyName}. Book your free estimate.`,
            heroBadge: `Serving ${hood} & Surrounding Areas`,
            heroDescription: `Need junk removed in ${hood}? ${companyName} provides fast, reliable junk removal. We handle furniture, appliances, yard waste, construction debris, and full property cleanouts.`,
            neighborhoods: nearby.slice(0, 6),
            localInfo: `${companyName} proudly serves ${hood} and the surrounding ${city} area. Our local crew knows the area well and can navigate HOA requirements, gated communities, and narrow streets with ease.`,
            faqs: [
                { q: `Do you serve ${hood}?`, a: `Yes! ${hood} is one of our core service areas. We're familiar with the neighborhoods and can typically offer same-day or next-day service.` },
                { q: `How fast can you get to ${hood}?`, a: `We usually have same-day availability for ${hood}. Book online or call before noon for the best chance of a same-day pickup.` },
                { q: `What does junk removal cost in ${hood}?`, a: `Pricing is based on volume — how much space your items take up in our truck. We'll give you a firm price before we start. No surprises.` },
                { q: `Do you handle estate cleanouts in ${hood}?`, a: `Absolutely. We do full property cleanouts, garage cleanouts, and estate cleanouts throughout the ${city} area including ${hood}.` },
            ],
        };
    });

    return [mainLocation, ...neighborhoodPages];
}

export function getLocationBySlug(slug: string): LocationData | undefined {
    return getLocations().find((loc) => loc.slug === slug);
}
