import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/booking-confirmed", "/booking-details", "/thank-you"],
            },
        ],
        sitemap: `${siteConfig.subdomain ? `https://${siteConfig.subdomain}.scaleyourjunk.com` : "https://scaleyourjunk.com"}/sitemap.xml`,
    };
}
