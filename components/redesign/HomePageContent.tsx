import type { ReactNode } from "react";
import {
    siteConfig,
    type SiteConfig,
} from "@/lib/siteConfig";
import { fmt24to12, isSameDayEnabled } from "@/lib/siteConfig";
import { filterFaqs, resolveTokens, type FaqItem } from "@/lib/catalogs/faqs";
import Credentials from "@/components/redesign/Credentials";
import CtaBand from "@/components/redesign/CtaBand";
import DispatchActionStrip from "@/components/redesign/DispatchActionStrip";
import FaqPreview from "@/components/redesign/FaqPreview";
import HomeHero from "@/components/redesign/HomeHero";
import NearbyAreas from "@/components/redesign/NearbyAreas";
import PageIntro, { type PageIntroRow } from "@/components/redesign/PageIntro";
import PricingTeaser from "@/components/redesign/PricingTeaser";
import ProcessSection from "@/components/redesign/ProcessSection";
import RelatedSvc from "@/components/redesign/RelatedSvc";
import TestimonialsStrip from "@/components/redesign/TestimonialsStrip";
import { getJunkRemovalThemeProfile } from "@/lib/templateAssets/junkRemoval";

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

function buildIntroRows(config: SiteConfig): PageIntroRow[] {
    const rows: PageIntroRow[] = [];
    const serviceAreas = Array.from(new Set(
        (config.serviceArea || config.city || "")
            .split(",")
            .map((area) => area.trim())
            .filter((area) => area && !/^\d{5}(?:-\d{4})?$/.test(area) && area.toLowerCase() !== "your area"),
    ));

    if (serviceAreas.length > 0) {
        rows.push({
            n: String(rows.length + 1).padStart(2, "0"),
            t: `${serviceAreas.length} local area${serviceAreas.length === 1 ? "" : "s"}`,
            d: serviceAreas.slice(0, 3).join(" · "),
        });
    }

    if (config.services.length > 0) {
        rows.push({
            n: String(rows.length + 1).padStart(2, "0"),
            t: `${config.services.length} bookable service${config.services.length === 1 ? "" : "s"}`,
            d: config.services.slice(0, 2).join(" · "),
        });
    }

    if (isSameDayEnabled(config)) {
        rows.push({
            n: String(rows.length + 1).padStart(2, "0"),
            t: "Same-day requests",
            d: config.sameDayCutoffTime ? `Book by ${fmt24to12(config.sameDayCutoffTime)}` : "When schedule allows",
        });
    }

    if (config.yearFounded) {
        rows.push({
            n: String(rows.length + 1).padStart(2, "0"),
            t: `Established ${config.yearFounded}`,
            d: config.city ? `Serving ${config.city}` : "Company history",
        });
    }

    return rows.slice(0, 4);
}

function introBody(config: SiteConfig): ReactNode {
    if (config.aboutStory.trim()) return <p>{config.aboutStory}</p>;

    return (
        <>
            <p>
                Removing junk is usually less about the item and more about access, timing, lifting,
                and getting the job details right before a crew arrives.
            </p>
            <p>
                Choose a service, share the pickup details, and book a time. The final quote is
                confirmed before loading begins.
            </p>
        </>
    );
}

function localAreaLabel(config: SiteConfig): string {
    const serviceArea = config.serviceArea.trim();
    if (serviceArea && serviceArea.toLowerCase() !== "your area") return serviceArea;
    if (config.city && config.state) return `${config.city}, ${config.state}`;
    return config.city || "your area";
}

function localBody(config: SiteConfig): ReactNode {
    return (
        <>
            <p>
                The site is configured around the real service area sent during launch, so location
                copy stays tied to the client&apos;s market instead of prototype neighborhoods.
            </p>
            <p>
                Visitors can choose one of the configured services, confirm whether their address is
                covered, and continue into the booking wizard for a job-specific estimate.
            </p>
        </>
    );
}

function editorialBody(config: SiteConfig): ReactNode {
    if (config.aboutStory.trim()) return <p>{config.aboutStory}</p>;

    return (
        <>
            <p>
                A good junk removal page should answer the practical questions first: what can be
                hauled, how the quote is confirmed, where the crew operates, and how to book.
            </p>
            <p>
                This layout leads with that story, then supports it with configured services,
                verified reviews when available, and the same booking flow used on the live site.
            </p>
        </>
    );
}

function boldBody(config: SiteConfig): ReactNode {
    return (
        <>
            <p>
                This version pushes the conversion path forward: choose a service, show the job
                details, pick a window, and review the estimate inside the booking wizard.
            </p>
            <p>
                Proof-heavy sections still only appear when the dashboard sends supporting data, so
                the page stays assertive without inventing claims.
            </p>
        </>
    );
}

type HomeVariantProps = {
    config: SiteConfig;
    introRows: PageIntroRow[];
};

function commonIntroRows(introRows: PageIntroRow[]): PageIntroRow[] | undefined {
    return introRows.length > 0 ? introRows : undefined;
}

