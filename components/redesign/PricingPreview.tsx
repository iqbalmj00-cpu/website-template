import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";
import SectionShell from "./SectionShell";

function money(value: number): string {
    return `$${Math.round(value)}`;
}

export default function PricingPreview() {
    const tiers = siteConfig.pricing.tiers.slice(0, 3);
    if (tiers.length === 0) return null;

    return (
        <SectionShell
            tone="card"
            eyebrow="Pricing"
            title="Configured Price Ranges"
            subtitle="Use these ranges as planning guidance. The crew confirms the final price before loading begins."
        >
            <div className="grid gap-4 md:grid-cols-3">
                {tiers.map((tier) => (
                    <article key={tier.id} className="rounded-card border border-border bg-background p-6">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-brand">{tier.fraction} truck</p>
                        <h3 className="mt-3 text-xl font-black">{tier.label}</h3>
                        <p className="mt-4 text-3xl font-black text-foreground">
                            {money(tier.min)} - {money(tier.max)}
                        </p>
                    </article>
                ))}
            </div>
            <div className="mt-8">
                <Link href="/pricing" className="inline-flex items-center gap-2 font-black text-brand no-underline hover:underline">
                    Review pricing factors <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
            </div>
        </SectionShell>
    );
}
