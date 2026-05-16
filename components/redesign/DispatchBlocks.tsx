import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import SafeImage from "@/components/SafeImage";
import {
    formatPhone,
    getGoogleTestimonials,
    getPricingTiersForDisplay,
    getReviewSummary,
    hasConfiguredPricing,
    hasVerifiedGoogleReviews,
    isSameDayEnabled,
    siteConfig,
    telHref,
    type PricingTier,
    type SiteConfig,
} from "@/lib/siteConfig";
import { resolveServiceCatalogIds } from "@/lib/catalogs/services";
import {
    focalPointToObjectPosition,
    getServiceImageRole,
    resolveJunkRemovalImage,
    type JunkRemovalImageRole,
} from "@/lib/templateAssets/junkRemoval";

export type DispatchFaq = { q: string; a: string };
export type DispatchCard = { title: string; desc: string; eyebrow?: string; href?: string };
export type DispatchMetric = { label: string; value: string };
export type DispatchInfoRow = { n: string; title: string; desc: string };

function displayArea(config: SiteConfig): string {
    if (config.serviceArea && config.serviceArea !== "your area") return config.serviceArea;
    return [config.city, config.state].filter(Boolean).join(", ") || "your service area";
}

function companyInitial(name: string): string {
    const clean = name.trim();
    return clean ? clean.charAt(0).toUpperCase() : "J";
}

function cleanSlug(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

function areaNames(config: SiteConfig, limit = 8): string[] {
    const values = [config.city, ...config.serviceArea.split(/[,;]/)];
    const seen = new Set<string>();
    const result: string[] = [];

    for (const value of values) {
        const clean = value.replace(/\s+/g, " ").trim();
        const key = clean.toLowerCase();
        if (!clean || seen.has(key)) continue;
        if (["your area", "service area", "surrounding areas", "near me", "nearby"].includes(key)) continue;
        if (/^\d{5}(?:-\d{4})?$/.test(clean)) continue;
        seen.add(key);
        result.push(clean);
    }

    return result.slice(0, limit);
}

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
    if (label.includes("quarter")) return "Small room or curb pile";
    if (label.includes("half")) return "Garage wall or several bulky items";
    if (label.includes("full")) return "Large cleanout or packed truck";
    if (label.includes("multi") || label.includes("+")) return "Multi-load project reviewed before scheduling";
    return index < 2 ? "Smaller pickup load" : "Larger pickup load";
}

function pricingRows(config: SiteConfig): Array<{ label: string; desc: string; fraction: string; price: string }> {
    const tiers = getPricingTiersForDisplay(6, config);
    if (hasConfiguredPricing(config) && tiers.length > 0) {
        return tiers.map((tier, index) => ({
            label: tier.label,
            fraction: tier.fraction,
            desc: loadDescription(tier, index),
            price: formatPricingRange(tier),
        }));
    }

    return [
        { label: "Minimum pickup", fraction: "Small", desc: "Single item or small pile", price: "Quote review" },
        { label: "Quarter load", fraction: "1/4", desc: "Small room or curb pile", price: "Quote review" },
        { label: "Half load", fraction: "1/2", desc: "Garage wall or several bulky items", price: "Quote review" },
        { label: "Full load", fraction: "Full", desc: "Large cleanout or packed truck", price: "Quote review" },
    ];
}

export function DispatchUtilityBar({ config = siteConfig, showReviews }: { config?: SiteConfig; showReviews?: boolean } = {}) {
    const sameDay = isSameDayEnabled(config);
    const reviewSummary = hasVerifiedGoogleReviews(config) ? getReviewSummary(config) : null;
    const canShowReviews = showReviews ?? Boolean(reviewSummary);

    return (
        <div className="utility-bar">
            <span>
                {sameDay
                    ? `Same-day route openings in ${config.city || "your area"} when capacity is available`
                    : `Pickup windows available across ${displayArea(config)}`}
            </span>
            <div className="utility-actions">
                {canShowReviews && reviewSummary && <Link href="/reviews">{reviewSummary.averageRating.toFixed(1)} rating</Link>}
                {hasConfiguredPricing(config) && <Link href="/pricing">Volume pricing</Link>}
                <Link href="/book">Book online</Link>
            </div>
        </div>
    );
}

