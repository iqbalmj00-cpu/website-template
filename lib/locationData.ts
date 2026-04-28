/**
 * locationData.ts — Auto-generates location page data from siteConfig.
 * Creates a dedicated page for the main city AND every neighborhood/area
 * listed in siteConfig.serviceArea (comma or semicolon separated).
 */

import { hasInsurance, hasLicense, isSameDayEnabled, siteConfig } from "./siteConfig";

export interface LocationData {
    slug: string;
    name: string;
    state: string;
    isMainCity: boolean;
    isExplicit: boolean;
    metaTitle: string;
    metaDescription: string;
    heroBadge: string;
    heroDescription: string;
    neighborhoods: string[];
    localInfo: string;
    /** Short, client-specific paragraph about which services are most common in this location.
     *  Pulls from siteConfig.services so each client's neighborhood pages render unique copy. */
    serviceHighlight?: string;
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
            .filter((s) => isQualityLocationName(s, mainCity));
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

function isQualityLocationName(name: string, mainCity: string): boolean {
    const normalized = name.trim().toLowerCase();
    if (!normalized || normalized === mainCity.trim().toLowerCase()) return false;
    if (normalized.length < 3 || normalized.length > 80) return false;

    const genericAreaNames = new Set([
        "your area",
        "near me",
        "nearby",
        "surrounding areas",
        "surrounding communities",
        "greater area",
        "metro area",
        "service area",
        "all areas",
        "all neighborhoods",
        "countywide",
        "citywide",
    ]);

    if (genericAreaNames.has(normalized)) return false;
    if (/^(north|south|east|west|central|downtown)\s+city$/.test(normalized)) return false;

    return true;
}

export function getExplicitServiceAreaLocations(): string[] {
    const { serviceArea, city } = siteConfig;
    if (!serviceArea || (!serviceArea.includes(",") && !serviceArea.includes(";"))) return [];
    return serviceArea
        .split(/[,;]+/)
        .map((s) => s.trim())
        .filter((s) => isQualityLocationName(s, city));
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
    const explicitNeighborhoods = getExplicitServiceAreaLocations();
    const explicitNeighborhoodSlugs = new Set(explicitNeighborhoods.map(toSlug));
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
        isExplicit: true,
        metaTitle: `Junk Removal in ${city}, ${state} | ${companyName}`,
        metaDescription: `Professional junk removal services in ${city}, ${state}. ${companyName} serves the ${serviceArea || city} area. Book your free estimate today.`,
        heroBadge: `Serving ${serviceArea || city}`,
        heroDescription: `Professional junk removal across ${city} and the ${serviceArea || "surrounding"} area. We help you clear unwanted items with upfront pricing and online booking.`,
        neighborhoods: allNeighborhoodNames,
        localInfo: `${companyName} serves the ${city}, ${state} community with junk removal for homes, businesses, moves, and cleanouts.`,
        faqs: [
            { q: `Do you offer same-day service in ${city}?`, a: isSameDayEnabled() ? `Same-day pickup may be available in ${city}. Call or book online early for the best availability.` : `Availability depends on the schedule. Book online or call to see the next open pickup window in ${city}.` },
            { q: `What areas do you cover?`, a: `We cover all of ${city} and the greater ${serviceArea || city} area, including ${allNeighborhoodNames.slice(0, 4).join(", ")}, and more.` },
            { q: `How is pricing calculated?`, a: `Our pricing is based on volume — how much space your items take up in our truck. We provide free, no-obligation estimates before we start any work.` },
            { q: `Do you take construction debris?`, a: `Absolutely. We handle drywall, wood, tile, and other renovation debris.` },
            { q: `Do you donate usable items?`, a: `Usable items may be routed for donation when a local option is available for the item and schedule.` },
        ],
    };

    // 2. Individual neighborhood pages — varied content per location.
    // Variant matrix (8 hero × 6 localInfo = 48 unique combinations) reduces
    // cross-client boilerplate that Google's Helpful Content System penalizes.
    const sameDayPhrase = isSameDayEnabled() ? "same-day or next-day" : "scheduled";
    const credentialPhrase = [
        hasLicense() ? "licensed" : "",
        hasInsurance() ? "insured" : "",
    ].filter(Boolean).join(" and ");
    const crewPhrase = credentialPhrase ? `${credentialPhrase} crew` : "local crew";

    const heroVariants = [
        (hood: string) => `Looking for junk removal near ${hood}? ${companyName} offers professional service throughout ${hood} and the surrounding ${city} area. From single-item pickups to full property cleanouts, we handle the loading and hauling.`,
        (hood: string) => `${companyName} provides junk removal in ${hood}. We haul away furniture, appliances, yard waste, construction debris, and more with upfront pricing before work begins.`,
        (hood: string) => `Need junk hauled away in ${hood}? ${companyName} provides reliable junk removal with online booking and clear arrival windows. Our crew handles loading, hauling, and cleanup so you don't have to.`,
        (hood: string) => `Reclaim your space with professional junk removal in ${hood}. ${companyName} serves homeowners and businesses across ${hood} and neighboring communities with a ${crewPhrase}.`,
        (hood: string) => `${hood} residents can book ${companyName} for furniture, appliance, yard waste, and cleanout pickups with transparent volume-based pricing.`,
        (hood: string) => `Serving ${hood} with ${sameDayPhrase} junk hauling, full-service cleanouts, and small single-item pickups. ${companyName} keeps the process simple from booking to final sweep-up.`,
        (hood: string) => `From garage cleanouts to estate clearances, ${companyName} handles junk removal in ${hood} with careful loading, transparent pricing, and a quote before work starts.`,
        (hood: string) => `${companyName} brings full-service junk removal to ${hood} with clear pricing before loading and cleanup after the truck is loaded. Usable or recyclable items are routed responsibly when local options are available.`,
    ];

