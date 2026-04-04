import { siteConfig } from "@/lib/siteConfig";
import { getClientServices } from "@/lib/serviceData";
import { getLocations } from "@/lib/locationData";
import { fetchBlogs } from "@/lib/blogData";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = siteConfig.subdomain
        ? `https://${siteConfig.subdomain}.scaleyourjunk.com`
        : "https://scaleyourjunk.com";

    const now = new Date();

    // Static pages
    const staticPages = [
        { url: baseUrl, changeFrequency: "weekly" as const, priority: 1.0 },
        { url: `${baseUrl}/about`, changeFrequency: "monthly" as const, priority: 0.6 },
        { url: `${baseUrl}/services`, changeFrequency: "weekly" as const, priority: 0.9 },
        { url: `${baseUrl}/locations`, changeFrequency: "weekly" as const, priority: 0.8 },
        { url: `${baseUrl}/pricing`, changeFrequency: "monthly" as const, priority: 0.8 },
        { url: `${baseUrl}/how-it-works`, changeFrequency: "monthly" as const, priority: 0.7 },
        { url: `${baseUrl}/reviews`, changeFrequency: "monthly" as const, priority: 0.6 },
        { url: `${baseUrl}/faq`, changeFrequency: "monthly" as const, priority: 0.6 },
        { url: `${baseUrl}/contact`, changeFrequency: "monthly" as const, priority: 0.7 },
        { url: `${baseUrl}/commercial`, changeFrequency: "monthly" as const, priority: 0.7 },
        { url: `${baseUrl}/items-we-take`, changeFrequency: "monthly" as const, priority: 0.5 },
        { url: `${baseUrl}/items-we-dont-take`, changeFrequency: "monthly" as const, priority: 0.4 },
        { url: `${baseUrl}/book`, changeFrequency: "monthly" as const, priority: 0.9 },
        { url: `${baseUrl}/get-started`, changeFrequency: "monthly" as const, priority: 0.8 },
        { url: `${baseUrl}/blog`, changeFrequency: "weekly" as const, priority: 0.7 },
        { url: `${baseUrl}/legal`, changeFrequency: "yearly" as const, priority: 0.2 },
        { url: `${baseUrl}/privacy`, changeFrequency: "yearly" as const, priority: 0.3 },
        { url: `${baseUrl}/terms`, changeFrequency: "yearly" as const, priority: 0.3 },
        ...(siteConfig.offersDumpsterRental ? [{ url: `${baseUrl}/dumpster-rental`, changeFrequency: "monthly" as const, priority: 0.8 }] : []),
    ];

    // Service pages
    const servicePages = getClientServices().map((svc) => ({
        url: `${baseUrl}/services/${svc.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
        lastModified: now,
    }));

    // Location pages
    const locationPages = getLocations().map((loc) => ({
        url: `${baseUrl}/locations/${loc.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
        lastModified: now,
    }));

    // Blog pages
    const blogs = await fetchBlogs();
    const blogPages = blogs.map((b) => ({
        url: `${baseUrl}/blog/${b.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        lastModified: now,
    }));

    return [
        ...staticPages.map((p) => ({ ...p, lastModified: now })),
        ...servicePages,
        ...locationPages,
        ...blogPages,
    ];
}
