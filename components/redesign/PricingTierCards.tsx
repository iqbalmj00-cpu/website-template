import { VisualPricingScaleSection } from "@/components/redesign/VisualReplacementBlocks";
import { siteConfig, type PricingTier, type SiteConfig } from "@/lib/siteConfig";

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
}: PricingTierCardsProps = {}) {
  return <VisualPricingScaleSection config={config} />;
}
