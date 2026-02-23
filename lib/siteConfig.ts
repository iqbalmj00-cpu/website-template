/**
 * siteConfig.ts — Single source of truth for all client-specific values.
 * Every value comes from environment variables injected at deploy time
 * by the ScaleYourJunk provisioning service.
 */

export type ServiceItem = string;
export type Testimonial = { name: string; role: string; text: string };

export type PricingTier = { id: string; label: string; fraction: string; min: number; max: number };
export type Surcharge = { id: string; label: string; amount: number; enabled: boolean };
export type PricingConfig = { truckSize: string; tiers: PricingTier[]; surcharges: Surcharge[] };

function parseJSON<T>(value: string | undefined, fallback: T): T {
    if (!value) return fallback;
    try {
        return JSON.parse(value) as T;
    } catch {
        return fallback;
    }
}

export const siteConfig = {
    // Theme
    theme: process.env.NEXT_PUBLIC_THEME ?? "classic",

    // Core identity
    companyName: process.env.NEXT_PUBLIC_COMPANY_NAME ?? "Your Company Name",
    subdomain: process.env.NEXT_PUBLIC_SUBDOMAIN ?? "",
    city: process.env.NEXT_PUBLIC_CITY ?? "Your City",
    state: process.env.NEXT_PUBLIC_STATE ?? "",
    serviceArea: process.env.NEXT_PUBLIC_SERVICE_AREA ?? "your area",
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
        {
            name: "Sarah M.",
            role: "Homeowner",
            text: "They were on time, professional, and got everything out in under an hour. Highly recommend!",
        },
        {
            name: "James T.",
            role: "Property Manager",
            text: "We use them for all our rental cleanouts. Fast, fair pricing, and they recycle what they can.",
        },
        {
            name: "Linda R.",
            role: "Estate Executor",
            text: "Handled an entire estate cleanout in one day. Couldn't have done it without them.",
        },
    ]),

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
            { id: "stairs", label: "Upstairs / Basement", amount: 50, enabled: true },
            { id: "heavy_item", label: "Heavy Item (piano, hot tub, safe)", amount: 75, enabled: true },
            { id: "same_day", label: "Same-Day Service", amount: 50, enabled: false },
            { id: "minimum", label: "Minimum Trip Fee", amount: 75, enabled: true },
        ],
    }),

    // Plan tier (controls feature gating)
    tier: (process.env.NEXT_PUBLIC_TIER ?? "starter") as "starter" | "growth",

    // Analytics
    gaTrackingId: process.env.NEXT_PUBLIC_GA_TRACKING_ID ?? null,

    // Dashboard connection
    dashboardUrl: process.env.DASHBOARD_URL ?? "",
    siteToken: process.env.SITE_TOKEN ?? "",

    // Stripe (client's connected account for card-on-file)
    stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
    stripeConnectAccountId: process.env.STRIPE_CONNECT_ACCOUNT_ID ?? "",
} as const;

export type SiteConfig = typeof siteConfig;
