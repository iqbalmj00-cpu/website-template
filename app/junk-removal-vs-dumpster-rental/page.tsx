import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/redesign/PageHero";
import StaticFAQ from "@/components/redesign/StaticFAQ";
import CtaBand from "@/components/redesign/CtaBand";
import { DispatchCardSection } from "@/components/redesign/DispatchBlocks";
import { breadcrumbJsonLd, createPageMetadata, faqPageJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

const path = "/junk-removal-vs-dumpster-rental";
const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Junk Removal vs Dumpster Rental", href: path },
];
const FAQS = [
    { q: "Is junk removal cheaper than dumpster rental?", a: "It depends on the job. Junk removal can be better for smaller or labor-heavy jobs because loading is included. Dumpster rental can be better for multi-day projects with steady debris and enough space for a container." },
    { q: "Which option is better for furniture and appliances?", a: "Full-service junk removal is usually simpler for furniture, mattresses, appliances, and mixed household junk because the crew loads and hauls the items in one visit." },
    { q: "Which option is better for remodeling debris?", a: "Dumpster rental is often useful for ongoing remodeling debris because you can load over several days. For a smaller finished pile, junk removal may be enough." },
    { q: "Do I need room for a dumpster?", a: "Yes. Dumpster rental requires a safe placement area and may require a permit if placed on a public street or right-of-way. Junk removal usually only requires crew and truck access." },
];

export const metadata: Metadata = createPageMetadata({
    title: `Junk Removal vs Dumpster Rental in ${siteConfig.city}`,
    description: `Compare full-service junk removal and dumpster rental in ${siteConfig.city}. Learn which option fits cleanouts, remodeling debris, heavy material, and flexible timelines.`,
    path,
    noIndex: !siteConfig.offersDumpsterRental,
});

export default function JunkRemovalVsDumpsterRentalPage() {
    if (!siteConfig.offersDumpsterRental) notFound();

    const choiceCards = [
        {
            eyebrow: "Full-service hauling",
            title: "Choose junk removal when",
            desc: "You want the crew to load approved furniture, appliances, clutter, or mixed household junk during one scheduled appointment.",
            href: "/book",
        },
        {
            eyebrow: "Container rental",
            title: "Choose dumpster rental when",
            desc: "You want to load over several days, have safe container placement space, and need a rental period for ongoing debris.",
            href: "/dumpster-rental",
        },
    ];
    const comparisonCards = [
        { title: "Labor", desc: "Junk removal includes crew loading. Dumpster rental is self-loaded unless the company separately offers loading help." },
        { title: "Timeline", desc: "Junk removal is usually one scheduled visit. Dumpster rental is useful for multi-day projects." },
        { title: "Space needed", desc: "Junk removal needs truck access and a safe carry path. Dumpster rental needs a clear placement area." },
        { title: "Best materials", desc: "Junk removal fits furniture, appliances, clutter, and mixed junk. Dumpster rental fits construction debris, roofing, and large cleanouts." },
        { title: "Price factors", desc: "Junk removal considers volume, weight, access, and item handling. Dumpster rental considers size, days, weight allowance, and overages." },
        { title: "Permits", desc: "Junk removal usually does not need a placement permit. Dumpster placement may require one on a street or public right-of-way." },
    ];
    const quickGuideCards = [
        { title: "Choose junk removal for speed", desc: "Use junk removal when you have a clear pile or item list and want the hauling finished during one appointment." },
        { title: "Choose dumpster rental for control", desc: "Use a dumpster when debris will build up over time and you want to load at your own pace during a confirmed rental period." },
        { title: "Check prohibited items first", desc: "Hazardous, flammable, medical, and regulated materials are not accepted in either option.", href: "/items-we-dont-take" },
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([
                    breadcrumbJsonLd(breadcrumbs.map(item => ({ name: item.label, path: item.href }))),
                    faqPageJsonLd(FAQS, path),
                ]) }}
            />
            <PageHero
                crumbs={breadcrumbs}
                eyebrow="Service comparison"
                titleStart="Junk removal vs dumpster rental"
                titleAccent={` in ${siteConfig.city}.`}
                lede="Both options can work. The right choice depends on who loads the material, how long the cleanup takes, what you are throwing away, and whether you have room for a container."
                primaryCta={{ label: "View Pricing", href: "/pricing" }}
            />
            <DispatchCardSection
                eyebrow="Choose the right option"
                heading="Start with labor, timing, and placement."
                cards={choiceCards}
                variant="service-links"
            />
            <DispatchCardSection
                eyebrow="Side-by-side"
                heading="Compare junk removal and dumpster rental."
                body={`Use this comparison before choosing service in ${siteConfig.city}.`}
                cards={comparisonCards}
                variant="detail-grid"
                alt
            />
            <DispatchCardSection
                eyebrow="Decision guide"
                heading="Quick way to decide."
                cards={quickGuideCards}
                variant="coverage-cards"
            />
            <StaticFAQ eyebrow="Comparison FAQ" heading="Junk removal vs dumpster rental FAQ." items={FAQS} />
            <CtaBand
                heading={{ lead: "Ready to choose", accent: "the right service?" }}
                lede="Book online for full-service junk removal, or review dumpster rental options when a container is a better fit."
            />
        </>
    );
}
