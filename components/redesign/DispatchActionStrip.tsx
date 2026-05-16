import { DispatchActionStrip as DispatchBoardActionStrip } from "@/components/redesign/DispatchBlocks";
import { type SiteConfig } from "@/lib/siteConfig";

export default function DispatchActionStrip(_props: { config?: SiteConfig } = {}) {
    return <DispatchBoardActionStrip />;
}
