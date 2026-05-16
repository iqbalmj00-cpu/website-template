import { DispatchServiceMosaic } from "@/components/redesign/DispatchBlocks";
import { siteConfig, type SiteConfig } from "@/lib/siteConfig";

interface RelatedSvcProps {
  eyebrow?: string;
  heading?: string;
  currentServiceId?: string;
  tone?: "paper" | "paper-2";
  limit?: number;
  layout?: "rail" | "mosaic";
  config?: SiteConfig;
}

export default function RelatedSvc({
  eyebrow,
  heading = "Services people often pair with this.",
  currentServiceId,
  limit = 5,
  config = siteConfig,
}: RelatedSvcProps = {}) {
  return (
    <DispatchServiceMosaic
      config={config}
      eyebrow={eyebrow || "Service menu"}
      heading={heading}
      currentServiceId={currentServiceId}
      limit={limit}
    />
  );
}
