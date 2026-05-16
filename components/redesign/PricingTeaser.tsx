/**
 * PricingTeaser — three-step pricing explainer paired with an inverted CTA
 * card that sends customers to the booking wizard for an estimate.
 *
 * Server component. It prints load-tier ranges only when client pricing is
 * configured through launch/preview config.
 */

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import {
  getPricingTiersForDisplay,
  hasConfiguredPricing,
  siteConfig,
  type SiteConfig,
} from "@/lib/siteConfig"
import { formatPricingRange } from "./PricingTierCards"

const STEPS = [
  {
    n: 1,
    label: "DETAILS",
    h: "Share the pickup details",
    p: "Add the item list, access notes, address, and photos when available so the job can be scoped clearly.",
  },
  {
    n: 2,
    label: "QUOTE",
    h: "Review the price",
    p: "The crew confirms the final price before loading begins, based on volume, access, weight, and enabled fees.",
  },
  {
    n: 3,
    label: "DONE",
    h: "Approve the haul-away",
    p: "After approval, accepted items are loaded, hauled away, and routed through available local options.",
  },
]

const FALLBACK_LOAD_ROWS = [
  { label: "Minimum pickup", fraction: "Small", desc: "Single item or small pile" },
  { label: "Quarter load", fraction: "1/4", desc: "Small room or curb pile" },
  { label: "Half load", fraction: "1/2", desc: "Garage wall or several bulky items" },
  { label: "Full load", fraction: "Full", desc: "Large cleanout or packed truck" },
]

const FACTORS = [
  { label: "Volume", desc: "Truck space used sets the clearest starting point." },
  { label: "Access", desc: "Stairs, elevators, gates, parking, and carry distance can affect labor." },
  { label: "Materials", desc: "Heavy, restricted, or special-handling items need review." },
  { label: "Location", desc: "Service area, route distance, and local rules stay visible." },
]

function DashedArrow({ vertical = false }: { vertical?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="grid place-items-center text-brand self-center"
      style={{ transform: vertical ? "rotate(90deg)" : undefined }}
    >
      <svg
        viewBox="0 0 28 12"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        className="w-7 h-3"
      >
        <line x1="2" y1="6" x2="22" y2="6" style={{ strokeDasharray: "4 5", animation: "ptzDash 18s linear infinite" }} />
        <polyline points="18 2 22 6 18 10" />
      </svg>
    </div>
  )
}

