import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/siteConfig";
import { canExposePublicSite } from "@/lib/publicSiteGuard";

export default function robots(): MetadataRoute.Robots {
    if (!canExposePublicSite()) {
        return {
            rules: [
                {
                    userAgent: "*",
                    disallow: "/",
                },
            ],
        };
    }

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/__preview", "/preview", "/booking-confirmed", "/customer-portal", "/thank-you"],
            },
        ],
        sitemap: absoluteUrl("/sitemap.xml"),
    };
}