export function DispatchSiteFooter({ config = siteConfig }: { config?: SiteConfig } = {}) {
    const services = resolveServiceCatalogIds([...config.services]).slice(0, 6);
    const areas = areaNames(config, 6);
    const companyLinks = [
        { label: "About", href: "/about" },
        { label: "Pricing", href: "/pricing" },
        ...(hasVerifiedGoogleReviews(config) ? [{ label: "Reviews", href: "/reviews" }] : []),
        { label: "Contact", href: "/contact" },
    ];

    return (
        <footer className="site-footer">
            <div className="footer-col">
                <h4>{config.companyName}</h4>
                <p>Professional junk removal, cleanouts, and hauling for {displayArea(config)}.</p>
                {config.phoneNumber && <a href={telHref(config.phoneNumber)}>{formatPhone(config.phoneNumber)}</a>}
            </div>
            <div className="footer-col">
                <h4>Pages</h4>
                {companyLinks.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
            </div>
            <div className="footer-col">
                <h4>Services</h4>
                {services.length > 0
                    ? services.map((service) => <Link key={service.id} href={`/services/${service.id}`}>{service.name}</Link>)
                    : <Link href="/services">Services</Link>}
            </div>
            <div className="footer-col">
                <h4>Locations</h4>
                {areas.length > 0
                    ? areas.map((area) => <Link key={area} href={`/locations/${cleanSlug(area)}`}>{area}</Link>)
                    : <Link href="/locations">Service areas</Link>}
                <Link href="/book">Book online</Link>
            </div>
        </footer>
    );
}

export function DispatchHomeHero({ config = siteConfig }: { config?: SiteConfig } = {}) {
    const hero = resolveJunkRemovalImage({
        config,
        role: "hero",
        routeKey: "home",
        overrideSrc: config.heroImageUrl,
    });
    const reviewSummary = hasVerifiedGoogleReviews(config) ? getReviewSummary(config) : null;
    const area = displayArea(config);
    const headline = [config.heroHeadline, config.heroAccentText].filter(Boolean).join(" ");

    return (
        <section className="hero" id="home">
            <div className="hero-copy">
                <span className="eyebrow">Local crew dispatch</span>
                <h1>{headline}</h1>
                <p>{config.tagline || `Book professional junk removal in ${area}. Pricing is based on load size, access, and job details.`}</p>
                <div className="hero-actions">
                    <Link className="btn brand" href="/book">Check availability</Link>
                    <Link className="btn light" href="/pricing">See load pricing</Link>
                </div>
                {reviewSummary && (
                    <div className="trust-line">
                        <span className="stars">★★★★★</span>
                        <strong>{reviewSummary.averageRating.toFixed(1)} average rating</strong>
                        <span>Verified Google reviews</span>
                    </div>
                )}
            </div>

            <div className="hero-media" aria-label="Crew loading junk removal truck">
                <div className="media-shell">
                    <SafeImage
                        src={hero.src}
                        fallbackSrc="/images/default-hero.png"
                        alt={hero.alt}
                        width={1800}
                        height={1125}
                        loading="eager"
                        style={{
                            width: "100%",
                            height: "100%",
                            minHeight: 520,
                            objectFit: "cover",
                            objectPosition: focalPointToObjectPosition(hero.focalPoint),
                        }}
                    />
                    <div className="dispatch-overlay">
                        <div className="route-card">
                            <span>Route board</span>
                            <strong>Pickup details reviewed for {config.city || "your area"}</strong>
                        </div>
                        <div className="route-mini">
                            <div>Load size scoped</div>
                            <div>Access reviewed</div>
                            <div>{area}</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function DispatchActionStrip() {
    const items = [
        ["01", "Find a pickup window", "Location and timing stay visible before the customer commits."],
        ["02", "Estimate the load", "Volume bands explain the job size before the final quote."],
        ["03", "Confirm what goes", "Items, access, photos, and crew notes stay part of the booking path."],
    ] as const;

    return (
        <section className="action-strip" aria-label="Quick actions">
            {items.map(([n, title, desc]) => (
                <div className="action-item" key={n}>
                    <span className="icon-box">{n}</span>
                    <div>
                        <h3>{title}</h3>
                        <p>{desc}</p>
                    </div>
                </div>
            ))}
        </section>
    );
}

export function DispatchServiceMosaic({
    config = siteConfig,
    eyebrow = "What customers scan first",
    heading = "Services that look concrete, not generic.",
    body,
    limit = 5,
    currentServiceId,
}: {
    config?: SiteConfig;
    eyebrow?: string;
    heading?: string;
    body?: string;
    limit?: number;
    currentServiceId?: string;
} = {}) {
    const services = resolveServiceCatalogIds([...config.services])
        .filter((service) => service.id !== currentServiceId)
        .slice(0, limit);
    if (services.length === 0) return null;

    return (
        <section className="section" id="services">
            <div className="section-head">
                <div>
                    <span className="eyebrow">{eyebrow}</span>
                    <h2>{heading}</h2>
                </div>
                <p>{body || "Each enabled service is rendered from the configured service set and safe service catalog copy."}</p>
            </div>
            <div className="service-mosaic">
                {services.map((service, index) => {
                    const image = resolveJunkRemovalImage({
                        config,
                        role: getServiceImageRole(service.id),
                        routeKey: `service-mosaic-${service.id}`,
                        overrideSrc: config.serviceImages?.[service.id],
                        serviceTitle: service.name,
                    });
                    const className = ["service-tile"];
                    if (index === 0) className.push("large");
                    if (index === 3) className.push("wide");

                    return (
                        <Link href={`/services/${service.id}`} className={className.join(" ")} key={service.id}>
                            <SafeImage
                                src={image.src}
                                fallbackSrc="/images/default-hero.png"
                                alt={image.alt}
                                width={1100}
                                height={760}
                                loading="lazy"
                                style={{ objectPosition: focalPointToObjectPosition(image.focalPoint) }}
                            />
                            <div className="service-copy">
                                <small>{service.audience}</small>
                                <h3>{service.name}</h3>
                                <p>{service.blurb}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}

export function DispatchWorkGrid() {
    const steps = [
        ["1", "Tell us what goes", "Items, photos, stairs, gate codes, and curbside notes make the estimate useful."],
        ["2", "Pick a window", "Availability and service area are checked before the customer commits."],
        ["3", "Approve the quote", "The crew confirms final volume and removes the approved items."],
    ] as const;

    return (
        <section className="section tight" id="process">
            <div className="work-grid">
                <div className="work-panel">
                    <span className="eyebrow">How it works</span>
                    <h2>One screen should answer the job.</h2>
                    <p>The booking path reduces the decision to a short sequence: check availability, explain the job, approve the quote, then let the crew load.</p>
                    <Link className="btn brand" href="/book">Start quote</Link>
                </div>
                <div className="route-board">
                    {steps.map(([n, title, desc]) => (
                        <article className="route-step" key={n}>
                            <span>{n}</span>
                            <h3>{title}</h3>
                            <p>{desc}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function DispatchPricingBoard({
    config = siteConfig,
    eyebrow = "Pricing clarity",
    heading = "Load bands need to feel physical.",
    body,
}: {
    config?: SiteConfig;
    eyebrow?: string;
    heading?: string;
    body?: string;
} = {}) {
    const rows = pricingRows(config);
    const factors = [
        ["A", "Volume", "The amount of truck space used remains the clearest anchor."],
        ["B", "Access", "Stairs, elevators, long carries, and tight paths can affect labor."],
        ["C", "Materials", "Heavy, restricted, or special-disposal items need clear handling."],
        ["D", "Location", "Service area and route distance stay visible."],
    ] as const;

    return (
        <section className="section" id="pricing">
            <div className="section-head">
                <div>
                    <span className="eyebrow">{eyebrow}</span>
                    <h2>{heading}</h2>
                </div>
                <p>{body || "Pricing stays tied to configured load tiers. The final quote is confirmed before loading begins."}</p>
            </div>
            <div className="pricing-grid">
                <div className="price-board">
                    {rows.map((row, index) => (
                        <div className="load-row" key={`${row.label}-${index}`}>
                            <div><strong>{row.label}</strong><small>{row.desc}</small></div>
                            <div className="bar" aria-hidden="true"><span style={{ "--fill": `${Math.min(92, 18 + index * 14)}%` } as CSSProperties} /></div>
                            <div className="price">{row.price}</div>
                        </div>
                    ))}
                </div>
                <div className="price-board price-factors">
                    {factors.map(([n, title, desc]) => (
                        <div className="factor" key={n}>
                            <span>{n}</span>
                            <div><strong>{title}</strong><small>{desc}</small></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function DispatchAreaSection({ config = siteConfig }: { config?: SiteConfig } = {}) {
    const areas = areaNames(config, 8);
    if (areas.length === 0) return null;

    return (
        <section className="section tight" id="areas">
            <div className="area-section">
                <div className="map-board">
                    <div className="map-route" aria-hidden="true">
                        <span className="pin one">1</span>
                        <span className="pin two">2</span>
                        <span className="pin three">3</span>
                    </div>
                </div>
                <div className="area-copy">
                    <span className="eyebrow">Local coverage</span>
                    <h2>Route-first service area.</h2>
                    <p>{config.companyName} serves {displayArea(config)}. Address coverage is confirmed during booking.</p>
                    <div className="area-chips">
                        {areas.map((area) => <Link className="area-chip" href={`/locations/${cleanSlug(area)}`} key={area}>{area}</Link>)}
                    </div>
                </div>
            </div>
        </section>
    );
}

export function DispatchReviewRail({ config = siteConfig }: { config?: SiteConfig } = {}) {
    const reviews = getGoogleTestimonials(8, config);
    const summary = hasVerifiedGoogleReviews(config) ? getReviewSummary(config) : null;
    if (!summary || reviews.length === 0) return null;
    const loop = [...reviews, ...reviews];

    return (
        <section className="section reviews" id="reviews">
            <div className="section-head">
                <div>
                    <span className="eyebrow">Proof, when connected</span>
                    <h2>Show several reviews at once.</h2>
                </div>
                <p>Verified Google reviews appear only when the client has review data connected.</p>
            </div>
            <div className="review-layout">
                <aside className="review-score">
                    <span className="stars">★★★★★</span>
                    <strong>{summary.averageRating.toFixed(1)}</strong>
                    <p>{summary.totalCount.toLocaleString()} verified Google review{summary.totalCount === 1 ? "" : "s"} available for this business.</p>
                </aside>
                <div className="review-rail" aria-label="Animated customer reviews">
                    <div className="review-track">
                        {loop.map((review, index) => (
                            <article className="review-card" key={`${review.reviewerName}-${index}`}>
                                <span className="stars">★★★★★</span>
                                <b>{review.reviewerName}</b>
                                <p>{review.body}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export function DispatchBookingShell() {
    const steps = [
        ["1", "Service type", "Junk removal, cleanout, dumpster where enabled", "Configured"],
        ["2", "Pickup details", "Address, items, access notes, and photos", "Reviewed"],
        ["3", "Quote path", "Final price confirmed before loading", "Transparent"],
        ["4", "Confirmation", "Submitted request details stay visible", "Ready"],
    ] as const;

    return (
        <section className="section tight" id="booking">
            <div className="booking-shell">
                <div className="booking-board">
                    <span className="eyebrow">Booking path</span>
                    <h2>Keep the template configurable.</h2>
                    <p>The live booking wizard keeps company identity, brand color, services, pricing, service area, and booking rules connected to the dashboard configuration.</p>
                    <Link className="btn brand" href="/book">Open booking</Link>
                </div>
                <div className="booking-board wizard-board">
                    {steps.map(([n, title, desc, status]) => (
                        <div className="wizard-step" key={n}>
                            <span>{n}</span>
                            <div><strong>{title}</strong><small>{desc}</small></div>
                            <b>{status}</b>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function DispatchFaqBoard({
    items,
    eyebrow = "FAQ",
    heading = "Questions before booking.",
    body,
}: {
    items: DispatchFaq[];
    eyebrow?: string;
    heading?: string;
    body?: string;
}) {
    if (items.length === 0) return null;

    return (
        <section className="section" id="faq">
            <div className="section-head">
                <div>
                    <span className="eyebrow">{eyebrow}</span>
                    <h2>{heading}</h2>
                </div>
                <p>{body || "Answers stay aligned with the visible page content and configured service rules."}</p>
            </div>
            <div className="faq-board">
                {items.slice(0, 6).map((faq) => (
                    <article className="faq-item" key={faq.q}>
                        <h3>{faq.q}</h3>
                        <p>{faq.a}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}

export function DispatchFinalCta({
    config = siteConfig,
    heading = "Ready to clear it out?",
    body,
}: {
    config?: SiteConfig;
    heading?: string;
    body?: string;
} = {}) {
    return (
        <section className="section tight">
            <div className="final-cta">
                <div>
                    <h2>{heading}</h2>
                    <p>{body || `Book online with the pickup address, item list, photos when available, and access notes for ${displayArea(config)}.`}</p>
                </div>
                <Link className="btn brand" href="/book">Start quote</Link>
            </div>
        </section>
    );
}

export function DispatchPageHero({
    config = siteConfig,
    crumbs,
    eyebrow,
    title,
    lede,
    media,
    coverageMap = false,
    primaryCta = { label: "Check availability", href: "/book" },
    secondaryCta,
}: {
    config?: SiteConfig;
    crumbs: Array<{ label: string; href?: string }>;
    eyebrow: string;
    title: ReactNode;
    lede: string;
    media?: {
        role?: JunkRemovalImageRole;
        src?: string | null;
        alt?: string;
        routeKey?: string;
        serviceTitle?: string;
        locationName?: string;
        label?: string;
        caption?: string;
    };
    coverageMap?: boolean;
    primaryCta?: { label: string; href: string };
    secondaryCta?: { label: string; href: string };
}) {
    const image = media && !coverageMap
        ? resolveJunkRemovalImage({
            config,
            role: media.role ?? "hero",
            routeKey: media.routeKey,
            overrideSrc: media.src,
            alt: media.alt,
            serviceTitle: media.serviceTitle,
            locationName: media.locationName,
        })
        : null;

    return (
        <section className="page-hero">
            <div className="hero-copy">
                <nav className="crumbs" aria-label="Breadcrumb">
                    {crumbs.map((crumb, index) => (
                        <span key={`${crumb.label}-${index}`}>
                            {index > 0 && " / "}
                            {crumb.href && index < crumbs.length - 1 ? <Link href={crumb.href}>{crumb.label}</Link> : crumb.label}
                        </span>
                    ))}
                </nav>
                <span className="eyebrow">{eyebrow}</span>
                <h1>{title}</h1>
                <p>{lede}</p>
                <div className="hero-actions">
                    <Link className="btn brand" href={primaryCta.href}>{primaryCta.label}</Link>
                    {secondaryCta && <Link className="btn light" href={secondaryCta.href}>{secondaryCta.label}</Link>}
                </div>
            </div>

            <div className="hero-media">
                {coverageMap ? (
                    <div className="coverage-map" aria-label="Local service area map">
                        <div className="route-line" aria-hidden="true" />
                        <span className="pin one">1</span>
                        <span className="pin two">2</span>
                        <span className="pin three">3</span>
                    </div>
                ) : image ? (
                    <div className="media-shell">
                        <SafeImage
                            src={image.src}
                            fallbackSrc="/images/default-hero.png"
                            alt={image.alt}
                            width={1600}
                            height={1000}
                            loading="eager"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                objectPosition: focalPointToObjectPosition(image.focalPoint),
                            }}
                        />
                        <div className="media-label">
                            <span>{media?.label || "Configured page"}</span>
                            <strong>{media?.caption || "Generated from the client's configured website data."}</strong>
                        </div>
                    </div>
                ) : null}
            </div>
        </section>
    );
}

export function DispatchLoadPricingCards({ config = siteConfig, localLabel }: { config?: SiteConfig; localLabel?: string } = {}) {
    const rows = pricingRows(config);
    const hasPricing = hasConfiguredPricing(config);

    return (
        <section className="section alt border" id="pricing">
            <div className="section-head">
                <div>
                    <span className="eyebrow">{localLabel ? "Local load pricing" : "Load pricing"}</span>
                    <h2>{localLabel ? `Starting prices for ${localLabel} loads.` : "Pricing cards for every load size."}</h2>
                </div>
                <p>{hasPricing ? "These cards come from the client's configured pricing tiers." : "Load pricing is configured during launch. The booking path still collects the job details needed for review."}</p>
            </div>
            <div className="pricing-grid">
                <div>
                    <div className="load-card-grid" aria-label="Starting load prices">
                        {rows.map((row) => (
                            <article className="load-card" key={row.label}>
                                <small>{row.fraction} load</small>
                                <h3>{row.label}</h3>
                                <p>{row.desc}</p>
                                <div className="load-price"><span>{hasPricing ? "Configured range" : "Estimate path"}</span><strong>{row.price}</strong></div>
                            </article>
                        ))}
                    </div>
                    <p className="price-note">Final price is confirmed before loading and can change with access, heavy materials, distance, or enabled local fees.</p>
                </div>
                <aside className="info-board">
                    <span className="eyebrow">Final quote factors</span>
                    <h2>No mystery pricing copy.</h2>
                    <DispatchInfoRows rows={[
                        { n: "A", title: "Volume", desc: "How much truck space is used" },
                        { n: "B", title: "Access", desc: "Stairs, gates, elevators, carry distance" },
                        { n: "C", title: "Weight", desc: "Heavy material changes the job" },
                        { n: "D", title: "Handling", desc: "Disassembly, sorting, restricted items" },
                    ]} />
                </aside>
            </div>
        </section>
    );
}

export function DispatchMetricStrip({ items }: { items: DispatchMetric[] }) {
    return (
        <section className="metric-strip" aria-label="Page facts">
            {items.map((item) => (
                <div className="stat" key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                </div>
            ))}
        </section>
    );
}

export function DispatchInfoRows({ rows }: { rows: DispatchInfoRow[] }) {
    return (
        <div className="factor-list">
            {rows.map((row) => (
                <div className="info-row" key={`${row.n}-${row.title}`}>
                    <b>{row.n}</b>
                    <div><strong>{row.title}</strong><span>{row.desc}</span></div>
                </div>
            ))}
        </div>
    );
}

export function DispatchIntroGrid({
    eyebrow,
    heading,
    children,
    boardEyebrow,
    boardHeading,
    rows,
}: {
    eyebrow: string;
    heading: ReactNode;
    children: ReactNode;
    boardEyebrow: string;
    boardHeading: ReactNode;
    rows: DispatchInfoRow[];
}) {
    return (
        <section className="section">
            <div className="intro-grid">
                <div className="copy-block">
                    <span className="eyebrow">{eyebrow}</span>
                    <h2>{heading}</h2>
                    {children}
                </div>
                <aside className="info-board">
                    <span className="eyebrow">{boardEyebrow}</span>
                    <h2>{boardHeading}</h2>
                    <DispatchInfoRows rows={rows} />
                </aside>
            </div>
        </section>
    );
}

export function DispatchCardSection({
    eyebrow,
    heading,
    body,
    cards,
    variant = "card-grid",
    alt = false,
}: {
    eyebrow: string;
    heading: string;
    body?: string;
    cards: DispatchCard[];
    variant?: "card-grid" | "detail-grid" | "coverage-cards" | "service-links" | "fact-grid";
    alt?: boolean;
}) {
    if (cards.length === 0) return null;
    return (
        <section className={`section${alt ? " alt border" : ""}`}>
            <div className="section-head">
                <div>
                    <span className="eyebrow">{eyebrow}</span>
                    <h2>{heading}</h2>
                </div>
                {body && <p>{body}</p>}
            </div>
            <div className={variant}>
                {cards.map((card) => {
                    const content = (
                        <>
                            {card.eyebrow && <small>{card.eyebrow}</small>}
                            <h3>{card.title}</h3>
                            <p>{card.desc}</p>
                            {card.href && <span className="btnline">View service -&gt;</span>}
                        </>
                    );
                    return card.href ? (
                        <Link className="service-link" href={card.href} key={card.title}>{content}</Link>
                    ) : (
                        <article className={variant === "detail-grid" ? "project-card" : variant === "coverage-cards" ? "coverage-card" : variant === "fact-grid" ? "fact-card" : "item-card"} key={card.title}>
                            {content}
                        </article>
                    );
                })}
            </div>
        </section>
    );
}

export function DispatchInlinePills({ items }: { items: string[] }) {
    if (items.length === 0) return null;
    return (
        <div className="inline-list">
            {items.map((item) => <span className="pill" key={item}>{item}</span>)}
        </div>
    );
}
