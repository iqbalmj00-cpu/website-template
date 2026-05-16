import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarClock, CheckCircle, Phone } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import StaticFAQ from "@/components/redesign/StaticFAQ";
import CtaBand from "@/components/redesign/CtaBand";
import { breadcrumbJsonLd, createPageMetadata, faqPageJsonLd, serviceJsonLd } from "@/lib/seo";
import { formatPhone, isSameDayEnabled, siteConfig, telHref } from "@/lib/siteConfig";

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

    const availabilityRules = [
        "Availability depends on route capacity and booking time.",
        "Load details and access notes help confirm the right truck space.",
        "Final pricing is confirmed before the crew loads anything.",
        "Hazardous or prohibited materials are not accepted.",
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
            <Breadcrumbs items={breadcrumbs} />

            <section style={{ background: "var(--hero-bg)", padding: "5rem 1.5rem 4rem", textAlign: "center" }}>
                <div style={{ maxWidth: 820, margin: "0 auto" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.4rem 0.85rem", borderRadius: "var(--btn-radius)", background: "var(--hero-badge-bg)", border: "1px solid var(--hero-badge-border)", color: "var(--brand)", fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1.25rem" }}>
                        <CalendarClock size={15} /> Schedule-Dependent
                    </span>
                    <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", lineHeight: 1.05, fontWeight: 900, color: "var(--hero-text)", marginBottom: "1rem" }}>
                        Same-Day Junk Removal in {siteConfig.city}
                    </h1>
                    <p style={{ color: "var(--hero-muted)", fontSize: "1.13rem", lineHeight: 1.75, maxWidth: 680, margin: "0 auto" }}>
                        {siteConfig.companyName} offers same-day pickup when schedule capacity is available. Use the booking flow or call to check today&apos;s open windows before crews are routed.
                    </p>
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginTop: "2rem" }}>
                        <Link href="/book" className="btn-primary">
                            Book Now <ArrowRight size={18} />
                        </Link>
                        <a href={telHref(siteConfig.phoneNumber)} className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                            <Phone size={18} /> Call Us
                        </a>
                    </div>
                </div>
            </section>

            <section style={{ padding: "4.5rem 1.5rem", background: "var(--background)" }}>
                <div style={{ maxWidth: 980, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "1rem" }}>
                    {availabilityRules.map((rule) => (
                        <div key={rule} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "1.25rem", display: "flex", gap: "0.8rem", alignItems: "flex-start" }}>
                            <CheckCircle size={20} style={{ color: "var(--brand)", flexShrink: 0, marginTop: 2 }} />
                            <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>{rule}</p>
                        </div>
                    ))}
                </div>
            </section>
            <StaticFAQ eyebrow="Same-day FAQ" heading="Questions about same-day junk removal." items={SAME_DAY_FAQS} />
            <CtaBand
                heading={{ lead: "Need junk removed today?", accent: "Book Now." }}
                lede={`Use the booking flow or call ${formatPhone(siteConfig.phoneNumber)} to see whether a pickup window is available in ${siteConfig.city}.`}
            />
        </>
    );
}
