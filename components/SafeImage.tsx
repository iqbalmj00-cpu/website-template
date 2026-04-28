"use client";

import { useState } from "react";

/**
 * SafeImage — client component that renders an <img> with a fallback.
 * If the image fails to load, it either shows a fallback src or hides itself.
 * Use this in Server Component pages where inline onError is not allowed.
 *
 * Pass `width` and `height` to prevent Cumulative Layout Shift (CLS) — the
 * browser reserves space using the intrinsic ratio before the image loads.
 * If your image is responsive, set CSS `aspect-ratio` in the style prop instead;
 * either approach prevents CLS. Only one is needed.
 */
export default function SafeImage({
    src,
    fallbackSrc,
    alt,
    style,
    width,
    height,
    loading,
    collapseParentGrid,
}: {
    src: string;
    fallbackSrc?: string;
    alt: string;
    style?: React.CSSProperties;
    /** Intrinsic width — pass alongside height to reserve layout space and avoid CLS. */
    width?: number;
    /** Intrinsic height — pass alongside width to reserve layout space and avoid CLS. */
    height?: number;
    /** "lazy" (default for below-the-fold) or "eager" (for above-the-fold hero images). */
    loading?: "lazy" | "eager";
    /** If true, collapse the grandparent grid to 1 column on error */
    collapseParentGrid?: boolean;
}) {
    const [hidden, setHidden] = useState(false);

    if (hidden) return null;

    return (
        <img
            src={src}
            alt={alt}
            style={style}
            {...(width !== undefined ? { width } : {})}
            {...(height !== undefined ? { height } : {})}
            {...(loading ? { loading } : {})}
            decoding="async"
            onError={(e) => {
                const el = e.target as HTMLImageElement;
                if (fallbackSrc && el.src !== fallbackSrc) {
                    el.src = fallbackSrc;
                    return;
                }
                setHidden(true);
                if (collapseParentGrid) {
                    const grid = el.closest("[data-image-grid]") as HTMLElement;
                    if (grid) grid.style.gridTemplateColumns = "1fr";
                }
            }}
        />
    );
}
