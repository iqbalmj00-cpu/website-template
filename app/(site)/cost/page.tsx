import type { Metadata } from "next";
import PageHero from "@/components/redesign/PageHero";
import StaticFAQ from "@/components/redesign/StaticFAQ";
import CtaBand from "@/components/redesign/CtaBand";
import { DispatchCardSection } from "@/components/redesign/DispatchBlocks";
import { breadcrumbJsonLd, createPageMetadata, faqPageJsonLd } from "@/lib/seo";
import { formatCostRange, getCostGuides } from "@/lib/costData";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = createPageMetadata({
    title: `Junk Removal Cost in ${siteConfig.city}`,
    description: `Compare junk removal cost guides in ${siteConfig.city} for couches, mattresses, appliances, cleanouts, construction debris, and more.`,
    path: "/cost",
});
const FAQS = [
    { q: "What is the main factor in junk removal cost?", a: "Truck volume is usually the main factor. Weight, stairs, long carry distance, item handling, and disposal requirements can also change the final price." },
    { q: "Are these cost guides final quotes?", a: "No. They are planning guides based on common junk removal pricing factors. The final price is confirmed before loading begins." },
    { q: "Can one item cost less than a full truckload?", a: "Yes. Smaller single-item pickups usually fall near the lower pricing tiers, but the minimum charge still applies." },
    { q: "Why do heavy materials cost more?", a: "Heavy materials can fill the truck by weight before they fill it by volume and may carry additional local disposal or handling costs." },
];

export default function CostGuideIndexPage() {
    const guides = getCostGuides();
    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Cost Guide", href: "/cost" },
    ];
    const guideCards = guides.map((guide) => {
        const range = formatCostRange(guide);
        return {
            eyebrow: range ? "Planning range" : "Cost guide",
            title: guide.title,
            desc: range
                ? `Typical smaller-job range: ${range} before the final quote is confirmed.`
                : "Review common cost factors before the final quote is confirmed.",
            href: `/cost/${guide.slug}`,
        };
    });
    const factorCards = [
        {
            eyebrow: "Factor 01",
            title: "Volume",
            desc: "Most junk removal pricing starts with the space your items take in the truck.",
        },
        {
            eyebrow: "Factor 02",
            title: "Access",
            desc: "Stairs, elevators, tight hallways, parking limits, and long carry distance can affect the quote.",
        },
        {
            eyebrow: "Factor 03",
            title: "Material type",
            desc: "Appliances, heavy debris, and regulated disposal streams may need different handling than general household junk.",
        },
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([
                    breadcrumbJsonLd(breadcrumbs.map(item => ({ name: item.label, path: item.href }))),
                    faqPageJsonLd(FAQS, "/cost"),
                ]) }}
            />
            <PageHero
                crumbs={breadcrumbs}
                eyebrow="Cost guides"
                titleStart="Junk removal cost guides "
                titleAccent={`in ${siteConfig.city}.`}
                lede="Pricing depends on item volume, access, weight, and local disposal requirements. These guides explain the main cost factors before you book."
                primaryCta={{ label: "View Pricing", href: "/pricing" }}
            />

            <DispatchCardSection
                eyebrow="Planning guides"
                heading="Compare common junk removal costs."
                body="Use these guides as planning context. The final quote is confirmed before loading begins."
                cards={guideCards}
                variant="service-links"
            />

            <DispatchCardSection
                eyebrow="Cost factors"
                heading="How to estimate junk removal cost."
                body="A small curbside item is usually simpler than a basement cleanout, heavy construction debris, or a multi-room estate cleanout."
                cards={factorCards}
                alt
            />

            <StaticFAQ eyebrow="Cost FAQ" heading="Junk removal cost questions." items={FAQS} />
            <CtaBand
                heading={{ lead: "Ready for a real quote?", accent: "Start with the job details." }}
                lede={`Book junk removal in ${siteConfig.city} with service type, load details, pickup address, access notes, schedule window, and quote review.`}
            />
        </>
    );
}