export default function PricingTeaser({ config = siteConfig }: { config?: SiteConfig } = {}) {
  const tiers = getPricingTiersForDisplay(6, config)
  const hasPricingTiers = hasConfiguredPricing(config) && tiers.length > 0
  const loadRows = hasPricingTiers
    ? tiers.map((tier) => ({
        label: tier.label,
        fraction: tier.fraction,
        desc: `${tier.fraction} truck load tier`,
        price: formatPricingRange(tier),
      }))
    : FALLBACK_LOAD_ROWS.map((row) => ({ ...row, price: "Estimate in booking" }))

  return (
    <section className="dispatch-pricing relative overflow-hidden bg-paper py-[100px] px-[clamp(20px,4vw,64px)] border-y border-line">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(var(--brand-rgb), 0.055) 1px, transparent 1px), linear-gradient(180deg, rgba(var(--brand-rgb), 0.055) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div
        className="relative mx-auto"
        style={{ maxWidth: 1480 }}
      >
        <div className="mb-9 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(420px,0.54fr)] lg:items-end">
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-2.5 font-mono text-[12px] font-medium uppercase tracking-[0.18em] text-brand">
              <span aria-hidden="true" className="w-6 h-[2px] bg-current rounded-sm" />
              Pricing clarity
            </div>
            <h2 className="font-display font-extrabold text-[clamp(36px,4.5vw,58px)] leading-[1.02] tracking-[-0.018em] max-w-[17ch]">
              Load bands need to feel physical.
            </h2>
            <p className="max-w-[60ch] text-[16px] leading-[1.65] text-muted">
              Pricing stays tied to the client&apos;s configured load tiers. The final quote is still
              confirmed before loading begins, based on volume, access, weight, and enabled fees.
            </p>
          </div>
          <Link href="/pricing" className="justify-self-start lg:justify-self-end inline-flex items-center gap-2 font-display text-[15px] font-bold text-brand hover:text-ink transition-colors">
            Review pricing factors <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
          <div className="price-board rounded-[14px] border border-line bg-paper-2 p-4 sm:p-5">
            <div className="grid gap-3">
              {loadRows.slice(0, 6).map((row, index) => {
                const fill = `${Math.min(92, 18 + index * 14)}%`
                return (
                  <div
                    key={`${row.label}-${index}`}
                    className="load-row grid grid-cols-1 gap-3 rounded-[12px] border border-line bg-paper p-4 sm:grid-cols-[minmax(0,1fr)_minmax(130px,0.52fr)_auto] sm:items-center"
                  >
                    <div>
                      <strong className="block font-display text-[18px] leading-tight text-ink">{row.label}</strong>
                      <small className="mt-1 block text-[13px] leading-[1.4] text-muted">{row.desc}</small>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-paper-3" aria-hidden="true">
                      <span
                        className="block h-full rounded-full bg-brand"
                        style={{ width: fill }}
                      />
                    </div>
                    <div className="font-display text-[22px] font-extrabold leading-none text-brand">
                      {row.price}
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="mt-4 text-[13.5px] leading-[1.6] text-muted">
              {hasPricingTiers
                ? "Displayed ranges come from the pricing configured for this client website."
                : "Load tiers are configured during launch; the booking flow remains the estimate entry point."}
            </p>
          </div>

          <aside className="price-board price-factors rounded-[14px] border border-line bg-ink p-6 text-paper">
            <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
              Final quote factors
            </div>
            <h3 className="mt-3 font-display text-[28px] font-extrabold leading-[1.05]">
              No mystery pricing copy.
            </h3>
            <div className="mt-6 grid gap-3">
              {FACTORS.map((factor, index) => (
                <div
                  key={factor.label}
                  className="factor grid grid-cols-[42px_1fr] gap-3 border-t border-paper/10 pt-4 first:border-t-0 first:pt-0"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-brand font-display text-[13px] font-bold text-white">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <div>
                    <strong className="block font-display text-[17px] leading-tight">{factor.label}</strong>
                    <small className="mt-1 block text-[13px] leading-[1.45] text-paper/65">{factor.desc}</small>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/book" className="btn-primary mt-7 w-full justify-center">
              Get Instant Quote <ArrowRight className="w-4 h-4" strokeWidth={2.4} aria-hidden="true" />
            </Link>
          </aside>
        </div>

        <div className="mt-10">
          <div className="mb-4 flex flex-col gap-2">
            <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
              Estimate path
            </div>
            <h3 className="font-display text-[clamp(28px,3.2vw,38px)] font-extrabold leading-tight">
              The site explains pricing, then sends the customer into booking.
            </h3>
          </div>

          {/* Desktop: inline 3-step row with animated connectors */}
          <ol className="hidden lg:grid lg:grid-cols-[1fr_32px_1fr_32px_1fr] items-stretch">
            {STEPS.map((step, i) => (
              <li key={step.n} className="contents">
                <div className="bg-paper-2 border border-line rounded-[14px] p-5 flex flex-col gap-2.5 transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-paper hover:border-brand">
                  <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase text-brand">
                    <b className="grid place-items-center w-6 h-6 bg-brand text-white rounded-full font-display font-bold text-[12px] not-italic">
                      {step.n}
                    </b>
                    {step.label}
                  </div>
                  <h3 className="font-display font-bold text-[20px] leading-[1.15]">{step.h}</h3>
                  <p className="text-[13.5px] leading-[1.5] text-muted">{step.p}</p>
                </div>
                {i < STEPS.length - 1 && <DashedArrow />}
              </li>
            ))}
          </ol>

          {/* Mobile: stacked column with vertical connectors */}
          <ol className="lg:hidden flex flex-col gap-3">
            {STEPS.map((step, i) => (
              <li key={step.n} className="flex flex-col gap-1.5">
                <div className="bg-paper-2 border border-line rounded-[14px] p-5 flex flex-col gap-2.5">
                  <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase text-brand">
                    <b className="grid place-items-center w-6 h-6 bg-brand text-white rounded-full font-display font-bold text-[12px]">
                      {step.n}
                    </b>
                    {step.label}
                  </div>
                  <h3 className="font-display font-bold text-[20px] leading-[1.15]">{step.h}</h3>
                  <p className="text-[13.5px] leading-[1.5] text-muted">{step.p}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="self-center py-1.5">
                    <DashedArrow vertical />
                  </div>
                )}
              </li>
            ))}
          </ol>

        </div>
      </div>

      <style>{`
        @keyframes ptzDash { to { stroke-dashoffset: -200; } }
      `}</style>
    </section>
  )
}
