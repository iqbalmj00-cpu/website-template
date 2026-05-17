import { DispatchFinalCta } from "@/components/redesign/DispatchBlocks";
import { siteConfig, type SiteConfig } from "@/lib/siteConfig";

interface CtaBandProps {
    heading?: { lead: string; accent: string };
    lede?: string;
    config?: SiteConfig;
}

export default function CtaBand({ heading, lede, config = siteConfig }: CtaBandProps = {}) {
    const headingText = heading ? `${heading.lead} ${heading.accent}`.trim() : undefined;
    return (
        <DispatchFinalCta
            config={config}
            heading={headingText}
            body={lede}
        />
    );
}
