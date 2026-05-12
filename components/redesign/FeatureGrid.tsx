import type { ReactNode } from "react";
import SectionShell from "./SectionShell";

type Feature = {
    title: string;
    desc: string;
    icon?: ReactNode;
};

type FeatureGridProps = {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    features: Feature[];
    tone?: "background" | "card";
};

export default function FeatureGrid({ eyebrow, title, subtitle, features, tone = "background" }: FeatureGridProps) {
    if (features.length === 0) return null;

    return (
        <SectionShell tone={tone} eyebrow={eyebrow} title={title} subtitle={subtitle}>
            <div className="grid gap-4 md:grid-cols-3">
                {features.map((feature) => (
                    <article key={feature.title} className="rounded-card border border-border bg-card p-6">
                        {feature.icon && <div className="mb-4 text-brand">{feature.icon}</div>}
                        <h3 className="text-xl font-black">{feature.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-muted">{feature.desc}</p>
                    </article>
                ))}
            </div>
        </SectionShell>
    );
}
