import Link from "next/link";
import type { ReactNode } from "react";
import SafeImage from "@/components/SafeImage";
import ServiceAreaMap, { type MapFocus } from "@/components/redesign/ServiceAreaMap";
import RichFAQ from "@/components/redesign/RichFAQ";
import { VisualPricingScaleSection } from "@/components/redesign/VisualReplacementBlocks";
import {
    formatPhone,
    getGoogleTestimonials,
    getPricingTiersForDisplay,
    getReviewSummary,
    groupBusinessHours,
    hasConfiguredPricing,
    hasVerifiedGoogleReviews,
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
export type DispatchCard = { title: string; desc: string; eyebrow?: string; href?: string; actionLabel?: string };
export type DispatchMetric = { label: string; value: string };
export type DispatchInfoRow = { n: string; title: string; desc: string };

function displayArea(config: SiteConfig): string {
    if (config.serviceArea && config.serviceArea !== "your area") return config.serviceArea;
    return [config.city, config.state].filter(Boolean).join(", ") || "your service area";
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

export function DispatchSiteFooter({ config = siteConfig, showReviews }: { config?: SiteConfig; showReviews?: boolean } = {}) {
    const services = resolveServiceCatalogIds([...config.services]).slice(0, 6);
    const areas = areaNames(config, 6);
    const shouldShowReviews = showReviews ?? hasVerifiedGoogleReviews(config);
    const hoursRows = config.businessHours ? groupBusinessHours(config.businessHours) : [];
    const addressLines = [
        config.streetAddress,
        [config.city, config.state].filter(Boolean).join(", "),
    ].filter(Boolean);
    const emailAddress = config.emailAddress;
    const companyLinks = [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Pricing", href: "/pricing" },
        ...(shouldShowReviews ? [{ label: "Reviews", href: "/reviews" }] : []),
        ...(config.enableBlog ? [{ label: "Blog", href: "/blog" }] : []),
        { label: "Contact", href: "/contact" },
        { label: "Manage Booking", href: "/customer-portal" },
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
    ];

    return (
        <footer className="site-footer">
            <div className="footer-main">
                <div className="footer-brand">
                    <Link className="footer-logo" href="/" aria-label={`${config.companyName} home`}>
                        <span>
                            <strong>{config.companyName}</strong>
                            <small>Hauling and cleanouts</small>
                        </span>
                    </Link>
                    <p>Professional junk removal, cleanouts, and hauling services.</p>
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
                    <Link href="/book">Book Now</Link>
                </div>
                <div className="footer-contact">
                    <h4>Contact us</h4>
                    <div className="footer-contact-list">
                        {emailAddress && <a href={`mailto:${emailAddress}`}>{emailAddress}</a>}
                        {config.phoneNumber && <a href={telHref(config.phoneNumber)}>{formatPhone(config.phoneNumber)}</a>}
                        {addressLines.length > 0 && (
                            <address>
                                {addressLines.map((line) => <span key={line}>{line}</span>)}
                            </address>
                        )}
                    </div>
                    {hoursRows.length > 0 && (
                        <div className="footer-hours" aria-label="Business hours">
                            <strong>Business hours</strong>
                            {hoursRows.map((row) => (
                                <span key={row.days}><b>{row.days}</b>{row.label}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="footer-bottom">
                <span>Copyright © {new Date().getFullYear()} {config.companyName}</span>
                <span>
                    All rights reserved | <Link href="/terms">Terms and Conditions</Link> | <Link href="/privacy">Privacy Policy</Link>
                </span>
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
                    <Link className="btn brand" href="/book">Book Now</Link>
                    <Link className="btn light" href="/customer-portal" prefetch={false}>Manage Booking</Link>
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
                            <strong>Pickup details reviewed before booking</strong>
                        </div>
                        <div className="route-mini">
                            <div>Load size selected</div>
                            <div>Access notes checked</div>
                            <div>Quote reviewed</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function DispatchActionStrip({ config = siteConfig }: { config?: SiteConfig } = {}) {
    const items = [
        ["01", "Tell us what needs hauling", "Enter contact details, service type, pickup address, and access notes."],
        ["02", "Select the job details", "Choose the load size or dumpster details that best match the job."],
        ["03", "Review and schedule", "Pick an available window, review the quote, and submit the booking request."],
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
    eyebrow = "Junk removal services",
    heading,
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
    const area = displayArea(config);

    return (
        <section className="section" id="services">
            <div className="section-head">
                <div>
                    <span className="eyebrow">{eyebrow}</span>
                    <h2>{heading || `Junk removal services in ${area}.`}</h2>
                </div>
                <p>{body || "Choose the service that best matches the items, cleanout, or debris you need hauled away."}</p>
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

export function DispatchWorkGrid({ config = siteConfig }: { config?: SiteConfig } = {}) {
    const steps = [
        ["1", "Enter contact details", "Start with your name, phone, email, and the service type you need."],
        ["2", "Add job and access notes", "Choose the load size, pickup address, access location, and any special handling details."],
        ["3", "Schedule and review", "Pick an available window, review the quote, and submit the booking request."],
    ] as const;

    return (
        <section className="section tight" id="process">
            <div className="work-grid">
                <div className="work-panel">
                    <span className="eyebrow">How it works</span>
                    <h2>Book junk removal without guessing the final price.</h2>
                    <p>Start online with contact and job details, choose an available window, and review the quote before submitting the booking request.</p>
                    <Link className="btn brand" href="/book">Get an Instant Quote</Link>
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
    eyebrow = "Load pricing",
    heading = "Pick the load that fits the job.",
}: {
    config?: SiteConfig;
    eyebrow?: string;
    heading?: string;
    body?: string;
} = {}) {
    return <VisualPricingScaleSection config={config} eyebrow={eyebrow} title={heading} />;
}

export function DispatchAreaSection({ config = siteConfig, focus }: { config?: SiteConfig; focus?: MapFocus } = {}) {
    const areas = areaNames(config, 8);
    if (areas.length === 0) return null;

    return (
        <section className="section tight" id="areas">
            <div className="area-section">
                <ServiceAreaMap config={config} focus={focus} />
                <div className="area-copy">
                    <span className="eyebrow">Local coverage</span>
                    <h2>{focus?.name ? `Junk removal coverage around ${focus.name}.` : `Junk removal service areas near ${config.city || "you"}.`}</h2>
                    <p>
                        {focus?.name
                            ? `${config.companyName} highlights ${focus.name} on this location page. Exact pickup address coverage is confirmed during booking.`
                            : `${config.companyName} serves ${displayArea(config)}. Address coverage is confirmed during booking.`}
                    </p>
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
                    <span className="eyebrow">Customer reviews</span>
                    <h2>Recent Google reviews from junk removal customers.</h2>
                </div>
                <p>Reviews appear here only when verified Google review data is available for this business.</p>
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

export function DispatchBookingShell({ config = siteConfig }: { config?: SiteConfig } = {}) {
    const steps = [
        ["1", "Contact and service", "Name, phone, email, and the service type you need", "Start"],
        ["2", "Job details", "Load size, pickup address, access location, and special handling notes", "Details"],
        ["3", "Schedule", "Available date and time window based on the booking calendar", "Window"],
        ["4", "Quote review", "Review the quote and submit the booking request", "Submit"],
    ] as const;

    return (
        <section className="section tight" id="booking">
            <div className="booking-shell">
                <div className="booking-board">
                    <span className="eyebrow">Booking path</span>
                    <h2>Book junk removal online in {config.city || "your area"}.</h2>
                    <p>Use the booking form to enter contact information, job details, pickup address, access notes, schedule window, and quote review.</p>
                    <div className="booking-actions">
                        <Link className="btn brand" href="/book">Book Now</Link>
                        <Link className="btn light" href="#pricing">See Pricing</Link>
                    </div>
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
    heading = "Junk removal questions before booking.",
    body,
    tone = "paper",
}: {
    items: DispatchFaq[];
    eyebrow?: string;
    heading?: string;
    body?: string;
    tone?: "paper" | "paper-2";
}) {
    return <RichFAQ eyebrow={eyebrow} heading={heading} body={body} items={items} tone={tone} />;
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
    const phoneHref = telHref(config.phoneNumber);
    return (
        <section className="section tight">
            <div className="final-cta">
                <div>
                    <h2>{heading}</h2>
                    <p>{body || `Start with the service type, load details, pickup address, access notes, and preferred schedule for ${displayArea(config)}.`}</p>
                </div>
                <div className="final-cta-actions">
                    <Link className="btn brand" href="/book">Get an Instant Quote</Link>
                    {config.phoneNumber && <a className="btn light" href={phoneHref}>Call Us</a>}
                </div>
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
    coverageMapFocus,
    primaryCta = { label: "Book Now", href: "/book" },
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
    coverageMapFocus?: MapFocus;
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
        <section className={`page-hero${!image && !coverageMap ? " no-media" : ""}`}>
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

            {(coverageMap || image) && (
                <div className="hero-media">
                    {coverageMap ? (
                        <>
                            <ServiceAreaMap config={config} focus={coverageMapFocus} />
                            {coverageMapFocus?.name && (
                                <div className="location-focus-card">
                                    <span>Location focus</span>
                                    <strong>{coverageMapFocus.name}</strong>
                                </div>
                            )}
                        </>
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
                    </div>
                    ) : null}
                </div>
            )}
        </section>
    );
}

export function DispatchLoadPricingCards({ config = siteConfig, localLabel }: { config?: SiteConfig; localLabel?: string } = {}) {
    return <VisualPricingScaleSection config={config} localLabel={localLabel} />;
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
                            {card.href && <span className="btnline">{card.actionLabel || "View details"} -&gt;</span>}
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
