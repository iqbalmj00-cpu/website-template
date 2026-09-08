import type { SiteConfig } from "@/lib/siteConfig";

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

function uniqueByLabel(values: string[]): string[] {
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

function isZipLike(value: string): boolean {
    return /^\d{5}(?:-\d{4})?$/.test(value.trim());
}

function isGenericAreaName(value: string, mainCity: string): boolean {
    const normalized = value.trim().toLowerCase();
    const city = mainCity.trim().toLowerCase();

    if (!normalized || normalized === "your area") return true;
    if (isZipLike(normalized)) return true;
    if (normalized === city) return false;

    return new Set([
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
    ]).has(normalized);
}

function serviceAreaNames(config: SiteConfig): string[] {
    const { city, serviceArea } = config;
    const parts = serviceArea
        ? serviceArea
            .split(/[,;]+/)
            .map((area) => area.trim())
            .filter((area) => !isGenericAreaName(area, city))
        : [];

    return uniqueByLabel([city, ...parts]).filter(Boolean);
}

export { buildServiceNavItems } from "./serviceNavigation";

export function buildLocationNavItems(config: SiteConfig, limit = 10): NavItem[] {
    return serviceAreaNames(config)
        .map((name) => ({ label: name, href: `/locations/${toSlug(name)}` }))
        .slice(0, limit);
}
