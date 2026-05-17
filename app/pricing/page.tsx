import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, ClipboardList, MapPin, Truck } from "lucide-react";
import PageHero from "@/components/redesign/PageHero";
import StaticFAQ from "@/components/redesign/StaticFAQ";
import CtaBand from "@/components/redesign/CtaBand";
import { VisualEstimateFactors, VisualPricingScaleSection } from "@/components/redesign/VisualReplacementBlocks";
import { createPageMetadata, faqPageJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;

const PRICING_FAQS = [
    {
        q: "Where can I see a junk removal price estimate?",
        a: "When load-tier pricing is available, this page shows planning ranges. Use the booking flow to enter contact information, service type, load size, pickup address, access details, schedule window, and quote review.",
    },
    {
        q: "How is junk removal pricing calculated?",
        a: "Pricing depends on truck volume, item weight, access, distance, material type, and any applicable handling or disposal fees. The final price is confirmed before loading begins.",
    },
    {
        q: "Do stairs, basements, or long carries affect pricing?",
        a: "Access can affect the estimate because stairs, basements, elevators, gates, parking limits, and long carries can change the labor required.",
    },
    {
        q: "Can I get an exact quote before loading starts?",
        a: "Yes. The crew confirms the final price before loading starts, after reviewing the item volume, access, material type, and any applicable fees.",
    },
];

const ESTIMATE_STEPS = [
    {
        icon: ClipboardList,
        label: "Step 01",
        title: "Choose service and load details",
        body: "Select the service type, load size, and job notes that best match the pickup.",
    },
    {
        icon: MapPin,
        label: "Step 02",
        title: "Add access details",
        body: "Address, ZIP code, stairs, parking, gates, elevators, and carry distance can all affect the estimate.",
    },
    {
        icon: Truck,
        label: "Step 03",
        title: "Review the estimate",
        body: "The booking wizard provides the estimate path, and the final price is confirmed before loading begins.",
    },
];

export const metadata: Metadata = createPageMetadata({
    title: `Junk Removal Pricing in ${siteConfig.city}`,
    description: `Review junk removal load-tier pricing in ${cityState} and learn how ${siteConfig.companyName} estimates jobs before final quote confirmation.`,
    path: "/pricing",
});

export default function PricingPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(PRICING_FAQS, "/pricing")) }}
            />
            <PageHero
                crumbs={[
                    { label: "Home", href: "/" },
                    { label: "Pricing" },
                ]}
                titleStart="Get a junk removal estimate "
                titleAccent={`through booking.`}
                lede="Load-tier ranges give customers a planning guide. The booking wizard adds item details, access notes, and the pickup address so the estimate can match the actual job."
                primaryCta={{ label: "Get an Instant Quote", href: "/book" }}
            />
            <VisualPricingScaleSection
                config={siteConfig}
                eyebrow="Pricing"
                title="Pick the load that fits the job."
            />

            <section className="bg-paper-2 py-[100px] px-[clamp(20px,4vw,64px)]">
                <div className="mx-auto" style={{ maxWidth: 1480 }}>
                    <div className="mb-9 flex max-w-[46rem] flex-col gap-3">
                        <div className="eyebrow">Estimate process</div>
                        <h2 className="font-display text-[clamp(36px,4.5vw,56px)] font-extrabold leading-[1.02] tracking-normal text-ink">
                            Pricing starts with load size and job details.
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {ESTIMATE_STEPS.map(({ icon: Icon, label, title, body }) => (
                            <article key={title} className="rounded-[14px] border border-line bg-paper p-6">
                                <div className="flex items-center gap-3">
                                    <span className="grid h-11 w-11 place-items-center rounded-[12px] bg-brand text-white">
                                        <Icon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                    <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
                                        {label}
                                    </span>
                                </div>
                                <h3 className="mt-5 font-display text-[24px] font-bold leading-tight text-ink">{title}</h3>
                                <p className="mt-3 text-[14.5px] leading-[1.6] text-muted">{body}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <VisualEstimateFactors config={siteConfig} />

            <section className="bg-paper-2 py-[100px] px-[clamp(20px,4vw,64px)]">
                <div className="mx-auto grid grid-cols-1 gap-4 md:grid-cols-3" style={{ maxWidth: 1180 }}>
                    {[
                        "The booking wizard is the estimate entry point.",
                        "The final price is confirmed before loading begins.",
                        "Access notes and load details help produce a cleaner estimate.",
                    ].map((item) => (
                        <div key={item} className="flex gap-3 rounded-[14px] border border-line bg-paper p-5">
                            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                            <p className="text-[14.5px] leading-[1.6] text-muted">{item}</p>
                        </div>
                    ))}
                </div>
            </section>

            <StaticFAQ eyebrow="Pricing FAQ" heading="Questions before you approve a quote." items={PRICING_FAQS} />
            <section className="bg-paper-2 px-[clamp(20px,4vw,64px)] pb-[100px]">
                <div className="mx-auto text-center" style={{ maxWidth: 760 }}>
                    <Link href="/book" className="btn-primary">
                        Get an Instant Quote <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                </div>
            </section>
            <CtaBand />
        </>
    );
}
