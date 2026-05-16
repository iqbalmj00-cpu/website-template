import { DispatchReviewRail } from "@/components/redesign/DispatchBlocks";
import { siteConfig, type SiteConfig } from "@/lib/siteConfig";

export default function TestimonialsStrip({ config = siteConfig }: { config?: SiteConfig } = {}) {
    return <DispatchReviewRail config={config} />;
}
