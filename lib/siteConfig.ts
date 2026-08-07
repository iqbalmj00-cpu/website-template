/**
 * siteConfig.ts — Single source of truth for all client-specific values.
 * Every value comes from environment variables injected at deploy time
 * by the ScaleYourJunk provisioning service.
 */

export type ServiceItem = string;
export type Testimonial = { name: string; role: string; text: string };
export type GoogleReview = {
    reviewerName: string;
    rating: number;
    body: string | null;
    replyBody: string | null;
    platform: string;
    reviewedAt: string;
};
export type ReviewStats = {
    averageRating: number;
    totalCount: number;
    distribution: Record<string, number>;
};
export type Credential = { label: string; value: string };
const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;

export const WEBSITE_THEME_VALUES = ["classic", "industrial", "eco", "editorial"] as const;
export type WebsiteTheme = (typeof WEBSITE_THEME_VALUES)[number];
export const WEBSITE_FONT_PAIR_VALUES = [
    "space-grotesk-inter",
    "bebas-dm-sans",
    "fraunces-nunito",
    "playfair-source-sans",
] as const;

export type WebsiteFontPair = (typeof WEBSITE_FONT_PAIR_VALUES)[number];
export type WebsiteDesignConfig = {
    homepageStyle: "conversion";
    cornerRadius: "square" | "balanced" | "rounded";
    navStyle: "solid" | "transparent";
    showTrustBar: boolean;
};

export const DEFAULT_WEBSITE_DESIGN_CONFIG: WebsiteDesignConfig = {
    homepageStyle: "conversion",
    cornerRadius: "balanced",
    navStyle: "solid",
    showTrustBar: true,
};

export type PricingTier = { id: string; label: string; fraction: string; min: number; max: number };
export type Surcharge = {
    id: string;
    label: string;
    amount: number;
    enabled: boolean;
    /** Density-scaled surcharges (Heavy Material) carry one amount per tier:
     *  [1/8, 1/4, 1/2, 3/4, Full, 1+]. If absent, use flat `amount`. */
    amountsByTier?: number[];
    /** Access surcharges carry one amount per LOCATION_OPTIONS id
     *  (curbside, garage, ground_floor, upstairs, basement, backyard). */
    amountsByLocation?: Record<string, number>;
};
export type DistanceTier = { id: string; maxMiles: number; additionalCost: number };
export type PricingConfig = { truckSize: string; fullLoadPrice?: number; tiers: PricingTier[]; distanceTiers?: DistanceTier[]; surcharges: Surcharge[] };
export type BusinessDayHours = {
    start: string;
    end: string;
    closed?: boolean;
    /** Legacy keys as the dashboard actually stores them. `normalizeBusinessHours`
     *  folds these into start/end at intake; they are declared here so the
     *  defensive reads in wizardData.ts don't need a cast. */
    open?: string;
    close?: string;
};
export type BusinessHoursConfig = Record<string, BusinessDayHours>;
export type SameDayDisplayConfig = {
    enabled: boolean;
    minNoticeMinutes: number | null;
    cutoffTime: string;
    surchargeType: string;
    surchargeAmount: number | null;
    timezone: string;
};

export type DumpsterPriceTier = {
    sizeCuYd: number;
    baseRate: number;
    baseRateMin: number | null;
    baseRateMax: number | null;
    includedDays: number;
    weightAllowanceTons: number;
    overageRatePerTon: number;
    extendedDailyRate: number | null;
};

/** Round to nearest $5 */
export function roundTo5(n: number): number { return Math.round(n / 5) * 5; }

/** Format dumpster price as range or "Starting at", rounded to nearest $5 */
export function formatDumpsterPrice(tier: DumpsterPriceTier): string {
    const min = roundTo5(tier.baseRateMin ?? tier.baseRate);
    const max = tier.baseRateMax ? roundTo5(tier.baseRateMax) : null;
    if (max && max > min) return `$${min} – $${max}`;
    return `Starting at $${min}`;
}
export type DumpsterSurcharge = { name: string; type: string; amount: number };
export type DumpsterPricingConfig = { tiers: DumpsterPriceTier[]; surcharges: DumpsterSurcharge[] };

function parseJSON<T>(value: string | undefined, fallback: T): T {
    if (!value) return fallback;
    try {
        return JSON.parse(value) as T;
    } catch {
        return fallback;
    }
}

function parseList(value: string | undefined): string[] {
    if (!value) return [];
    return value
        .split(",")
        .map(item => item.trim())
        .filter(Boolean);
}

