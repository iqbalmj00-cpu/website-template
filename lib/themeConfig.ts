/**
 * themeConfig.ts — Theme definitions for the multi-theme system.
 * Each theme defines CSS custom property values and font families.
 * The active theme is selected via NEXT_PUBLIC_THEME env var.
 */

export type ThemeId = "classic" | "industrial" | "eco" | "editorial";

export interface ThemeConfig {
    id: ThemeId;
    label: string;
    tagline: string;
    fonts: {
        heading: string;
        body: string;
    };
    /** Google Fonts CSS variables set in layout.tsx */
    fontVarHeading: string;
    fontVarBody: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
    classic: {
        id: "classic",
        label: "Classic",
        tagline: "Clean, bold, and professional.",
        fonts: { heading: "Space Grotesk", body: "Inter" },
        fontVarHeading: "var(--font-space-grotesk)",
        fontVarBody: "var(--font-inter)",
    },
    industrial: {
        id: "industrial",
        label: "Bold Industrial",
        tagline: "Heavy duty. No nonsense.",
        fonts: { heading: "Bebas Neue", body: "DM Sans" },
        fontVarHeading: "var(--font-bebas-neue)",
        fontVarBody: "var(--font-dm-sans)",
    },
    eco: {
        id: "eco",
        label: "Clean & Green",
        tagline: "Thoughtful removal. Happy planet.",
        fonts: { heading: "Fraunces", body: "Nunito" },
        fontVarHeading: "var(--font-fraunces)",
        fontVarBody: "var(--font-nunito)",
    },
    editorial: {
        id: "editorial",
        label: "Modern Editorial",
        tagline: "Premium service. Minimal hassle.",
        fonts: { heading: "Playfair Display", body: "Source Sans 3" },
        fontVarHeading: "var(--font-playfair)",
        fontVarBody: "var(--font-source-sans)",
    },
};

export function getTheme(id: string): ThemeConfig {
    return THEMES[id as ThemeId] || THEMES.classic;
}
