import { DispatchPageHero } from "@/components/redesign/DispatchBlocks";
import { siteConfig, type SiteConfig } from "@/lib/siteConfig";
import { type JunkRemovalImageRole } from "@/lib/templateAssets/junkRemoval";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  crumbs: BreadcrumbItem[];
  titleStart: string;
  titleAccent: string;
  lede: string;
  eyebrow?: string;
  primaryCta?: { label: string; href: string };
  hideTrustPanel?: boolean;
  coverageMap?: boolean;
  media?: {
    role?: JunkRemovalImageRole;
    src?: string | null;
    alt?: string;
    routeKey?: string;
    serviceTitle?: string;
    locationName?: string;
    caption?: string;
  };
  config?: SiteConfig;
}

export default function PageHero({
  crumbs,
  eyebrow = "Page overview",
  titleStart,
  titleAccent,
  lede,
  primaryCta = { label: "Book Now", href: "/book" },
  coverageMap = false,
  media,
  config = siteConfig,
}: PageHeroProps) {
  return (
    <DispatchPageHero
      config={config}
      crumbs={crumbs}
      eyebrow={eyebrow}
      title={<>{titleStart}{titleAccent}</>}
      lede={lede}
      media={media ? { ...media, label: media.caption || eyebrow, caption: media.caption } : undefined}
      coverageMap={coverageMap}
      primaryCta={primaryCta}
      secondaryCta={{ label: "View Pricing", href: "/pricing" }}
    />
  );
}