    const localInfoVariants = [
        (hood: string, nearby: string[]) => `${companyName} proudly serves ${hood} and nearby areas including ${nearby.slice(0, 3).join(", ")}. Our local crew knows the area well and can navigate HOA requirements, gated communities, and narrow streets with ease.`,
        (hood: string, nearby: string[]) => `Our ${city}-based team provides junk removal across ${hood} and the surrounding neighborhoods of ${nearby.slice(0, 3).join(", ")}. We review access, volume, and disposal needs before quoting the job.`,
        (hood: string, nearby: string[]) => `${companyName} operates throughout ${hood} and neighboring communities like ${nearby.slice(0, 3).join(", ")}. Whether you're decluttering, renovating, or moving, our ${crewPhrase} handles the heavy lifting.`,
        (hood: string, nearby: string[]) => `Serving ${hood} and the greater ${city} area, ${companyName} provides junk removal with a focus on clear pricing, careful handling, and responsible disposal options when available.`,
        (hood: string, nearby: string[]) => `Routes through ${hood} and nearby ${nearby.slice(0, 3).join(", ")} run regularly throughout the week, making it easy to find a pickup window in this part of ${city}.`,
        (hood: string, nearby: string[]) => `${companyName} serves ${hood} and the broader ${city} community with single-item pickups, cleanouts, and post-job cleanup after the truck is loaded.`,
    ];

    // Per-neighborhood "service highlight" variants — uses client-specific
    // services from siteConfig so EVERY client's neighborhood pages differ
    // from every other client's. 6 framings × N services per client = high uniqueness.
    const serviceHighlightVariants = [
        (hood: string, topServices: string[]) => `Most common requests in ${hood}: ${topServices.slice(0, 3).join(", ")}. Whatever's filling up your space, we can handle it.`,
        (hood: string, topServices: string[]) => `${hood} customers most often book us for ${topServices.slice(0, 3).join(", ")} — though we do everything else on our service list too.`,
        (hood: string, topServices: string[]) => `In ${hood}, we get a lot of calls for ${topServices.slice(0, 3).join(", ")}. Our crew comes prepared for any job — small or large.`,
        (hood: string, topServices: string[]) => `Top services in ${hood}: ${topServices.slice(0, 3).join(", ")}. We bring the right truck, the right crew, and the right tools for every pickup.`,
        (hood: string, topServices: string[]) => `From ${topServices.slice(0, 3).join(" to ")}, our ${hood} pickups cover the full range. One crew, one truck, one upfront price.`,
        (hood: string, topServices: string[]) => `Our ${hood} job mix runs heavy on ${topServices.slice(0, 3).join(", ")}, but we're equipped for anything our service list covers.`,
    ];

    const neighborhoodPages: LocationData[] = allNeighborhoodNames.map((hood, idx) => {
        const nearby = allNeighborhoodNames.filter((n) => n !== hood);
        const heroFn = heroVariants[idx % heroVariants.length];
        const localFn = localInfoVariants[idx % localInfoVariants.length];
        const highlightFn = serviceHighlightVariants[idx % serviceHighlightVariants.length];
        // Use the client's actual configured services so each client's pages differ
        const topServices = (siteConfig.services && siteConfig.services.length > 0)
            ? siteConfig.services
            : ["junk removal", "furniture removal", "appliance removal"];

        return {
            slug: toSlug(hood),
            name: hood,
            state,
            isMainCity: false,
            isExplicit: explicitNeighborhoodSlugs.has(toSlug(hood)),
            metaTitle: `Junk Removal in ${hood}, ${state} | ${companyName}`,
            metaDescription: `Professional junk removal in ${hood}, ${state}. Clear pricing, online booking, and full-service hauling by ${companyName}.`,
            heroBadge: `Serving ${hood} & Surrounding Areas`,
            heroDescription: heroFn(hood),
            neighborhoods: nearby.slice(0, 6),
            localInfo: localFn(hood, nearby),
            serviceHighlight: highlightFn(hood, topServices),
            faqs: [
                { q: `Do you offer junk removal near ${hood}?`, a: `Yes. ${hood} is listed in our ${city} service area. Book online or call to check the next available pickup window.` },
                { q: `How fast can you get to ${hood}?`, a: isSameDayEnabled() ? `Same-day or next-day windows may be available for ${hood}. Book online or call early for the best availability.` : `Availability depends on the route schedule. Book online or call to see the next open pickup window for ${hood}.` },
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

export function getIndexableLocations(): LocationData[] {
    return getLocations().filter(location => location.isMainCity || location.isExplicit);
}
