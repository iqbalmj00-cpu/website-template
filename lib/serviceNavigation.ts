import { resolveServiceCatalogIds } from "./catalogs/services";
export type ServiceNavigationConfig = { services: readonly string[]; offersDumpsterRental: boolean; companyMode?: string };
export function buildServiceNavItems(config: ServiceNavigationConfig, limit = 10): { label: string; href: string }[] {
    const count = Math.max(0, Math.floor(limit));
    if (config.companyMode === "dumpster_rental") return config.offersDumpsterRental && count > 0 ? [{ label: "Dumpster Rental", href: "/dumpster-rental" }] : [];
    const selected = config.services.filter(service => !/^dumpster[ -]rental$/i.test(service.trim()));
    const catalog = resolveServiceCatalogIds([...selected]);
    const services = catalog.length > 0
        ? catalog.map(service => ({ label: service.name, href: `/services/${service.id}` }))
        : selected.map(service => service.trim()).filter(Boolean).map(service => ({ label: service, href: `/services/${service.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}` }));
    if (!config.offersDumpsterRental || count === 0) return services.slice(0, count);
    return [...services.slice(0, count - 1), { label: "Dumpster Rental", href: "/dumpster-rental" }];
}
