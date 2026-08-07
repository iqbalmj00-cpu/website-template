import type { Metadata } from "next";
import PageHero from "@/components/redesign/PageHero";
import PageIntro from "@/components/redesign/PageIntro";
import PricingTeaser from "@/components/redesign/PricingTeaser";
import StaticFAQ from "@/components/redesign/StaticFAQ";
import CtaBand from "@/components/redesign/CtaBand";
import { DispatchCardSection } from "@/components/redesign/DispatchBlocks";
import { getServerConfig } from "@/lib/serverConfig";
import {
    hasInsurance,
    siteConfig,
} from "@/lib/siteConfig";
import { breadcrumbJsonLd, createPageMetadata, faqPageJsonLd, serviceJsonLd } from "@/lib/seo";
import { resolveJunkRemovalImage } from "@/lib/templateAssets/junkRemoval";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;
const commercialDumpsterCopy = siteConfig.offersDumpsterRental
    ? `commercial dumpster rental, roll-off dumpster service, construction debris hauling, and business junk removal in ${cityState}`
    : `commercial junk removal, office cleanouts, construction debris pickup, and business cleanout service in ${cityState}`;
const commercialMetaDescription = `Commercial junk removal in ${cityState} for offices, property managers, contractors, retail spaces, warehouses, and business cleanouts.`;

export const metadata: Metadata = {
    ...createPageMetadata({
        title: `Commercial Junk Removal in ${cityState}`,
        description: commercialMetaDescription,
        path: "/commercial",
        image: resolveJunkRemovalImage({
            config: siteConfig,
            role: "commercialCleanout",
            routeKey: "commercial-meta",
            overrideSrc: siteConfig.commercialImageUrl,
        }).src,
    }),
    keywords: [
        `commercial junk removal ${siteConfig.city}`,
        `business junk removal ${siteConfig.city}`,
        `office cleanout ${siteConfig.city}`,
        `property management junk removal ${siteConfig.city}`,
        `construction debris removal ${siteConfig.city}`,
        ...(siteConfig.offersDumpsterRental ? [
            `commercial dumpster rental ${siteConfig.city}`,
            `roll off dumpster rental ${siteConfig.city}`,
        ] : []),
    ],
};

const commercialServices = [
    {
        title: "Office Cleanouts",
        desc: `Office junk removal in ${cityState} for desks, chairs, cubicles, filing cabinets, electronics, and workspace cleanouts.`,
    },
    {
        title: "Retail & Restaurant Cleanouts",
        desc: "Fixtures, shelving, signage, seating, backroom junk, remodel debris, and bulky items from commercial spaces.",
    },
    {
        title: "Property Management Junk Removal",
        desc: "Tenant moveout junk, apartment bulk item pickup, storage area cleanouts, and multi-property service after access is approved.",
    },
    {
        title: "Construction Debris Pickup",
        desc: `Commercial debris removal in ${cityState} for renovation debris, contractor cleanup, and jobsite hauling within accepted material limits.`,
    },
    ...(siteConfig.offersDumpsterRental ? [{
        title: "Commercial Dumpster Rental",
        desc: `Roll-off dumpster rental in ${cityState} for construction, property cleanup, retail remodels, and ongoing commercial disposal needs.`,
    }] : []),
];

const commercialPlanning = [
    "Item volume, material type, and number of loads",
    "Elevator, loading dock, parking, and floor-access requirements",
    "Business hours, building rules, and approved appointment windows",
    "Sorting, staging, PO, invoice, or recurring service needs",
    "Accepted material limits for construction debris, fixtures, and bulky items",
];

const faqs = [
    {
        q: `Do you offer commercial junk removal in ${cityState}?`,
        a: `Yes. ${siteConfig.companyName} handles commercial junk removal for offices, retail spaces, property managers, contractors, warehouses, and other business customers across ${cityState}.`,
    },
    {
        q: "What can commercial customers manage online?",
        a: "Commercial customers can manage booking details, saved locations, job records, invoices, account details, and recurring service requests when account access is available.",
    },
    {
        q: "Can property managers save multiple locations?",
        a: "Commercial accounts can keep saved locations with building or unit details, access notes, and service instructions so repeat jobs are easier to request accurately.",
    },
    {
        q: "How is commercial junk removal pricing calculated?",
        a: "Commercial pricing depends on item volume, material type, building access, loading requirements, scheduling needs, and any approved recurring or account workflow details. The final price is confirmed before loading begins.",
    },
    ...(siteConfig.offersDumpsterRental ? [{
        q: `Do you offer commercial dumpster rental in ${siteConfig.city}?`,
        a: `${siteConfig.companyName} offers dumpster rental for eligible commercial cleanup, construction debris, remodel, and property cleanup needs in ${siteConfig.city}. Availability, container sizes, and accepted materials depend on the job details.`,
    }] : []),
];