function parseBoolean(value: string | undefined): boolean {
    return ["1", "true", "yes", "y"].includes((value ?? "").trim().toLowerCase());
}

function parseOptionalNumber(value: string | undefined): number | null {
    if (!value) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function cleanConfigText(value: string | undefined): string {
    return typeof value === "string" ? value.trim() : "";
}

function cleanUnknownText(value: unknown): string {
    return typeof value === "string" ? value.trim() : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function numberFromUnknown(value: unknown): number | null {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim()) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
}

export function normalizeTheme(value: unknown): WebsiteTheme {
    return WEBSITE_THEME_VALUES.includes(value as WebsiteTheme)
        ? value as WebsiteTheme
        : "classic";
}

export function normalizeFontPair(value: unknown): WebsiteFontPair {
    return WEBSITE_FONT_PAIR_VALUES.includes(value as WebsiteFontPair)
        ? value as WebsiteFontPair
        : "space-grotesk-inter";
}

export function normalizeBrandColor(value: unknown, fallback = "#f97316"): string {
    const clean = cleanUnknownText(value);
    return HEX_COLOR.test(clean) ? clean : fallback;
}

/** Darken or lighten a hex color by `amount` RGB points for hover states. */
export function adjustHexColor(hex: string, amount: number): string {
    const clean = normalizeBrandColor(hex);
    const num = parseInt(clean.replace("#", ""), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount));
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

/** Convert hex color to comma-separated RGB string for rgba() usage. */
export function hexToRgb(hex: string): string {
    const clean = normalizeBrandColor(hex);
    const num = parseInt(clean.replace("#", ""), 16);
    return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
}

export function defaultHeroHeadline(city: string): string {
    const loc = cleanConfigText(city) || "Your City";
    return `Junk Removal in ${loc} Made`;
}

export function normalizeWebsiteDesignConfig(input: unknown): WebsiteDesignConfig {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
        return { ...DEFAULT_WEBSITE_DESIGN_CONFIG };
    }

    const raw = input as Record<string, unknown>;
    return {
        homepageStyle: DEFAULT_WEBSITE_DESIGN_CONFIG.homepageStyle,
        cornerRadius: ["square", "balanced", "rounded"].includes(String(raw.cornerRadius))
            ? raw.cornerRadius as WebsiteDesignConfig["cornerRadius"]
            : DEFAULT_WEBSITE_DESIGN_CONFIG.cornerRadius,
        navStyle: ["solid", "transparent"].includes(String(raw.navStyle))
            ? raw.navStyle as WebsiteDesignConfig["navStyle"]
            : DEFAULT_WEBSITE_DESIGN_CONFIG.navStyle,
        showTrustBar: typeof raw.showTrustBar === "boolean"
            ? raw.showTrustBar
            : DEFAULT_WEBSITE_DESIGN_CONFIG.showTrustBar,
    };
}

/** Normalize business hours — dashboard may store {open,close}, template expects {start,end} */
function normalizeBusinessHours(raw: Record<string, Record<string, unknown>> | null): BusinessHoursConfig | null {
    if (!raw || typeof raw !== "object") return null;
    const result: BusinessHoursConfig = {};
    for (const [day, entry] of Object.entries(raw)) {
        if (!entry || typeof entry !== "object") continue;
        result[day] = {
            start: (entry.start as string) || (entry.open as string) || "",
            end: (entry.end as string) || (entry.close as string) || "",
            ...(entry.closed != null && { closed: Boolean(entry.closed) }),
        };
    }
    return Object.keys(result).length > 0 ? result : null;
}

const DEFAULT_PRICING_CONFIG: PricingConfig = {
    truckSize: "15yd",
    tiers: [
        { id: "few", label: "A Few Items", fraction: "1/8", min: 75, max: 150 },
        { id: "quarter", label: "Quarter Load", fraction: "1/4", min: 150, max: 250 },
        { id: "half", label: "Half Load", fraction: "1/2", min: 250, max: 400 },
        { id: "three_quarter", label: "3/4 Load", fraction: "3/4", min: 400, max: 550 },
        { id: "full", label: "Full Load", fraction: "1", min: 500, max: 700 },
        { id: "multi", label: "Multiple Loads", fraction: "1+", min: 700, max: 1200 },
    ],
    surcharges: [
        { id: "appliance", label: "Appliance", amount: 50, enabled: true },
        { id: "heavy_material", label: "Heavy Material (concrete, dirt, shingles)", amount: 50, enabled: true, amountsByTier: [50, 100, 150, 200, 250, 300] },
        { id: "same_day", label: "Same-Day Service", amount: 50, enabled: false },
        { id: "minimum", label: "Minimum Trip Fee", amount: 75, enabled: true },
    ],
};

