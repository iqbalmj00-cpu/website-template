import type { Metadata } from "next";
import PageHero from "@/components/redesign/PageHero";
import CtaBand from "@/components/redesign/CtaBand";
import { DispatchCardSection } from "@/components/redesign/DispatchBlocks";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";
import { getVerifiableTrustSignals, siteConfig } from "@/lib/siteConfig";
import { hasVerifiedPublicReviews } from "@/lib/reviewData";

const path = "/best-junk-removal";
const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Best Junk Removal Guide", href: path },
];

export const metadata: Metadata = createPageMetadata({
    title: `Best Junk Removal in ${siteConfig.city}`,
    description: `A practical guide to comparing junk removal companies in ${siteConfig.city}: pricing, accepted items, reviews, insurance, scheduling, and responsible disposal questions.`,
    path,
});

export default async function BestJunkRemovalPage() {
    const trustSignals = getVerifiableTrustSignals();
    const showReviews = await hasVerifiedPublicReviews();
    const comparisonCards = [
        {
            title: "Clear pricing process",
            desc: "Look for load-based pricing, quote review, and final price confirmation before loading begins.",
        },
        {
            title: "Published item rules",
            desc: "A strong provider explains accepted items, restricted materials, and what details can affect a quote.",
        },
        {
            title: "Easy booking path",
            desc: "The booking flow should collect contact details, service type, job details, pickup address, access notes, schedule window, and quote review.",
        },
        {
            title: "Verified reviews",
            desc: "Real Google review data should appear only when it is available and connected to the business.",
            href: showReviews ? "/reviews" : undefined,
        },
        {
            title: "Configured credentials",
            desc: "Insurance, licensing, or company credentials should be shown only when the business has provided them.",
        },
        {
            title: "Responsible disposal limits",
            desc: "Donation, recycling, landfill, and prohibited item language should be practical instead of overpromising.",
        },
    ];
    const trustCards = trustSignals.map((signal) => ({
        title: signal,
        desc: `${siteConfig.companyName} displays this because it is configured for this business.`,
    }));
    const resourceCards = [
        { title: "View pricing", desc: "Review load-based planning ranges before booking.", href: "/pricing" },
        { title: "Check accepted items", desc: "See which junk removal items can be requested.", href: "/items-we-take" },
        { title: "Review prohibited items", desc: "Check materials that cannot be hauled through standard service.", href: "/items-we-dont-take" },
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs.map(item => ({ name: item.label, path: item.href })))) }}
            />
            <PageHero
                crumbs={breadcrumbs}
                eyebrow="Comparison guide"
                titleStart="How to choose the best junk removal company"
                titleAccent={` in ${siteConfig.city}.`}
                lede="Compare pricing, accepted items, scheduling, reviews, credentials, and service expectations before booking a pickup."
                primaryCta={{ label: "View Pricing", href: "/pricing" }}
            />
            <DispatchCardSection
                eyebrow="What to compare"
                heading="Use real service details, not generic claims."
                body="The best junk removal choice depends on quote clarity, accepted item rules, schedule fit, and whether the company explains its limits."
                cards={comparisonCards}
                variant="detail-grid"
            />
            <DispatchCardSection
                eyebrow="Company snapshot"
                heading={`${siteConfig.companyName} at a glance.`}
                cards={trustCards}
                variant="fact-grid"
                alt
            />
            <DispatchCardSection
                eyebrow="Decision tools"
                heading="Review the details before booking."
                cards={resourceCards}
                variant="service-links"
            />
            <CtaBand
                heading={{ lead: "Ready to compare", accent: "a real quote?" }}
                lede="Enter service type, load details, pickup address, access notes, schedule window, and quote review."
            />
        </>
    );
}
