/**
 * locationData.ts — Builds location page data from dashboard-provided config
 * plus optional source-backed local facts.
 *
 * The template must not invent neighborhoods, routes, local job trends, or
 * city-specific operational claims. Optional local facts come from
 * LOCATION_CONTENT_JSON or .generated/sourced-location-content.json and are
 * rendered only when they include source URLs in the validated data.
 */

import { hasConfiguredPricing, isSameDayEnabled, siteConfig } from "./siteConfig";

export type LocationSourcedContent = {
    intro?: string;
    localFacts: string[];
    neighborhoods: string[];
    districts: string[];
    landmarks: string[];
    faqs: { q: string; a: string }[];
};

export type LocationSourcedContentResolver = (slug: string) => LocationSourcedContent | null;

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
    districts: string[];
    landmarks: string[];
    localFacts: string[];
    localInfo: string;
    serviceHighlight?: string;
    faqs: { q: string; a: string }[];
    hasSourcedLocalContent: boolean;
}

function toSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

function unique(values: string[]): string[] {
    const seen = new Set<string>();
    const result: string[] = [];

    for (const value of values) {
        const clean = value.replace(/\s+/g, " ").trim();
        const key = clean.toLowerCase();
        if (!clean || seen.has(key)) continue;
        seen.add(key);
        result.push(clean);
    }

    return result;
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

function getConfiguredServiceAreaLocations(): string[] {
    const { serviceArea, city } = siteConfig;
    if (!serviceArea || (!serviceArea.includes(",") && !serviceArea.includes(";"))) return [];

    return unique(
        serviceArea
            .split(/[,;]+/)
            .map((area) => area.trim())
            .filter((area) => isQualityLocationName(area, city)),
    );
}

export function getExplicitServiceAreaLocations(): string[] {
    return getConfiguredServiceAreaLocations();
}

function formatLocation(name: string, state: string): string {
    return state ? `${name}, ${state}` : name;
}

function formatShortList(values: string[], fallback: string): string {
    if (values.length === 0) return fallback;
    if (values.length === 1) return values[0];
    if (values.length === 2) return `${values[0]} and ${values[1]}`;
    return `${values.slice(0, 2).join(", ")}, and ${values.length - 2} more`;
}

function serviceSummary(locationName: string): string {
    const services = siteConfig.services.length > 0
        ? siteConfig.services.slice(0, 4)
        : ["junk removal", "furniture removal", "appliance removal", "cleanouts"];

    return `Services available in ${locationName} include ${formatShortList(services, "junk removal")} and other approved item pickups listed on this site.`;
}

function buildSafeFaqs(locationName: string, state: string): { q: string; a: string }[] {
    const locationLabel = formatLocation(locationName, state);
    const firstTier = siteConfig.pricing?.tiers?.[0];
    const lastTier = siteConfig.pricing?.tiers?.[siteConfig.pricing.tiers.length - 1];
    const priceRange = hasConfiguredPricing() && firstTier && lastTier
        ? ` Published pricing currently starts around $${firstTier.min} and larger loads can reach $${lastTier.max} before any enabled surcharges.`
        : "";

    return [
        {
            q: `Do you offer junk removal in ${locationName}?`,
            a: `${locationLabel} is listed as a service area for ${siteConfig.companyName}. Use the booking flow or call to confirm the pickup address, available windows, and item details.`,
        },
        {
            q: `How is pricing calculated for ${locationName}?`,
            a: `Pricing is based on item volume, access, weight, and any enabled disposal or handling surcharges.${priceRange} The final price is confirmed before loading begins.`,
        },
        {
            q: `What items can be picked up in ${locationName}?`,
            a: "Common accepted categories include furniture, appliances, mattresses, yard debris, renovation debris, and mixed household junk. Hazardous or restricted materials are not accepted.",
        },
        {
            q: `Can I book same-day junk removal in ${locationName}?`,
            a: isSameDayEnabled()
                ? `Same-day pickup may be available in ${locationName} when schedule capacity allows. Book early or call to check open windows.`
                : `Pickup windows in ${locationName} depend on schedule availability. Use the booking flow or call to see the next open appointment.`,
        },
    ];
}

function buildLocationEntry(
    name: string,
    isMainCity: boolean,
    configuredServiceAreas: string[],
    resolveSourcedContent?: LocationSourcedContentResolver,
): LocationData {
    const { city, state, companyName } = siteConfig;
    const slug = toSlug(name);
    const sourced = resolveSourcedContent?.(slug) ?? null;
    const locationLabel = formatLocation(name, state);
    const configuredAreas = configuredServiceAreas.filter((area) => toSlug(area) !== slug);
    const areaText = configuredAreas.length > 0 ? ` and nearby service areas including ${formatShortList(configuredAreas, "")}` : "";
    const sourcedAreas = unique([
        ...(sourced?.neighborhoods ?? []),
        ...(sourced?.districts ?? []),
    ]);
    const safeIntro = `${companyName} provides junk removal service in ${locationLabel}. Use the booking flow or call to confirm pickup timing, item details, and the final price before loading begins.`;
    const localInfo = sourced?.intro || safeIntro;
    const hasSourcedLocalContent = Boolean(
        sourced?.intro
        || sourcedAreas.length > 0
        || sourced?.landmarks.length
        || sourced?.localFacts.length
        || sourced?.faqs.length,
    );

    return {
        slug,
        name,
        state,
        isMainCity,
        isExplicit: isMainCity || configuredServiceAreas.some((area) => toSlug(area) === slug),
        metaTitle: `Junk Removal in ${locationLabel} | ${companyName}`,
        metaDescription: `Professional junk removal in ${locationLabel} from ${companyName}. Book Now for furniture, appliance, cleanout, and debris hauling.`,
        heroBadge: isMainCity
            ? unique([city, ...configuredServiceAreas]).join(", ")
            : name,
        heroDescription: isMainCity
            ? `Professional junk removal in ${formatLocation(city, state)}${areaText}. Get clear pricing before loading begins and book online when you are ready.`
            : `Professional junk removal in ${locationLabel}. ${companyName} handles approved item pickups, cleanouts, and debris hauling with the final price confirmed before loading begins.`,
        neighborhoods: sourcedAreas,
        districts: sourced?.districts ?? [],
        landmarks: sourced?.landmarks ?? [],
        localFacts: sourced?.localFacts ?? [],
        localInfo,
        serviceHighlight: serviceSummary(name),
        faqs: [
            ...buildSafeFaqs(name, state),
            ...(sourced?.faqs.map((faq) => ({ q: faq.q, a: faq.a })) ?? []),
        ],
        hasSourcedLocalContent,
    };
}

/** Build location entries from the configured main city and explicit service-area list. */
export function buildLocations(resolveSourcedContent?: LocationSourcedContentResolver): LocationData[] {
    const { city } = siteConfig;
    if (!city) return [];

    const configuredServiceAreas = getConfiguredServiceAreaLocations();
    const locationNames = unique([city, ...configuredServiceAreas]);

    return locationNames.map((name) => buildLocationEntry(name, toSlug(name) === toSlug(city), configuredServiceAreas, resolveSourcedContent));
}

export function getLocations(): LocationData[] {
    return buildLocations();
}

export function getLocationBySlug(slug: string): LocationData | undefined {
    return getLocations().find((loc) => loc.slug === slug);
}

export function getIndexableLocations(): LocationData[] {
    return getLocations().filter(location => location.isMainCity || location.isExplicit);
}
