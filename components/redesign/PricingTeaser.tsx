import { DispatchPricingBoard } from "@/components/redesign/DispatchBlocks";
import { siteConfig, type SiteConfig } from "@/lib/siteConfig";

export default function PricingTeaser({ config = siteConfig }: { config?: SiteConfig } = {}) {
    return <DispatchPricingBoard config={config} />;
}
