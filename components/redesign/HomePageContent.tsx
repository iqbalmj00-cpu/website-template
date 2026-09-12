import {
    getHomeAreaSummary,
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
    DispatchPageHero,
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
        serviceArea: getHomeAreaSummary(config),
        maxRadius: config.maxRadius ?? "",
        phone: config.phoneNumber,
    };
}

export function buildHomeFaqs(config: SiteConfig = siteConfig) {
    if (config.companyMode === "dumpster_rental") return [
        { q: "How do I request a dumpster?", a: "Choose a listed container size, describe the debris, and request a delivery date and window. Availability and rental terms need confirmation." },
        { q: "What is included in the rental price?", a: "Check the dumpster rental page for the listed base rates, included days, weight allowances, and extra charges." },
    ];
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
    if (config.companyMode === "dumpster_rental") return (
        <>
            <DispatchPageHero config={config} crumbs={[]} eyebrow="Dumpster rental" title={`Dumpster rental in ${config.city || "your area"}`} lede="Choose a container, review the rental terms, and request delivery for your project." primaryCta={{ label: "Request a dumpster", href: "/book" }} secondaryCta={{ label: "Sizes and rental prices", href: "/dumpster-rental" }} />
            <Credentials config={config} />
            <DispatchServiceMosaic config={config} heading="Dumpster sizes and rental details" body="Review the available containers, accepted materials, and rental terms." />
            <DispatchReviewRail config={config} />
            <DispatchFaqBoard items={buildHomeFaqs(config)} heading="Dumpster rental questions" />
            <DispatchFinalCta config={config} heading="Ready to request a container?" body="Choose a container size, describe your debris, and request a delivery window." />
        </>
    );
    return (
        <>
            <DispatchHomeHero config={config} />
            <Credentials config={config} />
            <DispatchActionStrip config={config} />
            <DispatchServiceMosaic
                config={config}
                heading={`${config.offersDumpsterRental ? "Services" : "Junk removal services"} people book in ${config.city || "your area"}.`}
                body={config.offersDumpsterRental ? "Choose junk removal for a crew to haul your items, or dumpster rental for a container delivered to your project." : "Start with the service that matches the job: furniture, appliances, cleanouts, debris, or general junk removal."}
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
