import type { Metadata } from "next";
import { createPageMetadata, faqPageJsonLd } from "@/lib/seo";
import { getSiteBaseUrl, siteConfig } from "@/lib/siteConfig";
import HomePageContent, { buildHomeFaqs } from "@/components/redesign/HomePageContent";
import { resolveJunkRemovalImage } from "@/lib/templateAssets/junkRemoval";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;
const HOME_FAQS = buildHomeFaqs(siteConfig);
const homeMetaImage = resolveJunkRemovalImage({
    config: siteConfig,
    role: "hero",
    routeKey: "home-meta",
    overrideSrc: siteConfig.heroImageUrl,
});

export const metadata: Metadata = createPageMetadata({
    title: `${siteConfig.companyMode === "dumpster_rental" ? "Dumpster Rental" : "Junk Removal"} in ${cityState}`,
    description: siteConfig.companyMode === "dumpster_rental" ? `${siteConfig.companyName} offers dumpster rental in ${cityState}. Review container sizes, rental terms and delivery requests.` : `${siteConfig.companyName} provides junk removal in ${cityState}: furniture, appliances, yard waste, cleanouts, construction debris, and more.`,
    path: "/",
    image: homeMetaImage.src,
});

export default function HomePage() {
    const baseUrl = getSiteBaseUrl();

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            name: siteConfig.companyName,
                            url: baseUrl,
                        },
                        faqPageJsonLd(HOME_FAQS, "/"),
                    ]),
                }}
            />

            <HomePageContent />
        </>
    );
}
