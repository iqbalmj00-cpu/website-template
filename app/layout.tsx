import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, Bebas_Neue, DM_Sans, Fraunces, Nunito, Playfair_Display, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/siteConfig";
import { createPageMetadata, localBusinessJsonLd } from "@/lib/seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ── Theme-conditional font loading ───────────────────────────────────────
 * Next.js requires next/font/google calls at module top level, so all 8 fonts
 * are imported. Preload is disabled with explicit literals because the font
 * loader cannot statically analyze dynamic preload flags. Only the active
 * theme's CSS variables are applied to <html>. */
const activeTheme = siteConfig.theme;

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap", preload: false });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap", preload: false });
const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas-neue", display: "swap", preload: false });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap", preload: false });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", preload: false });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap", preload: false });
const playfairDisplay = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap", preload: false });
const sourceSans3 = Source_Sans_3({ subsets: ["latin"], variable: "--font-source-sans", display: "swap", preload: false });

// Only the active theme's font CSS variables go on <html> — non-active fonts
// are bundled but their var() references never appear in any rendered CSS,
// so the browser never actually fetches the woff2 files for them.
const themeFontVarsMap: Record<string, string[]> = {
    classic: [inter.variable, spaceGrotesk.variable],
    industrial: [bebasNeue.variable, dmSans.variable],
    eco: [fraunces.variable, nunito.variable],
    editorial: [playfairDisplay.variable, sourceSans3.variable],
};
const allFontVars = (themeFontVarsMap[activeTheme] || themeFontVarsMap.classic).join(" ");

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
const faviconFont = THEME_FAVICON_FONTS[siteConfig.theme] || THEME_FAVICON_FONTS.classic;

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

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" data-theme={siteConfig.theme} className={allFontVars}>
            <head>
                {/* Inject brand color override from onboarding */}
                <style>{`:root { --brand: ${siteConfig.brandColor}; --brand-dark: ${adjustColor(siteConfig.brandColor, -15)}; --brand-rgb: ${hexToRgb(siteConfig.brandColor)}; }`}</style>
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
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(localBusinessJsonLd()),
                    }}
                />
                <Navbar />
                <main>{children}</main>
                <Footer />
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
