/**
 * SameDayBanner — slim orange strip pinned above the site header that announces
 * same-day pickup availability. Hides automatically when same-day isn't enabled
 * in the dashboard.
 *
 * Server component — no client-side hooks. Drop in above <Navbar /> in layout.tsx.
 */

import { Phone } from "lucide-react"
import { siteConfig, formatPhone, telHref, fmt24to12, type SiteConfig } from "@/lib/siteConfig"
import { shouldRenderSameDayBanner } from "@/lib/visibility"

export default function SameDayBanner({ config = siteConfig }: { config?: SiteConfig } = {}) {
  if (!shouldRenderSameDayBanner(config)) return null

  const { phoneNumber, sameDayCutoffTime } = config
  const cutoff = sameDayCutoffTime ? fmt24to12(sameDayCutoffTime) : ""

  return (
    <div className="relative overflow-hidden bg-brand text-white px-[clamp(20px,4vw,64px)] py-3.5 flex flex-wrap items-center justify-center gap-3 text-[13px] font-medium">
      <span
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)",
          animation: "sdbnShine 4s linear infinite",
        }}
      />
      <span
        aria-hidden="true"
        className="relative w-2 h-2 rounded-full bg-white"
        style={{
          boxShadow: "0 0 0 0 rgba(255,255,255,0.7)",
          animation: "sdbnPulse 1.6s ease-out infinite",
        }}
      />
      <span className="relative">
        <b className="font-semibold">Same-day pickup may be available</b>
        {cutoff && <> — book by {cutoff}</>}
      </span>
      {phoneNumber && (
        <a
          href={telHref(phoneNumber)}
          aria-label={`Call us at ${formatPhone(phoneNumber)}`}
          className="relative inline-flex items-center gap-2 bg-white text-brand px-4 min-h-[44px] py-2 rounded-full font-semibold text-[13px] hover:bg-ink hover:text-white transition-colors"
        >
          <Phone className="w-3.5 h-3.5" strokeWidth={2.4} aria-hidden="true" />
          Call Us
        </a>
      )}
      <style>{`
        @keyframes sdbnShine { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes sdbnPulse {
          0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.7); }
          70% { box-shadow: 0 0 0 8px rgba(255,255,255,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
        }
      `}</style>
    </div>
  )
}
