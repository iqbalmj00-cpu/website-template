import Link from "next/link";
import type { Metadata } from "next";
import {
    ArrowRight,
    Building,
    Building2,
    ClipboardList,
    CreditCard,
    KeyRound,
    Phone,
    Store,
    Truck,
} from "lucide-react";
import PageHero from "@/components/redesign/PageHero";
import PageIntro from "@/components/redesign/PageIntro";
import PricingTeaser from "@/components/redesign/PricingTeaser";
import StaticFAQ from "@/components/redesign/StaticFAQ";
import CtaBand from "@/components/redesign/CtaBand";
import { getServerConfig } from "@/lib/serverConfig";
import {
    formatPhone,
    hasInsurance,
    siteConfig,
    telHref,
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
        Icon: Building2,
        title: "Office Cleanouts",
        desc: `Office junk removal in ${cityState} for desks, chairs, cubicles, filing cabinets, electronics, and workspace cleanouts.`,
    },
    {
        Icon: Store,
        title: "Retail & Restaurant Cleanouts",
        desc: "Fixtures, shelving, signage, seating, backroom junk, remodel debris, and bulky items from commercial spaces.",
    },
    {
        Icon: Building,
        title: "Property Management Junk Removal",
        desc: "Tenant moveout junk, apartment bulk item pickup, storage area cleanouts, and multi-property service after access is approved.",
    },
    {
        Icon: ClipboardList,
        title: "Construction Debris Pickup",
        desc: `Commercial debris removal in ${cityState} for renovation debris, contractor cleanup, and jobsite hauling within accepted material limits.`,
    },
    ...(siteConfig.offersDumpsterRental ? [{
        Icon: Truck,
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
        q: "What can commercial customers do in the customer portal?",
        a: "Commercial customers can request jobs, use saved locations, track active work, view job history, review invoices, manage payment visibility, update account details, and request recurring service for approval when portal access is available.",
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
    const { companyName, phoneNumber, city } = siteConfig;
    const { dashboardUrl, siteToken } = getServerConfig();
    const portalConfigured = Boolean(dashboardUrl && siteToken);

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
                primaryCta={{ label: "Request Commercial Service", href: "/contact" }}
                media={{
                    role: "commercialCleanout",
                    src: siteConfig.commercialImageUrl,
                    routeKey: "commercial",
                    locationName: city,
                    caption: "Commercial cleanout",
                }}
            />

            <section className="dispatch-services bg-paper-2 py-[100px] px-[clamp(20px,4vw,64px)]">
                <div className="mx-auto" style={{ maxWidth: 1480 }}>
                    <div className="mb-9 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(360px,0.48fr)] lg:items-end">
                        <div>
                            <div className="eyebrow">Business cleanouts</div>
                            <h2 className="mt-3 font-display text-[clamp(36px,4.6vw,58px)] font-extrabold leading-[1.02] text-ink">
                                Commercial junk removal for offices, retail spaces, and managed properties.
                            </h2>
                        </div>
                        <p className="text-[16px] leading-[1.65] text-muted">
                            Request one-time cleanouts, contractor debris pickup, property turnover hauling, or account
                            support when the job fits the available commercial services.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {commercialServices.map(({ Icon, title, desc }) => (
                            <article key={title} className="dispatch-service-card rounded-[14px] border border-line bg-paper p-6">
                                <span className="grid h-12 w-12 place-items-center rounded-[12px] bg-brand text-white">
                                    <Icon className="h-6 w-6" aria-hidden="true" />
                                </span>
                                <h3 className="mt-5 font-display text-[23px] font-bold leading-tight text-ink">{title}</h3>
                                <p className="mt-3 text-[14.5px] leading-[1.6] text-muted">{desc}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

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
                <section className="bg-paper-2 py-[100px] px-[clamp(20px,4vw,64px)] border-y border-line">
                    <div className="mx-auto grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.62fr)] lg:items-start" style={{ maxWidth: 1280 }}>
                        <div>
                            <div className="eyebrow">Account support</div>
                            <h2 className="mt-3 font-display text-[clamp(34px,4vw,50px)] font-extrabold leading-[1.04] text-ink">
                                Portal support for commercial accounts.
                            </h2>
                            <p className="mt-4 max-w-[58ch] text-[16px] leading-[1.65] text-muted">
                                Commercial account contacts can use portal access for saved locations, job records,
                                invoices, account details, and recurring service requests when portal access is available.
                            </p>
                            <div className="mt-7 flex flex-wrap gap-3">
                                <Link href="/customer-portal" referrerPolicy="no-referrer" className="btn-primary">
                                    Customer Portal <KeyRound className="h-4 w-4" aria-hidden="true" />
                                </Link>
                                <Link href="/contact" className="btn-secondary">
                                    Request Account Service <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </Link>
                            </div>
                        </div>
                        <div className="rounded-[14px] border border-line bg-paper p-6">
                            {[
                                { Icon: ClipboardList, label: "Saved locations and access notes" },
                                { Icon: CreditCard, label: "Invoice and payment visibility" },
                                { Icon: Building2, label: "Commercial job history" },
                                ...(siteConfig.offersDumpsterRental ? [{ Icon: Truck, label: "Dumpster swaps, pickups, and extensions" }] : []),
                            ].map(({ Icon, label }) => (
                                <div key={label} className="grid grid-cols-[44px_1fr] gap-3 border-b border-line py-4 first:pt-0 last:border-b-0 last:pb-0">
                                    <span className="grid h-10 w-10 place-items-center rounded-[10px] bg-brand/10 text-brand">
                                        <Icon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                    <span className="self-center font-display text-[17px] font-bold leading-tight text-ink">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <PricingTeaser />

            <StaticFAQ
                eyebrow="Commercial FAQ"
                heading={`Commercial junk removal questions in ${cityState}.`}
                items={faqs}
            />

            <section className="bg-paper-2 px-[clamp(20px,4vw,64px)] py-10">
                <div className="mx-auto flex flex-wrap justify-center gap-3" style={{ maxWidth: 980 }}>
                    <Link href="/services" className="btn-secondary">View Services</Link>
                    <Link href="/pricing" className="btn-secondary">View Pricing</Link>
                    <Link href="/locations" className="btn-secondary">Service Areas</Link>
                    {siteConfig.offersDumpsterRental && <Link href="/dumpster-rental" className="btn-secondary">Dumpster Rental</Link>}
                    {phoneNumber && (
                        <a href={telHref(phoneNumber)} className="btn-secondary">
                            <Phone className="h-4 w-4" aria-hidden="true" /> {formatPhone(phoneNumber)}
                        </a>
                    )}
                </div>
            </section>

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
