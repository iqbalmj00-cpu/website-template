/**
 * siteConfig.ts — Single source of truth for all client-specific values.
 * Every value comes from environment variables injected at deploy time
 * by the ScaleYourJunk provisioning service.
 */

export type ServiceItem = string;
export type Testimonial = { name: string; role: string; text: string };

function parseJSON<T>(value: string | undefined, fallback: T): T {
    if (!value) return fallback;
    try {
        return JSON.parse(value) as T;
    } catch {
        return fallback;
    }
}

export const siteConfig = {
    // Core identity
    companyName: process.env.NEXT_PUBLIC_COMPANY_NAME ?? "Your Company Name",
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

    // Analytics
    gaTrackingId: process.env.NEXT_PUBLIC_GA_TRACKING_ID ?? null,

    // Dashboard connection
    dashboardUrl: process.env.DASHBOARD_URL ?? "",
    ingestApiKey: process.env.INGEST_API_KEY ?? "",
    siteToken: process.env.SITE_TOKEN ?? "",

    // Stripe (client's connected account for card-on-file)
    stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
    stripeConnectAccountId: process.env.STRIPE_CONNECT_ACCOUNT_ID ?? "",
} as const;

export type SiteConfig = typeof siteConfig;