export default function CommercialPage() {
    const { companyName, city } = siteConfig;
    const { dashboardUrl, siteToken } = getServerConfig();
    const portalConfigured = Boolean(dashboardUrl && siteToken);
    const accountCards = [
        { title: "Saved locations and access notes", desc: "Keep repeat business pickup details organized when commercial account access is available." },
        { title: "Invoice and payment visibility", desc: "Review job records, invoice details, and payment history from the connected account workflow." },
        { title: "Commercial job history", desc: "Track past cleanouts, repeat service requests, and job details for account contacts." },
        ...(siteConfig.offersDumpsterRental ? [{ title: "Dumpster requests", desc: "Manage eligible dumpster swaps, pickups, and extension requests when the service is enabled." }] : []),
        { title: "Manage Booking", desc: "Open the customer portal for account and booking management.", href: "/customer-portal", actionLabel: "Manage Booking" },
    ];

    const serviceSchema = serviceJsonLd({
        service: {
            title: siteConfig.offersDumpsterRental ? "Commercial Junk Removal and Dumpster Rental" : "Commercial Junk Removal",
            shortDesc: `${companyName} provides ${commercialDumpsterCopy}.`,
        },
        path: "/commercial",
        description: `${companyName} provides commercial junk removal in ${cityState} for offices, property managers, contractors, retailers, warehouses, and approved business cleanout projects.`,
    });

    const breadcrumbSchema = breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Commercial Junk Removal", path: "/commercial" },
    ]);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([serviceSchema, breadcrumbSchema, faqPageJsonLd(faqs, "/commercial")]) }}
            />

            <PageHero
                crumbs={[
                    { label: "Home", href: "/" },
                    { label: "Commercial" },
                ]}
                eyebrow="Commercial service"
                titleStart="Commercial junk removal "
                titleAccent={`in ${cityState}.`}
                lede={`${companyName} helps businesses, property managers, contractors, retailers, and office teams remove bulky items, clear spaces, and plan approved commercial cleanouts${siteConfig.offersDumpsterRental ? " or dumpster rental needs" : ""}.`}
                primaryCta={{ label: "Get an Instant Quote", href: "/book" }}
                media={{
                    role: "commercialCleanout",
                    src: siteConfig.commercialImageUrl,
                    routeKey: "commercial",
                    locationName: city,
                    caption: "Commercial cleanout",
                }}
            />

            <DispatchCardSection
                eyebrow="Business cleanouts"
                heading="Commercial junk removal for offices, retail spaces, and managed properties."
                body="Request one-time cleanouts, contractor debris pickup, property turnover hauling, or account support when the job fits the available commercial services."
                cards={commercialServices}
                variant="detail-grid"
                alt
            />

            <PageIntro
                eyebrow="Commercial planning"
                headline="Commercial jobs depend on access, timing, material limits, and account details."
                body={
                    <>
                        <p>
                            Commercial cleanouts are scoped around the business type, item volume, building access,
                            approved pickup window, and any recurring or billing needs.
                        </p>
                        <p>
                            The customer can request service online or by phone. The final price is confirmed before
                            loading begins.
                        </p>
                    </>
                }
                rightEyebrow="Before scheduling"
                rightHeading="Details that help the quote"
                rightRows={commercialPlanning.slice(0, 4).map((item, index) => ({
                    n: String(index + 1).padStart(2, "0"),
                    t: item,
                    d: index === 0 ? "Primary scope input" : "Reviewed before loading",
                }))}
            />

            {portalConfigured && (
                <DispatchCardSection
                    eyebrow="Account support"
                    heading="Booking management for commercial accounts."
                    body="Commercial account contacts can manage saved locations, job records, invoices, account details, and recurring service requests when account access is available."
                    cards={accountCards}
                    variant="coverage-cards"
                    alt
                />
            )}

            <PricingTeaser />

            <StaticFAQ
                eyebrow="Commercial FAQ"
                heading={`Commercial junk removal questions in ${cityState}.`}
                items={faqs}
            />

            <CtaBand
                heading={{
                    lead: `Need commercial junk removal${siteConfig.offersDumpsterRental ? " or dumpster rental" : ""}?`,
                    accent: `Request service in ${cityState}.`,
                }}
                lede={`Discuss a one-time cleanout, repeat pickup needs, or commercial account details${hasInsurance(siteConfig) ? " with an insured local provider" : ""}.`}
            />
        </>
    );
}
