import Link from "next/link";
import {
    AlertTriangle,
    Armchair,
    ArrowRight,
    Ban,
    Bed,
    Briefcase,
    Building2,
    CalendarClock,
    Check,
    Clock,
    HardHat,
    Home,
    Laptop,
    MapPin,
    Package,
    Plus,
    Refrigerator,
    Ruler,
    Scale,
    Trees,
    Truck,
    Wrench,
    type LucideIcon,
} from "lucide-react";
import VisualPricingScaleClient, { type VisualPricingFactor, type VisualPricingTier } from "@/components/redesign/VisualPricingScaleClient";
import VisualServiceItemsClient, { type VisualServiceItem } from "@/components/redesign/VisualServiceItemsClient";
import {
    getPricingTiersForDisplay,
    hasConfiguredPricing,
    siteConfig,
    type PricingTier,
    type SiteConfig,
} from "@/lib/siteConfig";
import type { ServiceDetail } from "@/lib/serviceData";

type VisualCard = {
    title: string;
    desc: string;
};

type RentalInsight = {
    Icon: LucideIcon;
    title: string;
    body: string;
};

function formatPricingRange(tier: PricingTier): string {
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    });
    const min = Math.round(tier.min);
    const max = Math.round(tier.max);
    return min === max ? formatter.format(min) : `${formatter.format(min)} - ${formatter.format(max)}`;
}

function loadDescription(tier: PricingTier, index: number): string {
    const label = tier.label.toLowerCase();
    if (label.includes("few") || label.includes("minimum")) return "Single item or small pile";
    if (label.includes("quarter")) return "Smaller pickup load";
    if (label.includes("half")) return "Larger pickup load";
    if (label.includes("full")) return "Large cleanout or packed truck";
    if (label.includes("multi") || label.includes("+")) return "Multi-load project reviewed before scheduling";
    return index < 2 ? "Smaller pickup load" : "Larger pickup load";
}

function tierTag(tier: PricingTier): string {
    const fraction = tier.fraction.trim();
    if (!fraction) return tier.label;
    return fraction === "1" ? "1 load" : `${fraction} load`;
}

function pricingTiers(config: SiteConfig, limit = 5): VisualPricingTier[] {
    const configured = getPricingTiersForDisplay(limit, config);
    if (hasConfiguredPricing(config) && configured.length > 0) {
        const fillStops = [0.16, 0.32, 0.55, 0.78, 1, 1];
        return configured.map((tier, index) => ({
            tag: tierTag(tier),
            name: tier.label,
            note: loadDescription(tier, index),
            range: formatPricingRange(tier),
            fill: fillStops[index] ?? Math.min(1, (index + 1) / configured.length),
        }));
    }

    return [
        { tag: "Small load", name: "Minimum pickup", note: "Single item or small pile", range: "Quote review", fill: 0.2 },
        { tag: "1/4 load", name: "Quarter load", note: "Small room or curb pile", range: "Quote review", fill: 0.36 },
        { tag: "1/2 load", name: "Half load", note: "Garage wall or several bulky items", range: "Quote review", fill: 0.58 },
        { tag: "Full load", name: "Full load", note: "Large cleanout or packed truck", range: "Quote review", fill: 1 },
    ];
}

function pricingFactors(config: SiteConfig): VisualPricingFactor[] {
    const base: VisualPricingFactor[] = [
        { key: "A", title: "Volume", detail: "How much truck space is used" },
        { key: "B", title: "Access", detail: "Stairs, gates, elevators, carry distance" },
        { key: "C", title: "Weight", detail: "Heavy material changes the job" },
        { key: "D", title: "Handling", detail: "Disassembly, sorting, restricted items" },
    ];

    if (!config.pricingConfigured) return base;
    return base;
}

function enabledPricingFactorText(config: SiteConfig): string {
    const enabled = config.pricingConfigured
        ? config.pricing.surcharges.filter((surcharge) => surcharge.enabled).map((surcharge) => surcharge.label)
        : [];

    if (enabled.length === 0) {
        return "Additional factors may include access, weight, material type, distance, and applicable local fees. Amounts are handled inside the booking estimate and final quote process.";
    }

    return `Additional factors may include: ${enabled.join(", ")}. Amounts are handled inside the booking estimate and final quote process.`;
}

