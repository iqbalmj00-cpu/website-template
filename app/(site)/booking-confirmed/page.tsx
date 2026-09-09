import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import BookingConfirmedClient from "./BookingConfirmedClient";

export const metadata: Metadata = {
    title: `Booking Receipt | ${siteConfig.companyName}`,
    description: `Review the saved service responses for your request with ${siteConfig.companyName}.`,
    robots: { index: false, follow: false },
};

export default function BookingConfirmedPage() {
    return <BookingConfirmedClient />;
}
