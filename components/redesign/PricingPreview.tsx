import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
    getPricingTiersForDisplay,
    siteConfig,
    type SiteConfig,
} from "@/lib/siteConfig";
import SectionShell from "./SectionShell";
import PricingTierCards from "./PricingTierCards";

type PricingPreviewProps = {
    config?: SiteConfig;
    limit?: number;
    title?: string;
    subtitle?: string;
    showDetailsLink?: boolean;
};

export default function PricingPreview({
    config = siteConfig,
    limit = 6,
    title = "Configured load-tier pricing",
    subtitle = "These ranges come from the client pricing sent at launch. The crew still confirms the final quote before loading begins.",
    showDetailsLink = true,
}: PricingPreviewProps = {}) {
    const tiers = getPricingTiersForDisplay(limit, config);
    if (tiers.length === 0) return null;

    return (
        <SectionShell
            tone="card"
            eyebrow="Pricing"
            title={title}
            subtitle={subtitle}
        >
            <PricingTierCards config={config} limit={limit} />
            {showDetailsLink && (
                <div className="mt-8">
                    <Link href="/pricing" className="inline-flex items-center gap-2 font-black text-brand no-underline hover:underline">
                        Review pricing factors <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                </div>
            )}
        </SectionShell>
    );
}
