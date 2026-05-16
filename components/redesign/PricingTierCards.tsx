import {
  getPricingTiersForDisplay,
  hasConfiguredPricing,
  siteConfig,
  type PricingTier,
  type SiteConfig,
} from "@/lib/siteConfig";

type PricingTierCardsProps = {
  config?: SiteConfig;
  limit?: number;
  compact?: boolean;
  className?: string;
};

export function formatPricingRange(tier: PricingTier): string {
  const min = Math.round(tier.min);
  const max = Math.round(tier.max);
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  if (min === max) return formatter.format(min);
  return `${formatter.format(min)} - ${formatter.format(max)}`;
}

export default function PricingTierCards({
  config = siteConfig,
  limit = 6,
  className = "",
}: PricingTierCardsProps = {}) {
  const tiers = getPricingTiersForDisplay(limit, config);
  if (!hasConfiguredPricing(config) || tiers.length === 0) return null;

  return (
    <div className={`load-card-grid ${className}`}>
      {tiers.map((tier) => (
        <article key={tier.id} className="load-card">
          <small>{tier.fraction} load</small>
          <h3>{tier.label}</h3>
          <p>Planning range for this load size. Final quote is confirmed before loading begins.</p>
          <div className="load-price">
            <span>Planning range</span>
            <strong>{formatPricingRange(tier)}</strong>
          </div>
        </article>
      ))}
    </div>
  );
}