function normalizePricingTier(entry: unknown): PricingTier | null {
    if (!isRecord(entry)) return null;
    const min = numberFromUnknown(entry.min);
    const max = numberFromUnknown(entry.max);
    const id = cleanUnknownText(entry.id);
    const label = cleanUnknownText(entry.label);
    const fraction = cleanUnknownText(entry.fraction);
    if (!id || !label || !fraction || min === null || max === null) return null;
    return { id, label, fraction, min, max };
}

function normalizeSurcharge(entry: unknown): Surcharge | null {
    if (!isRecord(entry)) return null;
    const id = cleanUnknownText(entry.id);
    const label = cleanUnknownText(entry.label);
    const amount = numberFromUnknown(entry.amount);
    if (!id || !label || amount === null) return null;

    const amountsByTier = Array.isArray(entry.amountsByTier)
        ? entry.amountsByTier
            .map(numberFromUnknown)
            .filter((value): value is number => value !== null)
        : undefined;

    const amountsByLocation = isRecord(entry.amountsByLocation)
        ? Object.fromEntries(
            Object.entries(entry.amountsByLocation)
                .map(([key, value]) => [key, numberFromUnknown(value)])
                .filter((item): item is [string, number] => item[1] !== null),
        )
        : undefined;

    return {
        id,
        label,
        amount,
        enabled: Boolean(entry.enabled),
        ...(amountsByTier && amountsByTier.length > 0 ? { amountsByTier } : {}),
        ...(amountsByLocation && Object.keys(amountsByLocation).length > 0 ? { amountsByLocation } : {}),
    };
}

function normalizeDistanceTier(entry: unknown): DistanceTier | null {
    if (!isRecord(entry)) return null;
    const id = cleanUnknownText(entry.id);
    const maxMiles = numberFromUnknown(entry.maxMiles);
    const additionalCost = numberFromUnknown(entry.additionalCost);
    if (!id || maxMiles === null || additionalCost === null) return null;
    return { id, maxMiles, additionalCost };
}

function normalizePricingConfig(input: unknown): PricingConfig | null {
    if (!isRecord(input)) return null;

    const tiers = Array.isArray(input.tiers)
        ? input.tiers.map(normalizePricingTier).filter((tier): tier is PricingTier => tier !== null)
        : [];
    if (tiers.length === 0) return null;

    const surcharges = Array.isArray(input.surcharges)
        ? input.surcharges.map(normalizeSurcharge).filter((surcharge): surcharge is Surcharge => surcharge !== null)
        : [];
    const distanceTiers = Array.isArray(input.distanceTiers)
        ? input.distanceTiers.map(normalizeDistanceTier).filter((tier): tier is DistanceTier => tier !== null)
        : undefined;
    const fullLoadPrice = numberFromUnknown(input.fullLoadPrice);

    return {
        truckSize: cleanUnknownText(input.truckSize) || DEFAULT_PRICING_CONFIG.truckSize,
        ...(fullLoadPrice !== null ? { fullLoadPrice } : {}),
        tiers,
        ...(distanceTiers && distanceTiers.length > 0 ? { distanceTiers } : {}),
        surcharges,
    };
}

function parsePricingEnv(value: string | undefined): { pricing: PricingConfig; configured: boolean } {
    const trimmed = cleanConfigText(value);
    if (!trimmed || trimmed === "__DEFAULT__") {
        return { pricing: DEFAULT_PRICING_CONFIG, configured: false };
    }

    const normalized = normalizePricingConfig(parseJSON<unknown>(trimmed, null));
    if (!normalized) {
        return { pricing: DEFAULT_PRICING_CONFIG, configured: false };
    }

    return { pricing: normalized, configured: true };
}

function normalizeGoogleReviews(input: unknown): GoogleReview[] {
    if (!Array.isArray(input)) return [];

    return input
        .map(item => {
            if (!isRecord(item)) return null;
            const reviewerName =
                cleanUnknownText(item.reviewerName)
                || cleanUnknownText(item.name)
                || "Google reviewer";
            const rating = numberFromUnknown(item.rating);
            const body = cleanUnknownText(item.body) || cleanUnknownText(item.text) || null;
            const reviewedAt = cleanUnknownText(item.reviewedAt) || cleanUnknownText(item.date);
            const platform = cleanUnknownText(item.platform) || "google";
            const replyBody = cleanUnknownText(item.replyBody) || null;

            if (rating === null || rating < 1 || rating > 5) return null;
            return { reviewerName, rating, body, replyBody, platform, reviewedAt };
        })
        .filter((review): review is GoogleReview => review !== null);
}

