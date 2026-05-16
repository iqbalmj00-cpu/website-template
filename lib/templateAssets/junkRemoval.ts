import {
    siteConfig,
    type SiteConfig,
    type WebsiteTheme,
} from "@/lib/siteConfig";

export type JunkRemovalImageRole =
    | "hero"
    | "crewAbout"
    | "serviceLoading"
    | "furnitureRemoval"
    | "applianceRemoval"
    | "mattressDisposal"
    | "eWasteRecycling"
    | "hotTubRemoval"
    | "yardWasteRemoval"
    | "lightDemolition"
    | "constructionDebris"
    | "foreclosureCleanout"
    | "estateCleanout"
    | "storageUnitCleanout"
    | "hoarderCleanout"
    | "garageCleanout"
    | "commercialCleanout"
    | "locationNeighborhood";

export type JunkRemovalTemplateAsset = {
    id: string;
    role: JunkRemovalImageRole;
    src: string;
    sourceFile: string;
    altBase: string;
    recommendedFor: string[];
    focalPoint: "center" | "left" | "right" | "top" | "bottom";
};

export type ResolvedTemplateImage = {
    src: string;
    alt: string;
    source: "dashboard" | "template" | "fallback";
    assetId?: string;
    focalPoint: JunkRemovalTemplateAsset["focalPoint"];
};

export type JunkRemovalThemeProfile = {
    id: WebsiteTheme;
    label: string;
    homeVariant: "conversion" | "bold" | "local" | "editorial";
    shellClass: string;
    heroLayoutClass: string;
    pageHeroLayoutClass: string;
    mediaFrameClass: string;
    mediaBadge: string;
    density: "roomy" | "balanced" | "compact";
};

const ASSET_ROOT = "/template-assets/junk-removal";

