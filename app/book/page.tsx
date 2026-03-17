import type { Metadata } from "next";
import { Suspense } from "react";
import BookingWizard from "@/components/BookingWizard";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
    title: `Book Junk Removal in ${siteConfig.city} | ${siteConfig.companyName}`,
    description: `Schedule junk removal or rent a dumpster with ${siteConfig.companyName} in ${siteConfig.serviceArea}. Fast, easy online booking. Same-day service available.`,
    alternates: { canonical: "/book" },
};

export default function BookPage() {
    return <Suspense><BookingWizard /></Suspense>;
}
