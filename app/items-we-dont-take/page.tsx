import { siteConfig } from "@/lib/siteConfig";
import type { Metadata } from "next";
import PageHero from "@/components/redesign/PageHero";
import StaticFAQ from "@/components/redesign/StaticFAQ";
import CtaBand from "@/components/redesign/CtaBand";
import { DispatchCardSection } from "@/components/redesign/DispatchBlocks";
import { PROHIBITED_ITEMS } from "@/lib/prohibitedItems";
import { createPageMetadata, faqPageJsonLd } from "@/lib/seo";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;

export const metadata: Metadata = createPageMetadata({
    title: `Items We Don't Take in ${siteConfig.city}`,
    description: `For safety and legal reasons, ${siteConfig.companyName} in ${cityState} cannot transport certain hazardous or regulated materials.`,
    path: "/items-we-dont-take",
});
const FAQS = [
    { q: "Why can't junk removal companies take hazardous materials?", a: "Hazardous and regulated materials can require special licensing, containment, transport rules, or disposal facilities. They should be handled by municipal or specialized disposal programs." },
    { q: "Can you take paint cans?", a: "Liquid paint is not accepted. Some dried empty cans may be acceptable depending on local rules and the condition of the container. Ask before booking if paint is involved." },
    { q: "Can prohibited items go in a dumpster?", a: "No. Hazardous, flammable, medical, and regulated materials should not be loaded into a junk removal truck or dumpster." },
    { q: "What should I do with restricted items?", a: "Contact your local municipal waste department, hazardous waste collection site, retailer take-back program, or specialized disposal company for safe handling." },
];

export default function ItemsWeDontTakePage() {
    const restrictedCards = PROHIBITED_ITEMS.map((item) => ({
        eyebrow: "Restricted",
        title: item.item,
        desc: item.detail,
    }));
    const handlingCards = [
        {
            eyebrow: "Safe disposal",
            title: "Use local hazardous waste programs",
            desc: "Municipal programs are usually the right path for chemicals, liquid paint, pesticides, solvents, and similar materials.",
        },
        {
            eyebrow: "Take-back",
            title: "Check retailer programs",
            desc: "Some batteries, electronics, bulbs, and tires may qualify for retailer or manufacturer take-back programs.",
        },
        {
            eyebrow: "Before pickup",
            title: "Separate restricted items",
            desc: "Keep restricted materials away from accepted junk so the crew can load approved items without unsafe mixing.",
        },
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(FAQS, "/items-we-dont-take")) }}
            />
            <PageHero
                crumbs={[
                    { label: "Home", href: "/" },
                    { label: "Items We Don't Take" },
                ]}
                eyebrow="Restricted items"
                titleStart="Items we do not "
                titleAccent="haul."
                lede={`For safety and legal reasons, ${siteConfig.companyName} cannot transport certain hazardous or regulated materials in ${cityState}.`}
                primaryCta={{ label: "View Pricing", href: "/pricing" }}
            />

            <DispatchCardSection
                eyebrow="Restricted list"
                heading="Do not load these materials."
                body="Restricted items are not refused because of size. They are refused because they may require special handling, permits, containment, or disposal facilities."
                cards={restrictedCards}
                variant="detail-grid"
            />

            <DispatchCardSection
                eyebrow="Safe handling"
                heading="How to handle restricted items."
                body="Before booking, separate hazardous or regulated material from the rest of the junk pile."
                cards={handlingCards}
                alt
            />

            <StaticFAQ eyebrow="Restricted FAQ" heading="Restricted item questions." items={FAQS} />
            <CtaBand
                heading={{ lead: "Not sure what can be hauled?", accent: "Ask before booking." }}
                lede={`Call or book online with item details so ${siteConfig.companyName} can review accepted items for ${cityState}.`}
            />
        </>
    );
}
