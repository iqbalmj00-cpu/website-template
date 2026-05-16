import { DispatchActionStrip as DispatchBoardActionStrip } from "@/components/redesign/DispatchBlocks";
import { type SiteConfig } from "@/lib/siteConfig";

export default function DispatchActionStrip({ config }: { config?: SiteConfig } = {}) {
    return <DispatchBoardActionStrip config={config} />;
}
