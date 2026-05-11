/**
 * ReviewAggregate — big Google rating summary. Left side has the
 * giant numeric rating + headline; right side shows a customer-category
 * breakdown from the dashboard review distribution.
 *
 * Server component. Returns null unless verified Google review data exists.
 */

import { Star } from "lucide-react"
import { siteConfig, getReviewSummary, getGoogleTestimonials, type SiteConfig } from "@/lib/siteConfig"
import { shouldRenderReviewAggregate } from "@/lib/visibility"

export default function ReviewAggregate({ config = siteConfig }: { config?: SiteConfig } = {}) {
  if (!shouldRenderReviewAggregate(config)) return null

  const { gbpUrl, city } = config
  const summary = getReviewSummary(config)
  const testimonials = getGoogleTestimonials(4, config)
  if (!summary) return null

  const distributionRows = [5, 4, 3, 2, 1]
    .map((rating) => {
      const count = summary.distribution[String(rating)] ?? 0
      return {
        rating,
        count,
        pct: summary.totalCount > 0 ? Math.round((count / summary.totalCount) * 100) : 0,
      }
    })
    .filter((row) => row.count > 0)

  return (
    <section className="bg-ink text-paper py-[100px] px-[clamp(20px,4vw,64px)]">
      <div
        className="mx-auto grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-14 items-center"
        style={{ maxWidth: 1480 }}
      >
        <div>
          <div className="font-mono text-[12px] font-medium tracking-[0.18em] uppercase text-brand">
            — Verified reviews
          </div>
          <div className="flex items-baseline gap-3 mt-3.5">
            <div className="font-display font-extrabold text-[clamp(80px,11vw,144px)] leading-[0.9] tracking-[-0.03em] text-paper">
              {summary.averageRating.toFixed(1)}
            </div>
            <div className="font-display font-extrabold text-[clamp(48px,6vw,72px)] leading-none text-brand">
              ★
            </div>
          </div>
          <p className="mt-4 text-[16px] leading-[1.5] text-paper/60 max-w-[36ch]">
            <b className="text-paper font-bold">
              {summary.totalCount.toLocaleString()} Google review{summary.totalCount === 1 ? "" : "s"}.
            </b>{" "}
            {city ? `Feedback from customers around ${city}.` : "Feedback from verified Google reviews."}
          </p>
          {gbpUrl && (
            <a
              href={gbpUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 mt-6 font-display font-semibold text-[14px] text-brand hover:text-paper transition-colors"
            >
              See full review profile →
            </a>
          )}
        </div>

        {distributionRows.length > 0 && (
          <div
            className="rounded-[14px] p-2"
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(250, 246, 239, 0.10)",
            }}
          >
            {distributionRows.map((row, i) => (
              <div
                key={row.rating}
                className="grid grid-cols-[1fr_auto] items-center gap-[18px] px-5 py-4 transition-colors hover:bg-white/5"
                style={
                  i < distributionRows.length - 1
                    ? { borderBottom: "1px solid rgba(250, 246, 239, 0.10)" }
                    : undefined
                }
              >
                <div className="min-w-0">
                  <div className="font-display font-bold text-[15px] text-paper truncate">
                    {row.rating}-star Google reviews
                  </div>
                  <div className="mt-2 h-[6px] rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-brand rounded-full"
                      style={{ width: `${Math.max(row.pct, 4)}%` }}
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <div className="flex items-baseline gap-1 shrink-0">
                  <b className="font-display font-extrabold text-[22px] leading-none text-paper tracking-[-0.012em]">
                    {row.count}
                  </b>
                  <Star className="w-4 h-4 text-brand fill-brand" aria-hidden="true" />
                </div>
              </div>
            ))}
          </div>
        )}
        {distributionRows.length === 0 && testimonials.length > 0 && (
          <div
            className="rounded-[14px] p-7"
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(250, 246, 239, 0.10)",
            }}
          >
            <p className="text-[15px] leading-[1.6] text-paper/70">
              Recent Google reviews are available on the reviews page and Google Business Profile.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
