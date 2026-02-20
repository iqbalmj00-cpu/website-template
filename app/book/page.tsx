import type { Metadata } from "next";
import BookingWizard from "@/components/BookingWizard";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
    title: `Book a Pickup | ${siteConfig.companyName}`,
    description: `Schedule your junk removal pickup with ${siteConfig.companyName} in ${siteConfig.serviceArea}. Fast, easy online booking.`,
};

export default function BookPage() {
    return <BookingWizard />;
}
