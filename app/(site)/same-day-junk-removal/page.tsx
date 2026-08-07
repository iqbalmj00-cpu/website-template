import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/redesign/PageHero";
import StaticFAQ from "@/components/redesign/StaticFAQ";
import CtaBand from "@/components/redesign/CtaBand";
import { DispatchCardSection } from "@/components/redesign/DispatchBlocks";
import { breadcrumbJsonLd, createPageMetadata, faqPageJsonLd, serviceJsonLd } from "@/lib/seo";
import { formatPhone, isSameDayEnabled, siteConfig } from "@/lib/siteConfig";

const pagePath = "/same-day-junk-removal";
const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Same-Day Junk Removal", href: pagePath },
];
const SAME_DAY_FAQS = [
    { q: "Is same-day junk removal guaranteed?", a: "No. Same-day pickup depends on route capacity, booking time, pickup address, item type, and crew availability." },
    { q: "What jobs are best for same-day pickup?", a: "Smaller item lists, curbside piles, furniture pickup, appliance pickup, and cleanouts with clear access are usually easier to review for same-day availability." },
    { q: "Can pricing change for same-day service?", a: "Pricing is still confirmed before loading begins. Any scheduling, access, material, or disposal fees should be reviewed before work starts." },
    { q: "What should I include when booking today?", a: "Include the service type, load size, pickup address, and access notes such as stairs, gates, elevators, or parking limits." },
];

export const metadata: Metadata = createPageMetadata({
    title: `Same-Day Junk Removal in ${siteConfig.city}`,
    description: `Same-day junk removal in ${siteConfig.city} from ${siteConfig.companyName}, available only when schedule capacity allows. Book Now or call for today's pickup windows.`,
    path: pagePath,
    noIndex: !isSameDayEnabled(),
});

export default function SameDayJunkRemovalPage() {
    if (!isSameDayEnabled()) notFound();

    const availabilityCards = [
        {
            title: "Route capacity matters",
            desc: "Same-day availability depends on the current schedule, route capacity, and when the request is submitted.",
        },
        {
            title: "Job details help confirm space",
            desc: "Load size, pickup address, access location, and special handling notes help the team review the request.",
        },
        {
            title: "Final price is reviewed",
            desc: "Pricing is still confirmed before loading begins, even when the appointment is requested for today.",
        },
        {
            title: "Prohibited items still apply",
            desc: "Hazardous, flammable, medical, and regulated materials are not accepted through standard service.",
            href: "/items-we-dont-take",
        },
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        breadcrumbJsonLd(breadcrumbs.map(item => ({ name: item.label, path: item.href }))),
                        serviceJsonLd({
                            service: {
                                title: "Same-Day Junk Removal",
                                shortDesc: `Same-day junk removal in ${siteConfig.city} when schedule capacity is available.`,
                            },
                            path: pagePath,
                            description: `Same-day junk removal in ${siteConfig.city} when schedule capacity is available.`,
                        }),
                        faqPageJsonLd(SAME_DAY_FAQS, pagePath),
                    ]),
                }}
            />
            <PageHero
                crumbs={breadcrumbs}
                eyebrow="Schedule-dependent"
                titleStart="Same-day junk removal"
                titleAccent={` in ${siteConfig.city}.`}
                lede={`${siteConfig.companyName} offers same-day pickup when schedule capacity is available. Use the booking flow or call to check today's open windows before crews are routed.`}
                primaryCta={{ label: "Book Now", href: "/book" }}
            />
            <DispatchCardSection
                eyebrow="Availability rules"
                heading="Same-day service depends on real route capacity."
                body="These checks keep the page accurate for clients that enable same-day pickup."
                cards={availabilityCards}
                variant="coverage-cards"
            />
            <StaticFAQ eyebrow="Same-day FAQ" heading="Questions about same-day junk removal." items={SAME_DAY_FAQS} />
            <CtaBand
                heading={{ lead: "Need junk removed", accent: "today?" }}
                lede={`Use the booking flow or call ${formatPhone(siteConfig.phoneNumber)} to see whether a pickup window is available in ${siteConfig.city}.`}
            />
        </>
    );
}
