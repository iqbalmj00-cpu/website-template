"use client"

/**
 * RelatedSvc — horizontal-scroll rail of service cards. Resolves dashboard
 * service strings to catalog entries (with icons and safe blurbs)
 * and exposes prev/next scroll buttons.
 *
 * Client component — uses useRef + scrollBy for the prev/next controls.
 */

import { useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { siteConfig, type SiteConfig } from "@/lib/siteConfig"
import { resolveServiceCatalogIds } from "@/lib/catalogs/services"

interface RelatedSvcProps {
  eyebrow?: string
  heading?: string
  /** Service ID to exclude — used on service-detail pages so a service
   *  doesn't recommend itself. */
  currentServiceId?: string
  tone?: "paper" | "paper-2"
  limit?: number
  config?: SiteConfig
}

const HEADLINE_TAGS = [
  "Most booked",
  "Often paired",
  "Same crew",
  "Popular route",
  "Customer favorite",
  "Big jobs",
]

export default function RelatedSvc({
  eyebrow,
  heading = "Services people often pair with this.",
  currentServiceId,
  tone = "paper",
  limit = 5,
  config = siteConfig,
}: RelatedSvcProps = {}) {
  const { services } = config
  const railRef = useRef<HTMLDivElement>(null)
  const scroll = (dir: 1 | -1) =>
    railRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" })

  const resolved = resolveServiceCatalogIds(services).filter((s) => s.id !== currentServiceId)
  const cards = resolved.slice(0, limit)

  if (cards.length === 0) return null

  const bg = tone === "paper-2" ? "bg-paper-2" : "bg-paper"
  return (
    <section className={`${bg} py-[100px] px-[clamp(20px,4vw,64px)]`}>
      <div className="mx-auto" style={{ maxWidth: 1480 }}>
        <div className="flex items-end justify-between gap-8 mb-9 flex-wrap">
          <div className="flex flex-col gap-3 max-w-[36rem]">
            {eyebrow && (
              <div className="inline-flex items-center gap-2.5 font-mono text-[12px] font-medium uppercase tracking-[0.18em] text-brand">
                <span aria-hidden="true" className="w-6 h-[2px] bg-current rounded-sm" />
                {eyebrow}
              </div>
            )}
            <h2 className="font-display font-extrabold text-[clamp(36px,4.4vw,52px)] leading-[1.02] tracking-[-0.02em] text-balance">
              {heading}
            </h2>
          </div>
          {cards.length > 3 && (
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => scroll(-1)}
                aria-label="Previous"
                className="grid place-items-center w-11 h-11 rounded-full border border-line text-ink hover:bg-ink hover:text-paper hover:border-ink transition-colors"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={2.2} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scroll(1)}
                aria-label="Next"
                className="grid place-items-center w-11 h-11 rounded-full border border-line text-ink hover:bg-ink hover:text-paper hover:border-ink transition-colors"
              >
                <ChevronRight className="w-4 h-4" strokeWidth={2.2} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        <div
          ref={railRef}
          className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {cards.map((c, i) => {
            const tag = `${String(i + 1).padStart(2, "0")} · ${
              HEADLINE_TAGS[i % HEADLINE_TAGS.length].toUpperCase()
            }`
            return (
              <Link
                key={c.id}
                href={`/services/${c.id}`}
                className="group relative bg-paper-2 border border-line rounded-[14px] p-7 min-w-[300px] max-w-[320px] snap-start flex flex-col gap-5 overflow-hidden transition-all duration-300 ease-out hover:bg-ink hover:text-paper hover:border-brand hover:-translate-y-1"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle at 100% 0%, rgba(var(--brand-rgb), 0.18), transparent 60%)",
                  }}
                />
                <div className="relative font-mono text-[11px] tracking-[0.16em] uppercase text-brand">
                  {tag}
                </div>
                <div className="relative mt-auto">
                  <h3 className="font-display font-bold text-[22px] leading-tight tracking-[-0.012em]">
                    {c.name}
                  </h3>
                  <p className="text-[14px] text-muted group-hover:text-paper/70 mt-1.5 transition-colors">
                    {c.blurb}
                  </p>
                </div>
                <div className="relative grid place-items-center w-9 h-9 rounded-full border border-line group-hover:border-brand group-hover:bg-brand group-hover:text-white transition-all duration-300">
                  <ArrowRight
                    className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-rotate-45"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  )
}
