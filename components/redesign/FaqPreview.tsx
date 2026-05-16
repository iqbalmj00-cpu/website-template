import { DispatchFaqBoard } from "@/components/redesign/DispatchBlocks";
import { isSameDayEnabled, siteConfig, type SiteConfig } from "@/lib/siteConfig";
import { filterFaqs, resolveTokens, type FaqItem } from "@/lib/catalogs/faqs";

const PREFERRED_HOME_FAQS = [
  "sched-how-fast",
  "pricing-how-calculated",
  "items-what-you-take",
  "pricing-hidden-fees",
  "area-where",
];

function selectFaqs(config: SiteConfig, limit: number): FaqItem[] {
  const eligible = filterFaqs({
    sameDayEnabled: isSameDayEnabled(config),
    offersDumpsterRental: config.offersDumpsterRental,
    hasCommercial: config.tier === "growth",
  });
  const byId = new Map(eligible.map((item) => [item.id, item]));
  const ordered: FaqItem[] = [];

  for (const id of PREFERRED_HOME_FAQS) {
    const item = byId.get(id);
    if (item) {
      ordered.push(item);
      byId.delete(id);
    }
  }

  for (const item of eligible) {
    if (ordered.length >= limit) break;
    if (byId.has(item.id)) ordered.push(item);
  }

  return ordered.slice(0, limit);
}

export default function FaqPreview({ limit = 5, config = siteConfig }: { limit?: number; config?: SiteConfig } = {}) {
  const tokens: Record<string, string | number | null> = {
    city: config.city || "your area",
    state: config.state,
    serviceArea: config.serviceArea || (config.city ? `Greater ${config.city}` : "your area"),
    maxRadius: config.maxRadius ?? "",
    phone: config.phoneNumber,
  };

  const items = selectFaqs(config, limit).map((item) => ({
    q: item.question,
    a: resolveTokens(item.answer, tokens),
  }));

  return <DispatchFaqBoard items={items} heading="Junk removal questions before booking." />;
}
