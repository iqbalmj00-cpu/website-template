"use client";

import { useState } from "react";

/**
 * SafeImage — client component that renders an <img> with a fallback.
 * If the image fails to load, it either shows a fallback src or hides itself.
 * Use this in Server Component pages where inline onError is not allowed.
 */
export default function SafeImage({
    src,
    fallbackSrc,
    alt,
    style,
    collapseParentGrid,
}: {
    src: string;
    fallbackSrc?: string;
    alt: string;
    style?: React.CSSProperties;
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
