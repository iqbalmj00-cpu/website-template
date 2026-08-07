import {
    isSameDayEnabled,
    siteConfig,
    type SiteConfig,
} from "@/lib/siteConfig";
import { filterFaqs, resolveTokens, type FaqItem } from "@/lib/catalogs/faqs";
import {
    DispatchActionStrip,
    DispatchAreaSection,
    DispatchBookingShell,
    DispatchFaqBoard,
    DispatchFinalCta,
    DispatchHomeHero,
    DispatchPricingBoard,
    DispatchReviewRail,
    DispatchServiceMosaic,
    DispatchWorkGrid,
} from "@/components/redesign/DispatchBlocks";
import Credentials from "@/components/redesign/Credentials";

const HOME_FAQ_IDS = [
    "sched-how-fast",
    "pricing-how-calculated",
    "items-what-you-take",
    "pricing-hidden-fees",
    "area-where",
];

function homeFaqItems(config: SiteConfig, limit = 5): FaqItem[] {
    const eligible = filterFaqs({
        sameDayEnabled: isSameDayEnabled(config),
        offersDumpsterRental: config.offersDumpsterRental,
        hasCommercial: config.tier === "growth",
    });
    const byId = new Map(eligible.map((item) => [item.id, item]));
    const ordered: FaqItem[] = [];

    for (const id of HOME_FAQ_IDS) {
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

function faqTokens(config: SiteConfig): Record<string, string | number | null> {
    return {
        city: config.city || "your area",
        state: config.state,
        serviceArea: config.serviceArea || (config.city ? `Greater ${config.city}` : "your area"),
        maxRadius: config.maxRadius ?? "",
        phone: config.phoneNumber,
    };
}

export function buildHomeFaqs(config: SiteConfig = siteConfig) {
    const tokens = faqTokens(config);
    return homeFaqItems(config).map((item) => ({
        q: item.question,
        a: resolveTokens(item.answer, tokens),
    }));
}

type HomePageContentProps = {
    config?: SiteConfig;
};

export default function HomePageContent({ config = siteConfig }: HomePageContentProps) {
    return (
        <>
            <DispatchHomeHero config={config} />
            <Credentials config={config} />
            <DispatchActionStrip config={config} />
            <DispatchServiceMosaic
                config={config}
                heading={`Junk removal services people book in ${config.city || "your area"}.`}
                body="Start with the service that matches the job: furniture, appliances, cleanouts, debris, or general junk removal."
            />
            <DispatchWorkGrid config={config} />
            <DispatchPricingBoard config={config} />
            <DispatchAreaSection config={config} />
            <DispatchReviewRail config={config} />
            <DispatchBookingShell config={config} />
            <DispatchFaqBoard
                items={buildHomeFaqs(config)}
                heading="Junk removal questions before booking."
            />
            <DispatchFinalCta config={config} />
        </>
    );
}
