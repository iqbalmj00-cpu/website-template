import { DispatchWorkGrid } from "@/components/redesign/DispatchBlocks";
import { type SiteConfig } from "@/lib/siteConfig";

export default function ProcessSection({ config }: { config?: SiteConfig } = {}) {
    return <DispatchWorkGrid config={config} />;
}
