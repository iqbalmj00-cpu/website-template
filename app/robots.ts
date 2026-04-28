import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/siteConfig";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/booking-confirmed", "/customer-portal", "/thank-you"],
            },
        ],
        sitemap: absoluteUrl("/sitemap.xml"),
    };
}
