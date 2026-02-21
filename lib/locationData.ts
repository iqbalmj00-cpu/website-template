/**
 * locationData.ts — Auto-generates location page data from siteConfig.
 * Uses the client's city, state, and serviceArea to produce SEO-rich
 * location pages without requiring hand-written per-city content.
 */

import { siteConfig } from "./siteConfig";

export interface LocationData {
    slug: string;
    name: string;
    state: string;
    metaTitle: string;
    metaDescription: string;
    heroBadge: string;
    heroDescription: string;
    neighborhoods: string[];
    faqs: { q: string; a: string }[];
}

/** Build location entries from the client's siteConfig */
export function getLocations(): LocationData[] {
    const { city, state, serviceArea, companyName } = siteConfig;
    if (!city) return [];

    const mainLocation: LocationData = {
        slug: city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        name: city,
        state,
        metaTitle: `Junk Removal in ${city}, ${state} | ${companyName}`,
        metaDescription: `Professional junk removal services in ${city}, ${state}. ${companyName} serves the ${serviceArea || city} area. Book your free estimate today.`,
        heroBadge: `Serving ${serviceArea || city}`,
        heroDescription: `Fast, professional junk removal across ${city} and the ${serviceArea || "surrounding"} area. We help you reclaim your space without lifting a finger.`,
        neighborhoods: generateNeighborhoods(city, serviceArea),
        faqs: [
            { q: `Do you offer same-day service in ${city}?`, a: `Yes! We frequently have same-day availability for ${city} residents. Call before 11 AM for the best chance of same-day pickup.` },
            { q: `What areas do you cover?`, a: `We cover all of ${city} and the greater ${serviceArea || city} area. Contact us to confirm service in your neighborhood.` },
            { q: `How is pricing calculated?`, a: `Our pricing is based on volume — how much space your items take up in our truck. We provide free, no-obligation estimates before we start any work.` },
            { q: `Do you take construction debris?`, a: `Absolutely. We handle drywall, wood, tile, and other renovation debris. We just ask that it be bagged or piled for easy access.` },
            { q: `Do you donate usable items?`, a: `Yes! Items in good condition are donated to local charities. We provide donation receipts upon request.` },
        ],
    };

    return [mainLocation];
}

/** Generate plausible neighborhood names from serviceArea text */
function generateNeighborhoods(city: string, serviceArea: string): string[] {
    // If serviceArea contains commas or semicolons, split them as neighborhood names
    if (serviceArea && (serviceArea.includes(",") || serviceArea.includes(";"))) {
        return serviceArea
            .split(/[,;]+/)
            .map((s) => s.trim())
            .filter((s) => s.length > 0 && s.toLowerCase() !== city.toLowerCase());
    }

    // Otherwise provide generic neighborhood descriptions
    return [
        `Downtown ${city}`,
        `North ${city}`,
        `South ${city}`,
        `East ${city}`,
        `West ${city}`,
        "Surrounding Areas",
    ];
}

export function getLocationBySlug(slug: string): LocationData | undefined {
    return getLocations().find((loc) => loc.slug === slug);
}
