import type { Metadata } from "next";
import { absoluteUrl, getServiceAreas, getSiteBaseUrl, hasConfiguredPricing, siteConfig } from "@/lib/siteConfig";
import type { ServiceDetail } from "@/lib/serviceData";
import { setupMetadataText, shouldForceNoIndex } from "@/lib/publicSiteGuard";

export const SEO_CONTENT_LAST_MODIFIED = new Date("2026-05-10");
export const BUSINESS_SCHEMA_ID = `${getSiteBaseUrl()}/#business`;

type MetadataInput = {
    title: string;
    description: string;
    path: string;
    canonicalPath?: string;
    image?: string | null;
    noIndex?: boolean;
    follow?: boolean;
};

type BreadcrumbItem = {
    name: string;
    path: string;
};

function stripUndefined(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.map(stripUndefined).filter(item => item !== undefined);
    }

    if (value && typeof value === "object") {
        const entries = Object.entries(value as Record<string, unknown>)
            .map(([key, entry]) => [key, stripUndefined(entry)] as const)
            .filter(([, entry]) => entry !== undefined && entry !== "");
        return Object.fromEntries(entries);
    }

    return value === "" ? undefined : value;
}

export function getOgImage(explicitImage?: string | null): string {
    const image = explicitImage || siteConfig.heroImageUrl || siteConfig.logoUrl || "/opengraph-image";
    return absoluteUrl(image);
}

export function formatSeoTitle(pageTitle: string): string {
    const suffix = siteConfig.companyName;
    const full = `${pageTitle} | ${suffix}`;
    if (full.length <= 60) return full;
    return pageTitle.length <= 60 ? pageTitle : `${pageTitle.slice(0, 57).trim()}...`;
}

export function createPageMetadata(input: MetadataInput): Metadata {
    const canonical = absoluteUrl(input.canonicalPath || input.path);
    const image = getOgImage(input.image);
    const forceNoIndex = shouldForceNoIndex();
    const setupText = setupMetadataText();
    const title = forceNoIndex ? setupText.title : formatSeoTitle(input.title);
    const description = forceNoIndex ? setupText.description : input.description;
    const shouldIndex = forceNoIndex ? false : !input.noIndex;
    const shouldFollow = forceNoIndex ? false : input.follow ?? true;
    const siteName = forceNoIndex ? "Website setup" : siteConfig.companyName;
    const imageAlt = forceNoIndex ? setupText.title : `${siteConfig.companyName} in ${siteConfig.city}`;

    return {
        metadataBase: new URL(getSiteBaseUrl()),
        title,
        description,
        alternates: {
            canonical,
        },
        openGraph: {
            title,
            description,
            type: "website",
            url: canonical,
            siteName,
            locale: "en_US",
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: imageAlt,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image],
        },
        robots: {
            index: shouldIndex,
            follow: shouldFollow,
        },
    };
}

export function serviceAreaSchema(areas = getServiceAreas()): string[] {
    const names = areas.length > 0 ? areas : [siteConfig.city].filter(Boolean);
    return names;
}

export function openingHoursSchema(): Record<string, string>[] | undefined {
    const businessHours = siteConfig.businessHours;
    if (!businessHours) return undefined;

    const dayMap: Record<string, string> = {
        mon: "Monday",
        tue: "Tuesday",
        wed: "Wednesday",
        thu: "Thursday",
        fri: "Friday",
        sat: "Saturday",
        sun: "Sunday",
    };

    const rows = Object.entries(businessHours)
        .filter(([, value]) => value && !value.closed)
        .map(([day, value]) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: dayMap[day] || day,
            opens: value.start || "08:00",
            closes: value.end || "18:00",
        }));

    return rows.length > 0 ? rows : undefined;
}

function realLocationText(value: string, placeholders: string[]): string | undefined {
    const clean = value.trim();
    if (!clean) return undefined;
    return placeholders.includes(clean.toLowerCase()) ? undefined : clean;
}

function primaryPostalCode(): string | undefined {
    const validZips = siteConfig.serviceAreaZips
        .map(zip => zip.trim())
        .filter(zip => /^\d{5}(?:-\d{4})?$/.test(zip));

    return validZips.length === 1 ? validZips[0] : undefined;
}

