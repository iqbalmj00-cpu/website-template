import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/redesign/PageHero";
import StaticFAQ from "@/components/redesign/StaticFAQ";
import CtaBand from "@/components/redesign/CtaBand";
import { DispatchCardSection } from "@/components/redesign/DispatchBlocks";
import { breadcrumbJsonLd, createPageMetadata, faqPageJsonLd } from "@/lib/seo";
import { formatCostRange, getCostGuideBySlug, getCostGuides } from "@/lib/costData";
import { siteConfig } from "@/lib/siteConfig";
import { getClientServices } from "@/lib/serviceData";

type PageProps = {
    params: {
        itemSlug: string;
    };
};

export const dynamicParams = false;

export function generateStaticParams() {
    return getCostGuides().map((item) => ({ itemSlug: item.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
    const guide = getCostGuideBySlug(params.itemSlug);
    if (!guide) {
        return createPageMetadata({
            title: "Cost Guide Not Found",
            description: "This cost guide is not available.",
            path: `/cost/${params.itemSlug}`,
            noIndex: true,
        });
    }

    return createPageMetadata({
        title: `${guide.title} in ${siteConfig.city}`,
        description: guide.metaDescription,
        path: `/cost/${guide.slug}`,
    });
}

export default function CostGuidePage({ params }: PageProps) {
    const guide = getCostGuideBySlug(params.itemSlug);
    if (!guide) notFound();

    const relatedService = guide.serviceSlug ? getClientServices().find(service => service.slug === guide.serviceSlug) : undefined;
    const range = formatCostRange(guide);
    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Cost Guide", href: "/cost" },
        { label: guide.title, href: `/cost/${guide.slug}` },
    ];
    const faqItems = [
        { q: `How much does ${guide.item} removal cost in ${siteConfig.city}?`, a: range ? `Smaller ${guide.item} removal jobs often use the lower pricing tiers. This guide uses ${range} as a planning range before the final on-site quote.` : `Pricing for ${guide.item} removal depends on volume, access, weight, and local handling requirements. The crew confirms the final price before loading begins.` },
        { q: `What affects ${guide.item} removal pricing?`, a: `Common factors include ${guide.factors.slice(0, 4).join(", ").toLowerCase()}. The crew confirms the final price before loading begins.` },
        { q: `What is included with ${guide.item} removal?`, a: `${guide.included.join(", ")} are included when the item is approved for hauling and the final quote is accepted.` },
        { q: "Is the online range a final price?", a: "No. The online range is a planning guide. Final pricing depends on item volume, weight, access, and disposal requirements seen at the pickup." },
    ];

    const pricingCards = [
        {
            eyebrow: range ? "Planning range" : "Quote review",
            title: range || "Final quote reviewed",
            desc: range
                ? "Based on the current load pricing ranges. Large or unusually heavy jobs may require a higher on-site estimate."
                : "The job details are reviewed for volume, access, material type, and local handling requirements before the final quote is confirmed.",
        },
    ];

    const factorCards = guide.factors.map((factor) => ({
        title: factor,
        desc: `This can affect ${guide.item} removal cost because the crew must account for loading time, truck space, disposal, or safe access before confirming the quote.`,
    }));

    const includedCards = guide.included.map((item) => ({
        title: item,
        desc: "Included when the item is approved for hauling and the final quote is accepted before loading begins.",
    }));

    const prepCards = [
        {
            title: "Describe access",
            desc: "Mention stairs, basements, elevators, gates, parking limits, storage units, or long carry paths during booking.",
        },
        {
            title: "Mention heavy materials",
            desc: "Dense, oversized, or specialty disposal items can change the estimate after the crew reviews the job details.",
        },
        {
            title: "Check restrictions",
            desc: "Hazardous, flammable, medical, and regulated materials are not accepted with standard junk removal.",
            href: "/items-we-dont-take",
        },
    ];

    const relatedCards = relatedService
        ? [{
            eyebrow: "Related service",
            title: relatedService.title,
            desc: relatedService.shortDesc,
            href: `/services/${relatedService.slug}`,
        }]
        : [];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([
                    breadcrumbJsonLd(breadcrumbs.map(item => ({ name: item.label, path: item.href }))),
                    faqPageJsonLd(faqItems, `/cost/${guide.slug}`),
                ]) }}
            />
            <PageHero
                crumbs={breadcrumbs}
                eyebrow="Local cost guide"
                titleStart={guide.title}
                titleAccent={` in ${siteConfig.city}`}
                lede={`${guide.metaDescription} Final pricing is confirmed before work begins so you can approve or decline the job.`}
                primaryCta={{ label: "Get an Instant Quote", href: "/book" }}
            />
            <DispatchCardSection
                eyebrow="Cost snapshot"
                heading={`${guide.item} removal pricing starts with job details.`}
                body="Use this as a planning guide only. The final quote is confirmed before anything is loaded."
                cards={pricingCards}
                variant="fact-grid"
            />
            <DispatchCardSection
                eyebrow="Pricing factors"
                heading={`What affects ${guide.item} removal cost?`}
                cards={factorCards}
                variant="detail-grid"
                alt
            />
            <DispatchCardSection
                eyebrow="Included"
                heading="What is included?"
                cards={includedCards}
                variant="detail-grid"
            />
            <DispatchCardSection
                eyebrow="Prep notes"
                heading={`How to prepare for ${guide.item} removal.`}
                body="Good preparation helps the crew quote the job accurately and remove the item safely."
                cards={prepCards}
                variant="coverage-cards"
                alt
            />
            <DispatchCardSection
                eyebrow="Service match"
                heading="Related service page."
                cards={relatedCards}
                variant="service-links"
            />
            <StaticFAQ eyebrow="Cost FAQ" heading={`${guide.title} FAQ`} items={faqItems} />
            <CtaBand
                heading={{ lead: `Get a firm quote for`, accent: `${guide.item} removal.` }}
                lede="Use the booking flow with service type, load details, pickup address, access notes, schedule window, and quote review."
            />
        </>
    );
}
