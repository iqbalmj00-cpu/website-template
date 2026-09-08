/** One eligibility/slug contract for location links and detail pages. */
export function locationSlug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function configuredLocationNames(config: { city: string; serviceArea: string }): string[] {
    if (!config.city.trim()) return [];
    const generic = new Set(["your area", "near me", "nearby", "surrounding areas", "surrounding communities", "greater area", "metro area", "service area", "all areas", "all neighborhoods", "countywide", "citywide"]);
    const seen = new Set<string>();
    return [config.city, ...config.serviceArea.split(/[,;]+/)].map(name => name.replace(/\s+/g, " ").trim()).filter(name => {
        const key = name.toLowerCase();
        const slug = locationSlug(name);
        if (!slug || seen.has(slug) || generic.has(key) || /^\d{5}(?:-\d{4})?$/.test(name)) return false;
        if (key !== config.city.trim().toLowerCase() && (name.length < 3 || name.length > 80 || /^(north|south|east|west|central|downtown)\s+city$/.test(key))) return false;
        seen.add(slug);
        return true;
    });
}