function normalizeReviewStats(input: unknown): ReviewStats | null {
    if (!isRecord(input)) return null;
    const averageRating = numberFromUnknown(input.averageRating);
    const totalCount = numberFromUnknown(input.totalCount);
    if (averageRating === null || totalCount === null || averageRating <= 0 || totalCount <= 0) {
        return null;
    }

    const distribution = isRecord(input.distribution)
        ? Object.fromEntries(
            Object.entries(input.distribution)
                .map(([key, value]) => [key, numberFromUnknown(value) ?? 0]),
        )
        : {};

    return { averageRating, totalCount, distribution };
}

const pricingEnv = parsePricingEnv(process.env.NEXT_PUBLIC_PRICING);
const googleReviewsEnv = normalizeGoogleReviews(parseJSON<unknown>(process.env.NEXT_PUBLIC_GOOGLE_REVIEWS, []));
const testimonialReviewsEnv = normalizeGoogleReviews(parseJSON<unknown>(process.env.NEXT_PUBLIC_TESTIMONIALS, []));
const reviewStatsEnv = normalizeReviewStats(parseJSON<unknown>(process.env.NEXT_PUBLIC_REVIEW_STATS, null));

export const siteConfig = {
    // Theme
    theme: normalizeTheme(process.env.NEXT_PUBLIC_THEME),

    // Core identity
    companyName: process.env.NEXT_PUBLIC_COMPANY_NAME ?? "Your Company Name",
    subdomain: process.env.NEXT_PUBLIC_SUBDOMAIN ?? "",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
    city: process.env.NEXT_PUBLIC_CITY ?? "Your City",
    state: process.env.NEXT_PUBLIC_STATE ?? "",
    serviceArea: process.env.NEXT_PUBLIC_SERVICE_AREA ?? "your area",
    streetAddress: process.env.NEXT_PUBLIC_STREET_ADDRESS ?? "",
    phoneNumber: process.env.NEXT_PUBLIC_PHONE_NUMBER ?? "(555) 000-0000",
    emailAddress: cleanConfigText(process.env.NEXT_PUBLIC_EMAIL_ADDRESS),
    tagline:
        process.env.NEXT_PUBLIC_TAGLINE ?? "We haul it all — fast, fair, and friendly.",
    heroHeadline:
        cleanConfigText(process.env.NEXT_PUBLIC_HERO_HEADLINE)
        || defaultHeroHeadline(process.env.NEXT_PUBLIC_CITY ?? "Your City"),
    heroAccentText:
        cleanConfigText(process.env.NEXT_PUBLIC_HERO_ACCENT_TEXT)
        || "Easy.",
    timezone: cleanConfigText(process.env.NEXT_PUBLIC_TIMEZONE) || "America/Chicago",

    // Branding
    brandColor: normalizeBrandColor(process.env.NEXT_PUBLIC_BRAND_COLOR),
    fontPair: normalizeFontPair(process.env.NEXT_PUBLIC_FONT_PAIR),
    designConfig: normalizeWebsiteDesignConfig(
        parseJSON<unknown>(
            process.env.NEXT_PUBLIC_SITE_DESIGN_CONFIG,
            DEFAULT_WEBSITE_DESIGN_CONFIG,
        ),
    ),
    logoUrl: process.env.NEXT_PUBLIC_LOGO_URL ?? null,
    heroImageUrl: process.env.NEXT_PUBLIC_HERO_IMAGE_URL ?? null,
    aboutImageUrl: process.env.NEXT_PUBLIC_ABOUT_IMAGE_URL ?? null,
    commercialImageUrl: process.env.NEXT_PUBLIC_COMMERCIAL_IMAGE_URL ?? null,
    locationImages: parseJSON<Record<string, string>>(process.env.NEXT_PUBLIC_LOCATION_IMAGES, {}),
    serviceImages: parseJSON<Record<string, string>>(process.env.NEXT_PUBLIC_SERVICE_IMAGES, {}),

    // Dynamic content
    services: parseJSON<ServiceItem[]>(process.env.NEXT_PUBLIC_SERVICES, [
        "Furniture Removal",
        "Appliance Disposal",
        "Yard Waste",
        "Garage Cleanouts",
        "Construction Debris",
        "Estate Cleanouts",
    ]),
    testimonials: parseJSON<Testimonial[]>(process.env.NEXT_PUBLIC_TESTIMONIALS, [
    ]),
    googleReviews: googleReviewsEnv.length > 0 ? googleReviewsEnv : testimonialReviewsEnv,
    reviewStats: reviewStatsEnv,

    // Verifiable operator-provided company proof.
    // Claims that depend on these fields should hide when the values are empty.
    aboutStory: process.env.NEXT_PUBLIC_ABOUT_STORY ?? "",
    founderName: process.env.NEXT_PUBLIC_FOUNDER_NAME ?? "",
    yearFounded: process.env.NEXT_PUBLIC_YEAR_FOUNDED ?? "",
    licenseNumber: process.env.NEXT_PUBLIC_LICENSE_NUMBER ?? "",
    insuranceCarrier: process.env.NEXT_PUBLIC_INSURANCE_CARRIER ?? "",
    certifications: parseList(process.env.NEXT_PUBLIC_CERTIFICATIONS),
    recyclingRate: parseOptionalNumber(process.env.NEXT_PUBLIC_RECYCLING_RATE),
    sameDayEnabled: parseBoolean(process.env.NEXT_PUBLIC_SAME_DAY_ENABLED),
    sameDayMinNoticeMinutes: parseOptionalNumber(process.env.NEXT_PUBLIC_SAME_DAY_MIN_NOTICE_MINUTES),
    sameDayCutoffTime: cleanConfigText(process.env.NEXT_PUBLIC_SAME_DAY_CUTOFF_TIME),
    sameDaySurchargeType: cleanConfigText(process.env.NEXT_PUBLIC_SAME_DAY_SURCHARGE_TYPE),
    sameDaySurchargeAmount: parseOptionalNumber(process.env.NEXT_PUBLIC_SAME_DAY_SURCHARGE_AMOUNT),
    enableBlog: parseBoolean(process.env.NEXT_PUBLIC_ENABLE_BLOG),
    // True only when the operator has connected a Gmail mailbox in the dashboard.
    // The contact page is hidden entirely without it: a submission has nowhere to
    // go, so showing the form would collect messages nobody ever reads.
    // Defaults false — an operator with no flag gets no contact page.
    mailboxConnected: parseBoolean(process.env.NEXT_PUBLIC_MAILBOX_CONNECTED),
    legalEffectiveDate: process.env.NEXT_PUBLIC_LEGAL_EFFECTIVE_DATE ?? "",

    // Pricing
    pricing: pricingEnv.pricing,
    pricingConfigured: pricingEnv.configured,

    // Plan tier (controls feature gating)
    tier: (process.env.NEXT_PUBLIC_TIER ?? "starter") as "starter" | "growth",

    // Dumpster rental (enabled per client during onboarding)
    offersDumpsterRental: (process.env.NEXT_PUBLIC_OFFERS_DUMPSTER_RENTAL ?? "false") === "true",

    // Dumpster rental pricing (provisioned from DumpsterPriceTier table)
    dumpsterPricing: parseJSON<DumpsterPricingConfig | null>(process.env.NEXT_PUBLIC_DUMPSTER_PRICING, null),

    // Business hours (provisioned from CompanyProfile.businessHours)
    // Format: {"mon":{"start":"08:00","end":"18:00"},"sun":{"closed":true}}
    // Note: dashboard may store as {open,close} — normalizeBusinessHours converts to {start,end}
    businessHours: normalizeBusinessHours(parseJSON<Record<string, Record<string, unknown>> | null>(process.env.NEXT_PUBLIC_BUSINESS_HOURS, null)),

    // Google Maps (for address autocomplete)
    googleMapsKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "",

    // Google Business Profile — operator's GBP profile URL and Place ID.
    // Used for the footer "View us on Google" link and the embedded map on /contact.
    // Both optional; UI gracefully hides if missing.
    gbpUrl: process.env.NEXT_PUBLIC_GBP_URL ?? "",
    gbpPlaceId: process.env.NEXT_PUBLIC_GBP_PLACE_ID ?? "",

    // Service area ZIP codes (for blocking out-of-area bookings)
    serviceAreaZips: parseJSON<string[]>(process.env.NEXT_PUBLIC_SERVICE_AREA_ZIPS, []),

    // Service radius center point + max radius (for distance-based pricing)
    centerLat: process.env.NEXT_PUBLIC_CENTER_LAT ? parseFloat(process.env.NEXT_PUBLIC_CENTER_LAT) : null,
    centerLng: process.env.NEXT_PUBLIC_CENTER_LNG ? parseFloat(process.env.NEXT_PUBLIC_CENTER_LNG) : null,
    maxRadius: process.env.NEXT_PUBLIC_MAX_RADIUS ? parseInt(process.env.NEXT_PUBLIC_MAX_RADIUS, 10) : null,

    // Analytics
    gaTrackingId: process.env.NEXT_PUBLIC_GA_TRACKING_ID ?? null,

    // Stripe (client's connected account for card-on-file)
    stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
} as const;

