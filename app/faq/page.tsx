import type { Metadata } from "next";
import PageHero from "@/components/redesign/PageHero";
import StaticFAQ from "@/components/redesign/StaticFAQ";
import CtaBand from "@/components/redesign/CtaBand";
import { filterFaqs, resolveTokens } from "@/lib/catalogs/faqs";
import { createPageMetadata, faqPageJsonLd } from "@/lib/seo";
import { formatPhone, isSameDayEnabled, siteConfig } from "@/lib/siteConfig";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;

function faqSchemaItems() {
    const items = filterFaqs({
        sameDayEnabled: isSameDayEnabled(siteConfig),
        offersDumpsterRental: siteConfig.offersDumpsterRental,
        hasCommercial: siteConfig.tier === "growth",
    });
    const tokens: Record<string, string | number | null> = {
        city: siteConfig.city || "your area",
        state: siteConfig.state,
        serviceArea: siteConfig.serviceArea || (siteConfig.city ? `Greater ${siteConfig.city}` : "your area"),
        maxRadius: siteConfig.maxRadius ?? "",
        phone: siteConfig.phoneNumber ? formatPhone(siteConfig.phoneNumber) : "",
    };

    return items.map((item) => ({
        q: item.question,
        a: resolveTokens(item.answer, tokens),
    }));
}

const FAQS = faqSchemaItems();

export const metadata: Metadata = createPageMetadata({
    title: `Junk Removal FAQ in ${cityState}`,
    description: `Questions about junk removal in ${cityState}: pricing, scheduling, accepted items, prohibited items, and booking with ${siteConfig.companyName}.`,
    path: "/faq",
});

export default function FAQPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(FAQS, "/faq")) }}
            />
            <PageHero
                crumbs={[
                    { label: "Home", href: "/" },
                    { label: "FAQ" },
                ]}
                titleStart="Junk removal questions, "
                titleAccent="answered by category."
                lede={`Review pricing, items, scheduling, service-area, and booking questions for ${siteConfig.companyName} in ${cityState}.`}
            />
            <StaticFAQ eyebrow="FAQ" heading="Questions, by category." items={FAQS} />
            <CtaBand />
        </>
    );
}