export const JUNK_REMOVAL_TEMPLATE_ASSETS: Record<JunkRemovalImageRole, JunkRemovalTemplateAsset[]> = {
    hero: [
        asset("hero-01", "hero", `${ASSET_ROOT}/hero/hero-01.jpg`, "20260515-041624-editorial-hero-customer-interaction.jpg", "junk removal crew reviewing a pickup with a customer", ["home hero", "service hero"], "center"),
        asset("hero-02", "hero", `${ASSET_ROOT}/hero/hero-02.jpg`, "20260515-041943-industrial-hero-customer-interaction.jpg", "junk removal crew at a practical job site with a customer", ["industrial hero", "commercial hero"], "center"),
        asset("hero-03", "hero", `${ASSET_ROOT}/hero/hero-03.jpg`, "20260515-055450-editorial-hero-customer-interaction.jpg", "customer speaking with a junk removal crew near a truck", ["editorial hero", "home hero"], "center"),
        asset("hero-04", "hero", `${ASSET_ROOT}/hero/hero-04.jpg`, "20260515-203409-template-fill-hero-customer-curbside-estimate.jpg", "curbside junk removal estimate with customer and crew", ["classic hero", "location hero"], "right"),
        asset("hero-05", "hero", `${ASSET_ROOT}/hero/hero-05.jpg`, "20260515-203440-template-fill-hero-customer-garage-edge.jpg", "garage-edge junk removal customer interaction", ["garage service hero", "home support image"], "center"),
    ],
    crewAbout: [
        asset("crew-about-01", "crewAbout", `${ASSET_ROOT}/crew-about/crew-about-01.jpg`, "20260515-040847-classic-crew-about.jpg", "professional junk removal crew near their work vehicle", ["about", "trust"], "center"),
        asset("crew-about-02", "crewAbout", `${ASSET_ROOT}/crew-about/crew-about-02.jpg`, "20260515-041208-eco-crew-about.jpg", "junk removal crew prepared for a residential pickup", ["about", "eco support"], "center"),
        asset("crew-about-03", "crewAbout", `${ASSET_ROOT}/crew-about/crew-about-03.jpg`, "20260515-055146-eco-crew-about.jpg", "local junk removal team with practical service equipment", ["about", "homepage proof"], "center"),
        asset("crew-about-04", "crewAbout", `${ASSET_ROOT}/crew-about/crew-about-04.jpg`, "20260515-055520-editorial-crew-about.jpg", "junk removal crew portrait at a real job site", ["editorial about", "trust"], "center"),
    ],
    serviceLoading: [
        asset("service-loading-01", "serviceLoading", `${ASSET_ROOT}/service-loading/service-loading-01.jpg`, "20260515-041110-classic-service-loading.jpg", "crew loading approved junk into a service vehicle", ["service pages", "process"], "center"),
        asset("service-loading-02", "serviceLoading", `${ASSET_ROOT}/service-loading/service-loading-02.jpg`, "20260515-041438-eco-service-loading.jpg", "junk removal crew loading household items safely", ["service pages", "eco"], "center"),
        asset("service-loading-03", "serviceLoading", `${ASSET_ROOT}/service-loading/service-loading-03.jpg`, "20260515-042106-industrial-service-loading.jpg", "heavy-duty junk removal loading scene", ["industrial", "commercial"], "center"),
        asset("service-loading-04", "serviceLoading", `${ASSET_ROOT}/service-loading/service-loading-04.jpg`, "20260515-054845-classic-service-loading.jpg", "crew moving items toward a junk removal truck", ["service pages", "homepage"], "center"),
        asset("service-loading-05", "serviceLoading", `${ASSET_ROOT}/service-loading/service-loading-05.jpg`, "20260515-055547-editorial-service-loading.jpg", "organized junk removal loading at a real pickup", ["editorial", "process"], "center"),
    ],
    furnitureRemoval: [
        asset("furniture-removal-01", "furnitureRemoval", `${ASSET_ROOT}/furniture-removal/furniture-removal-01.jpg`, "20260516-014515-template-service-furniture-removal.jpg", "crew carrying old furniture from a home toward a service truck", ["furniture removal", "sofa removal", "service detail"], "center"),
    ],
    applianceRemoval: [
        asset("appliance-removal-01", "applianceRemoval", `${ASSET_ROOT}/appliance-removal/appliance-removal-01.jpg`, "20260516-014245-template-service-appliance-removal.jpg", "crew moving disconnected appliances with a dolly near a truck", ["appliance removal", "refrigerator removal", "washer dryer removal"], "center"),
    ],
    mattressDisposal: [
        asset("mattress-disposal-01", "mattressDisposal", `${ASSET_ROOT}/mattress-disposal/mattress-disposal-01.jpg`, "20260516-014627-template-service-mattress-disposal.jpg", "crew moving a mattress and box spring for disposal", ["mattress disposal", "bedroom cleanout", "service detail"], "center"),
    ],
    eWasteRecycling: [
        asset("e-waste-recycling-01", "eWasteRecycling", `${ASSET_ROOT}/e-waste-recycling/e-waste-recycling-01.jpg`, "20260516-014359-template-service-e-waste-recycling.jpg", "electronics pickup with TVs computers printers and accepted e-waste", ["e-waste recycling", "electronics pickup", "TV removal"], "center"),
    ],
    hotTubRemoval: [
        asset("hot-tub-removal-01", "hotTubRemoval", `${ASSET_ROOT}/hot-tub-removal/hot-tub-removal-01.jpg`, "20260516-014603-template-service-hot-tub-removal.jpg", "crew hauling dismantled hot tub panels from a residential property", ["hot tub removal", "spa removal", "heavy item pickup"], "center"),
    ],
    yardWasteRemoval: [
        asset("yard-waste-removal-01", "yardWasteRemoval", `${ASSET_ROOT}/yard-waste-removal/yard-waste-removal-01.jpg`, "20260516-014717-template-service-yard-waste-removal.jpg", "crew loading branches brush and outdoor debris into a truck", ["yard waste removal", "brush pickup", "outdoor debris"], "center"),
    ],
    lightDemolition: [
        asset("light-demolition-01", "lightDemolition", `${ASSET_ROOT}/light-demolition/light-demolition-01.jpg`, "20260516-014336-template-service-light-demolition.jpg", "crew hauling non-structural demolition debris and small tear-out pieces", ["light demolition", "shed removal", "deck removal"], "center"),
    ],
    constructionDebris: [
        asset("construction-debris-01", "constructionDebris", `${ASSET_ROOT}/construction-debris/construction-debris-01.jpg`, "20260516-014311-template-service-construction-debris.jpg", "crew loading renovation debris and contractor bags into a trailer", ["construction debris", "renovation debris", "contractor cleanup"], "center"),
    ],
    foreclosureCleanout: [
        asset("foreclosure-cleanout-01", "foreclosureCleanout", `${ASSET_ROOT}/foreclosure-cleanout/foreclosure-cleanout-01.jpg`, "20260516-014447-template-service-foreclosure-cleanout.jpg", "crew clearing leftover household items from an empty property", ["foreclosure cleanout", "property turnover", "rental cleanout"], "center"),
    ],
    estateCleanout: [
        asset("estate-cleanout-01", "estateCleanout", `${ASSET_ROOT}/estate-cleanout/estate-cleanout-01.jpg`, "20260516-152404-template-service-estate-cleanout-replacement.jpg", "crew sorting and loading household items during an estate cleanout", ["estate cleanout", "whole home cleanout", "service detail"], "center"),
    ],
    storageUnitCleanout: [
        asset("storage-unit-cleanout-01", "storageUnitCleanout", `${ASSET_ROOT}/storage-unit-cleanout/storage-unit-cleanout-01.jpg`, "20260516-014652-template-service-storage-unit-cleanout.jpg", "crew clearing boxes bins and bulky items from a storage unit", ["storage unit cleanout", "storage cleanout", "service detail"], "center"),
    ],
    hoarderCleanout: [
        asset("hoarder-cleanout-01", "hoarderCleanout", `${ASSET_ROOT}/hoarder-cleanout/hoarder-cleanout-01.jpg`, "20260516-014539-template-service-hoarder-cleanout.jpg", "crew clearing a heavily cluttered room with boxes and household items", ["hoarder cleanout", "large cleanout", "service detail"], "center"),
    ],
    garageCleanout: [
        asset("garage-cleanout-01", "garageCleanout", `${ASSET_ROOT}/garage-cleanout/garage-cleanout-01.jpg`, "20260515-040914-classic-garage-cleanout.jpg", "garage cleanout with boxes and household items", ["garage cleanout", "residential services"], "center"),
        asset("garage-cleanout-02", "garageCleanout", `${ASSET_ROOT}/garage-cleanout/garage-cleanout-02.jpg`, "20260515-041237-eco-garage-cleanout.jpg", "realistic garage cleanout with reusable household items", ["garage cleanout", "eco"], "center"),
        asset("garage-cleanout-03", "garageCleanout", `${ASSET_ROOT}/garage-cleanout/garage-cleanout-03.jpg`, "20260515-054915-classic-garage-cleanout.jpg", "crew clearing a practical residential garage", ["garage cleanout", "service detail"], "center"),
        asset("garage-cleanout-04", "garageCleanout", `${ASSET_ROOT}/garage-cleanout/garage-cleanout-04.jpg`, "20260515-055613-editorial-garage-cleanout.jpg", "garage cleanout scene with believable clutter", ["editorial", "garage"], "center"),
    ],
    commercialCleanout: [
        asset("commercial-cleanout-01", "commercialCleanout", `${ASSET_ROOT}/commercial-cleanout/commercial-cleanout-01.jpg`, "20260515-055340-eco-commercial-cleanout.jpg", "commercial cleanout crew loading office items", ["commercial", "business services"], "center"),
        asset("commercial-cleanout-02", "commercialCleanout", `${ASSET_ROOT}/commercial-cleanout/commercial-cleanout-02.jpg`, "20260515-055711-editorial-commercial-cleanout.jpg", "commercial junk removal in a work space", ["commercial", "editorial"], "center"),
        asset("commercial-cleanout-03", "commercialCleanout", `${ASSET_ROOT}/commercial-cleanout/commercial-cleanout-03.jpg`, "20260515-203242-template-fill-commercial-office-cleanout.jpg", "office cleanout with boxes and furniture moving toward a truck", ["commercial", "office cleanout"], "center"),
        asset("commercial-cleanout-04", "commercialCleanout", `${ASSET_ROOT}/commercial-cleanout/commercial-cleanout-04.jpg`, "20260515-203311-template-fill-commercial-retail-backroom-cleanout.jpg", "retail or backroom commercial cleanout with a crew", ["commercial", "retail cleanout"], "center"),
    ],
    locationNeighborhood: [
        asset("location-neighborhood-01", "locationNeighborhood", `${ASSET_ROOT}/location-neighborhood/location-neighborhood-01.jpg`, "20260515-041015-classic-location-neighborhood.jpg", "local junk removal truck in a residential neighborhood", ["location pages", "homepage area"], "center"),
        asset("location-neighborhood-02", "locationNeighborhood", `${ASSET_ROOT}/location-neighborhood/location-neighborhood-02.jpg`, "20260515-041700-editorial-location-neighborhood.jpg", "neighborhood junk removal pickup on a residential street", ["location pages", "editorial"], "center"),
        asset("location-neighborhood-03", "locationNeighborhood", `${ASSET_ROOT}/location-neighborhood/location-neighborhood-03.jpg`, "20260515-055048-classic-location-neighborhood.jpg", "junk removal service vehicle in a normal local neighborhood", ["location pages", "classic"], "center"),
        asset("location-neighborhood-04", "locationNeighborhood", `${ASSET_ROOT}/location-neighborhood/location-neighborhood-04.jpg`, "20260515-055417-eco-location-neighborhood.jpg", "local residential junk removal scene with trees and homes", ["location pages", "eco"], "center"),
    ],
};

