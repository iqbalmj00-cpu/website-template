/**
 * Credentials — five-tile trust-bar strip composed from dashboard-provided
 * proof only (license, insurance, certifications, recycling rate, same-day,
 * year founded). Each badge asserts a fact the dashboard has shipped.
 *
 * Server component. Hides entirely (returns null) when the dashboard has no
 * proof to surface OR when designConfig.showTrustBar is false.
 */

import { Shield, Award, Recycle, Clock, BadgeCheck, ShieldCheck, type LucideIcon } from "lucide-react"
import { siteConfig, hasLicense, hasInsurance, isSameDayEnabled, type SiteConfig } from "@/lib/siteConfig"
import { shouldRenderTrustBar } from "@/lib/visibility"

interface Badge {
  Icon: LucideIcon
  title: string
  detail: string
}

export default function Credentials({
  config = siteConfig,
  showDiversion = true,
}: {
  config?: SiteConfig
  showDiversion?: boolean
} = {}) {
  if (!shouldRenderTrustBar(config)) return null

  const { licenseNumber, insuranceCarrier, certifications, recyclingRate, yearFounded, sameDayCutoffTime } =
    config

  const badges: Badge[] = []

  if (hasLicense(config) && hasInsurance(config)) {
    badges.push({
      Icon: Shield,
      title: "Licensed & Insured",
      detail: insuranceCarrier ? `Carrier: ${insuranceCarrier}` : licenseNumber,
    })
  } else if (hasLicense(config)) {
    badges.push({ Icon: ShieldCheck, title: "Licensed", detail: licenseNumber })
  } else if (hasInsurance(config)) {
    badges.push({ Icon: Shield, title: "Insured", detail: insuranceCarrier })
  }

  for (const cert of certifications) {
    badges.push({ Icon: Award, title: cert, detail: "Verified credential" })
  }

  if (showDiversion && recyclingRate !== null && recyclingRate > 0) {
    badges.push({
      Icon: Recycle,
      title: `${recyclingRate}% Target`,
      detail: "Diversion goal",
    })
  }

  if (isSameDayEnabled(config)) {
    badges.push({
      Icon: Clock,
      title: "Same-Day Service",
      detail: sameDayCutoffTime ? "Book early in the day" : "When schedule allows",
    })
  }

  if (yearFounded) {
    badges.push({
      Icon: BadgeCheck,
      title: `Est. ${yearFounded}`,
      detail: "Locally owned",
    })
  }

  if (badges.length === 0) return null

  // Adapt the grid density to the badge count — keeps the row from looking
  // lopsided when only 3-4 facts are configured.
  const gridCols =
    badges.length >= 5
      ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
      : badges.length === 4
        ? "grid-cols-2 md:grid-cols-2 lg:grid-cols-4"
        : "grid-cols-2 md:grid-cols-3 lg:grid-cols-3"

  return (
    <section className="bg-paper py-[100px] px-[clamp(20px,4vw,64px)] border-y border-line">
      <div className={`mx-auto grid ${gridCols} gap-3`} style={{ maxWidth: 1480 }}>
        {badges.map(({ Icon, title, detail }) => (
          <div
            key={title}
            className="group bg-paper-2 border border-line rounded-[14px] p-[22px] flex gap-3.5 items-center transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-ink hover:text-paper"
          >
            <div className="grid place-items-center w-11 h-11 rounded-[12px] bg-brand text-white shrink-0 transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-105">
              <Icon className="w-[22px] h-[22px]" strokeWidth={2} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="font-display font-bold text-[14px] leading-tight truncate">{title}</div>
              <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted group-hover:text-paper/60 mt-1 transition-colors truncate">
                {detail}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
