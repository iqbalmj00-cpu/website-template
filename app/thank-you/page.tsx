import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import ThankYouClient from "./ThankYouClient";

export const metadata: Metadata = {
    title: `Thank You | ${siteConfig.companyName}`,
    description: `Thank you for booking junk removal with ${siteConfig.companyName}. We'll be in touch shortly.`,
};

export default function ThankYouPage() {
    return <ThankYouClient />;
}
