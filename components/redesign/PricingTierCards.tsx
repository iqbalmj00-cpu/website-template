import {
  getPricingTiersForDisplay,
  siteConfig,
  type PricingTier,
  type SiteConfig,
} from "@/lib/siteConfig"

type PricingTierCardsProps = {
  config?: SiteConfig
  limit?: number
  compact?: boolean
  className?: string
}

export function formatPricingRange(tier: PricingTier): string {
  const min = Math.round(tier.min)
  const max = Math.round(tier.max)
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })

  if (min === max) return formatter.format(min)
  return `${formatter.format(min)} - ${formatter.format(max)}`
}

export default function PricingTierCards({
  config = siteConfig,
  limit = 6,
  compact = false,
  className = "",
}: PricingTierCardsProps = {}) {
  const tiers = getPricingTiersForDisplay(limit, config)
  if (tiers.length === 0) return null

  return (
    <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {tiers.map((tier) => (
        <article
          key={tier.id}
          className="group rounded-[14px] border border-line bg-paper p-5 transition-all duration-200 hover:-translate-y-1 hover:border-brand hover:shadow-paper"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
              {tier.fraction} truck
            </p>
            <span className="rounded-full border border-line bg-paper-2 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
              Load tier
            </span>
          </div>
          <h3 className={`${compact ? "mt-3 text-[20px]" : "mt-4 text-[24px]"} font-display font-bold leading-tight text-ink`}>
            {tier.label}
          </h3>
          <p className={`${compact ? "mt-3 text-[28px]" : "mt-5 text-[34px]"} font-display font-extrabold leading-none text-brand`}>
            {formatPricingRange(tier)}
          </p>
          <p className="mt-3 text-[13.5px] leading-[1.5] text-muted">
            Planning range from the client&apos;s configured pricing. Final quote is confirmed before loading begins.
          </p>
        </article>
      ))}
    </div>
  )
}
