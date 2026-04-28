import { siteConfig } from "@/lib/siteConfig";

export type CostGuideItem = {
    slug: string;
    item: string;
    title: string;
    metaDescription: string;
    serviceSlug?: string;
    factors: string[];
    included: string[];
};

export const COST_GUIDES: CostGuideItem[] = [
    {
        slug: "couch-removal",
        item: "couch",
        title: "Couch Removal Cost",
        metaDescription: `Learn what affects couch removal pricing in ${siteConfig.city}, including load size, access, and disposal requirements.`,
        serviceSlug: "furniture-removal",
        factors: ["Number of pieces", "Stairs or tight access", "Distance from the truck", "Donation or disposal requirements"],
        included: ["Labor to carry the couch out", "Truck loading", "Hauling", "Disposal or donation routing when available"],
    },
    {
        slug: "mattress-removal",
        item: "mattress",
        title: "Mattress Removal Cost",
        metaDescription: `Compare mattress removal cost factors in ${siteConfig.city}, including quantity, access, and local disposal rules.`,
        serviceSlug: "furniture-removal",
        factors: ["Mattress size", "Box spring included", "Number of mattresses", "Pickup location inside the property"],
        included: ["Labor", "Loading", "Hauling", "Disposal routing"],
    },
    {
        slug: "refrigerator-removal",
        item: "refrigerator",
        title: "Refrigerator Removal Cost",
        metaDescription: `See what affects refrigerator removal pricing in ${siteConfig.city}, including appliance handling and access conditions.`,
        serviceSlug: "appliance-removal",
        factors: ["Appliance size", "Stairs", "Whether doors must be removed", "Local appliance disposal fees"],
        included: ["Careful carry-out", "Truck loading", "Hauling", "Appliance disposal routing"],
    },
    {
        slug: "appliance-removal",
        item: "appliance",
        title: "Appliance Removal Cost",
        metaDescription: `Understand appliance removal cost factors in ${siteConfig.city} for washers, dryers, refrigerators, and other bulky appliances.`,
        serviceSlug: "appliance-removal",
        factors: ["Appliance type", "Weight", "Pickup access", "Any local appliance handling fee"],
        included: ["Labor", "Loading", "Hauling", "Disposal routing"],
    },
    {
        slug: "furniture-removal",
        item: "furniture",
        title: "Furniture Removal Cost",
        metaDescription: `Estimate furniture removal pricing in ${siteConfig.city} based on item count, load size, and access.`,
        serviceSlug: "furniture-removal",
        factors: ["Item count", "Load volume", "Stairs or elevators", "Donation eligibility"],
        included: ["Labor", "Truck space", "Hauling", "Donation or disposal routing when available"],
    },
    {
        slug: "hot-tub-removal",
        item: "hot tub",
        title: "Hot Tub Removal Cost",
        metaDescription: `Learn what affects hot tub removal pricing in ${siteConfig.city}, including dismantling, weight, and access.`,
        factors: ["Dismantling required", "Tub size", "Deck or yard access", "Weight and haul distance"],
        included: ["Labor planning", "Breakdown when quoted", "Loading", "Hauling"],
    },
    {
        slug: "yard-waste-removal",
        item: "yard waste",
        title: "Yard Waste Removal Cost",
        metaDescription: `Review yard waste removal cost factors in ${siteConfig.city}, from pile size to weight and disposal type.`,
        serviceSlug: "yard-waste-removal",
        factors: ["Pile size", "Material weight", "Bagged vs loose debris", "Distance from truck access"],
        included: ["Loading", "Hauling", "Disposal routing", "Basic cleanup around the pickup area"],
    },
    {
        slug: "construction-debris-removal",
        item: "construction debris",
        title: "Construction Debris Removal Cost",
        metaDescription: `Understand construction debris removal pricing in ${siteConfig.city}, including heavy materials and load size.`,
        serviceSlug: "construction-debris",
        factors: ["Material type", "Weight", "Load volume", "Dump or processing fees"],
        included: ["Loading", "Hauling", "Disposal routing", "Weight-aware pricing review"],
    },
    {
        slug: "garage-cleanout",
        item: "garage cleanout",
        title: "Garage Cleanout Cost",
        metaDescription: `Estimate garage cleanout pricing in ${siteConfig.city} based on volume, sorting needs, and item types.`,
        serviceSlug: "garage-cleanout",
        factors: ["Garage size", "Amount of sorting", "Heavy or hazardous excluded materials", "Truck load volume"],
        included: ["Labor", "Loading", "Hauling", "Disposal or donation routing when available"],
    },
    {
        slug: "estate-cleanout",
        item: "estate cleanout",
        title: "Estate Cleanout Cost",
        metaDescription: `Learn what affects estate cleanout pricing in ${siteConfig.city}, including volume, access, and sorting needs.`,
        serviceSlug: "estate-cleanout",
        factors: ["Property size", "Room count", "Sorting requirements", "Truck load volume"],
        included: ["Labor", "Loading", "Hauling", "Disposal or donation routing when available"],
    },
];

export function getCostGuides(): CostGuideItem[] {
    return COST_GUIDES;
}

export function getCostGuideBySlug(slug: string): CostGuideItem | undefined {
    return COST_GUIDES.find(item => item.slug === slug);
}

export function getEstimatedCostRange(item: CostGuideItem): { min: number; max: number } {
    const tiers = siteConfig.pricing.tiers;
    const lowestTier = tiers[0];
    const middleTier = tiers[Math.min(2, tiers.length - 1)];
    const applianceSurcharge = siteConfig.pricing.surcharges.find(surcharge => surcharge.id === "appliance" && surcharge.enabled);
    const heavySurcharge = siteConfig.pricing.surcharges.find(surcharge => surcharge.id === "heavy_material" && surcharge.enabled);

    let min = lowestTier?.min ?? 75;
    let max = middleTier?.max ?? lowestTier?.max ?? 250;

    if (["refrigerator-removal", "appliance-removal"].includes(item.slug) && applianceSurcharge) {
        min += applianceSurcharge.amount;
        max += applianceSurcharge.amount;
    }

    if (["hot-tub-removal", "construction-debris-removal"].includes(item.slug) && heavySurcharge) {
        min += heavySurcharge.amount;
        max += heavySurcharge.amount * 2;
    }

    return { min, max };
}

export function formatCostRange(item: CostGuideItem): string {
    const { min, max } = getEstimatedCostRange(item);
    return `$${min}-$${max}`;
}
