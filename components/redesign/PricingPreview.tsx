import { DispatchPricingBoard } from "@/components/redesign/DispatchBlocks";
import { siteConfig, type SiteConfig } from "@/lib/siteConfig";

type PricingPreviewProps = {
    config?: SiteConfig;
    limit?: number;
    title?: string;
    subtitle?: string;
    showDetailsLink?: boolean;
};

export default function PricingPreview({
    config = siteConfig,
    title = "Junk removal pricing by load size",
    subtitle,
}: PricingPreviewProps = {}) {
    return (
        <DispatchPricingBoard
            config={config}
            eyebrow="Pricing"
            heading={title}
            body={subtitle}
        />
    );
}
