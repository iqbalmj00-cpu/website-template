import { getCostGuides } from "./costData";
import { getIndexableLocations } from "./locationData";
import { getClientServices } from "./serviceData";
import { isSameDayEnabled, siteConfig } from "./siteConfig";

export type KeywordIntentGroup =
    | "homepage-local-money"
    | "service"
    | "location"
    | "city-service"
    | "pricing-cost"
    | "comparison"
    | "commercial"
    | "item-guide"
    | "support";

export type KeywordOwner = {
    path: string;
    intentGroup: KeywordIntentGroup;
    primaryKeyword: string;
    secondaryKeywords: string[];
    indexable: boolean;
    notes?: string;
};

function cityKeyword(): string {
    return siteConfig.city;
}

function cityStateKeyword(): string {
    return siteConfig.state ? `${siteConfig.city} ${siteConfig.state}` : siteConfig.city;
}

function keyword(value: string): string {
    return value
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}

function serviceKeyword(serviceTitle: string): string {
    return keyword(`${serviceTitle} ${cityKeyword()}`);
}

export function getKeywordMap(): KeywordOwner[] {
    const city = cityKeyword();
    const services = getClientServices();
    const locations = getIndexableLocations();
    const costGuides = getCostGuides();

    const map: KeywordOwner[] = [
        {
            path: "/",
            intentGroup: "homepage-local-money",
            primaryKeyword: keyword(`junk removal ${city}`),
            secondaryKeywords: [
                keyword(`${siteConfig.city} junk removal`),
                keyword(`junk removal in ${city}`),
                keyword(`junk removal ${cityStateKeyword()}`),
                keyword(`junk removal near me ${siteConfig.city}`),
                keyword(`junk hauling ${city}`),
            ],
            indexable: true,
            notes: "Owns the broad local money term for the client's primary market.",
        },
        {
            path: "/services/junk-removal",
            intentGroup: "service",
            primaryKeyword: keyword(`full service junk removal ${city}`),
            secondaryKeywords: [
                keyword(`junk pickup ${city}`),
                keyword(`junk hauling service ${city}`),
                keyword(`trash removal ${city}`),
            ],
            indexable: true,
            notes: "Owns full-service junk removal details so the homepage can stay focused on the main local money term.",
        },
        {
            path: "/pricing",
            intentGroup: "pricing-cost",
            primaryKeyword: keyword(`junk removal prices ${city}`),
            secondaryKeywords: [
                keyword(`junk removal cost ${city}`),
                keyword(`how much does junk removal cost ${siteConfig.city}`),
                keyword(`affordable junk removal ${city}`),
            ],
            indexable: true,
        },
        {
            path: "/commercial",
            intentGroup: "commercial",
            primaryKeyword: keyword(`commercial junk removal ${city}`),
            secondaryKeywords: [
                keyword(`business junk removal ${city}`),
                keyword(`office cleanout ${city}`),
                keyword(`property management junk removal ${city}`),
                keyword(`construction debris removal ${city}`),
            ],
            indexable: true,
        },
        {
            path: "/best-junk-removal",
            intentGroup: "comparison",
            primaryKeyword: keyword(`best junk removal ${city}`),
            secondaryKeywords: [
                keyword(`compare junk removal companies ${city}`),
                keyword(`junk removal company guide ${siteConfig.city}`),
                keyword(`junk removal company reviews ${city}`),
            ],
            indexable: true,
            notes: "Must remain a buyer guide unless real proof supports stronger claims.",
        },
        {
            path: "/items-we-take",
            intentGroup: "item-guide",
            primaryKeyword: keyword(`what items junk removal takes ${siteConfig.city}`),
            secondaryKeywords: [
                keyword(`items junk removal accepts ${city}`),
                keyword(`junk removal items list ${city}`),
            ],
            indexable: true,
        },
        {
            path: "/items-we-dont-take",
            intentGroup: "item-guide",
            primaryKeyword: keyword(`what items junk removal will not take ${siteConfig.city}`),
            secondaryKeywords: [
                keyword(`hazardous items junk removal ${city}`),
                keyword(`junk removal restrictions ${city}`),
            ],
            indexable: true,
        },
        {
            path: "/junk-removal-vs-dumpster-rental",
            intentGroup: "comparison",
            primaryKeyword: keyword(`junk removal vs dumpster rental ${city}`),
            secondaryKeywords: [
                keyword(`dumpster rental or junk removal ${siteConfig.city}`),
                keyword(`full service junk removal vs dumpster ${city}`),
            ],
            indexable: siteConfig.offersDumpsterRental,
        },
        {
            path: "/same-day-junk-removal",
            intentGroup: "service",
            primaryKeyword: keyword(`same day junk removal ${city}`),
            secondaryKeywords: [
                keyword(`same day junk pickup ${city}`),
                keyword(`urgent junk removal ${siteConfig.city}`),
            ],
            indexable: isSameDayEnabled(),
        },
    ];

    for (const service of services) {
        if (service.slug === "junk-removal") continue;

        map.push({
            path: `/services/${service.slug}`,
            intentGroup: "service",
            primaryKeyword: serviceKeyword(service.title),
            secondaryKeywords: [
                keyword(`${service.title} near me ${siteConfig.city}`),
                keyword(`${service.title} cost ${city}`),
                ...((service.keywordSynonyms ?? []).slice(0, 3).map((term) => keyword(`${term} ${city}`))),
            ],
            indexable: true,
        });
    }

    for (const location of locations) {
        map.push({
            path: `/locations/${location.slug}`,
            intentGroup: "location",
            primaryKeyword: keyword(`junk removal ${location.name} ${location.state}`),
            secondaryKeywords: [
                keyword(`${location.name} junk removal`),
                keyword(`junk hauling ${location.name}`),
                keyword(`junk removal near me ${location.name}`),
            ],
            indexable: true,
        });
    }

    for (const guide of costGuides) {
        map.push({
            path: `/cost/${guide.slug}`,
            intentGroup: "pricing-cost",
            primaryKeyword: keyword(`${guide.title} ${city}`),
            secondaryKeywords: [
                keyword(`${guide.title} cost ${siteConfig.city}`),
                keyword(`${guide.title} price ${siteConfig.city}`),
            ],
            indexable: true,
        });
    }

    return map;
}

export function findDuplicateKeywordOwners(map = getKeywordMap()): Record<string, string[]> {
    const owners = new Map<string, string[]>();

    for (const entry of map.filter(item => item.indexable)) {
        const key = keyword(entry.primaryKeyword);
        owners.set(key, [...(owners.get(key) ?? []), entry.path]);
    }

    return Object.fromEntries(
        [...owners.entries()].filter(([, paths]) => paths.length > 1),
    );
}
