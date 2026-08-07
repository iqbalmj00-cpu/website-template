import type { Metadata } from "next";
import PageHero from "@/components/redesign/PageHero";
import ContactForm from "@/components/redesign/ContactForm";
import NapHours from "@/components/redesign/NapHours";
import StaticFAQ from "@/components/redesign/StaticFAQ";
import CtaBand from "@/components/redesign/CtaBand";
import { notFound } from "next/navigation";
import { createPageMetadata, faqPageJsonLd, localBusinessJsonLd } from "@/lib/seo";
import { formatPhone, siteConfig } from "@/lib/siteConfig";
import { shouldRenderContactPage } from "@/lib/visibility";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;

const CONTACT_FAQS = [
    { q: "What is the fastest way to get a junk removal quote?", a: "Booking online with service type, load size, pickup address, and access notes usually gives the team the clearest information before the appointment." },
    { q: "Can I call instead of using the form?", a: `Yes. You can call ${siteConfig.companyName} at ${formatPhone(siteConfig.phoneNumber)} to ask questions or book over the phone.` },
    { q: "What should I include in my message?", a: "Include the pickup address, load details, access details, preferred timing, and any stairs, elevators, gates, or parking limits." },
    { q: "How do I confirm service-area coverage?", a: "Use the booking form or call with your address. The team can confirm whether your pickup location is inside the current service area." },
];

export const metadata: Metadata = createPageMetadata({
    title: `Contact ${siteConfig.companyName}`,
    description: `Contact ${siteConfig.companyName} for junk removal near you in ${cityState}. Call, book online, or send a message.`,
    path: "/contact",
});

export default function ContactPage() {
    // No connected mailbox means no destination for a message. 404 rather than
    // render a form whose submissions nobody will ever see.
    if (!shouldRenderContactPage()) notFound();

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([localBusinessJsonLd(), faqPageJsonLd(CONTACT_FAQS, "/contact")]) }}
            />
            <PageHero
                crumbs={[
                    { label: "Home", href: "/" },
                    { label: "Contact" },
                ]}
                titleStart={`Contact ${siteConfig.companyName} `}
                titleAccent={`in ${siteConfig.city}.`}
                lede={`Start a junk removal quote for ${cityState}. Use the booking flow for the cleanest pickup details, or call with questions before scheduling.`}
            />
            <ContactForm />
            <NapHours />
            <StaticFAQ eyebrow="Contact FAQ" heading="What to include before pickup." items={CONTACT_FAQS} tone="paper-2" />
            <CtaBand />
        </>
    );
}
