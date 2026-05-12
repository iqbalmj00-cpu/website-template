import type { Metadata } from "next";
import { Suspense } from "react";
import BookingWizard from "@/components/BookingWizard";
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
        <Suspense fallback={<main style={{ minHeight: "60vh" }} />}>
            <BookingWizard />
        </Suspense>
    );
}
