import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHero from "@/components/redesign/PageHero";
import ReviewAggregate from "@/components/redesign/ReviewAggregate";
import ReviewsFeatured from "@/components/redesign/ReviewsFeatured";
import CtaBand from "@/components/redesign/CtaBand";
import { createPageMetadata, localBusinessJsonLd } from "@/lib/seo";
import { getReviewSummary, hasVerifiedGoogleReviews, siteConfig } from "@/lib/siteConfig";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;
const summary = getReviewSummary(siteConfig);
const hasReviews = hasVerifiedGoogleReviews(siteConfig) && summary !== null;

export const metadata: Metadata = createPageMetadata({
    title: hasReviews ? `${siteConfig.companyName} Reviews` : "Reviews Not Available",
    description: hasReviews
        ? `Read verified Google reviews for ${siteConfig.companyName}, a junk removal service serving ${cityState}.`
        : "Verified reviews are not available for this website.",
    path: "/reviews",
    noIndex: !hasReviews,
});

export default function ReviewsPage() {
    if (!hasReviews || !summary) notFound();

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(localBusinessJsonLd({
                        aggregateRating: {
                            "@type": "AggregateRating",
                            ratingValue: summary.averageRating,
                            reviewCount: summary.totalCount,
                            bestRating: 5,
                            worstRating: 1,
                        },
                    })),
                }}
            />
            <PageHero
                crumbs={[
                    { label: "Home", href: "/" },
                    { label: "Reviews" },
                ]}
                titleStart="Verified Google reviews "
                titleAccent={`for ${siteConfig.companyName}.`}
                lede={`${summary.totalCount.toLocaleString()} Google review${summary.totalCount === 1 ? "" : "s"} are available for this business. Testimonials on this page come from verified Google review data.`}
            />
            <ReviewAggregate />
            <ReviewsFeatured />
            <CtaBand />
        </>
    );
}