function postalAddressSchema(): Record<string, unknown> | undefined {
    const streetAddress = realLocationText(siteConfig.streetAddress, []);
    const addressLocality = realLocationText(siteConfig.city, ["your city"]);
    const addressRegion = realLocationText(siteConfig.state, ["your state"]);
    const postalCode = primaryPostalCode();

    if (!streetAddress && !addressLocality && !addressRegion && !postalCode) {
        return undefined;
    }

    return stripUndefined({
        "@type": "PostalAddress",
        streetAddress,
        addressLocality,
        addressRegion,
        postalCode,
        addressCountry: "US",
    }) as Record<string, unknown>;
}

export function localBusinessJsonLd(overrides: Record<string, unknown> = {}): Record<string, unknown> {
    const address = postalAddressSchema();

    const businessImage = siteConfig.heroImageUrl || siteConfig.logoUrl;

    return stripUndefined({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": BUSINESS_SCHEMA_ID,
        name: siteConfig.companyName,
        description: `${siteConfig.companyName} provides junk removal services in ${siteConfig.serviceArea || siteConfig.city}.`,
        telephone: siteConfig.phoneNumber,
        url: getSiteBaseUrl(),
        logo: siteConfig.logoUrl ? absoluteUrl(siteConfig.logoUrl) : undefined,
        image: businessImage ? absoluteUrl(businessImage) : undefined,
        address,
        areaServed: serviceAreaSchema(),
        priceRange: "$$",
        currenciesAccepted: "USD",
        paymentAccepted: "Cash, Credit Card",
        openingHoursSpecification: openingHoursSchema(),
        sameAs: siteConfig.gbpUrl ? [siteConfig.gbpUrl] : undefined,
        hasMap: siteConfig.gbpPlaceId ? `https://www.google.com/maps/place/?q=place_id:${siteConfig.gbpPlaceId}` : undefined,
        ...overrides,
    }) as Record<string, unknown>;
}

export function serviceJsonLd(input: {
    service: Pick<ServiceDetail, "title" | "shortDesc">;
    path: string;
    areas?: string[];
    description?: string;
    offers?: Record<string, unknown> | false;
}): Record<string, unknown> {
    const firstTier = siteConfig.pricing.tiers[0];
    const lastTier = siteConfig.pricing.tiers.find(tier => tier.id === "full") || siteConfig.pricing.tiers[siteConfig.pricing.tiers.length - 1];
    const defaultOffer = hasConfiguredPricing() && firstTier && lastTier ? {
        "@type": "AggregateOffer",
        lowPrice: firstTier.min,
        highPrice: lastTier.max,
        priceCurrency: "USD",
        url: absoluteUrl("/book"),
        availability: "https://schema.org/InStock",
    } : undefined;

    return stripUndefined({
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${absoluteUrl(input.path)}#service`,
        name: `${input.service.title} in ${siteConfig.city}`,
        serviceType: input.service.title,
        description: input.description || input.service.shortDesc,
        url: absoluteUrl(input.path),
        provider: {
            "@id": BUSINESS_SCHEMA_ID,
        },
        areaServed: serviceAreaSchema(input.areas),
        offers: input.offers === false ? undefined : input.offers || defaultOffer,
    }) as Record<string, unknown>;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]): Record<string, unknown> {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: absoluteUrl(item.path),
        })),
    };
}

export function faqPageJsonLd(items: { q: string; a: string }[], path: string): Record<string, unknown> {
    return stripUndefined({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${absoluteUrl(path)}#faq`,
        mainEntity: items.map(item => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
                "@type": "Answer",
                text: item.a,
            },
        })),
    }) as Record<string, unknown>;
}

export function howToJsonLd(input: {
    name: string;
    description: string;
    steps: { name: string; text: string; url?: string }[];
}): Record<string, unknown> {
    return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: input.name,
        description: input.description,
        step: input.steps.map((step, index) => ({
            "@type": "HowToStep",
            position: index + 1,
            name: step.name,
            text: step.text,
            url: step.url ? absoluteUrl(step.url) : undefined,
        })),
    };
}
