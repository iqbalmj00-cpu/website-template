"use client"

/**
 * GroupedFAQ — full FAQ surface organized by category. Tabs across the top
 * (Pricing / Items / Scheduling / Areas / Disposal / Commercial), accordion
 * below. Categories with no eligible questions hide automatically.
 *
 * Questions are filtered by dashboard capability:
 *   - same-day-only questions hide when sameDayEnabled is false
 *   - commercial-only questions hide when tier !== "growth"
 *   - dumpster-only questions hide when offersDumpsterRental is false
 *
 * Answers go through token resolution ({{city}}, {{maxRadius}}, etc.) so the
 * same answer text adapts to every operator.
 *
 * Client component — manages active-tab + open-question state.
 */

import { useMemo, useState, useRef, type KeyboardEvent } from "react"
import Link from "next/link"
import {
  DollarSign,
  Package,
  Calendar,
  MapPin,
  Recycle,
  Building2,
  Plus,
  ArrowRight,
  type LucideIcon,
} from "lucide-react"
import { siteConfig, isSameDayEnabled, telHref, formatPhone, type SiteConfig } from "@/lib/siteConfig"
import {
  FAQ_CATEGORIES,
  filterFaqs,
  resolveTokens,
  type FaqCategory,
  type FaqItem,
} from "@/lib/catalogs/faqs"

const CATEGORY_ICONS: Record<FaqCategory["iconKey"], LucideIcon> = {
  pricing: DollarSign,
  items: Package,
  scheduling: Calendar,
  areas: MapPin,
  disposal: Recycle,
  commercial: Building2,
}

interface GroupedFAQProps {
  heading?: string
  eyebrow?: string
  config?: SiteConfig
}