export type SiteConfig = typeof siteConfig;

function getRecordText(record: Record<string, unknown>, key: string): string {
    return cleanUnknownText(record[key]);
}

function getRecordNumber(record: Record<string, unknown>, key: string): number | null {
    return numberFromUnknown(record[key]);
}

function getRecordBoolean(record: Record<string, unknown>, key: string, fallback: boolean): boolean {
    return typeof record[key] === "boolean" ? Boolean(record[key]) : fallback;
}

function getRecordStringArray(record: Record<string, unknown>, key: string, fallback: readonly string[]): string[] {
    const value = record[key];
    if (!Array.isArray(value)) return [...fallback];
    const cleaned = value
        .map(cleanUnknownText)
        .filter(Boolean);
    return cleaned.length > 0 ? Array.from(new Set(cleaned)) : [...fallback];
}

function getRecordStringMap(record: Record<string, unknown>, key: string, fallback: Record<string, string>): Record<string, string> {
    const value = record[key];
    if (!isRecord(value)) return { ...fallback };
    const result: Record<string, string> = {};
    for (const [itemKey, itemValue] of Object.entries(value)) {
        const cleanKey = cleanUnknownText(itemKey);
        const cleanValue = cleanUnknownText(itemValue);
        if (cleanKey && cleanValue) result[cleanKey] = cleanValue;
    }
    return Object.keys(result).length > 0 ? result : { ...fallback };
}

