import type { Metadata, Viewport } from "next";
import "../globals.css";
import { siteConfig } from "@/lib/siteConfig";
import { brandStyleCss, faviconDataUrl, fontStylesheetHref, htmlThemeAttributes } from "@/lib/documentHead";

/**
 * Root layout for the dashboard's preview routes.
 *
 * Preview renders the page on its own: no site chrome, no analytics, no
 * LocalBusiness JSON-LD, and no "Website Setup Required" gate — the whole point
 * of preview is to show an operator what their site will look like before it is
 * ready to launch.
 *
 * This existing as a separate root layout is what let the public layout stop
 * calling `headers()`. That call both forced every public route to render per
 * request and let anyone bypass the setup gate by sending
 * `x-template-preview-route: 1` on any path.
 */

export const metadata: Metadata = {
    title: `${siteConfig.companyName} — Preview`,
    // Never indexable. The middleware also sends X-Robots-Tag for these paths.
    robots: { index: false, follow: false },
    icons: {
        icon: faviconDataUrl,
        apple: faviconDataUrl,
    },
};

export const viewport: Viewport = {
    themeColor: siteConfig.brandColor,
};

export default function PreviewLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html {...htmlThemeAttributes}>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="stylesheet" href={fontStylesheetHref} />
                <style>{brandStyleCss}</style>
            </head>
            <body>{children}</body>
        </html>
    );
}
