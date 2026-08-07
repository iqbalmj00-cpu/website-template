import type { Metadata } from "next";
import PageHero from "@/components/redesign/PageHero";
import PageIntro from "@/components/redesign/PageIntro";
import RelatedSvc from "@/components/redesign/RelatedSvc";
import StaticFAQ from "@/components/redesign/StaticFAQ";
import CtaBand from "@/components/redesign/CtaBand";
import { createPageMetadata, faqPageJsonLd } from "@/lib/seo";
import { getClientServices } from "@/lib/serviceData";
import { siteConfig } from "@/lib/siteConfig";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;

const SERVICE_OVERVIEW_FAQS = [
    { q: `What junk removal services are available in ${siteConfig.city}?`, a: `${siteConfig.companyName} lists the junk removal services available for this location on this page. Availability depends on the pickup address, item type, and schedule.` },
    { q: "Can approved items be removed from inside a home or business?", a: "Yes. Approved items can usually be removed from inside rooms, garages, storage units, offices, yards, and job sites when access is safe and clear." },
    { q: "How do I know which service page to choose?", a: "Choose the closest matching service, or use the general junk removal option if your job includes mixed items. The crew can review the full scope before loading begins." },
    { q: "Do you handle residential and commercial jobs?", a: "Residential junk removal is available for homes, apartments, garages, and cleanouts. Commercial service is available when the job type and service area are supported." },
];

export const metadata: Metadata = createPageMetadata({
    title: `Junk Removal Services in ${cityState}`,
    description: `Need junk removal near you in ${cityState}? ${siteConfig.companyName} lists available services for furniture, appliances, yard waste, construction debris, cleanouts, and more.`,
    path: "/services",
});

export default function ServicesPage() {
    const services = getClientServices();

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(SERVICE_OVERVIEW_FAQS, "/services")) }} />
            <PageHero
                crumbs={[
                    { label: "Home", href: "/" },
                    { label: "Services" },
                ]}
                titleStart="Everything we haul, "
                titleAccent="in one place."
                lede={`${services.length > 0 ? `${services.length} junk removal service categories.` : "Junk removal service categories."} One booking flow for approved item removal, cleanouts, debris hauling, and junk removal projects in ${cityState}.`}
            />
            <RelatedSvc
                eyebrow="Junk removal services"
                heading="Choose the closest match for the job."
                tone="paper-2"
                limit={Math.max(services.length, 6)}
            />
            <PageIntro
                eyebrow="How to choose"
                headline="Choose the closest junk removal service for your job."
                body={
                    <>
                        <p>
                            Pick the service that best matches the items or cleanup project. If the job includes several categories,
                            choose the closest option and include the load details, pickup address, and access notes.
                        </p>
                        <p>
                            The crew confirms the final scope and price before loading begins, based on the actual item volume,
                            weight, access, and any handling requirements.
                        </p>
                    </>
                }
                rightEyebrow="Before pickup"
                rightHeading="Details that help the quote"
                rightRows={[
                    { n: "01", t: "Service type", d: "Closest match for the job" },
                    { n: "02", t: "Load details", d: "Volume and accepted items" },
                    { n: "03", t: "Access notes", d: "Stairs, gates, elevators, or parking" },
                ]}
            />
            <StaticFAQ
                eyebrow="Service questions"
                heading="Common questions before choosing a service."
                items={SERVICE_OVERVIEW_FAQS}
            />
            <CtaBand />
        </>
    );
}