function normalizePreviewPricing(input: unknown, fallback: SiteConfig): { pricing: PricingConfig; configured: boolean } {
    const normalized = normalizePricingConfig(input);
    if (!normalized) {
        return { pricing: fallback.pricing, configured: fallback.pricingConfigured };
    }
    return { pricing: normalized, configured: true };
}

/**
 * Build a public, request-scoped config object from the dashboard preview
 * payload. This intentionally merges only public website fields; secrets stay
 * in server-only config and are never accepted from preview JSON.
 */
export function createSiteConfigFromPublicConfig(input: unknown, fallback: SiteConfig = siteConfig): SiteConfig {
    if (!isRecord(input)) return fallback;

    const city = getRecordText(input, "displayCity") || getRecordText(input, "city") || fallback.city;
    const state = getRecordText(input, "displayState") || getRecordText(input, "state") || fallback.state;
    const pricingInput = input.pricing ?? input.pricingConfig;
    const previewPricing = normalizePreviewPricing(pricingInput, fallback);
    const previewReviews = normalizeGoogleReviews(input.googleReviews ?? input.reviews ?? input.testimonials);
    const previewStats = normalizeReviewStats(input.reviewStats ?? input.stats);

    return {
        ...fallback,
        theme: normalizeTheme(input.theme ?? fallback.theme),
        companyName:
            getRecordText(input, "displayCompanyName")
            || getRecordText(input, "companyName")
            || fallback.companyName,
        city,
        state,
        serviceArea:
            getRecordText(input, "displayServiceArea")
            || getRecordText(input, "serviceArea")
            || fallback.serviceArea,
        phoneNumber:
            getRecordText(input, "phoneNumber")
            || getRecordText(input, "displayPhoneNumber")
            || getRecordText(input, "phone")
            || fallback.phoneNumber,
        emailAddress: getRecordText(input, "emailAddress") || fallback.emailAddress,
        tagline: getRecordText(input, "tagline") || fallback.tagline,
        heroHeadline:
            getRecordText(input, "heroHeadline")
            || defaultHeroHeadline(city),
        heroAccentText:
            getRecordText(input, "heroAccentText")
            || fallback.heroAccentText,
        brandColor: normalizeBrandColor(input.brandColor, fallback.brandColor),
        fontPair: normalizeFontPair(input.fontPair ?? fallback.fontPair),
        designConfig: normalizeWebsiteDesignConfig(input.designConfig ?? fallback.designConfig),
        logoUrl: getRecordText(input, "logoUrl") || fallback.logoUrl,
        heroImageUrl: getRecordText(input, "heroImageUrl") || fallback.heroImageUrl,
        aboutImageUrl: getRecordText(input, "aboutImageUrl") || fallback.aboutImageUrl,
        commercialImageUrl: getRecordText(input, "commercialImageUrl") || fallback.commercialImageUrl,
        serviceImages: getRecordStringMap(input, "serviceImages", fallback.serviceImages),
        locationImages: getRecordStringMap(input, "locationImages", fallback.locationImages),
        services: getRecordStringArray(input, "services", fallback.services),
        googleReviews: previewReviews.length > 0 ? previewReviews : fallback.googleReviews,
        reviewStats: previewStats ?? fallback.reviewStats,
        pricing: previewPricing.pricing,
        pricingConfigured: previewPricing.configured,
        timezone: getRecordText(input, "timezone") || fallback.timezone,
        sameDayEnabled: getRecordBoolean(input, "sameDayEnabled", fallback.sameDayEnabled),
        sameDayMinNoticeMinutes: getRecordNumber(input, "sameDayMinNoticeMinutes") ?? fallback.sameDayMinNoticeMinutes,
        sameDayCutoffTime: getRecordText(input, "sameDayCutoffTime") || fallback.sameDayCutoffTime,
        sameDaySurchargeType: getRecordText(input, "sameDaySurchargeType") || fallback.sameDaySurchargeType,
        sameDaySurchargeAmount: getRecordNumber(input, "sameDaySurchargeAmount") ?? fallback.sameDaySurchargeAmount,
        mailboxConnected: getRecordBoolean(input, "mailboxConnected", fallback.mailboxConnected),
    };
}

