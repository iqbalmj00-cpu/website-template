import type { Metadata } from "next";
import PageHero from "@/components/redesign/PageHero";
import PageIntro from "@/components/redesign/PageIntro";
import ProcessSection from "@/components/redesign/ProcessSection";
import GroupedFAQ from "@/components/redesign/GroupedFAQ";
import CtaBand from "@/components/redesign/CtaBand";
import { createPageMetadata, faqPageJsonLd, howToJsonLd } from "@/lib/seo";
import { formatPhone, isSameDayEnabled, siteConfig } from "@/lib/siteConfig";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;

const PROCESS_STEPS = [
    {
        name: "Enter contact and service details",
        text: "Start with your name, contact information, service type, load size, pickup address, and access notes.",
    },
    {
        name: "Choose an available window",
        text: "Select an available pickup date and time. Same-day windows only appear when same-day service is offered and schedule capacity allows.",
    },
    {
        name: "Review the quote and submit",
        text: "Review the quote in the booking flow and submit the booking request. The crew confirms final details before loading begins.",
    },
];

const PROCESS_FAQS = [
    { q: "Do I need to move items to the curb?", a: "No. Full-service junk removal can include removal from inside, outside, garages, storage units, offices, or job sites when access is safe." },
    { q: "When is the final price confirmed?", a: "The final price is confirmed before loading begins, after the crew reviews item volume, access, weight, and any applicable handling requirements." },
    { q: "What should I do before the crew arrives?", a: "Separate anything you want to keep, clear a safe path to the items when possible, and mention stairs, elevators, gates, or parking limits when booking." },
    { q: "What happens after loading?", a: "Approved items are hauled away and basic cleanup around the loaded area can be completed when appropriate for the job." },
];

export const metadata: Metadata = createPageMetadata({
    title: `How Junk Removal Works in ${siteConfig.city}`,
    description: `Book junk removal in ${cityState} with ${siteConfig.companyName}: share pickup details, choose an available window, and approve the final quote before loading.`,
    path: "/how-it-works",
});

export default function HowItWorksPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        howToJsonLd({
                            name: `How junk removal works with ${siteConfig.companyName}`,
                            description: `Book junk removal in ${cityState}, choose an available appointment, and approve the final quote before loading.`,
                            steps: PROCESS_STEPS.map((step) => ({
                                name: step.name,
                                text: step.text,
                                url: "/how-it-works",
                            })),
                        }),
                        faqPageJsonLd(PROCESS_FAQS, "/how-it-works"),
                    ]),
                }}
            />
            <PageHero
                crumbs={[
                    { label: "Home", href: "/" },
                    { label: "How It Works" },
                ]}
                titleStart="Start online, "
                titleAccent="then review the quote."
                lede={`Junk removal in ${cityState} should be clear: enter the job details, choose an available pickup window, and review the quote before submitting the booking request.`}
            />
            <ProcessSection />
            <PageIntro
                eyebrow="Before pickup"
                headline="The better the pickup details, the clearer the quote."
                body={
                    <>
                        <p>
                            Add the service type, load size, stairs or elevator notes, parking instructions,
                            and anything that may affect access.
                        </p>
                        <p>
                            Prefer to talk through the job? Call {formatPhone(siteConfig.phoneNumber)} and the team can
                            help confirm what information is needed before booking.
                        </p>
                    </>
                }
                rightEyebrow="Flow"
                rightHeading="Three production steps"
                rightRows={PROCESS_STEPS.map((step, index) => ({
                    n: String(index + 1).padStart(2, "0"),
                    t: step.name,
                    d: index === 1 && isSameDayEnabled(siteConfig) ? "Same-day depends on capacity" : "Visible in the booking flow",
                }))}
            />
            <section className="bg-paper-2 py-[100px] px-[clamp(20px,4vw,64px)]">
                <div className="mx-auto" style={{ maxWidth: 980 }}>
                    <div className="mb-7 text-center">
                        <div className="eyebrow inline-flex">Process FAQ</div>
                        <h2 className="mt-3 font-display text-[clamp(34px,4.5vw,52px)] font-extrabold leading-[1.03] tracking-normal text-ink">
                            Questions about pickup day.
                        </h2>
                    </div>
                    <div className="overflow-hidden rounded-[14px] border border-line bg-paper">
                        {PROCESS_FAQS.map((faq) => (
                            <details key={faq.q} className="border-b border-line last:border-b-0">
                                <summary className="cursor-pointer px-6 py-5 font-display text-[19px] font-semibold text-ink">
                                    {faq.q}
                                </summary>
                                <div className="px-6 pb-6 text-[15.5px] leading-[1.6] text-muted">{faq.a}</div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
            <GroupedFAQ eyebrow="More questions" heading="More details before booking." />
            <CtaBand />
        </>
    );
}
