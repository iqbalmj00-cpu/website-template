/** Local-only fixture configuration. Every configured backend URL points at loopback. */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
export function fixtureEnvironment(root, dashboardUrl) {
    const env = { ...process.env, NODE_ENV: "production", NEXT_TELEMETRY_DISABLED: "1" };
    // Blank values take precedence over Next's dotenv loader, including user .env.local.
    const keys = new Set(Object.keys(env));
    for (const name of readdirSync(root).filter(n => /^\.env(?:\.|$)/.test(n))) {
        for (const line of readFileSync(join(root, name), "utf8").split("\n")) {
            const match = line.match(/^\s*(?:export\s+)?([A-Za-z_]\w*)\s*=/); if (match) keys.add(match[1]);
        }
    }
    for (const key of keys) if (key.startsWith("NEXT_PUBLIC_") || /DASHBOARD|SITE_TOKEN|INGEST_API_KEY|STRIPE|VERCEL|SEO_STRICT/.test(key)) env[key] = "";
    return { ...env, DASHBOARD_URL: dashboardUrl, SITE_TOKEN: "fixture-only-not-a-real-token", INGEST_API_KEY: "fixture-api-key", SEO_STRICT_SITE_GUARD: "true",
        NEXT_PUBLIC_COMPANY_NAME: "Fixture Hauling", NEXT_PUBLIC_CITY: "Houston", NEXT_PUBLIC_STATE: "TX",
        NEXT_PUBLIC_SERVICE_AREA: "Houston", NEXT_PUBLIC_PHONE_NUMBER: "7135550199", NEXT_PUBLIC_SITE_URL: "https://fixture.invalid",
        NEXT_PUBLIC_SUBDOMAIN: "fixture", NEXT_PUBLIC_ENABLE_BLOG: "true", NEXT_PUBLIC_CONTACT_ENABLED: "true",
        NEXT_PUBLIC_TIER: "growth", NEXT_PUBLIC_COMPANY_MODE: "both", NEXT_PUBLIC_OFFERS_DUMPSTER_RENTAL: "true",
        NEXT_PUBLIC_PRICING: JSON.stringify({ truckSize: "20", tiers: [{ id: "minimum", label: "Minimum", fraction: "1/8", min: 99, max: 150 }, { id: "full", label: "Full", fraction: "1", min: 600, max: 650 }], surcharges: [] }),
        NEXT_PUBLIC_DUMPSTER_PRICING: JSON.stringify({ tiers: [{ sizeCuYd: 20, baseRate: 400, baseRateMin: 400, baseRateMax: 400, includedDays: 7, weightAllowanceTons: 2, overageRatePerTon: 75, extendedDailyRate: 20 }], surcharges: [] }),
    };
}
export const fixtureBlog = {
    slug: "fixture-blog", title: "Fixture booking preparation", description: "Local fixture for static blog rendering and metadata validation.",
    publishedAt: "2026-09-01", category: "Preparation", tags: [], readTime: "2 min", heroHeadline: "Prepare for pickup",
    content: { heroHeadline: "Prepare for pickup", breadcrumbs: [], sections: [{ heading: "Local fixture", body: "Review your items before pickup." }], faq: [], cta: { heading: "Book", body: "Choose a time", buttonLabel: "Book", buttonHref: "/book" }, structuredData: {}, relatedPages: [], meta: { title: "Fixture booking preparation", description: "Local fixture for static blog rendering and metadata validation.", canonical: "/blog/fixture-blog" } },
};