export const JUNK_REMOVAL_THEME_PROFILES: Record<WebsiteTheme, JunkRemovalThemeProfile> = {
    classic: {
        id: "classic",
        label: "Classic local service",
        homeVariant: "conversion",
        shellClass: "dispatch-classic",
        heroLayoutClass: "lg:grid-cols-[minmax(0,1.04fr)_minmax(390px,0.74fr)]",
        pageHeroLayoutClass: "lg:grid-cols-[minmax(0,1.18fr)_minmax(360px,0.82fr)]",
        mediaFrameClass: "rounded-[18px] border border-line bg-paper-2 shadow-[0_28px_70px_rgba(20,20,20,0.12)]",
        mediaBadge: "Local pickup",
        density: "balanced",
    },
    eco: {
        id: "eco",
        label: "Clean and responsible",
        homeVariant: "local",
        shellClass: "dispatch-eco",
        heroLayoutClass: "lg:grid-cols-[minmax(0,1fr)_minmax(390px,0.8fr)]",
        pageHeroLayoutClass: "lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,0.88fr)]",
        mediaFrameClass: "rounded-[28px] border border-line bg-paper-2 shadow-[0_24px_60px_rgba(26,46,26,0.12)]",
        mediaBadge: "Sorted pickup",
        density: "roomy",
    },
    editorial: {
        id: "editorial",
        label: "Editorial service guide",
        homeVariant: "editorial",
        shellClass: "dispatch-editorial",
        heroLayoutClass: "lg:grid-cols-[minmax(0,0.95fr)_minmax(410px,0.86fr)]",
        pageHeroLayoutClass: "lg:grid-cols-[minmax(0,1.08fr)_minmax(380px,0.9fr)]",
        mediaFrameClass: "rounded-[10px] border border-line bg-paper shadow-[0_34px_90px_rgba(20,20,20,0.10)]",
        mediaBadge: "Field note",
        density: "roomy",
    },
    industrial: {
        id: "industrial",
        label: "Heavy-duty worksite",
        homeVariant: "bold",
        shellClass: "dispatch-industrial",
        heroLayoutClass: "lg:grid-cols-[minmax(0,1.08fr)_minmax(390px,0.72fr)]",
        pageHeroLayoutClass: "lg:grid-cols-[minmax(0,1.16fr)_minmax(350px,0.78fr)]",
        mediaFrameClass: "rounded-[8px] border border-line bg-paper-2 shadow-[0_30px_80px_rgba(0,0,0,0.32)]",
        mediaBadge: "Work order",
        density: "compact",
    },
};

