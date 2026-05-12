import type { Metadata } from "next";
import { createPageMetadata, faqPageJsonLd } from "@/lib/seo";
import { getSiteBaseUrl, siteConfig } from "@/lib/siteConfig";
import HomePageContent, { buildHomeFaqs } from "@/components/redesign/HomePageContent";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;
const HOME_FAQS = buildHomeFaqs(siteConfig);

export const metadata: Metadata = createPageMetadata({
    title: `Junk Removal in ${cityState}`,
    description: `${siteConfig.companyName} provides junk removal in ${cityState}: furniture, appliances, yard waste, cleanouts, construction debris, and more.`,
    path: "/",
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
