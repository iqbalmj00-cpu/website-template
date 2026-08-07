import { absoluteUrl, formatPhone, isSameDayEnabled, siteConfig } from "@/lib/siteConfig";
import { getCostGuides } from "@/lib/costData";
import { getIndexableLocations } from "@/lib/locationData.server";
import { getClientServices } from "@/lib/serviceData";
import { canExposePublicSite } from "@/lib/publicSiteGuard";
import { hasVerifiedPublicReviews } from "@/lib/reviewData";
import { shouldRenderContactPage } from "@/lib/visibility";

export const dynamic = "force-static";

function line(label: string, value: string | null | undefined): string | null {
    const clean = value?.trim();
    return clean ? `${label}: ${clean}` : null;
}

export async function GET() {
    if (!canExposePublicSite()) {
        return new Response("Not Found\n", {
            status: 404,
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-store",
            },
        });
    }

    const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;
    const services = getClientServices();
    const locations = getIndexableLocations();
    const costGuides = getCostGuides();
    const showReviews = await hasVerifiedPublicReviews();

    const primaryPages = [
        ["Home", "/"],
        ["Book Now", "/book"],
        ["Services", "/services"],
        ["Service areas", "/locations"],
        ["Pricing", "/pricing"],
        ["Cost guides", "/cost"],
        ["FAQ", "/faq"],
        ["Items we take", "/items-we-take"],
        ["Items we do not take", "/items-we-dont-take"],
        ["How it works", "/how-it-works"],
        ["Commercial junk removal", "/commercial"],
        ...(shouldRenderContactPage() ? [["Contact", "/contact"] as const] : []),
        ["About", "/about"],
        ...(showReviews ? [["Reviews", "/reviews"] as const] : []),
        ["Best junk removal guide", "/best-junk-removal"],
        ...(isSameDayEnabled() ? [["Same-day junk removal", "/same-day-junk-removal"]] : []),
        ...(siteConfig.offersDumpsterRental ? [
            ["Dumpster rental", "/dumpster-rental"],
            ["Junk removal vs dumpster rental", "/junk-removal-vs-dumpster-rental"],
        ] : []),
    ] as const;

    const sections = [
        `# ${siteConfig.companyName} AI Site Guide`,
        "",
        "## Business Summary",
        ...[
            line("Company", siteConfig.companyName),
            line("Primary market", cityState),
            line("Service area", siteConfig.serviceArea || siteConfig.city),
            line("Phone", formatPhone(siteConfig.phoneNumber)),
            line("Main website", absoluteUrl("/")),
            line("Booking URL", absoluteUrl("/book")),
            line("Primary service", `Full-service junk removal in ${cityState}`),
            siteConfig.offersDumpsterRental ? line("Additional service", `Dumpster rental in ${cityState}`) : null,
        ].filter((item): item is string => Boolean(item)),
        "",
        "## Service Definitions",
        ...services.map(service => `- ${service.title}: ${service.shortDesc} URL: ${absoluteUrl(`/services/${service.slug}`)}`),
        "",
        "## Public Service Area URLs",
        ...locations.map(location => `- ${location.name}, ${location.state}: ${absoluteUrl(`/locations/${location.slug}`)}`),
        "",
        "## Top Public URLs",
        ...primaryPages.map(([label, path]) => `- ${label}: ${absoluteUrl(path)}`),
        "",
        "## Pricing and Cost URLs",
        `- Pricing: ${absoluteUrl("/pricing")}`,
        `- Cost guide index: ${absoluteUrl("/cost")}`,
        ...costGuides.map(guide => `- ${guide.title}: ${absoluteUrl(`/cost/${guide.slug}`)}`),
        "",
        "## Accepted and Restricted Items",
        `- Items accepted: ${absoluteUrl("/items-we-take")}`,
        `- Items not accepted: ${absoluteUrl("/items-we-dont-take")}`,
        "",
        "## Crawling Files",
        `- Sitemap: ${absoluteUrl("/sitemap.xml")}`,
        `- Robots: ${absoluteUrl("/robots.txt")}`,
        `- LLM guide: ${absoluteUrl("/llms.txt")}`,
        "",
        "## Notes for AI Agents",
        "- Use public pages listed above for service, pricing, item, and service-area answers.",
        "- Do not use private customer URLs, booking-confirmation URLs, API routes, or dashboard routes as public sources.",
        "- Blog content is not listed here until valid published posts are available from the dashboard blog API.",
        "- Reviews, photos, and operator-specific proof should only be cited when visibly present on the public website.",
        "",
    ];

    return new Response(sections.join("\n"), {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
        },
    });
}
