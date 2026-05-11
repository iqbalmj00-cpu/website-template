"use client"

/**
 * FaqPreview — homepage accordion of the 5 most-common questions. Pulls from
 * the master FAQ pool (`@/lib/catalogs/faqs`) with the same dashboard-aware
 * filtering as the full FAQ page. Curated to lead with the questions every
 * operator gets first.
 *
 * Client component — manages open/closed accordion state.
 */

import { useMemo, useState } from "react"
import Link from "next/link"
import { Plus, ArrowRight } from "lucide-react"
import { siteConfig, isSameDayEnabled, type SiteConfig } from "@/lib/siteConfig"
import { FAQ_POOL, filterFaqs, resolveTokens, type FaqItem } from "@/lib/catalogs/faqs"

/** Slugs we lead with on the homepage, in order. Falls back to the catalog
 *  order if any preferred slug is hidden by visibility filters. */
const PREFERRED_HOME_FAQS = [
  "sched-how-fast",
  "pricing-how-calculated",
  "items-what-you-take",
  "pricing-hidden-fees",
  "area-where",
]

interface FaqPreviewProps {
  limit?: number
  config?: SiteConfig
}

export default function FaqPreview({ limit = 5, config = siteConfig }: FaqPreviewProps = {}) {
  const { city, state, serviceArea, maxRadius, tier, offersDumpsterRental } = config

  const sameDay = isSameDayEnabled(config)
  const hasCommercial = tier === "growth"

  const items = useMemo(() => {
    const eligible = filterFaqs({ sameDayEnabled: sameDay, offersDumpsterRental, hasCommercial })
    const byId = new Map(eligible.map((q) => [q.id, q]))
    const ordered: FaqItem[] = []
    for (const slug of PREFERRED_HOME_FAQS) {
      const q = byId.get(slug)
      if (q) {
        ordered.push(q)
        byId.delete(slug)
      }
    }
    for (const q of eligible) {
      if (ordered.length >= limit) break
      if (byId.has(q.id)) ordered.push(q)
    }
    return ordered.slice(0, limit)
  }, [sameDay, offersDumpsterRental, hasCommercial, limit])

  const tokens: Record<string, string | number | null> = {
    city: city || "your area",
    state,
    serviceArea: serviceArea || (city ? `Greater ${city}` : "your area"),
    maxRadius: maxRadius ?? "",
  }

  const [openIdx, setOpenIdx] = useState<number | null>(0)

  if (items.length === 0) return null

  const totalAvailable = FAQ_POOL.length

  return (
    <section className="bg-paper py-[100px] px-[clamp(20px,4vw,64px)]">
      <div
        className="mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-12 lg:gap-16 items-start"
        style={{ maxWidth: 1480 }}
      >
        <div className="flex flex-col gap-3 lg:sticky lg:top-24 max-w-[34rem]">
          <div className="inline-flex items-center gap-2.5 font-mono text-[12px] font-medium uppercase tracking-[0.18em] text-brand">
            <span aria-hidden="true" className="w-6 h-[2px] bg-current rounded-sm" />
            FAQ
          </div>
          <h2 className="font-display font-extrabold text-[clamp(36px,5vw,56px)] leading-[1.02] tracking-[-0.02em] text-balance">
            Common questions, plain answers.
          </h2>
          <p className="text-[16px] leading-[1.55] text-muted mt-2">
            The most common questions we hear. See the full set on the FAQ page — {totalAvailable}+
            answers, organized by category.
          </p>
          <Link href="/faq" className="btn-secondary mt-4 self-start">
            See all FAQs <ArrowRight className="w-4 h-4" strokeWidth={2.4} aria-hidden="true" />
          </Link>
        </div>

        <div className="bg-paper-2 border border-line rounded-[14px] overflow-hidden">
          {items.map((item, i) => {
            const isOpen = openIdx === i
            const headingId = `faq-q-${i}`
            return (
              <div key={item.id} className="border-b border-line last:border-b-0">
                <button
                  type="button"
                  id={headingId}
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${i}`}
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full text-left grid grid-cols-[1fr_32px] sm:grid-cols-[auto_1fr_32px] gap-4 items-center px-6 py-5 min-h-[44px] hover:bg-paper transition-colors"
                >
                  <span className="hidden sm:inline font-mono text-[11px] font-semibold tracking-[0.14em] text-brand">
                    Q.{String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display font-semibold text-[18px] leading-[1.25] text-ink">
                    {item.question}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`grid place-items-center w-8 h-8 rounded-full bg-paper border border-line text-brand transition-all duration-300 ${
                      isOpen ? "rotate-45 bg-brand border-brand text-white" : ""
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </span>
                </button>
                <div
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={headingId}
                  hidden={!isOpen}
                  className="overflow-hidden transition-[max-height] duration-400 ease-out"
                  style={{ maxHeight: isOpen ? "320px" : 0 }}
                >
                  <div className="pl-6 sm:pl-[60px] pr-6 pb-5 text-[15.5px] leading-[1.6] text-muted max-w-[68ch]">
                    {resolveTokens(item.answer, tokens)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
