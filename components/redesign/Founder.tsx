/**
 * Founder — two-column "why we started" block. Left side is a generative
 * brand-color portrait that displays the founder's initial; right side has
 * the founder quote and a numbered stats strip composed from real dashboard
 * proof (yearFounded → years in business, testimonials count, recyclingRate).
 *
 * Server component. Returns null when the dashboard hasn't shipped both
 * `founderName` and `aboutStory` — we don't fabricate founders.
 */

import { Quote } from "lucide-react"
import { siteConfig, getReviewSummary, hasVerifiedGoogleReviews, type SiteConfig } from "@/lib/siteConfig"
import { shouldRenderFounder } from "@/lib/visibility"

function getFounderInitial(name: string): string {
  const t = name.trim()
  return t.length > 0 ? t.charAt(0).toUpperCase() : ""
}

export default function Founder({ config = siteConfig }: { config?: SiteConfig } = {}) {
  if (!shouldRenderFounder(config)) return null

  const { founderName, aboutStory, city, yearFounded, companyName, recyclingRate } = config

  const captionParts: string[] = []
  if (city) captionParts.push(city)
  if (yearFounded) captionParts.push(`est. ${yearFounded}`)
  const founderCaption = captionParts.join(" · ")

  // Stat row: only assert numbers we have proof for.
  const stats: { value: string; label: string }[] = []
  const reviewSummary = hasVerifiedGoogleReviews(config) ? getReviewSummary(config) : null
  if (reviewSummary) {
    stats.push({
      value: `${reviewSummary.totalCount.toLocaleString()}`,
      label: "Google reviews",
    })
    stats.push({ value: `${reviewSummary.averageRating.toFixed(1)} ★`, label: "Google rating" })
  }
  if (yearFounded) {
    const years = new Date().getFullYear() - parseInt(yearFounded, 10)
    if (Number.isFinite(years) && years > 0) {
      stats.push({ value: `${years}`, label: "Years in business" })
    }
  }
  if (recyclingRate !== null && recyclingRate > 0 && stats.length < 3) {
    stats.push({ value: `${recyclingRate}%`, label: "Diversion target" })
  }

  const initial = getFounderInitial(founderName)

  return (
    <section className="bg-paper-2 py-[100px] px-[clamp(20px,4vw,64px)]">
      <div className="mx-auto" style={{ maxWidth: 1480 }}>
        <div className="bg-paper border border-line rounded-[14px] overflow-hidden grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Generative portrait — replaces nicely with a real headshot when
              the dashboard adds a `founderImageUrl` field in the future. */}
          <div className="relative aspect-[4/5] lg:aspect-auto bg-brand">
            <svg
              className="w-full h-full"
              viewBox="0 0 400 460"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="portG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(var(--brand-rgb))" />
                  <stop offset="100%" stopColor="rgba(var(--brand-rgb), 0.55)" />
                </linearGradient>
              </defs>
              <rect width="400" height="460" fill="url(#portG)" />
              <text
                x="200"
                y="260"
                textAnchor="middle"
                fontFamily="var(--font-space-grotesk, system-ui), sans-serif"
                fontWeight="800"
                fontSize="200"
                fill="rgba(13,24,20,0.55)"
              >
                {initial}
              </text>
              <circle cx="60" cy="60" r="20" fill="rgba(255,255,255,0.18)" />
              <circle cx="350" cy="80" r="12" fill="rgba(255,255,255,0.18)" />
              <circle cx="40" cy="380" r="14" fill="rgba(255,255,255,0.12)" />
            </svg>
            <div className="absolute bottom-7 left-7 right-7 text-white">
              <div className="font-display font-extrabold text-[28px] leading-none tracking-[-0.014em]">
                {founderName}
              </div>
              {founderCaption && (
                <div className="font-mono text-[11px] tracking-[0.16em] uppercase opacity-85 mt-1.5">
                  Founder · {founderCaption}
                </div>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="p-10 lg:p-14 flex flex-col gap-7 justify-center">
            <div className="font-mono text-[12px] tracking-[0.18em] uppercase text-brand">
              — Why we started
            </div>
            <div className="relative">
              <Quote
                className="absolute -top-2 -left-1 w-10 h-10 text-brand"
                strokeWidth={1.6}
                aria-hidden="true"
                style={{ opacity: 0.2 }}
              />
              <blockquote className="relative font-display font-bold text-[clamp(22px,2.4vw,32px)] leading-[1.25] tracking-[-0.012em] pl-9">
                {aboutStory}
              </blockquote>
            </div>
            <div className="text-[14px] text-muted">
              <b className="font-semibold text-ink">{founderName}</b> · Founder of {companyName}
            </div>
            {stats.length > 0 && (
              <div
                className={`grid gap-6 pt-7 border-t border-line ${
                  stats.length === 1 ? "grid-cols-1" : stats.length === 2 ? "grid-cols-2" : "grid-cols-3"
                }`}
              >
                {stats.map((s) => (
                  <div key={s.label}>
                    <b className="font-display font-extrabold text-[24px] text-brand block leading-none">
                      {s.value}
                    </b>
                    <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted mt-2 block">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