export default function GroupedFAQ({
  heading = "Questions, by category.",
  eyebrow = "FAQ",
  config = siteConfig,
}: GroupedFAQProps = {}) {
  const { city, state, serviceArea, maxRadius, phoneNumber, offersDumpsterRental, tier } = config
  const sameDay = isSameDayEnabled(config)
  const hasCommercial = tier === "growth"

  const allFiltered = useMemo(
    () => filterFaqs({ sameDayEnabled: sameDay, offersDumpsterRental, hasCommercial }),
    [sameDay, offersDumpsterRental, hasCommercial],
  )

  const tokens: Record<string, string | number | null> = {
    city: city || "your area",
    state,
    serviceArea: serviceArea || (city ? `Greater ${city}` : "your area"),
    maxRadius: maxRadius ?? "",
    phone: phoneNumber ? formatPhone(phoneNumber) : "",
  }

  const grouped = useMemo(() => {
    const map = new Map<string, FaqItem[]>()
    for (const cat of FAQ_CATEGORIES) map.set(cat.id, [])
    for (const item of allFiltered) {
      const bucket = map.get(item.category)
      if (bucket) bucket.push(item)
    }
    return map
  }, [allFiltered])

  const visibleCategories = FAQ_CATEGORIES.filter((c) => (grouped.get(c.id)?.length ?? 0) > 0)

  const [active, setActive] = useState(0)
  const [openId, setOpenId] = useState<string | null>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  if (visibleCategories.length === 0) return null

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault()
      const next =
        e.key === "ArrowRight"
          ? (i + 1) % visibleCategories.length
          : (i - 1 + visibleCategories.length) % visibleCategories.length
      setActive(next)
      setOpenId(null)
      tabRefs.current[next]?.focus()
    }
    if (e.key === "Home") {
      e.preventDefault()
      setActive(0)
      setOpenId(null)
      tabRefs.current[0]?.focus()
    }
    if (e.key === "End") {
      e.preventDefault()
      const last = visibleCategories.length - 1
      setActive(last)
      setOpenId(null)
      tabRefs.current[last]?.focus()
    }
  }

  const cat = visibleCategories[active]
  const items = grouped.get(cat.id) ?? []
  const totalItems = visibleCategories.reduce((acc, c) => acc + (grouped.get(c.id)?.length ?? 0), 0)

  return (
    <section className="bg-paper py-[100px] px-[clamp(20px,4vw,64px)]">
      <div className="mx-auto" style={{ maxWidth: 1480 }}>
        <div className="flex justify-between items-end gap-8 mb-7 flex-wrap">
          <div className="flex flex-col gap-3 max-w-[36ch]">
            <div className="inline-flex items-center gap-2.5 font-mono text-[12px] font-medium uppercase tracking-[0.18em] text-brand">
              <span aria-hidden="true" className="w-6 h-[2px] bg-current rounded-sm" />
              {eyebrow}
            </div>
            <h2 className="font-display font-extrabold text-[clamp(36px,5vw,56px)] leading-[1.02] tracking-[-0.02em] text-balance">
              {heading}
            </h2>
          </div>
          <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted">
            {totalItems} answer{totalItems === 1 ? "" : "s"} · {visibleCategories.length}{" "}
            categor{visibleCategories.length === 1 ? "y" : "ies"}
          </div>
        </div>

        <div
          role="tablist"
          aria-label="FAQ categories"
          className="flex gap-2 flex-wrap pb-6 border-b border-line mb-6"
        >
          {visibleCategories.map((c, i) => {
            const isOn = i === active
            const Icon = CATEGORY_ICONS[c.iconKey]
            const count = grouped.get(c.id)?.length ?? 0
            return (
              <button
                key={c.id}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                role="tab"
                id={`faq-tab-${c.id}`}
                aria-selected={isOn}
                aria-controls={`faq-panel-${c.id}`}
                tabIndex={isOn ? 0 : -1}
                onClick={() => {
                  setActive(i)
                  setOpenId(null)
                }}
                onKeyDown={(e) => onTabKey(e, i)}
                className={`inline-flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-full font-body font-semibold text-[13.5px] border transition-colors duration-200 ${
                  isOn
                    ? "bg-ink text-paper border-ink"
                    : "bg-paper-2 text-ink border-line hover:border-brand hover:-translate-y-0.5"
                }`}
              >
                <Icon className="w-4 h-4 text-brand shrink-0" strokeWidth={2} aria-hidden="true" />
                {c.label}
                <span
                  className={`ml-1 font-mono text-[10px] font-semibold tracking-[0.12em] px-2 py-0.5 rounded-full ${
                    isOn ? "text-brand" : "text-muted"
                  }`}
                  style={
                    isOn
                      ? { backgroundColor: "rgba(var(--brand-rgb), 0.20)" }
                      : { backgroundColor: "rgba(13, 24, 20, 0.10)" }
                  }
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <div
          key={cat.id}
          role="tabpanel"
          id={`faq-panel-${cat.id}`}
          aria-labelledby={`faq-tab-${cat.id}`}
          className="bg-paper-2 border border-line rounded-[14px] overflow-hidden"
          style={{ animation: "gfaqFade 0.4s cubic-bezier(0.22, 1, 0.36, 1)" }}
        >
          {items.map((item, idx) => {
            const id = `${cat.id}-${idx}`
            const isOpen = openId === id
            const num = `Q.${String(idx + 1).padStart(2, "0")}`
            const headingId = `${id}-q`
            const resolved = resolveTokens(item.answer, tokens)
            return (
              <div key={id} className="border-b border-line last:border-b-0">
                <button
                  type="button"
                  id={headingId}
                  aria-expanded={isOpen}
                  aria-controls={`${id}-a`}
                  onClick={() => setOpenId(isOpen ? null : id)}
                  className="w-full text-left grid grid-cols-[1fr_32px] sm:grid-cols-[auto_1fr_32px] gap-4 items-center px-6 py-5 min-h-[44px] hover:bg-paper transition-colors"
                >
                  <span className="hidden sm:inline font-mono text-[11px] font-semibold tracking-[0.14em] text-brand">
                    {num}
                  </span>
                  <span className="font-display font-semibold text-[19px] leading-[1.25] text-ink">
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
                  id={`${id}-a`}
                  role="region"
                  aria-labelledby={headingId}
                  hidden={!isOpen}
                  className="overflow-hidden transition-[max-height] duration-400 ease-out"
                  style={{ maxHeight: isOpen ? "480px" : 0 }}
                >
                  <div className="pl-[60px] pr-6 pb-6 text-[15.5px] leading-[1.6] text-muted max-w-[70ch]">
                    {resolved}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-7 flex justify-between items-center gap-3.5 px-6 py-4 bg-ink text-paper rounded-[14px] flex-wrap">
          <div className="font-display font-semibold text-[16px]">
            Don&apos;t see your question?{" "}
            <span className="text-brand">We&apos;re a real human at the other end.</span>
          </div>
          {phoneNumber ? (
            <a
              href={telHref(phoneNumber)}
              aria-label={`Call us at ${formatPhone(phoneNumber)}`}
              className="btn-primary"
            >
              Call Us{" "}
              <ArrowRight className="w-4 h-4" strokeWidth={2.4} aria-hidden="true" />
            </a>
          ) : (
            <Link href="/book" className="btn-primary">
              Book Now <ArrowRight className="w-4 h-4" strokeWidth={2.4} aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>

      <style>{`
        @keyframes gfaqFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  )
}
