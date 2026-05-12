/**
 * TestimonialsStrip — compact homepage strip fed only by Google review payloads
 * from onboarding/sync. It never invents review text, names, ratings, or counts.
 */

import Link from "next/link"
import { ArrowRight, Star } from "lucide-react"
import {
  getGoogleTestimonials,
  getReviewSummary,
  hasVerifiedGoogleReviews,
  siteConfig,
  type SiteConfig,
} from "@/lib/siteConfig"

export default function TestimonialsStrip({ config = siteConfig }: { config?: SiteConfig } = {}) {
  const testimonials = getGoogleTestimonials(3, config)
  if (testimonials.length === 0) return null

  const summary = hasVerifiedGoogleReviews(config) ? getReviewSummary(config) : null

  return (
    <section className="bg-paper py-[100px] px-[clamp(20px,4vw,64px)] border-y border-line">
      <div className="mx-auto" style={{ maxWidth: 1480 }}>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[46rem]">
            <div className="eyebrow">Google testimonials</div>
            <h2 className="mt-3 font-display text-[clamp(36px,5vw,58px)] font-extrabold leading-[1.02] tracking-normal text-ink">
              What customers say after pickup.
            </h2>
          </div>
          {summary && (
            <div className="rounded-full border border-line bg-paper-2 px-5 py-3">
              <div className="flex items-center gap-2 font-display text-[16px] font-bold text-ink">
                <Star className="h-4 w-4 fill-brand text-brand" aria-hidden="true" />
                {summary.averageRating.toFixed(1)}
                <span className="font-body text-[13px] font-semibold text-muted">
                  - {summary.totalCount.toLocaleString()} Google review{summary.totalCount === 1 ? "" : "s"}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {testimonials.map((review) => (
            <article key={`${review.reviewerName}-${review.reviewedAt}`} className="rounded-[14px] border border-line bg-paper-2 p-6">
              <div
                role="img"
                aria-label={`${review.rating} out of 5 stars`}
                className="flex items-center gap-1 text-brand"
              >
                {Array.from({ length: Math.round(review.rating) }).map((_, index) => (
                  <Star key={index} className="h-3.5 w-3.5 fill-current" strokeWidth={1.8} aria-hidden="true" />
                ))}
              </div>
              <p className="mt-4 font-display text-[20px] font-semibold leading-[1.35] text-ink text-pretty">
                &ldquo;{review.body}&rdquo;
              </p>
              <div className="mt-5 flex items-center justify-between gap-4 border-t border-line pt-4">
                <div>
                  <div className="font-display text-[15px] font-bold text-ink">{review.reviewerName}</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                    Google review
                  </div>
                </div>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-white font-display text-[13px] font-bold">
                  {review.reviewerName.trim().charAt(0).toUpperCase() || "G"}
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/reviews" className="inline-flex items-center gap-2 font-display text-[15px] font-bold text-brand hover:text-ink transition-colors">
            Read more verified reviews <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
