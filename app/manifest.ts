import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";

export default function manifest(): MetadataRoute.Manifest {
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
