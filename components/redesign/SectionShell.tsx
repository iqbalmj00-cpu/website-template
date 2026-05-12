import type { ReactNode } from "react";

type SectionShellProps = {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    children: ReactNode;
    align?: "left" | "center";
    tone?: "background" | "card" | "hero";
    className?: string;
};

const toneClass = {
    background: "bg-background text-foreground",
    card: "bg-card text-foreground",
    hero: "bg-[var(--hero-bg)] text-[var(--hero-text)]",
};

export default function SectionShell({
    eyebrow,
    title,
    subtitle,
    children,
    align = "left",
    tone = "background",
    className = "",
}: SectionShellProps) {
    const centered = align === "center";

    return (
        <section className={`${toneClass[tone]} px-5 py-16 sm:px-8 lg:px-12 lg:py-24 ${className}`}>
            <div className="mx-auto max-w-6xl">
                {(eyebrow || title || subtitle) && (
                    <div className={`${centered ? "mx-auto text-center" : ""} mb-10 max-w-3xl`}>
                        {eyebrow && (
                            <p className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-brand">
                                {eyebrow}
                            </p>
                        )}
                        {title && (
                            <h2 className="text-3xl font-black leading-tight text-inherit sm:text-4xl lg:text-5xl">
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className={`${centered ? "mx-auto" : ""} mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg`}>
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}
                {children}
            </div>
        </section>
    );
}
