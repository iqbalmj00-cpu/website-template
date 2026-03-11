import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import BookingLookupClient from "./BookingLookupClient";

export const metadata: Metadata = {
    title: `Check Your Booking | ${siteConfig.companyName}`,
    description: `Look up your junk removal booking status with ${siteConfig.companyName}. Enter your phone number to see appointment details.`,
    alternates: { canonical: "/booking-details" },
    robots: { index: false, follow: false },
};

export default function BookingDetailsPage() {
    return <BookingLookupClient />;
}
