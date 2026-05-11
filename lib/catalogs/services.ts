import { ALL_SERVICES } from "@/lib/serviceData";

export type ServiceCatalogEntry = {
    id: string;
    name: string;
    blurb: string;
};

function normalize(value: string): string {
    return value
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
}

function fallbackSlug(value: string): string {
    return normalize(value).replace(/\s+/g, "-");
}

export function resolveServiceCatalogIds(services: readonly string[]): ServiceCatalogEntry[] {
    const seen = new Set<string>();
    const resolved: ServiceCatalogEntry[] = [];

    for (const service of services) {
        const clean = service.trim();
        if (!clean) continue;

        const normalized = normalize(clean);
        const match = ALL_SERVICES.find((catalogItem) => {
            if (normalize(catalogItem.slug) === normalized) return true;
            if (normalize(catalogItem.title) === normalized) return true;
            return catalogItem.names.some((name) => normalize(name) === normalized);
        });

        const entry = match
            ? { id: match.slug, name: match.title, blurb: match.shortDesc }
            : { id: fallbackSlug(clean), name: clean, blurb: "Book this service through the online quote flow." };

        if (!entry.id || seen.has(entry.id)) continue;
        seen.add(entry.id);
        resolved.push(entry);
    }

    return resolved;
}
