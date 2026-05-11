export interface FaqCategory {
    id: string;
    label: string;
    iconKey: "pricing" | "items" | "scheduling" | "areas" | "disposal" | "commercial";
}

export interface FaqItem {
    id: string;
    category: FaqCategory["id"];
    question: string;
    answer: string;
    showIf?: "dumpster" | "same-day" | "commercial";
}

export const FAQ_CATEGORIES: FaqCategory[] = [
    { id: "pricing", label: "Pricing", iconKey: "pricing" },
    { id: "items", label: "Items", iconKey: "items" },
    { id: "scheduling", label: "Scheduling", iconKey: "scheduling" },
    { id: "areas", label: "Service Areas", iconKey: "areas" },
    { id: "disposal", label: "Disposal", iconKey: "disposal" },
    { id: "commercial", label: "Commercial", iconKey: "commercial" },
];

export const FAQ_POOL: FaqItem[] = [
    {
        id: "sched-how-fast",
        category: "scheduling",
        question: "How fast can I book junk removal?",
        answer: "Availability depends on the route schedule. Book online or call {{phone}} to see the next available pickup window in {{city}}.",
    },
    {
        id: "pricing-how-calculated",
        category: "pricing",
        question: "How is the price calculated?",
        answer: "Pricing depends on job size, item type, access, distance, and any configured surcharges. The final quote is confirmed before loading begins.",
    },
    {
        id: "items-what-you-take",
        category: "items",
        question: "What can you take?",
        answer: "The services page lists the item categories configured for this business. Common categories can include furniture, appliances, yard waste, cleanouts, and construction debris when selected.",
    },
    {
        id: "pricing-hidden-fees",
        category: "pricing",
        question: "Are there hidden fees?",
        answer: "Any configured surcharges should be reviewed before loading starts, including item, access, distance, or scheduling charges when they apply.",
    },
    {
        id: "area-where",
        category: "areas",
        question: "Where do you provide service?",
        answer: "This website is configured for {{serviceArea}}. Enter your address during booking to confirm service availability.",
    },
    {
        id: "sched-same-day",
        category: "scheduling",
        question: "Do you offer same-day pickup?",
        answer: "Same-day pickup may be available when route capacity allows. Book early for the best chance of same-day availability.",
        showIf: "same-day",
    },
    {
        id: "commercial-available",
        category: "commercial",
        question: "Do you handle commercial cleanouts?",
        answer: "Commercial service availability depends on this business setup and selected service categories.",
        showIf: "commercial",
    },
    {
        id: "dumpster-available",
        category: "disposal",
        question: "Do you offer dumpster rental?",
        answer: "Dumpster rental appears only when this business has configured dumpster availability.",
        showIf: "dumpster",
    },
];

export function filterFaqs(options: {
    sameDayEnabled?: boolean;
    offersDumpsterRental?: boolean;
    hasCommercial?: boolean;
} = {}): FaqItem[] {
    return FAQ_POOL.filter((item) => {
        if (item.showIf === "same-day") return Boolean(options.sameDayEnabled);
        if (item.showIf === "dumpster") return Boolean(options.offersDumpsterRental);
        if (item.showIf === "commercial") return Boolean(options.hasCommercial);
        return true;
    });
}

export function resolveTokens(
    value: string,
    tokens: Record<string, string | number | null | undefined>,
): string {
    return value.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
        const replacement = tokens[key];
        return replacement === null || replacement === undefined ? "" : String(replacement);
    });
}
