import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
    DispatchCardSection,
    DispatchFaqBoard,
    DispatchFinalCta,
    DispatchIntroGrid,
    DispatchMetricStrip,
    DispatchPageHero,
    DispatchServiceMosaic,
} from "@/components/redesign/DispatchBlocks";
import {
    VisualCommonProjects,
    VisualPrepChecklist,
    VisualPricingScaleSection,
    VisualServiceItemsSection,
    VisualWhoBooks,
} from "@/components/redesign/VisualReplacementBlocks";
import { breadcrumbJsonLd, createPageMetadata, faqPageJsonLd, serviceJsonLd } from "@/lib/seo";
import { getClientServices, getServiceBySlug } from "@/lib/serviceData";
import { siteConfig } from "@/lib/siteConfig";
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
            <DispatchPageHero
                config={siteConfig}
                crumbs={[
                    { label: "Home", href: "/" },
                    { label: "Services", href: "/services" },
                    { label: svc.title },
                ]}
                eyebrow="Service overview"
                title={<>{svc.title} in {cityState}.</>}
                lede={svc.heroSubtitle}
                media={{
                    role: mediaRole,
                    src: siteConfig.serviceImages?.[svc.slug],
                    routeKey: `service-${svc.slug}`,
                    serviceTitle: svc.title,
                    label: svc.title,
                    caption: `${svc.title} details, accepted items, and quote factors.`,
                }}
                secondaryCta={{ label: "View Pricing", href: "#pricing" }}
            />
            <VisualPricingScaleSection config={siteConfig} />
            <DispatchMetricStrip
                items={[
                    { label: "Service area", value: siteConfig.city || "Local" },
                    { label: "Pricing basis", value: "Load size" },
                    { label: "Service type", value: svc.title },
                    { label: "Quote timing", value: "Before loading" },
                ]}
            />
            <DispatchIntroGrid
                eyebrow="Service overview"
                heading={`What to know before booking ${svc.title.toLowerCase()}.`}
                boardEyebrow="Booking prep"
                boardHeading="Details that affect the quote."
                rows={svc.pricingFactors.slice(0, 4).map((factor, index) => ({
                    n: String(index + 1).padStart(2, "0"),
                    title: factor,
                    desc: index === 0 ? "Primary pricing factor" : "Reviewed before loading",
                }))}
            >
                <p>{svc.serviceIntro}</p>
                <p>{svc.fullDesc}</p>
            </DispatchIntroGrid>
            <VisualServiceItemsSection service={svc} />
            <VisualCommonProjects service={svc} />
            <VisualWhoBooks service={svc} />
            <VisualPrepChecklist service={svc} />
            <DispatchCardSection
                eyebrow="Service process"
                heading={`How ${svc.title.toLowerCase()} works.`}
                body="The crew reviews the scope, confirms the quote before loading, and hauls approved items after you accept the final price."
                cards={svc.procesSteps.map((item) => ({ title: item.title, desc: item.desc }))}
                variant="detail-grid"
            />
            <DispatchFaqBoard
                eyebrow="Service FAQ"
                heading={`Questions about ${svc.title.toLowerCase()}.`}
                body={`Answers to common ${svc.title.toLowerCase()} pricing, item, preparation, and pickup questions.`}
                items={svc.faqs}
            />
            <DispatchServiceMosaic
                config={siteConfig}
                currentServiceId={svc.slug}
                eyebrow="Related services"
                heading="Other junk removal services to compare."
            />
            <DispatchFinalCta config={siteConfig} />
        </>
    );
}
