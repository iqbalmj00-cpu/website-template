import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";
import { canExposePublicSite } from "@/lib/publicSiteGuard";

export default function manifest(): MetadataRoute.Manifest {
    if (!canExposePublicSite()) {
        return {
            name: "Website Setup Required",
            short_name: "Setup Required",
            description: "This website is not ready for public indexing.",
            start_url: "/",
            display: "standalone",
            background_color: "#ffffff",
            theme_color: "#111827",
        };
    }

    return {
        name: siteConfig.companyName,
        short_name: siteConfig.companyName.slice(0, 24),
        description: `${siteConfig.companyName} junk removal booking website.`,
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: siteConfig.brandColor,
        icons: [
            {
                src: absoluteUrl("/opengraph-image"),
                sizes: "1200x630",
                type: "image/svg+xml",
            },
        ],
    };
}
