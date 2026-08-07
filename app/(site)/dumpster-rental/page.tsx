import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    AlertTriangle,
    CalendarClock,
    CheckCircle2,
    Container,
    Phone,
    Truck,
    type LucideIcon,
} from "lucide-react";
import {
    DispatchFaqBoard,
    DispatchFinalCta,
    DispatchIntroGrid,
    DispatchMetricStrip,
    DispatchPageHero,
    type DispatchInfoRow,
} from "@/components/redesign/DispatchBlocks";
import { VisualAcceptedMaterials, VisualRentalPricing } from "@/components/redesign/VisualReplacementBlocks";
import {
    formatDumpsterPrice,
    formatPhone,
    hasInsurance,
    hasLicense,
    isSameDayEnabled,
    siteConfig,
    telHref,
    type DumpsterPriceTier,
} from "@/lib/siteConfig";
import { CONTAINER_SIZES, DEBRIS_TYPES } from "@/lib/wizardData";
import { breadcrumbJsonLd, createPageMetadata, faqPageJsonLd, serviceJsonLd } from "@/lib/seo";

const path = "/dumpster-rental";
const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;

export const metadata: Metadata = createPageMetadata({
    title: `Dumpster Rental in ${cityState}`,
    description: `Rent a dumpster in ${cityState}. Compare container sizes, project fit, accepted debris, rental terms, and booking steps from ${siteConfig.companyName}.`,
    path,
    noIndex: !siteConfig.offersDumpsterRental,
});

const FAQ_ITEMS = [
    { q: "How long can I keep the dumpster?", a: "The rental period is confirmed during booking and may vary by container size, availability, and any extension terms shown before the request is submitted." },
    { q: "What can I put in the dumpster?", a: "Common approved materials can include household junk, construction debris, yard waste, roofing materials, and mixed cleanup debris. Material rules are reviewed before booking." },
    { q: "How is dumpster rental pricing calculated?", a: "Dumpster rental pricing can depend on container size, included rental days, included weight, delivery distance, disposal costs, overage rates, extension days, and local fees." },
    { q: "What size dumpster do I need?", a: "Smaller containers are usually better for minor cleanouts and bathroom projects. Larger containers are better for renovations, roof debris, whole-home cleanouts, and commercial cleanup projects." },
    { q: "Where can the dumpster be placed?", a: "Driveways are common placement areas when there is safe truck access. Street or right-of-way placement may require local approval or a permit." },
    { q: "Should I rent a dumpster or book junk removal?", a: "Rent a dumpster when you want to load over several days. Book junk removal when you want a crew to load the approved items and haul them away in one appointment." },
];

const processRows: DispatchInfoRow[] = [
    { n: "01", title: "Contact and service", desc: "Enter your contact details and choose dumpster rental in the booking flow." },
    { n: "02", title: "Container size", desc: "Select the container size that matches the project and debris volume." },
    { n: "03", title: "Rental details", desc: "Add debris type, placement notes, rental timing, and access details." },
    { n: "04", title: "Schedule and review", desc: "Pick a delivery window, review the quote, and submit the request." },
];

const prohibitedItems = [
    "Paint, stains, and solvents",
    "Batteries and flammable liquids",
    "Tires and regulated automotive waste",
    "Medical waste or hazardous chemicals",
    "Asbestos or unknown regulated material",
];

function tierForSize(sizeId: string): DumpsterPriceTier | undefined {
    const sizeNum = Number.parseInt(sizeId, 10);
    return siteConfig.dumpsterPricing?.tiers.find((tier) => tier.sizeCuYd === sizeNum);
}

function hasTierPrice(tier: DumpsterPriceTier | undefined): tier is DumpsterPriceTier {
    return Boolean(tier && (tier.baseRate > 0 || (tier.baseRateMin != null && tier.baseRateMin > 0)));
}

