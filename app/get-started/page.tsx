import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import GetStartedForm from "./GetStartedForm";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;

export const metadata: Metadata = {
    title: `Get a Free Junk Removal Quote in ${cityState} | ${siteConfig.companyName}`,
    description: `Request a free, no-obligation junk removal quote from ${siteConfig.companyName} in ${cityState}. Same-day service available. Book in minutes.`,
    alternates: { canonical: "/get-started" },
};

export default function GetStartedPage() {
    return <GetStartedForm />;
}