function ConversionHome({ config, introRows }: HomeVariantProps) {
    return (
        <>
            <HomeHero config={config} />
            <DispatchActionStrip config={config} />
            <Credentials config={config} showDiversion={false} />
            <RelatedSvc
                config={config}
                eyebrow="What we haul"
                heading="Services people most often book."
                tone="paper-2"
                layout="mosaic"
            />
            <PageIntro
                eyebrow={config.city ? `${config.city}, locally configured` : "Local service"}
                headline={`${config.companyName} makes junk removal easier to quote, schedule, and confirm.`}
                body={introBody(config)}
                rightEyebrow="By the numbers"
                rightHeading={`${config.companyName} at a glance`}
                rightRows={commonIntroRows(introRows)}
            />
            <ProcessSection config={config} />
            <PricingTeaser config={config} />
            <NearbyAreas config={config} />
            <TestimonialsStrip config={config} />
            <FaqPreview config={config} />
            <CtaBand config={config} />
        </>
    );
}

function BoldHome({ config, introRows }: HomeVariantProps) {
    return (
        <>
            <HomeHero config={config} />
            <DispatchActionStrip config={config} />
            <RelatedSvc
                config={config}
                eyebrow="Start here"
                heading="Pick the service. Show the load. Book the job."
                tone="paper-2"
                limit={6}
                layout="mosaic"
            />
            <ProcessSection config={config} />
            <Credentials config={config} showDiversion={false} />
            <TestimonialsStrip config={config} />
            <PageIntro
                eyebrow="Fast quote path"
                headline="A stronger booking-first homepage for visitors who are ready to schedule."
                body={boldBody(config)}
                rightEyebrow="Configured facts"
                rightHeading="What changes per client"
                rightRows={commonIntroRows(introRows)}
            />
            <PricingTeaser config={config} />
            <NearbyAreas config={config} />
            <FaqPreview config={config} />
            <CtaBand
                config={config}
                heading={{ lead: "Ready for a quote?", accent: "Start the booking." }}
            />
        </>
    );
}

function EditorialHome({ config, introRows }: HomeVariantProps) {
    return (
        <>
            <HomeHero config={config} />
            <DispatchActionStrip config={config} />
            <PageIntro
                eyebrow="Local junk removal, explained"
                headline={`${config.companyName} gives customers the details they need before the crew arrives.`}
                body={editorialBody(config)}
                rightEyebrow="Page signals"
                rightHeading="What the homepage proves"
                rightRows={commonIntroRows(introRows)}
            />
            <TestimonialsStrip config={config} />
            <RelatedSvc
                config={config}
                eyebrow="Service menu"
                heading="Choose the job type that matches the pickup."
                tone="paper-2"
                layout="mosaic"
            />
            <ProcessSection config={config} />
            <PricingTeaser config={config} />
            <NearbyAreas config={config} />
            <Credentials config={config} showDiversion={false} />
            <FaqPreview config={config} />
            <CtaBand
                config={config}
                heading={{ lead: "Need it cleared?", accent: "Book with context." }}
            />
        </>
    );
}

function LocalHome({ config, introRows }: HomeVariantProps) {
    const areaLabel = localAreaLabel(config);

    return (
        <>
            <HomeHero config={config} />
            <DispatchActionStrip config={config} />
            <NearbyAreas
                config={config}
                heading={`Local coverage around ${areaLabel}.`}
            />
            <PageIntro
                eyebrow={config.city ? `${config.city} service coverage` : "Service coverage"}
                headline={`A locally focused homepage for customers checking if ${config.companyName} serves their address.`}
                body={localBody(config)}
                rightEyebrow="Coverage facts"
                rightHeading="Configured launch data"
                rightRows={commonIntroRows(introRows)}
            />
            <RelatedSvc
                config={config}
                eyebrow="Bookable services"
                heading="Services available for this local site."
                tone="paper"
                layout="mosaic"
            />
            <Credentials config={config} showDiversion={false} />
            <ProcessSection config={config} />
            <TestimonialsStrip config={config} />
            <PricingTeaser config={config} />
            <FaqPreview config={config} />
            <CtaBand
                config={config}
                heading={{ lead: `Book in ${config.city || "your area"}.`, accent: "Get the quote first." }}
            />
        </>
    );
}

type HomePageContentProps = {
    config?: SiteConfig;
};

export default function HomePageContent({ config = siteConfig }: HomePageContentProps) {
    const introRows = buildIntroRows(config);
    const variantProps = { config, introRows };
    const themeProfile = getJunkRemovalThemeProfile(config);
    const variant =
        config.designConfig.homepageStyle === "conversion"
            ? themeProfile.homeVariant
            : config.designConfig.homepageStyle;

    switch (variant) {
        case "bold":
            return <BoldHome {...variantProps} />;
        case "editorial":
            return <EditorialHome {...variantProps} />;
        case "local":
            return <LocalHome {...variantProps} />;
        case "conversion":
        default:
            return <ConversionHome {...variantProps} />;
    }
}
