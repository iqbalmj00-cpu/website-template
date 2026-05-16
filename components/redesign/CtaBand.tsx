/**
 * CtaBand — full-width final-CTA strip. Atmospheric ink background with a
 * slow rotating brand-conic sweep; left side has the headline + phone number,
 * right side has a brand card promoting the booking link.
 *
 * Server component. Accepts optional heading + lede overrides for per-page
 * tone variation.
 */

import { Calendar, ArrowRight } from "lucide-react"
import { siteConfig, telHref, formatPhone, isSameDayEnabled, fmt24to12, type SiteConfig } from "@/lib/siteConfig"

interface CtaBandProps {
  heading?: { lead: string; accent: string }
  lede?: string
  config?: SiteConfig
}

export default function CtaBand({ heading, lede, config = siteConfig }: CtaBandProps = {}) {
  const { phoneNumber, tagline, sameDayCutoffTime, serviceArea, city } = config

  const heroHeading = heading ?? {
    lead: "Ready to clear it out?",
    accent: isSameDayEnabled(config) ? "We'll haul it today." : "We'll haul it for you.",
  }

  const cutoffLabel = sameDayCutoffTime ? fmt24to12(sameDayCutoffTime) : ""
  const sameDayLine = isSameDayEnabled(config)
    ? `Same-day pickup${city ? ` in ${city}` : ""}${cutoffLabel ? ` — book by ${cutoffLabel}` : ""}.`
    : `Serving ${serviceArea && serviceArea !== "your area" ? serviceArea : city || "your area"}.`

  return (
    <section className="relative overflow-hidden bg-ink text-paper py-[100px] px-[clamp(20px,4vw,64px)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-55"
        style={{
          background:
            "linear-gradient(90deg, rgba(var(--brand-rgb), 0.12) 1px, transparent 1px), linear-gradient(180deg, rgba(var(--brand-rgb), 0.12) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -top-[20%] -left-[20%] w-[140%] h-[140%] pointer-events-none"
        style={{
          background:
            "conic-gradient(from 200deg at 50% 50%, transparent 0deg, rgba(var(--brand-rgb), 0.06) 60deg, transparent 120deg)",
          animation: "ctabSpin 24s linear infinite",
        }}
      />

      <div
        className="relative mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-14 items-center"
        style={{ maxWidth: 1480 }}
      >
        <div>
          <h2 className="font-display font-extrabold text-[clamp(48px,6vw,96px)] leading-[0.96] tracking-[-0.025em]">
            {heroHeading.lead}
            <br />
            <span className="text-brand">{heroHeading.accent}</span>
          </h2>
          <p className="text-[18px] leading-[1.5] text-paper/60 mt-[18px] max-w-[50ch]">
            {lede ?? tagline} {sameDayLine}
          </p>
          {phoneNumber && (
            <a
              href={telHref(phoneNumber)}
              aria-label={`Call us at ${formatPhone(phoneNumber)}`}
              className="inline-flex items-baseline gap-3.5 mt-7 font-display font-bold text-[28px] hover:text-brand transition-colors"
            >
              <span>
                <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-paper/60">
                  Call now
                </span>
                {formatPhone(phoneNumber)}
              </span>
            </a>
          )}
        </div>

        <div className="flex flex-col gap-3.5">
          <div className="relative bg-brand text-white rounded-[14px] p-8 overflow-hidden flex flex-col gap-3.5">
            <div className="relative grid place-items-center w-10 h-10 rounded-[12px] bg-white/20">
              <Calendar className="w-[22px] h-[22px]" strokeWidth={2} aria-hidden="true" />
            </div>
            <h4 className="relative font-display font-bold text-[24px] leading-[1.1]">
              Book online with the job details
            </h4>
            <p className="relative text-[14px] opacity-90">
              Share the pickup address, item list, photos when available, and access notes.
            </p>
            <a
              href="/book"
              className="relative inline-flex items-center gap-2 mt-auto self-start px-5 py-3 bg-white text-brand rounded-full font-display font-bold text-[14px] hover:bg-ink hover:text-white transition-colors"
            >
              Get Instant Quote <ArrowRight className="w-4 h-4" strokeWidth={2.4} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ctabSpin { to { transform: rotate(360deg); } }
      `}</style>
    </section>
  )
}
