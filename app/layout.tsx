import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/siteConfig";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
    display: "swap",
});

export const metadata: Metadata = {
    title: `${siteConfig.companyName} | Junk Removal in ${siteConfig.city}`,
    description: `${siteConfig.companyName} offers fast, affordable junk removal in ${siteConfig.serviceArea}. Furniture, appliances, yard waste & more. Book online in minutes.`,
    openGraph: {
        title: `${siteConfig.companyName} | Junk Removal in ${siteConfig.city}`,
        description: `Fast, affordable junk removal in ${siteConfig.serviceArea}.`,
        type: "website",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
            <head>
                {/* Inject brand color as CSS variable */}
                <style>{`:root { --brand: ${siteConfig.brandColor}; --brand-dark: ${adjustColor(siteConfig.brandColor, -15)}; }`}</style>
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
