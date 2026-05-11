import { resolveServiceCatalogIds } from "@/lib/catalogs/services";
import { siteConfig, type SiteConfig } from "@/lib/siteConfig";

export type NavItem = {
    label: string;
    href: string;
};

function toSlug(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

function uniqueClean(values: readonly string[]): string[] {
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

export function buildServiceNavItems(config: SiteConfig = siteConfig, limit = 10): NavItem[] {
    return resolveServiceCatalogIds(config.services)
        .slice(0, limit)
        .map((service) => ({
            label: service.name,
            href: `/services/${service.id}`,
        }));
}

export function buildLocationNavItems(config: SiteConfig = siteConfig, limit = 10): NavItem[] {
    const rawAreas = uniqueClean([
        config.city,
        ...config.serviceArea.split(/[,;]/).map((area) => area.trim()),
    ]);

    return rawAreas
        .filter((area) => {
            const normalized = area.toLowerCase();
            return Boolean(toSlug(area))
                && normalized !== "your area"
                && normalized !== "service area"
                && normalized !== "surrounding areas";
        })
        .slice(0, limit)
        .map((area) => ({
            label: area,
            href: `/locations/${toSlug(area)}`,
        }));
}
