import type { Metadata, Viewport } from "next";
import "../globals.css";
import { siteConfig } from "@/lib/siteConfig";
import { createPageMetadata, localBusinessJsonLd } from "@/lib/seo";
import { canExposePublicSite, getPublicSiteStatus } from "@/lib/publicSiteGuard";
import { hasVerifiedPublicReviews } from "@/lib/reviewData";
import { brandStyleCss, faviconDataUrl, fontStylesheetHref, htmlThemeAttributes } from "@/lib/documentHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * Root layout for the public marketing site.
 *
 * Deliberately does NOT call `headers()`. The previous single root layout read
 * `x-template-preview-route` to decide whether it was rendering a preview, and
 * that one call forced every route in the site to be server-rendered per
 * request. Preview now has its own root layout in `app/(preview)`, so this one
 * is free to be statically generated and served from the CDN.
 */

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

export default async function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const publicSiteStatus = getPublicSiteStatus();
    const renderPublicSite = canExposePublicSite();
    const showReviews = renderPublicSite ? await hasVerifiedPublicReviews() : false;

    return (
        <html {...htmlThemeAttributes}>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="stylesheet" href={fontStylesheetHref} />
                {/* Inject brand color override from onboarding */}
                <style>{brandStyleCss}</style>
                {/* Google Analytics */}
                {siteConfig.gaTrackingId && (
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
                {renderPublicSite && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify(localBusinessJsonLd()),
                        }}
                    />
                )}
                {renderPublicSite ? (
                    <>
                        <Navbar showReviews={showReviews} />
                        <main>{children}</main>
                        <Footer showReviews={showReviews} />
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
