import { DispatchHomeHero } from "@/components/redesign/DispatchBlocks";
import { siteConfig, type SiteConfig } from "@/lib/siteConfig";

export default function HomeHero({ config = siteConfig }: { config?: SiteConfig } = {}) {
  return <DispatchHomeHero config={config} />;
}