export function VisualPricingScaleSection({
    config = siteConfig,
    localLabel,
    eyebrow,
    title,
    sectionId = "pricing",
}: {
    config?: SiteConfig;
    localLabel?: string;
    eyebrow?: string;
    title?: string;
    sectionId?: string;
}) {
    const hasPricing = hasConfiguredPricing(config);
    return (
        <VisualPricingScaleClient
            sectionId={sectionId}
            tiers={pricingTiers(config)}
            factors={pricingFactors(config)}
            disclaimer="Final price is confirmed before loading and can change with access, heavy materials, distance, or applicable local fees."
            eyebrow={eyebrow ?? (localLabel ? "Local load pricing" : "Load pricing")}
            title={title ?? (localLabel ? `Pick the load for ${localLabel}.` : "Pick the load that fits the job.")}
            factorsEyebrow={hasPricing ? "Final quote factors" : "Quote review factors"}
            factorsTitle="What affects your final quote."
        />
    );
}

function reviewedFor(service: ServiceDetail, index: number): string {
    return service.pricingFactors[index % Math.max(1, service.pricingFactors.length)] || "Item type, access, and handling";
}

function serviceItems(service: ServiceDetail): VisualServiceItem[] {
    return service.items.slice(0, 6).map((item, index) => ({
        name: item.title,
        detail: item.desc,
        reviewedFor: reviewedFor(service, index),
        scopeNote: item.title,
    }));
}

export function VisualServiceItemsSection({ service }: { service: ServiceDetail }) {
    return (
        <VisualServiceItemsClient
            eyebrow="Accepted categories"
            title={`Common ${service.title.toLowerCase()} items and jobs.`}
            intro={`Review common ${service.title.toLowerCase()} item types before booking. Hazardous or restricted materials are not accepted.`}
            items={serviceItems(service)}
        />
    );
}

function iconForProject(title: string, index: number): LucideIcon {
    const key = title.toLowerCase();
    if (key.includes("yard") || key.includes("backyard") || key.includes("renovation")) return Trees;
    if (key.includes("property") || key.includes("rental") || key.includes("office")) return Building2;
    if (key.includes("furniture") || key.includes("couch") || key.includes("sofa")) return Armchair;
    if (key.includes("appliance") || key.includes("refrigerator") || key.includes("washer")) return Refrigerator;
    if (key.includes("mattress") || key.includes("bed")) return Bed;
    if (key.includes("electronic") || key.includes("computer") || key.includes("tv")) return Laptop;
    if (key.includes("demo") || key.includes("construction") || key.includes("shed")) return HardHat;
    return [Wrench, Trees, Building2][index % 3];
}

