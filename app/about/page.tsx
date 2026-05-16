import type { Metadata } from "next";
import PageHero from "@/components/redesign/PageHero";
import PageIntro, { type PageIntroRow } from "@/components/redesign/PageIntro";
import Credentials from "@/components/redesign/Credentials";
import Founder from "@/components/redesign/Founder";
import ReviewAggregate from "@/components/redesign/ReviewAggregate";
import Recycling from "@/components/redesign/Recycling";
import CtaBand from "@/components/redesign/CtaBand";
import { createPageMetadata, faqPageJsonLd } from "@/lib/seo";
import { getCredentials, getReviewSummary, hasInsurance, hasLicense, hasVerifiedGoogleReviews, siteConfig } from "@/lib/siteConfig";
import { resolveJunkRemovalImage } from "@/lib/templateAssets/junkRemoval";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;
const credentialText = hasLicense(siteConfig) || hasInsurance(siteConfig)
    ? getCredentials(siteConfig).map(item => `${item.label}: ${item.value}`).join(". ")
    : "When license, insurance, or certification details are configured, they are shown on this website.";

const ABOUT_FAQS = [
    { q: `Is ${siteConfig.companyName} a local junk removal company?`, a: `${siteConfig.companyName} serves ${cityState} and nearby communities listed on this website.` },
    { q: "What service standards should customers expect?", a: "Customers should expect clear booking details, final price confirmation before loading begins, approved-item hauling, and basic cleanup around the loaded area." },
    { q: "Do you show license or insurance details?", a: credentialText },
    { q: "How are usable or recyclable items handled?", a: "Usable or recyclable items are routed responsibly when local options are available for the item type and schedule." },
];

export const revalidate = 3600;

export const metadata: Metadata = createPageMetadata({
    title: `About ${siteConfig.companyName}`,
    description: `Learn about ${siteConfig.companyName}, a junk removal service serving ${cityState} with online booking and final price confirmation before loading.`,
    path: "/about",
    image: resolveJunkRemovalImage({
        config: siteConfig,
        role: "crewAbout",
        routeKey: "about-meta",
        overrideSrc: siteConfig.aboutImageUrl,
    }).src,
});

function aboutRows(): PageIntroRow[] {
    const rows: PageIntroRow[] = [];
    const reviewSummary = hasVerifiedGoogleReviews(siteConfig) ? getReviewSummary(siteConfig) : null;

    if (siteConfig.yearFounded) {
        rows.push({ n: "01", t: `Established ${siteConfig.yearFounded}`, d: siteConfig.city ? `Serving ${siteConfig.city}` : "Configured company history" });
    }
    if (reviewSummary) {
        rows.push({ n: String(rows.length + 1).padStart(2, "0"), t: `${reviewSummary.totalCount.toLocaleString()} Google reviews`, d: `${reviewSummary.averageRating.toFixed(1)} average rating` });
    }
    if (siteConfig.serviceAreaZips.length > 0) {
        rows.push({ n: String(rows.length + 1).padStart(2, "0"), t: `${siteConfig.serviceAreaZips.length} ZIP codes`, d: "Configured service coverage" });
    }

    return rows;
}

export default function AboutPage() {
    const rows = aboutRows();

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(ABOUT_FAQS, "/about")) }}
            />
            <PageHero
                crumbs={[
                    { label: "Home", href: "/" },
                    { label: "About" },
                ]}
                titleStart={`About ${siteConfig.companyName}, `}
                titleAccent={`serving ${siteConfig.city}.`}
                lede={siteConfig.tagline || `Junk removal service for ${cityState} and nearby communities listed on this website.`}
                media={{
                    role: "crewAbout",
                    src: siteConfig.aboutImageUrl,
                    routeKey: "about",
                    caption: "Crew profile",
                }}
            />
            <Credentials />
            <PageIntro
                eyebrow="Company profile"
                headline={`${siteConfig.companyName} keeps junk removal clear from quote to haul-away.`}
                body={
                    <>
                        <p>
                            Customers should know what is being removed, when the crew is scheduled, and what the final
                            price is before loading begins.
                        </p>
                        <p>
                            This website only displays company facts, credentials, reviews, and sustainability targets when
                            they are configured through the launch data for this client.
                        </p>
                    </>
                }
                rightEyebrow="Verified details"
                rightHeading={`${siteConfig.companyName} at a glance`}
                rightRows={rows.length > 0 ? rows : undefined}
            />
            <Founder />
            <ReviewAggregate />
            <Recycling />
            <section className="bg-paper-2 py-[100px] px-[clamp(20px,4vw,64px)]">
                <div className="mx-auto" style={{ maxWidth: 980 }}>
                    <div className="mb-7 text-center">
                        <div className="eyebrow inline-flex">Company questions</div>
                        <h2 className="mt-3 font-display text-[clamp(34px,4.5vw,52px)] font-extrabold leading-[1.03] tracking-normal text-ink">
                            Questions about the company.
                        </h2>
                    </div>
                    <div className="overflow-hidden rounded-[14px] border border-line bg-paper">
                        {ABOUT_FAQS.map((faq) => (
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
            <CtaBand />
        </>
    );
}
