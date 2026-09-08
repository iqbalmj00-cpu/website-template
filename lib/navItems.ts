import { configuredLocationNames, locationSlug } from "./locationNames";
import type { SiteConfig } from "@/lib/siteConfig";

export type NavItem = {
    label: string;
    href: string;
};

export { buildServiceNavItems } from "./serviceNavigation";

export function buildLocationNavItems(config: SiteConfig, limit = 10): NavItem[] {
    return configuredLocationNames(config)
        .map((name) => ({ label: name, href: `/locations/${locationSlug(name)}` }))
        .slice(0, limit);
}
