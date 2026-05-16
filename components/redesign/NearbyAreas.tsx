import { DispatchAreaSection } from "@/components/redesign/DispatchBlocks";
import { siteConfig, type SiteConfig } from "@/lib/siteConfig";

interface NearbyAreasProps {
    heading?: string;
    currentSlug?: string;
    limit?: number;
    config?: SiteConfig;
}

export default function NearbyAreas({ config = siteConfig }: NearbyAreasProps = {}) {
    return <DispatchAreaSection config={config} />;
}
