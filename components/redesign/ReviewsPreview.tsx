import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { fetchReviews } from "@/lib/reviewData";
import SectionShell from "./SectionShell";

export default async function ReviewsPreview() {
    const { reviews, stats } = await fetchReviews(3);

    if (reviews.length === 0 || !stats?.totalCount) {
        return null;
    }

    return (
        <SectionShell
            align="center"
            eyebrow="Google reviews"
            title="Customer Feedback"
            subtitle={`Available Google review data shows an average rating of ${stats.averageRating} across ${stats.totalCount} reviews.`}
        >
            <div className="grid gap-4 md:grid-cols-3">
                {reviews.map((review) => (
                    <article key={`${review.reviewerName}-${review.reviewedAt}`} className="rounded-card border border-border bg-card p-6 text-left">
                        <div className="mb-4 flex gap-1 text-brand" aria-label={`${review.rating} out of 5 stars`}>
                            {Array.from({ length: 5 }, (_, index) => (
                                <Star
                                    key={index}
                                    className="h-4 w-4"
                                    fill={index < review.rating ? "currentColor" : "none"}
                                    aria-hidden="true"
                                />
                            ))}
                        </div>
                        {review.body && (
                            <p className="text-sm leading-6 text-muted">&ldquo;{review.body}&rdquo;</p>
                        )}
                        <div className="mt-5 border-t border-border pt-4">
                            <p className="font-black text-foreground">{review.reviewerName}</p>
                            <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-muted">
                                Google review
                            </p>
                        </div>
                    </article>
                ))}
            </div>
            <div className="mt-8">
                <Link href="/reviews" className="inline-flex items-center gap-2 font-black text-brand no-underline hover:underline">
                    Read reviews <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
            </div>
        </SectionShell>
    );
}