const SERVICE_IMAGE_ROLES: Record<string, JunkRemovalImageRole> = {
    "commercial-cleanout": "commercialCleanout",
    "construction-debris": "constructionDebris",
    "foreclosure-cleanout": "foreclosureCleanout",
    "storage-unit-cleanout": "storageUnitCleanout",
    demolition: "lightDemolition",
    "garage-cleanout": "garageCleanout",
    "estate-cleanout": "estateCleanout",
    "hoarder-cleanout": "hoarderCleanout",
    "yard-waste-removal": "yardWasteRemoval",
    "hot-tub-removal": "hotTubRemoval",
    "appliance-removal": "applianceRemoval",
    "e-waste-recycling": "eWasteRecycling",
    "furniture-removal": "furnitureRemoval",
    "mattress-disposal": "mattressDisposal",
    "junk-removal": "serviceLoading",
};

function asset(
    id: string,
    role: JunkRemovalImageRole,
    src: string,
    sourceFile: string,
    altBase: string,
    recommendedFor: string[],
    focalPoint: JunkRemovalTemplateAsset["focalPoint"],
): JunkRemovalTemplateAsset {
    return { id, role, src, sourceFile, altBase, recommendedFor, focalPoint };
}

function cleanImageSrc(value: string | null | undefined): string {
    return typeof value === "string" ? value.trim() : "";
}

