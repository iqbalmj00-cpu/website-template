import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, MapPin } from "lucide-react";
import PageHero from "@/components/redesign/PageHero";
import PageIntro from "@/components/redesign/PageIntro";
import RelatedSvc from "@/components/redesign/RelatedSvc";
import StaticFAQ from "@/components/redesign/StaticFAQ";
import CtaBand from "@/components/redesign/CtaBand";
import { getIndexableLocations } from "@/lib/locationData.server";
import { createPageMetadata, faqPageJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;

const LOCATION_FAQS = [
    { q: `Do you serve all of ${siteConfig.city}?`, a: `${siteConfig.companyName} serves ${siteConfig.city}${siteConfig.state ? `, ${siteConfig.state}` : ""} and nearby communities listed on this page. Service availability can still depend on the exact pickup address and route schedule.` },
    { q: "Can I book if my neighborhood is not listed?", a: "Yes. Use the booking form or call with your address. The team can confirm whether your pickup location is inside the current service area." },
    { q: "Do nearby service areas have separate pages?", a: "Location pages are created for the main city and configured service-area locations that are safe to publish." },
    { q: "Are same-day pickups available in every service area?", a: "Same-day availability depends on route capacity, pickup address, and appointment timing. Same-day copy appears only when same-day service is enabled." },
];

export const metadata: Metadata = createPageMetadata({
    title: `Junk Removal Service Areas in ${cityState}`,
    description: `Junk removal service areas for ${siteConfig.companyName} in ${cityState}. Find local coverage and book online.`,
    path: "/locations",
});

export default function LocationsPage() {
    const locations = getIndexableLocations();

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
                lede={`${siteConfig.companyName} serves configured local areas around ${cityState}. Enter your pickup address when booking to confirm coverage and available windows.`}
            />
            <section className="bg-paper-2 py-[100px] px-[clamp(20px,4vw,64px)]">
                <div className="mx-auto" style={{ maxWidth: 1480 }}>
                    <div className="mb-9 flex max-w-[42rem] flex-col gap-3">
                        <div className="eyebrow">Service areas</div>
                        <h2 className="font-display text-[clamp(36px,4.5vw,56px)] font-extrabold leading-[1.02] tracking-normal text-ink">
                            Choose the closest configured area.
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {locations.map((location, index) => (
                            <Link
                                key={location.slug}
                                href={`/locations/${location.slug}`}
                                className="group relative overflow-hidden rounded-[14px] border border-line bg-paper p-7 text-ink transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:bg-ink hover:text-paper"
                            >
                                <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
                                    {String(index + 1).padStart(2, "0")} · Location
                                </div>
                                <div className="mt-8 flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="font-display text-[26px] font-bold leading-tight">{location.name}</h3>
                                        {location.state && (
                                            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted group-hover:text-paper/70">
                                                {location.state}
                                            </p>
                                        )}
                                    </div>
                                    <MapPin className="h-7 w-7 shrink-0 text-brand" aria-hidden="true" />
                                </div>
                                <p className="mt-5 text-[14.5px] leading-[1.6] text-muted group-hover:text-paper/70">
                                    {location.heroDescription}
                                </p>
                                <span className="mt-6 inline-flex items-center gap-2 font-display text-[14px] font-semibold text-brand">
                                    View area <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            <PageIntro
                eyebrow="Coverage check"
                headline="Configured service areas help customers confirm the right pickup route."
                body={
                    <>
                        <p>
                            Location pages start with the main city and configured service-area communities. Additional
                            neighborhood or landmark details appear only when they have been provided for that location.
                        </p>
                        <p>
                            If an exact neighborhood is not listed, customers can still book or call with the pickup address
                            so coverage can be confirmed before the appointment.
                        </p>
                    </>
                }
                rightEyebrow="Configured facts"
                rightHeading="What drives location pages"
                rightRows={[
                    { n: "01", t: "Main city", d: siteConfig.city },
                    { n: "02", t: "Service area", d: siteConfig.serviceArea || "Configured at launch" },
                    { n: "03", t: "ZIP coverage", d: siteConfig.serviceAreaZips.length ? `${siteConfig.serviceAreaZips.length} ZIP codes` : "Address check during booking" },
                ]}
            />
            <RelatedSvc eyebrow="Available services" heading="Services available across configured areas." />
            <StaticFAQ eyebrow="Location FAQ" heading="Questions about coverage." items={LOCATION_FAQS} />
            <CtaBand />
        </>
    );
}
