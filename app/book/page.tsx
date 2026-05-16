import type { Metadata } from "next";
import { Suspense } from "react";
import BookingWizard from "@/components/BookingWizard";
import PageHero from "@/components/redesign/PageHero";
import StaticFAQ from "@/components/redesign/StaticFAQ";
import CtaBand from "@/components/redesign/CtaBand";
import { createPageMetadata, faqPageJsonLd } from "@/lib/seo";
import { formatPhone, siteConfig } from "@/lib/siteConfig";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;

export const metadata: Metadata = createPageMetadata({
    title: `Book Junk Removal in ${cityState}`,
    description: `Book junk removal with ${siteConfig.companyName} in ${cityState}. Share pickup details and review the final price before loading begins.`,
    path: "/book",
});
const BOOKING_FAQS = [
    { q: "What information do I need to book junk removal?", a: "Share the pickup address, item list, photos when available, access notes, and preferred pickup window." },
    { q: "Is the online estimate the final price?", a: "The crew confirms the final price before loading begins, after reviewing item volume, access, weight, and any handling requirements." },
    { q: "Can I book if I am not sure which service to choose?", a: "Yes. Choose the closest service type and include notes about the full job. The crew can review the scope before loading." },
    { q: "Can I call before booking?", a: `Yes. Call ${siteConfig.companyName} at ${formatPhone(siteConfig.phoneNumber)} if you want to ask questions before scheduling.` },
];

export default function BookPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(BOOKING_FAQS, "/book")) }}
            />
            <PageHero
                crumbs={[
                    { label: "Home", href: "/" },
                    { label: "Book" },
                ]}
                eyebrow="Booking path"
                titleStart="Show the job details. "
                titleAccent="Get the estimate path."
                lede={`Book junk removal with ${siteConfig.companyName} in ${cityState}. Share the pickup address, item list, photos when available, and access notes so the job can be scoped clearly.`}
                hideTrustPanel
                primaryCta={{ label: "Start Below", href: "#booking-wizard" }}
            />
            <section id="booking-wizard" className="bg-paper-2 border-t border-line">
                <Suspense fallback={<main style={{ minHeight: "60vh" }} />}>
                    <BookingWizard />
                </Suspense>
            </section>
            <StaticFAQ eyebrow="Booking FAQ" heading="Questions before you book." items={BOOKING_FAQS} />
            <CtaBand
                heading={{ lead: "Need help before booking?", accent: "Call or send details." }}
                lede={`Use the booking wizard for the cleanest quote details, or call ${formatPhone(siteConfig.phoneNumber)} with questions about your pickup.`}
            />
        </>
    );
}
