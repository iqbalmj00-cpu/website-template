import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import {
    adjustHexColor,
    createSiteConfigFromPublicConfig,
    hasVerifiedGoogleReviews,
    hexToRgb,
    siteConfig,
    type SiteConfig,
} from "@/lib/siteConfig";
import { getServerConfig } from "@/lib/serverConfig";
import HomePageContent from "@/components/redesign/HomePageContent";
import PreviewClickGuard from "@/components/redesign/PreviewClickGuard";
import { DispatchSiteFooter } from "@/components/redesign/DispatchBlocks";
import DispatchSiteHeader from "@/components/redesign/DispatchSiteHeader";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
    title: "Website Preview",
    robots: {
        index: false,
        follow: false,
        googleBot: {
            index: false,
            follow: false,
        },
    },
};

type PreviewPageProps = {
    searchParams?: {
        token?: string | string[];
    };
};

type PreviewSessionResponse = {
    config?: unknown;
    expiresAt?: string;
};

function previewFallbackConfig(): SiteConfig {
    return {
        ...siteConfig,
        siteUrl: "",
        streetAddress: "",
        phoneNumber: "",
        emailAddress: "",
        tagline: "Configure the homepage preview from the dashboard.",
        logoUrl: null,
        heroImageUrl: null,
        aboutImageUrl: null,
        commercialImageUrl: null,
        locationImages: {},
        serviceImages: {},
        testimonials: [],
        googleReviews: [],
        reviewStats: null,
        aboutStory: "",
        founderName: "",
        yearFounded: "",
        licenseNumber: "",
        insuranceCarrier: "",
        certifications: [],
        recyclingRate: null,
        sameDayEnabled: false,
        sameDayMinNoticeMinutes: null,
        sameDayCutoffTime: "",
        sameDaySurchargeType: "",
        sameDaySurchargeAmount: null,
        pricingConfigured: false,
        offersDumpsterRental: false,
        dumpsterPricing: null,
        businessHours: {},
        gbpUrl: "",
        gbpPlaceId: "",
        serviceAreaZips: [],
        centerLat: null,
        centerLng: null,
        maxRadius: null,
        gaTrackingId: null,
        stripePublishableKey: "",
        googleMapsKey: "",
    };
}

function getToken(searchParams: PreviewPageProps["searchParams"]): string {
    const raw = searchParams?.token;
    const token = Array.isArray(raw) ? raw[0] : raw;
    return typeof token === "string" ? token.trim() : "";
}

async function loadPreviewConfig(token: string): Promise<SiteConfig | null> {
    if (!token || token.length < 20 || token.length > 120) return null;

    const { dashboardUrl } = getServerConfig();
    if (!dashboardUrl) return null;

    const url = new URL(`/api/website-preview/session/${encodeURIComponent(token)}`, dashboardUrl.replace(/\/+$/, ""));
    try {
        const response = await fetch(url.toString(), {
            cache: "no-store",
            headers: {
                Accept: "application/json",
            },
        });

        if (!response.ok) return null;

        const payload = await response.json() as PreviewSessionResponse;
        if (!payload?.config || !payload.expiresAt) return null;

        const expiresAt = Date.parse(payload.expiresAt);
        if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return null;

        return createSiteConfigFromPublicConfig(payload.config, previewFallbackConfig());
    } catch {
        return null;
    }
}

function PreviewUnavailable() {
    return (
        <main className="min-h-screen bg-paper px-5 py-20 text-ink sm:px-8 lg:px-10">
            <section className="mx-auto max-w-2xl rounded-xl border border-line bg-[#fffaf1] p-8 text-center shadow-paper">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-brand">Preview unavailable</p>
                <h1 className="mt-4 text-3xl font-black tracking-normal sm:text-4xl">This website preview is not available.</h1>
                <p className="mt-4 text-base leading-7 text-ink-2">
                    The preview link may be missing, expired, or no longer valid. Return to the dashboard and generate a fresh preview.
                </p>
            </section>
        </main>
    );
}

function previewStyle(config: SiteConfig): CSSProperties {
    return {
        "--brand": config.brandColor,
        "--brand-dark": adjustHexColor(config.brandColor, -15),
        "--brand-rgb": hexToRgb(config.brandColor),
    } as CSSProperties;
}

export default async function PreviewPage({ searchParams }: PreviewPageProps) {
    noStore();

    const config = await loadPreviewConfig(getToken(searchParams));
    if (!config) {
        return (
            <PreviewClickGuard>
                <PreviewUnavailable />
            </PreviewClickGuard>
        );
    }
    const showReviews = hasVerifiedGoogleReviews(config);

    return (
        <PreviewClickGuard>
            <div
                style={previewStyle(config)}
                data-theme={config.theme}
                data-font-pair={config.fontPair}
                data-homepage-style={config.designConfig.homepageStyle}
                data-corner-radius={config.designConfig.cornerRadius}
                data-nav-style={config.designConfig.navStyle}
            >
                <DispatchSiteHeader config={config} showReviews={showReviews} />
                <main>
                    <HomePageContent config={config} />
                </main>
                <DispatchSiteFooter config={config} />
            </div>
        </PreviewClickGuard>
    );
}
