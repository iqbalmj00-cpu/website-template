import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle } from "lucide-react";
import PageHero from "@/components/redesign/PageHero";
import PageIntro from "@/components/redesign/PageIntro";
import RelatedSvc from "@/components/redesign/RelatedSvc";
import PricingTeaser from "@/components/redesign/PricingTeaser";
import PricingTierCards from "@/components/redesign/PricingTierCards";
import CtaBand from "@/components/redesign/CtaBand";
import { breadcrumbJsonLd, createPageMetadata, faqPageJsonLd, serviceJsonLd } from "@/lib/seo";
import { getClientServices, getServiceBySlug } from "@/lib/serviceData";
import { hasConfiguredPricing, siteConfig } from "@/lib/siteConfig";
import { getServiceImageRole, resolveJunkRemovalImage } from "@/lib/templateAssets/junkRemoval";

export async function generateStaticParams() {
    return getClientServices().map((svc) => ({ slug: svc.slug }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
    const svc = getClientServices().find((service) => service.slug === params.slug);
    if (!svc) {
        return createPageMetadata({
            title: "Service Not Found",
            description: "This service is not available.",
            path: `/services/${params.slug}`,
            noIndex: true,
        });
    }

    const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;
    const pageTitle = svc.slug === "junk-removal"
        ? `Full-Service Junk Removal in ${cityState}`
        : `${svc.title} in ${cityState}`;
    const pageDesc = svc.slug === "junk-removal"
        ? `${siteConfig.companyName} provides full-service junk removal in ${cityState}. Review accepted items, pricing factors, and booking details.`
        : `${siteConfig.companyName} provides ${svc.title.toLowerCase()} in ${cityState}. Review accepted items, pricing factors, prep tips, and booking details.`;

    return createPageMetadata({
        title: pageTitle,
        description: pageDesc,
        path: `/services/${svc.slug}`,
        image: resolveServiceTemplateImage(svc.slug, svc.title).src,
    });
}

function resolveServiceTemplateImage(slug: string, title: string) {
    return resolveJunkRemovalImage({
        config: siteConfig,
        role: getServiceImageRole(slug),
        routeKey: `service-meta-${slug}`,
        overrideSrc: siteConfig.serviceImages?.[slug],
        serviceTitle: title,
    });
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
    const enabledServices = getClientServices();
    const svc = enabledServices.find((service) => service.slug === params.slug) || getServiceBySlug(params.slug);
    if (!svc || !enabledServices.some((service) => service.slug === svc.slug)) notFound();

    const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;
    const mediaRole = getServiceImageRole(svc.slug);
    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Services", href: "/services" },
        { label: svc.title, href: `/services/${svc.slug}` },
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        breadcrumbJsonLd(breadcrumbs.map(item => ({ name: item.label, path: item.href }))),
                        serviceJsonLd({
                            service: svc,
                            path: `/services/${svc.slug}`,
                            description: `${svc.shortDesc} ${siteConfig.companyName} provides ${svc.title.toLowerCase()} in ${cityState}.`,
                        }),
                        faqPageJsonLd(svc.faqs, `/services/${svc.slug}`),
                    ]),
                }}
            />
            <PageHero
                crumbs={[
                    { label: "Home", href: "/" },
                    { label: "Services", href: "/services" },
                    { label: svc.title },
                ]}
                titleStart={`${svc.title} `}
                titleAccent={`in ${cityState}.`}
                lede={svc.heroSubtitle}
                media={{
                    role: mediaRole,
                    src: siteConfig.serviceImages?.[svc.slug],
                    routeKey: `service-${svc.slug}`,
                    serviceTitle: svc.title,
                    caption: "Service scope",
                }}
            />
            {hasConfiguredPricing(siteConfig) && (
                <section className="bg-paper px-[clamp(20px,4vw,64px)] py-10 border-b border-line">
                    <div className="mx-auto" style={{ maxWidth: 1180 }}>
                        <div className="mb-5 flex flex-col gap-2">
                            <div className="eyebrow">Configured load pricing</div>
                            <h2 className="font-display text-[clamp(28px,3.4vw,40px)] font-extrabold leading-tight text-ink">
                                Start with the load size, then confirm the final quote.
                            </h2>
                        </div>
                        <PricingTierCards config={siteConfig} limit={4} compact />
                    </div>
                </section>
            )}
            <PageIntro
                eyebrow="Service overview"
                headline={`What to know before booking ${svc.title.toLowerCase()}.`}
                body={
                    <>
                        <p>{svc.serviceIntro}</p>
                        <p>{svc.fullDesc}</p>
                    </>
                }
                rightEyebrow="Booking prep"
                rightHeading="Details that affect the final quote"
                rightRows={svc.pricingFactors.slice(0, 4).map((factor, index) => ({
                    n: String(index + 1).padStart(2, "0"),
                    t: factor,
                    d: index === 0 ? "Primary pricing factor" : "Reviewed before loading",
                }))}
            />
            <section className="bg-paper-2 py-[100px] px-[clamp(20px,4vw,64px)]">
                <div className="mx-auto" style={{ maxWidth: 1480 }}>
                    <div className="mb-9 flex max-w-[42rem] flex-col gap-3">
                        <div className="eyebrow">Accepted categories</div>
                        <h2 className="font-display text-[clamp(36px,4.4vw,52px)] font-extrabold leading-[1.02] tracking-normal text-ink">
                            Common {svc.title.toLowerCase()} items and jobs.
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {svc.items.map((item, index) => (
                            <article key={item.title} className="rounded-[14px] border border-line bg-paper p-6">
                                <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
                                    {String(index + 1).padStart(2, "0")}
                                </div>
                                <h3 className="mt-3 font-display text-[22px] font-bold leading-tight text-ink">{item.title}</h3>
                                <p className="mt-2 text-[14.5px] leading-[1.6] text-muted">{item.desc}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
            <section className="bg-paper py-[100px] px-[clamp(20px,4vw,64px)] border-y border-line">
                <div className="mx-auto grid grid-cols-1 gap-12 lg:grid-cols-2" style={{ maxWidth: 1480 }}>
                    <div>
                        <div className="eyebrow">Common projects</div>
                        <h2 className="mt-3 font-display text-[clamp(32px,4vw,46px)] font-extrabold leading-[1.04] tracking-normal text-ink">
                            When customers book this service.
                        </h2>
                        <div className="mt-8 grid gap-4">
                            {svc.useCases.map((item) => (
                                <article key={item.title} className="rounded-[14px] border border-line bg-paper-2 p-6">
                                    <h3 className="font-display text-[20px] font-bold text-ink">{item.title}</h3>
                                    <p className="mt-2 text-[14.5px] leading-[1.6] text-muted">{item.desc}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="eyebrow">How to prepare</div>
                        <h2 className="mt-3 font-display text-[clamp(32px,4vw,46px)] font-extrabold leading-[1.04] tracking-normal text-ink">
                            A clearer quote starts with clearer details.
                        </h2>
                        <ul className="mt-8 grid gap-4">
                            {svc.preparationTips.map((tip) => (
                                <li key={tip} className="flex gap-3 rounded-[14px] border border-line bg-paper-2 p-5">
                                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                                    <span className="text-[14.5px] leading-[1.6] text-muted">{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
            <PricingTeaser />
            <section className="bg-paper-2 py-[100px] px-[clamp(20px,4vw,64px)]">
                <div className="mx-auto" style={{ maxWidth: 980 }}>
                    <div className="mb-7 text-center">
                        <div className="eyebrow inline-flex">Service FAQ</div>
                        <h2 className="mt-3 font-display text-[clamp(34px,4.5vw,52px)] font-extrabold leading-[1.03] tracking-normal text-ink">
                            Questions about {svc.title.toLowerCase()}.
                        </h2>
                    </div>
                    <div className="overflow-hidden rounded-[14px] border border-line bg-paper">
                        {svc.faqs.map((faq) => (
                            <details key={faq.q} className="border-b border-line last:border-b-0">
                                <summary className="cursor-pointer px-6 py-5 font-display text-[19px] font-semibold text-ink">
                                    {faq.q}
                                </summary>
                                <div className="px-6 pb-6 text-[15.5px] leading-[1.6] text-muted">{faq.a}</div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
            <RelatedSvc currentServiceId={svc.slug} eyebrow="Related services" heading="Other jobs this crew can quote." />
            <CtaBand />
        </>
    );
}
