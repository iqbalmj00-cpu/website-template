/**
 * reviewData.ts — Fetches Google Business reviews from the dashboard API.
 * Same pattern as blogData.ts: ISR with 1-hour revalidation, graceful fallback.
 */

import {
    getGoogleTestimonials,
    getReviewSummary,
    hasVerifiedGoogleReviews,
    siteConfig,
} from "./siteConfig";
import { getServerConfig } from "./serverConfig";

/* ── Types ─────────────────────────────────────────────────────────────── */

export type GoogleReview = {
    reviewerName: string;
    rating: number;
    body: string | null;
    replyBody: string | null;
    platform: string;
    reviewedAt: string;
};

export type ReviewStats = {
    averageRating: number;
    totalCount: number;
    distribution: Record<string, number>;
};

export type ReviewsResponse = {
    reviews: GoogleReview[];
    stats: ReviewStats | null;
};

/* ── Fetcher ──────────────────────────────────────────────────────────── */

/**
 * Fetch published Google reviews for this client.
 * Returns empty reviews and null stats on any failure so public review
 * surfaces can stay hidden until real Google review data is available.
 */
export async function fetchReviews(limit = 15): Promise<ReviewsResponse> {
    const envReviews = getGoogleTestimonials(limit);
    const envStats = getReviewSummary();

    if (envReviews.length > 0) {
        return { reviews: envReviews, stats: envStats };
    }

    const { dashboardUrl, siteToken } = getServerConfig();

    if (!dashboardUrl || !siteToken) {
        return { reviews: [], stats: envStats };
    }

    try {
        const url = `${dashboardUrl}/api/public/reviews?limit=${limit}&platform=google&minRating=4`;
        const res = await fetch(url, {
            headers: { "x-site-token": siteToken },
            next: { revalidate: 3600 },
        });

        if (!res.ok) return { reviews: [], stats: null };

        const data = await res.json();
        return {
            reviews: data.reviews ?? [],
            stats: data.stats ?? envStats,
        };
    } catch {
        return { reviews: [], stats: envStats };
    }
}

export async function hasVerifiedPublicReviews(): Promise<boolean> {
    if (hasVerifiedGoogleReviews()) return true;
    const { reviews, stats } = await fetchReviews(5);
    return reviews.length > 0 && Boolean(stats?.totalCount);
}
