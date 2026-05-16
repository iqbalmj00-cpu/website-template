import type { Metadata } from "next";
import { Suspense } from "react";
import BookingWizard from "@/components/BookingWizard";
import PageHero from "@/components/redesign/PageHero";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;

export const metadata: Metadata = createPageMetadata({
    title: `Book Junk Removal in ${cityState}`,
    description: `Book junk removal with ${siteConfig.companyName} in ${cityState}. Share pickup details and review the final price before loading begins.`,
    path: "/book",
});

export default function BookPage() {
    return (
        <>
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
        </>
    );
}
