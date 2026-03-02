import type { Metadata } from "next";
import BookingWizard from "@/components/BookingWizard";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
    title: `Book Online | ${siteConfig.companyName}`,
    description: `Schedule junk removal or rent a dumpster with ${siteConfig.companyName} in ${siteConfig.serviceArea}. Fast, easy online booking.`,
};

export default function BookPage() {
    return <BookingWizard />;
}
