import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { siteConfig } from "@/lib/siteConfig";
import { createPageMetadata, localBusinessJsonLd } from "@/lib/seo";
import { canExposePublicSite, getPublicSiteStatus } from "@/lib/publicSiteGuard";
import { hasVerifiedPublicReviews } from "@/lib/reviewData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SameDayBanner from "@/components/redesign/SameDayBanner";

const fontStylesheetHref = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,800;9..144,900&family=Inter:wght@400;500;600;700;800;900&family=Nunito:wght@400;500;600;700;800;900&family=Playfair+Display:wght@600;700;800;900&family=Source+Sans+3:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap";

/* ── Dynamic favicon from company initials + brand color ──────────────── */
const faviconInitials = siteConfig.companyName
    .split(/\s+/)
    .map(w => w[0])
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .slice(0, 3); // Max 3 characters (e.g. "JJR")

// Map themes to system fonts that approximate the Google Fonts (SVG can't load external fonts)
const THEME_FAVICON_FONTS: Record<string, string> = {
    classic: "'Trebuchet MS', system-ui, sans-serif",
    industrial: "Impact, 'Arial Narrow', sans-serif",
    eco: "Georgia, 'Times New Roman', serif",
    editorial: "Georgia, 'Palatino Linotype', serif",
};
const FONT_PAIR_FAVICON_FONTS: Record<string, string> = {
    "space-grotesk-inter": "'Trebuchet MS', system-ui, sans-serif",
    "bebas-dm-sans": "Impact, 'Arial Narrow', sans-serif",
    "fraunces-nunito": "Georgia, 'Times New Roman', serif",
    "playfair-source-sans": "Georgia, 'Palatino Linotype', serif",
};
const faviconFont = FONT_PAIR_FAVICON_FONTS[siteConfig.fontPair] || THEME_FAVICON_FONTS[siteConfig.theme] || THEME_FAVICON_FONTS.classic;

// Scale font size based on number of initials
const faviconFontSize = faviconInitials.length <= 2 ? 14 : 11;

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="${siteConfig.brandColor}"/>
  <text x="16" y="17" text-anchor="middle" dominant-baseline="central"
    font-family="${faviconFont}" font-size="${faviconFontSize}" font-weight="700"
    fill="white" letter-spacing="-0.5">${faviconInitials}</text>
</svg>`;

const faviconDataUrl = `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`;

export const metadata: Metadata = {
    ...createPageMetadata({
        title: `Junk Removal in ${siteConfig.city}`,
        description: `${siteConfig.companyName} provides junk removal in ${siteConfig.serviceArea || siteConfig.city}. Furniture, appliances, yard waste, cleanouts, and more.`,
        path: "/",
    }),
    applicationName: siteConfig.companyName,
    manifest: "/manifest.webmanifest",
    icons: {
        icon: faviconDataUrl,
        apple: faviconDataUrl,
    },
};

export const viewport: Viewport = {
    themeColor: siteConfig.brandColor,
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const isPreviewRoute = headers().get("x-template-preview-route") === "1";
    const publicSiteStatus = getPublicSiteStatus();
    const renderPublicSite = canExposePublicSite();
    const showReviews = !isPreviewRoute && renderPublicSite ? await hasVerifiedPublicReviews() : false;

    return (
        <html
            lang="en"
            data-theme={siteConfig.theme}
            data-font-pair={siteConfig.fontPair}
            data-homepage-style={siteConfig.designConfig.homepageStyle}
            data-corner-radius={siteConfig.designConfig.cornerRadius}
            data-nav-style={siteConfig.designConfig.navStyle}
        >
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="stylesheet" href={fontStylesheetHref} />
                {/* Inject brand color override from onboarding */}
                <style>{`:root { --brand: ${siteConfig.brandColor}; --brand-dark: ${adjustColor(siteConfig.brandColor, -15)}; --brand-rgb: ${hexToRgb(siteConfig.brandColor)}; }`}</style>
                {/* Google Analytics */}
                {!isPreviewRoute && siteConfig.gaTrackingId && (
                    <>
                        <script
                            async
                            src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.gaTrackingId}`}
                        />
                        <script
                            dangerouslySetInnerHTML={{
                                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${siteConfig.gaTrackingId}');`,
                            }}
                        />
                    </>
                )}
            </head>
            <body>
                {/* JSON-LD LocalBusiness schema for local SEO */}
                {!isPreviewRoute && renderPublicSite && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify(localBusinessJsonLd()),
                        }}
                    />
                )}
                {isPreviewRoute ? (
                    children
                ) : renderPublicSite ? (
                    <>
                        <SameDayBanner />
                        <Navbar />
                        <main>{children}</main>
                        <Footer />
                    </>
                ) : (
                    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem", background: "#111827", color: "#fff" }}>
                        <section style={{ maxWidth: 560, textAlign: "center" }}>
                            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1rem" }}>Website Setup Required</h1>
                            <p style={{ color: "#d1d5db", lineHeight: 1.7, marginBottom: "1rem" }}>
                                This website is not ready for public indexing. Required public business details must be completed before launch.
                            </p>
                            {publicSiteStatus.issues.length > 0 && (
                                <p style={{ color: "#9ca3af", fontSize: "0.9rem", lineHeight: 1.6 }}>
                                    Missing setup fields: {publicSiteStatus.issues.map(issue => issue.field).join(", ")}
                                </p>
                            )}
                        </section>
                    </main>
                )}
            </body>
        </html>
    );
}

/** Darken a hex color by `amount` lightness points for hover states */
function adjustColor(hex: string, amount: number): string {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount));
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

/** Convert hex color to comma-separated RGB string for rgba() usage */
function hexToRgb(hex: string): string {
    const num = parseInt(hex.replace("#", ""), 16);
    return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
}
