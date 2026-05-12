import { absoluteUrl, isSameDayEnabled, siteConfig } from "@/lib/siteConfig";
import { getClientServices } from "@/lib/serviceData";
import { getIndexableLocations } from "@/lib/locationData.server";
import { fetchBlogs } from "@/lib/blogData";
import { getCostGuides } from "@/lib/costData";
import { SEO_CONTENT_LAST_MODIFIED } from "@/lib/seo";
import { canExposePublicSite } from "@/lib/publicSiteGuard";
import { hasVerifiedPublicReviews } from "@/lib/reviewData";
import type { MetadataRoute } from "next";

/**
 * lastModified date for static informational pages whose content rarely changes.
 * Bump this string when you make a meaningful copy update to about/contact/faq/
 * privacy/terms/items-we-take/items-we-dont-take/how-it-works/commercial.
 *
 * Why a constant instead of `new Date()`: telling Google every page changed on
 * every build wastes crawl budget and dilutes the freshness signal — the dates
 * should reflect actual content updates, not deploy timestamps.
 */
const CONTENT_VERSION = SEO_CONTENT_LAST_MODIFIED;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    if (!canExposePublicSite()) return [];

    // Build time — use for pages whose content changes when the client's
    // siteConfig (services, locations, pricing, dumpster offering) changes.
    const buildTime = new Date();
    const showReviews = await hasVerifiedPublicReviews();

    type SitemapEntry = {
        url: string;
        changeFrequency: "weekly" | "monthly" | "yearly";
        priority: number;
        lastModified: Date;
    };

    // Pages whose content meaningfully changes when client's config changes.
    const configDrivenPages: SitemapEntry[] = [
        { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1.0, lastModified: buildTime },
        { url: absoluteUrl("/services"), changeFrequency: "weekly", priority: 0.9, lastModified: buildTime },
        { url: absoluteUrl("/locations"), changeFrequency: "weekly", priority: 0.8, lastModified: buildTime },
        { url: absoluteUrl("/pricing"), changeFrequency: "monthly", priority: 0.8, lastModified: buildTime },
        ...(showReviews ? [{ url: absoluteUrl("/reviews"), changeFrequency: "monthly" as const, priority: 0.6, lastModified: buildTime }] : []),
        { url: absoluteUrl("/book"), changeFrequency: "monthly", priority: 0.9, lastModified: buildTime },
        { url: absoluteUrl("/cost"), changeFrequency: "monthly", priority: 0.75, lastModified: buildTime },
        { url: absoluteUrl("/best-junk-removal"), changeFrequency: "monthly", priority: 0.75, lastModified: CONTENT_VERSION },
        ...(isSameDayEnabled() ? [{ url: absoluteUrl("/same-day-junk-removal"), changeFrequency: "monthly" as const, priority: 0.8, lastModified: buildTime }] : []),
        ...(siteConfig.offersDumpsterRental ? [
            { url: absoluteUrl("/dumpster-rental"), changeFrequency: "monthly" as const, priority: 0.8, lastModified: buildTime },
            { url: absoluteUrl("/junk-removal-vs-dumpster-rental"), changeFrequency: "monthly" as const, priority: 0.75, lastModified: CONTENT_VERSION },
        ] : []),
    ];

    // Pages whose content is largely static template copy — bump CONTENT_VERSION
    // above when you actually edit one of them.
    const staticContentPages: SitemapEntry[] = [
        { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.6, lastModified: CONTENT_VERSION },
        { url: absoluteUrl("/how-it-works"), changeFrequency: "monthly", priority: 0.7, lastModified: CONTENT_VERSION },
        { url: absoluteUrl("/faq"), changeFrequency: "monthly", priority: 0.6, lastModified: CONTENT_VERSION },
        { url: absoluteUrl("/contact"), changeFrequency: "monthly", priority: 0.7, lastModified: CONTENT_VERSION },
        { url: absoluteUrl("/commercial"), changeFrequency: "monthly", priority: 0.7, lastModified: CONTENT_VERSION },
        { url: absoluteUrl("/items-we-take"), changeFrequency: "monthly", priority: 0.5, lastModified: CONTENT_VERSION },
        { url: absoluteUrl("/items-we-dont-take"), changeFrequency: "monthly", priority: 0.4, lastModified: CONTENT_VERSION },
        { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.3, lastModified: CONTENT_VERSION },
        { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.3, lastModified: CONTENT_VERSION },
    ];

    // Service detail pages — depend on per-client config + per-service template
    const servicePages: SitemapEntry[] = getClientServices().map((svc) => ({
        url: absoluteUrl(`/services/${svc.slug}`),
        changeFrequency: "monthly",
        priority: 0.8,
        lastModified: buildTime,
    }));

    const indexableLocations = getIndexableLocations();

    // Location detail pages — only the main city and explicitly configured locations are indexable.
    const locationPages: SitemapEntry[] = indexableLocations.map((loc) => ({
        url: absoluteUrl(`/locations/${loc.slug}`),
        changeFrequency: "monthly",
        priority: 0.8,
        lastModified: buildTime,
    }));

    const costPages: SitemapEntry[] = getCostGuides().map((item) => ({
        url: absoluteUrl(`/cost/${item.slug}`),
        changeFrequency: "monthly",
        priority: 0.7,
        lastModified: CONTENT_VERSION,
    }));

    // Blog pages — TODO: use the actual published/updated date from each blog
    // when fetchBlogs returns it. For now use CONTENT_VERSION as a conservative
    // signal since these are operator-pushed and rarely re-edited per build.
    const blogs = siteConfig.enableBlog ? await fetchBlogs() : [];
    const blogIndex: SitemapEntry[] = blogs.length > 0 ? [{
        url: absoluteUrl("/blog"),
        changeFrequency: "weekly",
        priority: 0.7,
        lastModified: CONTENT_VERSION,
    }] : [];
    const blogPages: SitemapEntry[] = blogs.map((b) => ({
        url: absoluteUrl(`/blog/${b.slug}`),
        changeFrequency: "monthly",
        priority: 0.7,
        lastModified: CONTENT_VERSION,
    }));

    return [
        ...configDrivenPages,
        ...staticContentPages,
        ...servicePages,
        ...locationPages,
        ...costPages,
        ...blogIndex,
        ...blogPages,
    ];
}
