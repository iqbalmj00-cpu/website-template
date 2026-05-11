/**
 * PricingTeaser — three-step pricing explainer paired with an inverted CTA
 * card that sends customers to the booking wizard for an estimate.
 *
 * Server component. It never prints public dollar ranges.
 */

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { SiteConfig } from "@/lib/siteConfig"

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

export default function PricingTeaser(_props: { config?: SiteConfig } = {}) {
  return (
    <section className="relative overflow-hidden bg-paper py-20 px-[clamp(20px,4vw,64px)] border-y border-line">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 95% 50%, rgba(var(--brand-rgb), 0.07), transparent 60%)",
        }}
      />

      <div
        className="relative mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)] gap-14 items-center"
        style={{ maxWidth: 1480 }}
      >
        <div>
          <div className="flex flex-col gap-3 mb-8">
            <div className="inline-flex items-center gap-2.5 font-mono text-[12px] font-medium uppercase tracking-[0.18em] text-brand">
              <span aria-hidden="true" className="w-6 h-[2px] bg-current rounded-sm" />
              Pricing details · here&apos;s how
            </div>
            <h2 className="font-display font-extrabold text-[clamp(28px,3.5vw,42px)] leading-[1.05] tracking-[-0.018em] max-w-[22ch]">
              Pricing in three small steps.
            </h2>
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

        {/* Inverted CTA card */}
        <aside className="relative bg-ink text-paper rounded-[14px] p-8 flex flex-col gap-3.5 overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{
              inset: "-50% -10% auto auto",
              width: "80%",
              aspectRatio: "1",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 50% 50%, rgba(var(--brand-rgb), 0.30), transparent 70%)",
            }}
          />
          <span
            className="relative inline-flex w-fit items-baseline gap-1.5 px-3 py-1.5 rounded-full font-mono text-[11px] font-semibold tracking-[0.14em] uppercase text-brand"
            style={{
              backgroundColor: "rgba(var(--brand-rgb), 0.15)",
              border: "1px solid rgba(var(--brand-rgb), 0.35)",
            }}
          >
            Estimate in the booking wizard
          </span>
          <h3 className="relative font-display font-bold text-[26px] leading-[1.1] tracking-[-0.012em]">
            Start with job details, then see an estimate.
          </h3>
          <p className="relative text-[14.5px] leading-[1.5] text-paper/60">
            Add the item list, access details, and photos when available. The booking flow can
            calculate an estimate before the final quote is confirmed.
          </p>
          <Link href="/book" className="relative btn-primary mt-auto self-start">
            Get Instant Quote <ArrowRight className="w-4 h-4" strokeWidth={2.4} aria-hidden="true" />
          </Link>
          <div
            className="relative flex gap-3.5 font-mono text-[10px] tracking-[0.14em] uppercase text-paper/60 pt-3.5"
            style={{ borderTop: "1px solid rgba(250, 246, 239, 0.10)" }}
          >
            <span>Estimate first</span>
            <span>·</span>
            <span>Final quote before loading</span>
          </div>
        </aside>
      </div>

      <style>{`
        @keyframes ptzDash { to { stroke-dashoffset: -200; } }
      `}</style>
    </section>
  )
}
