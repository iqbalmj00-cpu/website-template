/**
 * documentHead.ts — Values shared by the two root layouts.
 *
 * There are two root layouts on purpose: `app/(site)` for the public marketing
 * site and `app/(preview)` for the dashboard's preview routes. Previously one
 * root layout served both and told them apart by calling `headers()` to read
 * `x-template-preview-route`, which had two costs:
 *
 *   1. `headers()` in a root layout opts EVERY route into per-request server
 *      rendering. On an SEO-driven local-business site that turns every page
 *      view into a serverless invocation instead of a CDN hit.
 *   2. The middleware only set that header on three paths, so a request could
 *      simply send `x-template-preview-route: 1` on any path and skip the
 *      "Website Setup Required" gate.
 *
 * Splitting the layouts removes the header mechanism, and with it both problems.
 * This module holds the parts both layouts genuinely share.
 */
import { siteConfig } from "@/lib/siteConfig";

export const fontStylesheetHref =
    "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Atkinson+Hyperlegible:wght@400;700&family=Barlow+Condensed:wght@600;700;800;900&family=Bebas+Neue&family=Besley:wght@600;700;800&family=Chivo:wght@400;600;700;900&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,800;9..144,900&family=Inter:wght@400;500;600;700;800;900&family=Nunito:wght@400;500;600;700;800;900&family=Playfair+Display:wght@600;700;800;900&family=Public+Sans:wght@400;600;700;800;900&family=Source+Sans+3:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap";

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
const faviconFont =
    FONT_PAIR_FAVICON_FONTS[siteConfig.fontPair] ||
    THEME_FAVICON_FONTS[siteConfig.theme] ||
    THEME_FAVICON_FONTS.classic;

// Scale font size based on number of initials
const faviconFontSize = faviconInitials.length <= 2 ? 14 : 11;

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="${siteConfig.brandColor}"/>
  <text x="16" y="17" text-anchor="middle" dominant-baseline="central"
    font-family="${faviconFont}" font-size="${faviconFontSize}" font-weight="700"
    fill="white" letter-spacing="-0.5">${faviconInitials}</text>
</svg>`;

export const faviconDataUrl = `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`;

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

/** Brand color overrides injected into <head> from onboarding config. */
export const brandStyleCss = `:root { --brand: ${siteConfig.brandColor}; --brand-dark: ${adjustColor(siteConfig.brandColor, -15)}; --brand-rgb: ${hexToRgb(siteConfig.brandColor)}; }`;

/** Theme/design attributes both layouts put on <html>. */
export const htmlThemeAttributes = {
    lang: "en",
    "data-theme": siteConfig.theme,
    "data-font-pair": siteConfig.fontPair,
    "data-homepage-style": siteConfig.designConfig.homepageStyle,
    "data-corner-radius": siteConfig.designConfig.cornerRadius,
    "data-nav-style": siteConfig.designConfig.navStyle,
} as const;