/** Format a phone number for display: +16186934498 → (618) 693-4498 */
export function formatPhone(raw: string): string {
    const d = raw.replace(/\D/g, "");
    if (d.length === 11 && d[0] === "1") {
        return `(${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
    }
    if (d.length === 10) {
        return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
    }
    return raw; // already formatted or non-US — return as-is
}

/** Build tel: href preserving the + prefix for E.164 */
export function telHref(raw: string): string {
    return `tel:${raw.replace(/[^+\d]/g, "")}`;
}

export function getSiteBaseUrl(config: SiteConfig = siteConfig): string {
    const explicit = config.siteUrl.trim().replace(/\/+$/, "");
    if (explicit) return explicit;
    if (config.subdomain) return `https://${config.subdomain}.scaleyourjunk.com`;
    return "https://www.scaleyourjunk.com";
}

export function absoluteUrl(path = "/"): string {
    if (/^https?:\/\//i.test(path)) return path;
    const base = getSiteBaseUrl();
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${base}${normalizedPath}`;
}

export function getCanonicalPath(path = "/"): string {
    if (path === "") return "/";
    const clean = path.split("?")[0].split("#")[0];
    if (clean === "/") return "/";
    return clean.endsWith("/") ? clean.slice(0, -1) : clean;
}

export function getServiceAreas(config: SiteConfig = siteConfig): string[] {
    return config.serviceArea
        .split(/[,;]/)
        .map(area => area.trim())
        .filter(Boolean);
}

export function isSameDayEnabled(config: SiteConfig = siteConfig): boolean {
    const sameDaySurcharge = config.pricing.surcharges.find(surcharge => surcharge.id === "same_day");
    return config.sameDayEnabled || Boolean(sameDaySurcharge?.enabled);
}

export function hasLicense(config: SiteConfig = siteConfig): boolean {
    return config.licenseNumber.trim().length > 0;
}

export function hasInsurance(config: SiteConfig = siteConfig): boolean {
    return config.insuranceCarrier.trim().length > 0;
}

export function getCredentials(config: SiteConfig = siteConfig): Credential[] {
    const credentials: Credential[] = [];

    if (hasLicense(config)) {
        credentials.push({ label: "License", value: config.licenseNumber.trim() });
    }

    if (hasInsurance(config)) {
        credentials.push({ label: "Insurance", value: config.insuranceCarrier.trim() });
    }

    for (const certification of config.certifications) {
        credentials.push({ label: "Certification", value: certification });
    }

    return credentials;
}

export function getGoogleTestimonials(limit = 6, config: SiteConfig = siteConfig): GoogleReview[] {
    return config.googleReviews
        .filter(review => review.platform.toLowerCase() === "google")
        .filter(review => review.rating >= 4 && Boolean(review.body?.trim()))
        .slice(0, limit);
}

export function getReviewSummary(config: SiteConfig = siteConfig): ReviewStats | null {
    if (config.reviewStats) return config.reviewStats;

    const reviews = config.googleReviews.filter(review => review.platform.toLowerCase() === "google");
    if (reviews.length === 0) return null;

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return {
        averageRating: Number((total / reviews.length).toFixed(1)),
        totalCount: reviews.length,
        distribution: reviews.reduce<Record<string, number>>((distribution, review) => {
            const key = String(Math.round(review.rating));
            distribution[key] = (distribution[key] ?? 0) + 1;
            return distribution;
        }, {}),
    };
}

export function hasVerifiedGoogleReviews(config: SiteConfig = siteConfig): boolean {
    return getGoogleTestimonials(1, config).length > 0 && Boolean(getReviewSummary(config)?.totalCount);
}

export function hasConfiguredPricing(config: SiteConfig = siteConfig): boolean {
    return config.pricingConfigured && config.pricing.tiers.length > 0;
}

export function getPricingTiersForDisplay(limit = 4, config: SiteConfig = siteConfig): PricingTier[] {
    if (!hasConfiguredPricing(config)) return [];
    return config.pricing.tiers.slice(0, limit);
}

export function getSameDayDisplayConfig(config: SiteConfig = siteConfig): SameDayDisplayConfig {
    const sameDaySurcharge = config.pricing.surcharges.find(surcharge => surcharge.id === "same_day");
    const surchargeAmount = config.sameDaySurchargeAmount ?? sameDaySurcharge?.amount ?? null;

    return {
        enabled: isSameDayEnabled(config),
        minNoticeMinutes: config.sameDayMinNoticeMinutes,
        cutoffTime: config.sameDayCutoffTime,
        surchargeType: config.sameDaySurchargeType,
        surchargeAmount,
        timezone: config.timezone,
    };
}

export function formatSameDayNotice(config = getSameDayDisplayConfig()): string {
    const parts: string[] = [];
    if (config.minNoticeMinutes) {
        const hours = config.minNoticeMinutes / 60;
        parts.push(Number.isInteger(hours) ? `${hours} hour notice` : `${config.minNoticeMinutes} minute notice`);
    }
    if (config.cutoffTime) {
        parts.push(`book by ${fmt24to12(config.cutoffTime) || config.cutoffTime}`);
    }
    if (config.surchargeAmount !== null && config.surchargeAmount > 0) {
        const suffix = config.surchargeType === "percentage" ? "%" : "";
        const prefix = config.surchargeType === "percentage" ? "" : "$";
        parts.push(`${prefix}${config.surchargeAmount}${suffix} same-day surcharge`);
    }
    return parts.join(" / ");
}

export function getVerifiableTrustSignals(config: SiteConfig = siteConfig): string[] {
    const signals = ["Local service team"];

    if (hasConfiguredPricing(config)) signals.push("Configured pricing");
    if (isSameDayEnabled(config)) signals.push("Same-day service available");
    if (hasLicense(config)) signals.push("Licensed");
    if (hasInsurance(config)) signals.push("Insured");
    if (config.recyclingRate !== null) signals.push(`${config.recyclingRate}% recycling target`);

    return signals;
}

/* ── Shared business hours formatting ─────────────────────────────────── */

const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
const DAY_LABELS: Record<string, string> = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" };

/** Convert "08:00" → "8 AM", "14:30" → "2:30 PM" */
export function fmt24to12(time: string | undefined): string {
    if (!time) return "";
    const [hStr, mStr] = time.split(":");
    let h = parseInt(hStr, 10);
    if (isNaN(h)) return time;
    const m = parseInt(mStr || "0", 10);
    const ampm = h >= 12 ? "PM" : "AM";
    if (h === 0) h = 12;
    else if (h > 12) h -= 12;
    return m > 0 ? `${h}:${mStr} ${ampm}` : `${h} ${ampm}`;
}

/** Group consecutive days with identical hours → [{days: "Mon–Fri", label: "8 AM – 5 PM"}, ...] */
export function groupBusinessHours(hours: Record<string, BusinessDayHours>): { days: string; label: string }[] {
    const groups: { days: string[]; label: string }[] = [];

    for (const day of DAY_ORDER) {
        const entry = hours[day];
        if (!entry) continue;
        const isClosed = entry.closed || (!entry.start && !entry.end);
        const label = isClosed ? "Closed" : `${fmt24to12(entry.start)} – ${fmt24to12(entry.end)}`;
        const last = groups[groups.length - 1];
        if (last && last.label === label) {
            last.days.push(day);
        } else {
            groups.push({ days: [day], label });
        }
    }

    return groups.map(g => ({
        days: g.days.length === 1
            ? DAY_LABELS[g.days[0]]
            : `${DAY_LABELS[g.days[0]]}–${DAY_LABELS[g.days[g.days.length - 1]]}`,
        label: g.label,
    }));
}
