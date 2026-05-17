import type { Metadata } from "next";
import PageHero from "@/components/redesign/PageHero";
import PageIntro from "@/components/redesign/PageIntro";
import RelatedSvc from "@/components/redesign/RelatedSvc";
import StaticFAQ from "@/components/redesign/StaticFAQ";
import CtaBand from "@/components/redesign/CtaBand";
import { DispatchCardSection } from "@/components/redesign/DispatchBlocks";
import { getIndexableLocations } from "@/lib/locationData.server";
import { createPageMetadata, faqPageJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;

const LOCATION_FAQS = [
    { q: `Do you serve all of ${siteConfig.city}?`, a: `${siteConfig.companyName} serves ${siteConfig.city}${siteConfig.state ? `, ${siteConfig.state}` : ""} and nearby communities listed on this page. Service availability can still depend on the exact pickup address and route schedule.` },
    { q: "Can I book if my neighborhood is not listed?", a: "Yes. Use the booking form or call with your address. The team can confirm whether your pickup location is inside the current service area." },
    { q: "Do nearby service areas have separate pages?", a: "Location pages are created for the main city and service-area communities that are safe to publish." },
    { q: "Are same-day pickups available in every service area?", a: "Same-day availability depends on route capacity, pickup address, and appointment timing. Same-day information appears only when same-day service is offered." },
];

export const metadata: Metadata = createPageMetadata({
    title: `Junk Removal Service Areas in ${cityState}`,
    description: `Junk removal service areas for ${siteConfig.companyName} in ${cityState}. Find local coverage and book online.`,
    path: "/locations",
});

export default function LocationsPage() {
    const locations = getIndexableLocations();
    const locationCards = locations.map((location, index) => ({
        eyebrow: `${String(index + 1).padStart(2, "0")} / Location`,
        title: location.name,
        desc: location.heroDescription,
        href: `/locations/${location.slug}`,
        actionLabel: "View area",
    }));

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(LOCATION_FAQS, "/locations")) }}
            />
            <PageHero
                crumbs={[
                    { label: "Home", href: "/" },
                    { label: "Locations" },
                ]}
                titleStart="Junk removal "
                titleAccent={`near ${siteConfig.city}.`}
                lede={`${siteConfig.companyName} serves local areas around ${cityState}. Enter your pickup address when booking to confirm coverage and available windows.`}
            />
            <DispatchCardSection
                eyebrow="Service areas"
                heading="Choose the closest service area."
                body="Location pages are generated for public service areas that are safe to show. Exact address coverage is confirmed during booking."
                cards={locationCards}
                variant="service-links"
                alt
            />
            <PageIntro
                eyebrow="Coverage check"
                headline="Service areas help customers confirm the right pickup route."
                body={
                    <>
                        <p>
                            Location pages start with the main city and service-area communities. Additional
                            neighborhood or landmark details appear only when they have been provided for that location.
                        </p>
                        <p>
                            If an exact neighborhood is not listed, customers can still book or call with the pickup address
                            so coverage can be confirmed before the appointment.
                        </p>
                    </>
                }
                rightEyebrow="Coverage details"
                rightHeading="What drives location pages"
                rightRows={[
                    { n: "01", t: "Main city", d: siteConfig.city },
                    { n: "02", t: "Service area", d: siteConfig.serviceArea || "Address check during booking" },
                    { n: "03", t: "ZIP coverage", d: siteConfig.serviceAreaZips.length ? `${siteConfig.serviceAreaZips.length} ZIP codes` : "Address check during booking" },
                ]}
            />
            <RelatedSvc eyebrow="Available services" heading="Services available across local service areas." />
            <StaticFAQ eyebrow="Location FAQ" heading="Questions about coverage." items={LOCATION_FAQS} />
            <CtaBand />
        </>
    );
}
