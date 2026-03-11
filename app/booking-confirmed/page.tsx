import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import BookingConfirmedClient from "./BookingConfirmedClient";

export const metadata: Metadata = {
    title: `Booking Confirmed | ${siteConfig.companyName}`,
    description: `Your junk removal booking with ${siteConfig.companyName} has been confirmed.`,
};

export default function BookingConfirmedPage() {
    return <BookingConfirmedClient />;
}