function termsForTier(tier: DumpsterPriceTier | undefined): string[] {
    if (!tier) return ["Rental terms confirmed before booking"];
    const terms = [];
    if (tier.includedDays > 0) terms.push(`${tier.includedDays} day${tier.includedDays === 1 ? "" : "s"} included`);
    if (tier.weightAllowanceTons > 0) terms.push(`${tier.weightAllowanceTons} ton${tier.weightAllowanceTons === 1 ? "" : "s"} included`);
    if (tier.overageRatePerTon > 0) terms.push(`$${tier.overageRatePerTon}/ton overage`);
    if (tier.extendedDailyRate && tier.extendedDailyRate > 0) terms.push(`$${tier.extendedDailyRate}/day extension`);
    return terms.length > 0 ? terms : ["Rental terms confirmed before booking"];
}

function StatIcon({ Icon, label }: { Icon: LucideIcon; label: string }) {
    return (
        <span className="dumpster-icon" aria-label={label}>
            <Icon aria-hidden="true" />
        </span>
    );
}

export default function DumpsterRentalPage() {
    if (!siteConfig.offersDumpsterRental) notFound();

    const hasDumpsterPricing = Boolean(siteConfig.dumpsterPricing?.tiers.length);
    const credentialText = [
        hasLicense(siteConfig) ? "License on file" : "",
        hasInsurance(siteConfig) ? "Insurance carrier on file" : "",
    ].filter(Boolean).join(" and ");
    const phoneHref = telHref(siteConfig.phoneNumber);
    const cityLabel = siteConfig.city || "your area";

    const metricItems = [
        { label: "Container guide", value: "10-40 cu yd" },
        { label: "Best fit", value: "Multi-day debris" },
        { label: "Pricing", value: hasDumpsterPricing ? "Size based" : "Quote review" },
        { label: "Booking", value: "Online request" },
    ];

    const comparisonCards = [
        {
            Icon: Container,
            title: "Choose dumpster rental",
            desc: "Use a dumpster when debris will build up over several days and you want to load at your own pace during a confirmed rental period.",
            href: "/book",
            cta: "Book Now",
        },
        {
            Icon: Truck,
            title: "Choose junk removal",
            desc: "Use full-service junk removal when you want a crew to load approved items and haul everything away during one appointment.",
            href: "/pricing",
            cta: "View Pricing",
        },
        {
            Icon: AlertTriangle,
            title: "Check restricted items",
            desc: "Hazardous, flammable, medical, and regulated materials should not be loaded into a junk removal truck or dumpster.",
        },
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        breadcrumbJsonLd([
                            { name: "Home", path: "/" },
                            { name: "Dumpster Rental", path },
                        ]),
                        serviceJsonLd({
                            service: {
                                title: "Dumpster Rental",
                                shortDesc: `Dumpster rental in ${cityState} for cleanouts, construction debris, remodeling projects, and household junk.`,
                            },
                            path,
                            description: `Dumpster rental in ${cityState} for cleanouts, construction debris, remodeling projects, and household junk.`,
                            offers: false,
                        }),
                        faqPageJsonLd(FAQ_ITEMS, path),
                    ]),
                }}
            />

            <DispatchPageHero
                crumbs={[
                    { label: "Home", href: "/" },
                    { label: "Dumpster Rental" },
                ]}
                eyebrow="Dumpster rental"
                title={<>Dumpster rental in {cityLabel}.</>}
                lede={`Book a dumpster rental request for cleanouts, remodeling debris, yard waste, roofing material, or large cleanup projects in ${cityState}. Container availability, placement, rental terms, and final pricing are reviewed before confirmation.`}
                primaryCta={{ label: "Book Now", href: "/book" }}
                secondaryCta={{ label: "View Pricing", href: "#container-sizes" }}
            />

            <DispatchMetricStrip items={metricItems} />

            <section className="section alt border" id="container-sizes">
                <div className="section-head">
                    <div>
                        <span className="eyebrow">Container sizes</span>
                        <h2>Choose the dumpster size that fits the job.</h2>
                    </div>
                    <p>Use these container cards as a planning guide. Availability, rental period, delivery address, material type, and final terms are confirmed through the booking flow.</p>
                </div>
                <div className="dumpster-size-grid">
                    {CONTAINER_SIZES.map((container) => {
                        const tier = tierForSize(container.id);
                        const hasPrice = hasTierPrice(tier);
                        return (
                            <article className="dumpster-size-card" key={container.id}>
                                <div className="dumpster-card-top">
                                    <StatIcon Icon={Container} label={`${container.label} dumpster`} />
                                    <div>
                                        <small>{container.yards}</small>
                                        <h3>{container.label}</h3>
                                    </div>
                                </div>
                                <p>{container.desc}</p>
                                <div className="dumpster-price">
                                    <span>{hasPrice ? "Planning range" : "Quote review"}</span>
                                    <strong>{hasPrice ? formatDumpsterPrice(tier) : "Call for pricing"}</strong>
                                </div>
                                <div className="dumpster-terms">
                                    {termsForTier(tier).map((term) => <span key={term}>{term}</span>)}
                                </div>
                                <div className="dumpster-fit">
                                    <b>Good for</b>
                                    <span>{container.goodFor}</span>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>

            <DispatchIntroGrid
                eyebrow="Booking flow"
                heading="Dumpster rental follows the same online quote path."
                boardEyebrow="Step sequence"
                boardHeading="What the booking form collects."
                rows={processRows}
            >
                <p>
                    The dumpster booking path starts with contact information, then collects the service type,
                    container size, rental details, delivery address, schedule window, and quote review.
                </p>
                <p>
                    If a container is unavailable for the selected date or size, the request is handled through the
                    configured availability and follow-up process instead of showing unsupported guarantees.
                </p>
                <div className="inline-cta-row">
                    <Link className="btn brand" href="/book">Get an Instant Quote</Link>
                    {siteConfig.phoneNumber && <a className="btn light" href={phoneHref}>Call Us</a>}
                </div>
            </DispatchIntroGrid>

            <VisualRentalPricing />

            <VisualAcceptedMaterials accepted={DEBRIS_TYPES} restrictedItems={prohibitedItems} />

            <section className="section">
                <div className="section-head">
                    <div>
                        <span className="eyebrow">Rental or removal</span>
                        <h2>Choose the right cleanup path.</h2>
                    </div>
                    <p>Some customers need a container for several days. Others need a crew to load and haul everything in one appointment.</p>
                </div>
                <div className="dumpster-option-grid">
                    {comparisonCards.map(({ Icon, title, desc, href, cta }) => (
                        <article className="dumpster-option-card" key={title}>
                            <StatIcon Icon={Icon} label={title} />
                            <h3>{title}</h3>
                            <p>{desc}</p>
                            {href && cta && <Link href={href}>{cta}</Link>}
                        </article>
                    ))}
                </div>
                {(credentialText || siteConfig.phoneNumber || isSameDayEnabled(siteConfig)) && (
                    <div className="dumpster-trust-strip">
                        {credentialText && <span><CheckCircle2 aria-hidden="true" /> {credentialText}</span>}
                        {isSameDayEnabled(siteConfig) && <span><CalendarClock aria-hidden="true" /> Same-day windows may be available when route capacity allows</span>}
                        {siteConfig.phoneNumber && <a href={phoneHref}><Phone aria-hidden="true" /> {formatPhone(siteConfig.phoneNumber)}</a>}
                    </div>
                )}
            </section>

            <DispatchFaqBoard
                eyebrow="Dumpster FAQ"
                heading={`Dumpster rental questions in ${cityState}.`}
                body="Review container sizing, placement, pricing factors, restricted items, and how dumpster rental compares with full-service junk removal."
                items={FAQ_ITEMS}
            />

            <DispatchFinalCta
                heading="Ready to book a dumpster rental?"
                body={`Start with container size, debris type, delivery address, placement notes, schedule window, and quote review for ${cityState}.`}
            />
        </>
    );
}
