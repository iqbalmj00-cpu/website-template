/**
 * ReviewsFeatured — mosaic grid of Google reviews with two hero tiles
 * (longest quotes) and 3-5 secondary tiles.
 *
 * Server component. Returns null with fewer than 4 testimonials — the mosaic
 * shape looks broken with less.
 */

import { siteConfig, getGoogleTestimonials, type SiteConfig } from "@/lib/siteConfig"
import { shouldRenderFeaturedReviews } from "@/lib/visibility"

type Variant = "big-orange" | "big-ink" | "med" | "sm"

const VARIANT_CLASSES: Record<Variant, string> = {
  "big-orange": "col-span-2 lg:col-span-3 bg-brand text-ink border-brand p-8",
  "big-ink": "col-span-2 lg:col-span-3 bg-ink text-paper border-ink p-8",
  med: "col-span-2 lg:col-span-2 bg-paper-2 border-line p-6",
  sm: "col-span-2 lg:col-span-3 bg-paper-2 border-line p-6",
}

const STAR_COLOR: Record<Variant, string> = {
  "big-orange": "text-ink",
  "big-ink": "text-brand",
  med: "text-brand",
  sm: "text-brand",
}

const QUOTE_SIZE: Record<Variant, string> = {
  "big-orange": "text-[22px] leading-[1.3]",
  "big-ink": "text-[22px] leading-[1.3]",
  med: "text-[16px] leading-[1.4]",
  sm: "text-[16px] leading-[1.4]",
}

const QUOTE_MARK_COLOR: Record<Variant, string> = {
  "big-orange": "before:text-ink",
  "big-ink": "before:text-brand",
  med: "before:text-brand",
  sm: "before:text-brand",
}

/** Border between quote and attribution. Production lacks `line-inv`, so we
 *  pass inline rgba for the inverted variants and Tailwind tokens for the
 *  light ones. */
const BY_BORDER_STYLE: Record<Variant, { className: string; inline?: string }> = {
  "big-orange": { className: "border-dashed", inline: "rgba(13, 24, 20, 0.20)" },
  "big-ink": { className: "border-dashed", inline: "rgba(250, 246, 239, 0.10)" },
  med: { className: "border-dashed border-line" },
  sm: { className: "border-dashed border-line" },
}

const AVATAR_CLASSES: Record<Variant, string> = {
  "big-orange": "bg-ink text-paper border-ink",
  "big-ink": "bg-brand text-paper border-brand",
  med: "bg-paper text-ink border-line",
  sm: "bg-paper text-ink border-line",
}

const TAG_COLOR: Record<Variant, { className?: string; inline?: string }> = {
  "big-orange": { inline: "rgba(13, 24, 20, 0.65)" },
  "big-ink": { inline: "rgba(250, 246, 239, 0.60)" },
  med: { className: "text-muted" },
  sm: { className: "text-muted" },
}

function shapeVariants(n: number): Variant[] {
  const variants: Variant[] = []
  for (let i = 0; i < n; i++) {
    if (i === 0) variants.push("big-orange")
    else if (i === 1) variants.push("big-ink")
    else if (i < 5) variants.push("med")
    else variants.push("sm")
  }
  return variants
}

function getInitial(name: string): string {
  const t = name.trim()
  return t.length > 0 ? t.charAt(0).toUpperCase() : "·"
}

export default function ReviewsFeatured({ config = siteConfig }: { config?: SiteConfig } = {}) {
  if (!shouldRenderFeaturedReviews(config)) return null

  const { city } = config
  const items = getGoogleTestimonials(7, config)

  // Promote the two longest quotes into the hero slots — short quotes look
  // anemic in the big tiles.
  const indexed = items.map((t, i) => ({ ...t, originalIdx: i, len: (t.body ?? "").length }))
  const sorted = [...indexed].sort((a, b) => b.len - a.len)
  const hero1 = sorted[0]
  const hero2 = sorted[1]
  const heroIdxs = new Set([hero1?.originalIdx, hero2?.originalIdx].filter((x): x is number => x != null))
  const rest = indexed.filter((t) => !heroIdxs.has(t.originalIdx))
  const ordered = [hero1, hero2, ...rest].filter(Boolean)

  const variants = shapeVariants(ordered.length)

  return (
    <section className="bg-paper py-[100px] px-[clamp(20px,4vw,64px)]">
      <div className="mx-auto mb-8 flex justify-between items-end gap-8 flex-wrap" style={{ maxWidth: 1480 }}>
        <div className="flex flex-col gap-3 max-w-[36ch]">
          <div className="inline-flex items-center gap-2.5 font-mono text-[12px] font-medium uppercase tracking-[0.18em] text-brand">
            <span aria-hidden="true" className="w-6 h-[2px] bg-current rounded-sm" />
            Featured reviews
          </div>
          <h2 className="font-display font-extrabold text-[clamp(36px,5vw,56px)] leading-[1.02] tracking-[-0.02em]">
            {city ? `${city}, in their own words.` : "Customers, in their own words."}
          </h2>
        </div>
      </div>

      <div className="mx-auto grid grid-cols-2 lg:grid-cols-6 gap-3.5" style={{ maxWidth: 1480 }}>
        {ordered.map((review, i) => {
          const variant = variants[i]
          const border = BY_BORDER_STYLE[variant]
          const tag = TAG_COLOR[variant]
          return (
            <article
              key={`${review.reviewerName}-${i}`}
              className={`${VARIANT_CLASSES[variant]} border rounded-[14px] flex flex-col gap-3 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brand`}
            >
              <div
                role="img"
                aria-label={`${review.rating} out of 5 stars`}
                className={`text-[14px] tracking-[4px] ${STAR_COLOR[variant]}`}
              >
                <span aria-hidden="true">{"★".repeat(Math.round(review.rating))}</span>
              </div>
              <p
                className={`font-display font-semibold ${QUOTE_SIZE[variant]} tracking-[-0.005em] text-pretty before:content-['\\201C'] ${QUOTE_MARK_COLOR[variant]} before:text-[32px] before:leading-[0.4] before:align-[-0.3em] before:mr-1 before:font-display before:font-bold`}
              >
                {review.body}
              </p>
              <div
                className={`flex gap-3 items-center mt-auto pt-3.5 border-t ${border.className}`}
                style={border.inline ? { borderTopColor: border.inline } : undefined}
              >
                <div
                  className={`grid place-items-center w-9 h-9 rounded-full border font-display font-bold text-[13px] ${AVATAR_CLASSES[variant]}`}
                >
                  {getInitial(review.reviewerName)}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="font-display font-bold text-[13.5px] leading-[1.1] truncate">
                    {review.reviewerName}
                  </div>
                  <div
                    className={`font-mono text-[10px] tracking-[0.14em] uppercase ${tag.className ?? ""} truncate`}
                    style={tag.inline ? { color: tag.inline } : undefined}
                  >
                    Google review
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
