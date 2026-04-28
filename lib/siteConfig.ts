/**
 * siteConfig.ts — Single source of truth for all client-specific values.
 * Every value comes from environment variables injected at deploy time
 * by the ScaleYourJunk provisioning service.
 */

export type ServiceItem = string;
export type Testimonial = { name: string; role: string; text: string };
export type Credential = { label: string; value: string };

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
export type BusinessDayHours = { start: string; end: string; closed?: boolean };
export type BusinessHoursConfig = Record<string, BusinessDayHours>;

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

export const siteConfig = {
    // Theme
    theme: process.env.NEXT_PUBLIC_THEME ?? "classic",

    // Core identity
    companyName: process.env.NEXT_PUBLIC_COMPANY_NAME ?? "Your Company Name",
    subdomain: process.env.NEXT_PUBLIC_SUBDOMAIN ?? "",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
    city: process.env.NEXT_PUBLIC_CITY ?? "Your City",
    state: process.env.NEXT_PUBLIC_STATE ?? "",
    serviceArea: process.env.NEXT_PUBLIC_SERVICE_AREA ?? "your area",
    streetAddress: process.env.NEXT_PUBLIC_STREET_ADDRESS ?? "",
    phoneNumber: process.env.NEXT_PUBLIC_PHONE_NUMBER ?? "(555) 000-0000",
    tagline:
        process.env.NEXT_PUBLIC_TAGLINE ?? "We haul it all — fast, fair, and friendly.",

    // Branding
    brandColor: process.env.NEXT_PUBLIC_BRAND_COLOR ?? "#f97316",
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
    enableBlog: parseBoolean(process.env.NEXT_PUBLIC_ENABLE_BLOG),
    legalEffectiveDate: process.env.NEXT_PUBLIC_LEGAL_EFFECTIVE_DATE ?? "",

    // Pricing
    pricing: parseJSON<PricingConfig>(process.env.NEXT_PUBLIC_PRICING, {
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
    }),

    // Plan tier (controls feature gating)
    tier: (process.env.NEXT_PUBLIC_TIER ?? "starter") as "starter" | "growth",

    // Dumpster rental (gated per client during onboarding)
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

    // Dashboard connection
    dashboardUrl: process.env.DASHBOARD_URL ?? "",
    siteToken: process.env.SITE_TOKEN ?? "",

    // Stripe (client's connected account for card-on-file)
    stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
    stripeConnectAccountId: process.env.STRIPE_CONNECT_ACCOUNT_ID ?? "",
} as const;

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

export function getSiteBaseUrl(): string {
    const explicit = siteConfig.siteUrl.trim().replace(/\/+$/, "");
    if (explicit) return explicit;
    if (siteConfig.subdomain) return `https://${siteConfig.subdomain}.scaleyourjunk.com`;
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

export function getServiceAreas(): string[] {
    return siteConfig.serviceArea
        .split(/[,;]/)
        .map(area => area.trim())
        .filter(Boolean);
}

export function isSameDayEnabled(): boolean {
    const sameDaySurcharge = siteConfig.pricing.surcharges.find(surcharge => surcharge.id === "same_day");
    return siteConfig.sameDayEnabled || Boolean(sameDaySurcharge?.enabled);
}

export function hasLicense(): boolean {
    return siteConfig.licenseNumber.trim().length > 0;
}

export function hasInsurance(): boolean {
    return siteConfig.insuranceCarrier.trim().length > 0;
}

export function getCredentials(): Credential[] {
    const credentials: Credential[] = [];

    if (hasLicense()) {
        credentials.push({ label: "License", value: siteConfig.licenseNumber.trim() });
    }

    if (hasInsurance()) {
        credentials.push({ label: "Insurance", value: siteConfig.insuranceCarrier.trim() });
    }

    for (const certification of siteConfig.certifications) {
        credentials.push({ label: "Certification", value: certification });
    }

    return credentials;
}

export function getVerifiableTrustSignals(): string[] {
    const signals = ["Local service team", "Upfront pricing"];

    if (isSameDayEnabled()) signals.push("Same-day service available");
    if (hasLicense()) signals.push("Licensed");
    if (hasInsurance()) signals.push("Insured");
    if (siteConfig.recyclingRate !== null) signals.push(`${siteConfig.recyclingRate}% recycling target`);

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

export type SiteConfig = typeof siteConfig;