function stableHash(input: string): number {
    let hash = 2166136261;
    for (let i = 0; i < input.length; i += 1) {
        hash ^= input.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return Math.abs(hash);
}

export function getJunkRemovalThemeProfile(config: SiteConfig = siteConfig): JunkRemovalThemeProfile {
    return JUNK_REMOVAL_THEME_PROFILES[config.theme] ?? JUNK_REMOVAL_THEME_PROFILES.classic;
}

export function getServiceImageRole(serviceSlug: string | undefined): JunkRemovalImageRole {
    if (!serviceSlug) return "serviceLoading";
    return SERVICE_IMAGE_ROLES[serviceSlug] ?? "serviceLoading";
}

export function focalPointToObjectPosition(focalPoint: JunkRemovalTemplateAsset["focalPoint"]): string {
    switch (focalPoint) {
        case "left":
            return "35% center";
        case "right":
            return "65% center";
        case "top":
            return "center 30%";
        case "bottom":
            return "center 70%";
        case "center":
        default:
            return "center";
    }
}

function buildAlt(input: {
    config: SiteConfig;
    role: JunkRemovalImageRole;
    serviceTitle?: string;
    locationName?: string;
    asset?: JunkRemovalTemplateAsset;
}): string {
    const { config, role, serviceTitle, locationName, asset } = input;
    const area = locationName || config.city || config.serviceArea || "the local service area";
    const company = config.companyName || "the junk removal company";

    if (serviceTitle) {
        return `${company} ${serviceTitle.toLowerCase()} crew working in ${area}`;
    }

    switch (role) {
        case "hero":
            return `${company} junk removal crew helping a customer in ${area}`;
        case "crewAbout":
            return `${company} junk removal crew and service vehicle`;
        case "garageCleanout":
            return `${company} garage cleanout service with household items`;
        case "commercialCleanout":
            return `${company} commercial cleanout crew at a work site`;
        case "locationNeighborhood":
            return `${company} junk removal service in a residential neighborhood near ${area}`;
        case "furnitureRemoval":
            return `${company} furniture removal crew carrying bulky items in ${area}`;
        case "applianceRemoval":
            return `${company} appliance removal crew moving disconnected appliances in ${area}`;
        case "mattressDisposal":
            return `${company} mattress disposal crew removing a mattress in ${area}`;
        case "eWasteRecycling":
            return `${company} e-waste pickup with accepted electronics in ${area}`;
        case "hotTubRemoval":
            return `${company} hot tub removal crew hauling dismantled spa pieces in ${area}`;
        case "yardWasteRemoval":
            return `${company} yard waste removal crew loading brush and outdoor debris in ${area}`;
        case "lightDemolition":
            return `${company} light demolition debris removal crew in ${area}`;
        case "constructionDebris":
            return `${company} construction debris removal crew loading renovation material in ${area}`;
        case "foreclosureCleanout":
            return `${company} foreclosure cleanout crew clearing leftover property items in ${area}`;
        case "estateCleanout":
            return `${company} estate cleanout crew sorting and loading household items in ${area}`;
        case "storageUnitCleanout":
            return `${company} storage unit cleanout crew moving boxes and bulky items in ${area}`;
        case "hoarderCleanout":
            return `${company} large cleanout crew clearing heavy household clutter in ${area}`;
        case "serviceLoading":
        default:
            return asset?.altBase ? `${company} ${asset.altBase}` : `${company} junk removal crew loading approved items`;
    }
}

export function resolveJunkRemovalImage(input: {
    config?: SiteConfig;
    role: JunkRemovalImageRole;
    routeKey?: string;
    overrideSrc?: string | null;
    alt?: string;
    serviceTitle?: string;
    locationName?: string;
    fallbackSrc?: string;
}): ResolvedTemplateImage {
    const config = input.config ?? siteConfig;
    const overrideSrc = cleanImageSrc(input.overrideSrc);
    const fallbackSrc = input.fallbackSrc ?? "/images/default-hero.png";

    if (overrideSrc) {
        return {
            src: overrideSrc,
            alt: input.alt || buildAlt({ config, role: input.role, serviceTitle: input.serviceTitle, locationName: input.locationName }),
            source: "dashboard",
            focalPoint: "center",
        };
    }

    const assets = JUNK_REMOVAL_TEMPLATE_ASSETS[input.role];
    if (assets.length > 0) {
        const key = `${config.theme}:${input.role}:${input.routeKey || ""}`;
        const asset = assets[stableHash(key) % assets.length];
        return {
            src: asset.src,
            alt: input.alt || buildAlt({ config, role: input.role, serviceTitle: input.serviceTitle, locationName: input.locationName, asset }),
            source: "template",
            assetId: asset.id,
            focalPoint: asset.focalPoint,
        };
    }

    return {
        src: fallbackSrc,
        alt: input.alt || buildAlt({ config, role: input.role, serviceTitle: input.serviceTitle, locationName: input.locationName }),
        source: "fallback",
        focalPoint: "center",
    };
}
