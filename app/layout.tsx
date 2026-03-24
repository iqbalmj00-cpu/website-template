import type { Metadata } from "next";
import { Inter, Space_Grotesk, Bebas_Neue, DM_Sans, Fraunces, Nunito, Playfair_Display, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/siteConfig";
import { getTheme } from "@/lib/themeConfig";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ── Load ALL theme fonts (Next.js requires static imports) ───────────── */
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });
const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas-neue", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });
const playfairDisplay = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const sourceSans3 = Source_Sans_3({ subsets: ["latin"], variable: "--font-source-sans", display: "swap" });

const allFontVars = [
    inter.variable,
    spaceGrotesk.variable,
    bebasNeue.variable,
    dmSans.variable,
    fraunces.variable,
    nunito.variable,
    playfairDisplay.variable,
    sourceSans3.variable,
].join(" ");

const baseUrl = siteConfig.subdomain
    ? `https://${siteConfig.subdomain}.scaleyourjunk.com`
    : "https://scaleyourjunk.com";

const ogImage = siteConfig.heroImageUrl || siteConfig.logoUrl || null;

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
    metadataBase: new URL(baseUrl),
    title: `${siteConfig.companyName} | Junk Removal in ${siteConfig.city}`,
    description: `${siteConfig.companyName} offers fast, affordable junk removal in ${siteConfig.serviceArea || siteConfig.city}. Furniture, appliances, yard waste & more. Book online in minutes.`,
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: `${siteConfig.companyName} | Junk Removal in ${siteConfig.city}`,
        description: `Fast, affordable junk removal in ${siteConfig.serviceArea || siteConfig.city}.`,
        type: "website",
        siteName: siteConfig.companyName,
        locale: "en_US",
        ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: `${siteConfig.companyName} — Junk Removal in ${siteConfig.city}` }] } : {}),
    },
    twitter: {
        card: ogImage ? "summary_large_image" : "summary",
        title: `${siteConfig.companyName} | Junk Removal in ${siteConfig.city}`,
        description: `Fast, affordable junk removal in ${siteConfig.serviceArea || siteConfig.city}.`,
        ...(ogImage ? { images: [ogImage] } : {}),
    },
    robots: {
        index: true,
        follow: true,
    },
    icons: {
        icon: faviconDataUrl,
    },
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
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "LocalBusiness",
                            "@id": siteConfig.subdomain ? `https://${siteConfig.subdomain}.scaleyourjunk.com/#business` : undefined,
                            name: siteConfig.companyName,
                            description: `${siteConfig.companyName} offers fast, affordable junk removal in ${siteConfig.serviceArea || siteConfig.city}.`,
                            telephone: siteConfig.phoneNumber,
                            ...(siteConfig.subdomain ? { url: `https://${siteConfig.subdomain}.scaleyourjunk.com` } : {}),
                            ...(siteConfig.logoUrl ? { logo: siteConfig.logoUrl, image: siteConfig.logoUrl } : {}),
                            address: {
                                "@type": "PostalAddress",
                                addressLocality: siteConfig.city,
                                addressRegion: siteConfig.state,
                                addressCountry: "US",
                            },
                            areaServed: (siteConfig.serviceArea || siteConfig.city).split(",").map(a => ({
                                "@type": "City",
                                name: a.trim(),
                            })),
                            priceRange: "$$",
                            currenciesAccepted: "USD",
                            paymentAccepted: "Cash, Credit Card",
                            openingHoursSpecification: (() => {
                                const bh = siteConfig.businessHours;
                                if (!bh) return undefined;
                                const dayMap: Record<string, string> = {
                                    mon: "Monday", tue: "Tuesday", wed: "Wednesday",
                                    thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday",
                                };
                                return Object.entries(bh)
                                    .filter(([, v]) => v && !(v as { closed?: boolean }).closed)
                                    .map(([day, v]) => ({
                                        "@type": "OpeningHoursSpecification",
                                        dayOfWeek: dayMap[day] || day,
                                        opens: (v as { start?: string }).start || "08:00",
                                        closes: (v as { end?: string }).end || "18:00",
                                    }));
                            })(),
                        }),
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