export function VisualCommonProjects({
    service,
    projects,
}: {
    service: ServiceDetail;
    projects?: VisualCard[];
}) {
    const rows = (projects ?? service.useCases).slice(0, 3);
    if (rows.length === 0) return null;

    return (
        <section className="syj-cp-section">
            <div className="syj-cp-inner">
                <header className="syj-cp-head">
                    <div>
                        <div className="syj-cp-eyebrow">
                            <span className="syj-cp-eyebrow-rule" />
                            Common projects
                        </div>
                        <h2 className="syj-cp-title">When customers book this service.</h2>
                    </div>
                    <p className="syj-cp-intro">
                        {service.title} can help with one-item pickups, cleanouts, move-outs, and other approved hauling needs when the job scope is safe.
                    </p>
                </header>
                <div className="syj-cp-grid">
                    {rows.map((project, index) => {
                        const Icon = iconForProject(project.title, index);
                        return (
                            <article className="syj-cp-card" style={{ animationDelay: `${index * 80}ms` }} key={project.title}>
                                <span aria-hidden="true" className="syj-cp-ghost-num">{String(index + 1).padStart(2, "0")}</span>
                                <div className="syj-cp-card-top">
                                    <span className="syj-cp-card-icon"><Icon aria-hidden="true" /></span>
                                    <span className="syj-cp-card-idx">{String(index + 1).padStart(2, "0")}</span>
                                </div>
                                <h3 className="syj-cp-card-name">{project.title}</h3>
                                <p className="syj-cp-card-detail">{project.desc}</p>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function iconForAudience(title: string, index: number): LucideIcon {
    const key = title.toLowerCase();
    if (key.includes("home") || key.includes("rent")) return Home;
    if (key.includes("property") || key.includes("landlord") || key.includes("apartment")) return Building2;
    if (key.includes("business") || key.includes("office") || key.includes("realtor") || key.includes("contractor")) return Briefcase;
    return [Home, Building2, Briefcase][index % 3];
}

export function VisualWhoBooks({ service }: { service: ServiceDetail }) {
    const rows = service.audience.slice(0, 3);
    if (rows.length === 0) return null;

    return (
        <section className="syj-wb-section">
            <div className="syj-wb-inner">
                <div className="syj-wb-intro">
                    <div className="syj-wb-eyebrow">
                        <span className="syj-wb-eyebrow-rule" />
                        Who this helps
                    </div>
                    <h2 className="syj-wb-title">Who books {service.title.toLowerCase()}.</h2>
                    <p className="syj-wb-intro-text">
                        This service is useful for customers who need the lifting, loading, hauling, and quote review handled on one scheduled pickup.
                    </p>
                </div>
                <div className="syj-wb-list">
                    {rows.map((audience, index) => {
                        const Icon = iconForAudience(audience.title, index);
                        return (
                            <article className="syj-wb-row" style={{ animationDelay: `${index * 80}ms` }} key={audience.title}>
                                <span className="syj-wb-row-icon"><Icon aria-hidden="true" /></span>
                                <div className="syj-wb-row-text">
                                    <span className="syj-wb-row-tag">Customer {String(index + 1).padStart(2, "0")}</span>
                                    <h3 className="syj-wb-row-name">{audience.title}</h3>
                                    <p className="syj-wb-row-detail">{audience.desc}</p>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export function VisualPrepChecklist({ service }: { service: ServiceDetail }) {
    const steps = service.preparationTips;
    if (steps.length === 0) return null;

    return (
        <section className="syj-pc-section">
            <div className="syj-pc-inner">
                <div className="syj-pc-panel">
                    <div className="syj-pc-head">
                        <div className="syj-pc-eyebrow">
                            <span className="syj-pc-eyebrow-rule" />
                            Preparation
                        </div>
                        <h2 className="syj-pc-title">A clearer quote starts with clearer details.</h2>
                        <span className="syj-pc-count">{steps.length} step{steps.length === 1 ? "" : "s"} to prep</span>
                    </div>
                    <ol className="syj-pc-steps">
                        {steps.map((step, index) => (
                            <li className="syj-pc-step" style={{ animationDelay: `${index * 90}ms` }} key={step}>
                                <span className="syj-pc-step-box"><Check aria-hidden="true" /></span>
                                <span className="syj-pc-step-num">{String(index + 1).padStart(2, "0")}</span>
                                <span className="syj-pc-step-text">{step}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </section>
    );
}

function factorIcon(title: string, index: number): LucideIcon {
    const key = title.toLowerCase();
    if (key.includes("truck") || key.includes("volume") || key.includes("space")) return Truck;
    if (key.includes("weight") || key.includes("material") || key.includes("heavy")) return Scale;
    if (key.includes("access") || key.includes("distance") || key.includes("location")) return MapPin;
    if (key.includes("timing") || key.includes("schedule") || key.includes("same")) return Clock;
    return [Truck, Scale, MapPin, Clock][index % 4];
}

export function VisualEstimateFactors({
    config = siteConfig,
    title = "What can change an estimate.",
    body = "The booking process collects the details needed for an estimate. The crew still confirms the final price before loading begins.",
}: {
    config?: SiteConfig;
    title?: string;
    body?: string;
}) {
    const factors = [
        { label: "Truck space", detail: "How much truck space the accepted items require." },
        { label: "Material type", detail: "Heavy, dense, or specialty materials that change handling or disposal needs." },
        { label: "Access", detail: "Pickup access, stairs, parking, gates, elevators, and carry distance." },
        { label: "Timing", detail: "Pickup timing and schedule availability." },
    ];

    return (
        <section className="syj-ef-section">
            <div className="syj-ef-inner">
                <div className="syj-ef-intro">
                    <div className="syj-ef-eyebrow">
                        <span className="syj-ef-eyebrow-rule" />
                        Quote factors
                    </div>
                    <h2 className="syj-ef-title">{title}</h2>
                    <p className="syj-ef-body">{body}</p>
                    <Link className="syj-ef-cta" href="/book">
                        Get an Instant Quote
                        <span className="syj-ef-cta-arrow"><ArrowRight aria-hidden="true" /></span>
                    </Link>
                </div>
                <div className="syj-ef-ledger">
                    <ol className="syj-ef-rows">
                        {factors.map((factor, index) => {
                            const Icon = factorIcon(factor.label, index);
                            return (
                                <li className="syj-ef-row" style={{ animationDelay: `${index * 70}ms` }} key={factor.label}>
                                    <span className="syj-ef-row-index">{String(index + 1).padStart(2, "0")}</span>
                                    <span className="syj-ef-row-icon"><Icon aria-hidden="true" /></span>
                                    <div className="syj-ef-row-text">
                                        <span className="syj-ef-row-label">{factor.label}</span>
                                        <span className="syj-ef-row-detail">{factor.detail}</span>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                    <div className="syj-ef-note">
                        <div className="syj-ef-note-head">
                            <Plus aria-hidden="true" />
                            <span>Additional pricing factors</span>
                        </div>
                        <p className="syj-ef-note-text">{enabledPricingFactorText(config)}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function VisualRentalPricing() {
    const insights: RentalInsight[] = [
        {
            Icon: Scale,
            title: "Weight changes the quote.",
            body: "Dense debris can create overage costs even when the container is not visually full.",
        },
        {
            Icon: CalendarClock,
            title: "Rental days are confirmed.",
            body: "Included days, extension rates, and pickup timing come from the configured rental terms.",
        },
    ];
    const factors = [
        { key: "A", title: "Placement", detail: "Clear driveway, surface, street, or gate access before delivery." },
        { key: "B", title: "Material type", detail: "Construction debris, roofing, yard waste, and mixed junk can price differently." },
        { key: "C", title: "Weight", detail: "Heavy material and overages can affect the final rental total." },
        { key: "D", title: "Local rules", detail: "Street placement may need city, HOA, or property approval." },
    ];

    return (
        <section className="syj-rp-section">
            <div className="syj-rp-inner">
                <div className="syj-rp-bento">
                    <article className="syj-rp-lead syj-rp-anim">
                        <span className="syj-rp-lead-glow" aria-hidden="true" />
                        <span className="syj-rp-lead-icon"><Ruler aria-hidden="true" /></span>
                        <h3 className="syj-rp-lead-title">Placement needs room for truck access.</h3>
                        <p className="syj-rp-lead-body">
                            Clear the driveway, jobsite, gate path, or approved surface before delivery. Street placement may need city, property, or HOA approval.
                        </p>
                    </article>
                    {insights.map((insight, index) => {
                        const Icon = insight.Icon;
                        return (
                            <article className="syj-rp-insight syj-rp-anim" style={{ animationDelay: `${(index + 1) * 90}ms` }} key={insight.title}>
                                <span className="syj-rp-insight-icon"><Icon aria-hidden="true" /></span>
                                <h3 className="syj-rp-insight-title">{insight.title}</h3>
                                <p className="syj-rp-insight-body">{insight.body}</p>
                            </article>
                        );
                    })}
                </div>
                <article className="syj-rp-panel syj-rp-anim" style={{ animationDelay: "280ms" }}>
                    <div className="syj-rp-eyebrow">
                        <span className="syj-rp-eyebrow-rule" />
                        Quote factors
                    </div>
                    <h2 className="syj-rp-panel-title">What affects rental pricing.</h2>
                    <ul className="syj-rp-factors">
                        {factors.map((factor) => (
                            <li className="syj-rp-factor" key={factor.key}>
                                <span className="syj-rp-factor-key">{factor.key}</span>
                                <div className="syj-rp-factor-text">
                                    <span className="syj-rp-factor-title">{factor.title}</span>
                                    <span className="syj-rp-factor-detail">{factor.detail}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </article>
            </div>
        </section>
    );
}

function iconForMaterial(label: string, index: number): LucideIcon {
    const key = label.toLowerCase();
    if (key.includes("construction") || key.includes("demolition") || key.includes("roof")) return HardHat;
    if (key.includes("household") || key.includes("mixed")) return Home;
    if (key.includes("yard") || key.includes("tree") || key.includes("brush")) return Trees;
    if (key.includes("commercial") || key.includes("business")) return Building2;
    return [HardHat, Home, Trees, Building2, Package][index % 5];
}

export function VisualAcceptedMaterials({
    accepted,
    restrictedItems,
}: {
    accepted: Array<{ label: string }>;
    restrictedItems: string[];
}) {
    return (
        <section className="syj-am-section">
            <div className="syj-am-inner">
                <div className="syj-am-accepted">
                    <div className="syj-am-eyebrow">
                        <span className="syj-am-eyebrow-rule" />
                        Accepted categories
                    </div>
                    <h2 className="syj-am-title">What we haul.</h2>
                    <div className="syj-am-grid">
                        {accepted.map((cat, index) => {
                            const Icon = iconForMaterial(cat.label, index);
                            return (
                                <article className="syj-am-cat syj-am-anim" style={{ animationDelay: `${index * 65}ms` }} key={cat.label}>
                                    <span className="syj-am-cat-icon"><Icon aria-hidden="true" /></span>
                                    <span className="syj-am-cat-label">{cat.label}</span>
                                    <span className="syj-am-cat-check"><Check aria-hidden="true" /></span>
                                </article>
                            );
                        })}
                    </div>
                </div>
                <aside className="syj-am-warn syj-am-anim" style={{ animationDelay: "120ms" }}>
                    <div className="syj-am-warn-head">
                        <span className="syj-am-warn-icon"><AlertTriangle aria-hidden="true" /></span>
                        <h2 className="syj-am-warn-title">Keep restricted material out of the dumpster.</h2>
                    </div>
                    <p className="syj-am-warn-body">Do not load hazardous, flammable, medical, or regulated materials. When in doubt, ask before booking.</p>
                    <ul className="syj-am-warn-list">
                        {restrictedItems.map((item, index) => (
                            <li className="syj-am-warn-row syj-am-anim" style={{ animationDelay: `${200 + index * 60}ms` }} key={item}>
                                <span className="syj-am-warn-mark"><Ban aria-hidden="true" /></span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </aside>
            </div>
        </section>
    );
}

export function VisualLocationOverview({
    companyName,
    locationName,
    state,
    localInfo,
    isMainCity,
    hasSourcedLocalContent,
}: {
    companyName: string;
    locationName: string;
    state: string;
    localInfo: string;
    isMainCity: boolean;
    hasSourcedLocalContent: boolean;
}) {
    const coverageRows = [
        { title: isMainCity ? "Main city" : "Service area", detail: `${locationName}, ${state}` },
        { title: "Pickup address", detail: "Confirmed during booking" },
        { title: "Nearby details", detail: hasSourcedLocalContent ? "Listed when available" : "Ask about exact coverage" },
        { title: "Service match", detail: "Routes depend on job details" },
    ];
    const bookingSteps = ["Service type", "Load details", "Pickup address", "Access notes", "Schedule window", "Quote review"];

    return (
        <section className="syj-lo-section">
            <span aria-hidden="true" className="syj-lo-grid-bg" />
            <div className="syj-lo-inner">
                <article className="syj-lo-panel syj-lo-anim" style={{ animationDelay: "0ms" }}>
                    <div className="syj-lo-eyebrow">
                        <span className="syj-lo-eyebrow-rule" />
                        Local overview
                    </div>
                    <h2 className="syj-lo-title">Junk removal service in {locationName}.</h2>
                    <p className="syj-lo-lead">
                        <span className="syj-lo-lead-bar" aria-hidden="true" />
                        {localInfo}
                    </p>
                    <div className="syj-lo-booking">
                        <p className="syj-lo-booking-intro">
                            Use the booking flow with service type, load details, pickup address, access notes, schedule window, and quote review.
                        </p>
                        <ul className="syj-lo-chips">
                            {bookingSteps.map((step, index) => (
                                <li className="syj-lo-chip" key={step}>
                                    <span className="syj-lo-chip-num">{String(index + 1).padStart(2, "0")}</span>
                                    {step}
                                </li>
                            ))}
                        </ul>
                        <p className="syj-lo-closing">The final price is confirmed before loading begins.</p>
                    </div>
                </article>
                <article className="syj-lo-panel syj-lo-anim" style={{ animationDelay: "110ms" }}>
                    <div className="syj-lo-eyebrow">
                        <span className="syj-lo-eyebrow-rule" />
                        Location details
                    </div>
                    <h2 className="syj-lo-title">Local coverage around {locationName}.</h2>
                    <dl className="syj-lo-spec">
                        {coverageRows.map((item, index) => (
                            <div className="syj-lo-spec-row syj-lo-anim" style={{ animationDelay: `${200 + index * 70}ms` }} key={item.title}>
                                <dt className="syj-lo-spec-key">
                                    <span className="syj-lo-spec-index">{String(index + 1).padStart(2, "0")}</span>
                                    {item.title}
                                </dt>
                                <dd className="syj-lo-spec-val">{item.detail}</dd>
                            </div>
                        ))}
                    </dl>
                </article>
            </div>
        </section>
    );
}
