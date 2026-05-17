import type { Metadata } from "next";
import PageHero from "@/components/redesign/PageHero";
import StaticFAQ from "@/components/redesign/StaticFAQ";
import CtaBand from "@/components/redesign/CtaBand";
import { DispatchCardSection } from "@/components/redesign/DispatchBlocks";
import { VisualEstimateFactors, VisualPricingScaleSection } from "@/components/redesign/VisualReplacementBlocks";
import { createPageMetadata, faqPageJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;

const PRICING_FAQS = [
    {
        q: "Where can I see a junk removal price estimate?",
        a: "When load-tier pricing is available, this page shows planning ranges. Use the booking flow to enter contact information, service type, load size, pickup address, access details, schedule window, and quote review.",
    },
    {
        q: "How is junk removal pricing calculated?",
        a: "Pricing depends on truck volume, item weight, access, distance, material type, and any applicable handling or disposal fees. The final price is confirmed before loading begins.",
    },
    {
        q: "Do stairs, basements, or long carries affect pricing?",
        a: "Access can affect the estimate because stairs, basements, elevators, gates, parking limits, and long carries can change the labor required.",
    },
    {
        q: "Can I get an exact quote before loading starts?",
        a: "Yes. The crew confirms the final price before loading starts, after reviewing the item volume, access, material type, and any applicable fees.",
    },
];

const ESTIMATE_STEPS = [
    {
        label: "Step 01",
        title: "Choose service and load details",
        body: "Select the service type, load size, and job notes that best match the pickup.",
    },
    {
        label: "Step 02",
        title: "Add access details",
        body: "Address, ZIP code, stairs, parking, gates, elevators, and carry distance can all affect the estimate.",
    },
    {
        label: "Step 03",
        title: "Review the estimate",
        body: "The booking wizard provides the estimate path, and the final price is confirmed before loading begins.",
    },
];

export const metadata: Metadata = createPageMetadata({
    title: `Junk Removal Pricing in ${siteConfig.city}`,
    description: `Review junk removal load-tier pricing in ${cityState} and learn how ${siteConfig.companyName} estimates jobs before final quote confirmation.`,
    path: "/pricing",
});

export default function PricingPage() {
    const estimateCards = ESTIMATE_STEPS.map((step) => ({
        eyebrow: step.label,
        title: step.title,
        desc: step.body,
    }));
    const promiseCards = [
        { title: "Booking is the estimate entry point", desc: "The wizard collects the service, load, address, access, schedule, and quote details needed for a useful estimate." },
        { title: "Final price before loading", desc: "The crew confirms the final price before loading begins, after job details and access are reviewed." },
        { title: "Cleaner details, cleaner estimate", desc: "Access notes and load details reduce surprises before the quote review step." },
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(PRICING_FAQS, "/pricing")) }}
            />
            <PageHero
                crumbs={[
                    { label: "Home", href: "/" },
                    { label: "Pricing" },
                ]}
                titleStart="Get a junk removal estimate "
                titleAccent={`through booking.`}
                lede="Load-tier ranges give customers a planning guide. The booking wizard adds item details, access notes, and the pickup address so the estimate can match the actual job."
                primaryCta={{ label: "Get an Instant Quote", href: "/book" }}
            />
            <VisualPricingScaleSection
                config={siteConfig}
                eyebrow="Pricing"
                title="Pick the load that fits the job."
            />
            <DispatchCardSection
                eyebrow="Estimate process"
                heading="Pricing starts with load size and job details."
                cards={estimateCards}
                variant="detail-grid"
                alt
            />

            <VisualEstimateFactors config={siteConfig} />
            <DispatchCardSection
                eyebrow="Quote rules"
                heading="What customers should expect."
                cards={promiseCards}
                variant="coverage-cards"
                alt
            />

            <StaticFAQ eyebrow="Pricing FAQ" heading="Questions before you approve a quote." items={PRICING_FAQS} />
            <CtaBand />
        </>
    );
}
