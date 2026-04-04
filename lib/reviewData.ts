/**
 * reviewData.ts — Fetches Google Business reviews from the dashboard API.
 * Same pattern as blogData.ts: ISR with 1-hour revalidation, graceful fallback.
 */

import { siteConfig } from "./siteConfig";

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
 * Returns empty reviews and null stats on any failure so the page
 * falls back gracefully to siteConfig testimonials.
 */
export async function fetchReviews(limit = 10): Promise<ReviewsResponse> {
    if (!siteConfig.dashboardUrl || !siteConfig.siteToken) {
        return { reviews: [], stats: null };
    }

    try {
        const url = `${siteConfig.dashboardUrl}/api/public/reviews?limit=${limit}&platform=google&minRating=4`;
        const res = await fetch(url, {
            headers: { "x-site-token": siteConfig.siteToken },
            next: { revalidate: 3600 },
        });

        if (!res.ok) return { reviews: [], stats: null };

        const data = await res.json();
        return {
            reviews: data.reviews ?? [],
            stats: data.stats ?? null,
        };
    } catch {
        return { reviews: [], stats: null };
    }
}
