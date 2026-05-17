import type { Metadata } from "next";
import PageHero from "@/components/redesign/PageHero";
import StaticFAQ from "@/components/redesign/StaticFAQ";
import CtaBand from "@/components/redesign/CtaBand";
import { DispatchCardSection } from "@/components/redesign/DispatchBlocks";
import { createPageMetadata, faqPageJsonLd } from "@/lib/seo";
import { getClientServices } from "@/lib/serviceData";
import { getVerifiableTrustSignals, siteConfig } from "@/lib/siteConfig";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;
const FAQS = [
    { q: "Can you take one bulky item?", a: "Yes. Single-item pickups can be used for couches, mattresses, appliances, TVs, exercise equipment, and other bulky items, subject to the minimum charge and route availability." },
    { q: "Can you remove items from inside the house?", a: "Yes. The crew can remove approved items from inside the home, garage, basement, attic, office, storage unit, or yard when access is safe." },
    { q: "What happens if an item is not accepted?", a: "If an item is hazardous, regulated, or unsafe to haul, it should not be loaded. Use the Items We Don't Take page to review restricted materials before booking." },
    { q: "Do I need to sort everything first?", a: "Separate anything you want to keep and group smaller loose items when possible. Large items can usually stay where they are until the crew reviews the job." },
];

export const metadata: Metadata = createPageMetadata({
    title: `Items We Haul Away in ${siteConfig.city}`,
    description: `See items ${siteConfig.companyName} can haul away in ${cityState}: furniture, appliances, yard waste, construction debris, electronics, and more.`,
    path: "/items-we-take",
});

export default function ItemsWeTakePage() {
    const trustSignals = getVerifiableTrustSignals();

    const generalItems = [
        { cat: "Furniture", items: ["Sofas & Couches", "Mattresses & Beds", "Tables & Chairs", "Dressers & Desks", "Bookshelves", "Patio Furniture"] },
        { cat: "Appliances", items: ["Refrigerators", "Washers & Dryers", "Ovens & Stoves", "Dishwashers", "Water Heaters", "A/C Units"] },
        { cat: "Electronics", items: ["TVs & Monitors", "Computers & Laptops", "Printers", "Speakers & Stereos", "Gaming Consoles", "Old Cables"] },
        { cat: "Yard & Outdoor", items: ["Branches & Limbs", "Soil & Dirt", "Old Fencing", "Swing Sets", "Trampolines", "Hot Tubs"] },
        { cat: "Construction", items: ["Drywall", "Lumber & Wood", "Tile & Flooring", "Carpet", "Roofing Shingles", "Concrete (small)"] },
        { cat: "Miscellaneous", items: ["Tires", "Bikes & Scooters", "Exercise Equipment", "Old Paint Cans (dried)", "Clothing", "Books & Magazines"] },
    ];
    const serviceDescriptions: Record<string, string> = {
        "furniture-removal": "Couches, mattresses, beds, dressers, tables, desks, and patio furniture.",
        "appliance-removal": "Refrigerators, washers, dryers, stoves, dishwashers, and water heaters.",
        "construction-debris": "Drywall, lumber, flooring, tile, carpet, roofing, and small heavy debris.",
        "garage-cleanout": "Boxes, tools, shelving, old equipment, seasonal clutter, and mixed junk.",
        "yard-waste-removal": "Branches, brush, bagged leaves, soil, mulch, fencing, and outdoor debris.",
        "estate-cleanout": "Furniture, boxes, household goods, garage items, and full-property cleanout debris.",
    };
    const prioritizedServiceLinks = getClientServices()
        .filter(service => serviceDescriptions[service.slug])
        .slice(0, 4);
    const serviceLinks = prioritizedServiceLinks.length > 0 ? prioritizedServiceLinks : getClientServices().slice(0, 4);
    const itemCards = generalItems.map((cat) => ({
        eyebrow: "Accepted category",
        title: cat.cat,
        desc: cat.items.join(", "),
    }));
    const serviceCards = serviceLinks.map((service) => ({
        eyebrow: "Related service",
        title: service.title,
        desc: serviceDescriptions[service.slug] || service.shortDesc,
        href: `/services/${service.slug}`,
    }));
    const trustCards = trustSignals.map((signal, index) => ({
        eyebrow: `Standard ${String(index + 1).padStart(2, "0")}`,
        title: signal,
        desc: "Shown only when this business has configured the matching trust detail.",
    }));

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(FAQS, "/items-we-take")) }}
            />
            <PageHero
                crumbs={[
                    { label: "Home", href: "/" },
                    { label: "Items We Take" },
                ]}
                eyebrow="Accepted items"
                titleStart="Items we haul away "
                titleAccent={`in ${siteConfig.city}.`}
                lede={`Accepted items can be picked up from homes, businesses, moves, and cleanouts in ${cityState}. Restricted or unsafe materials should be reviewed before booking.`}
                primaryCta={{ label: "Book Now", href: "/book" }}
            />

            <DispatchCardSection
                eyebrow="Item categories"
                heading="Common junk removal items."
                body="These examples help customers understand what can usually be reviewed for pickup."
                cards={itemCards}
            />

            <DispatchCardSection
                eyebrow="Service match"
                heading={`How item pickup works in ${cityState}.`}
                body="The crew reviews the items, confirms the price before loading, loads approved junk, and hauls it away."
                cards={serviceCards}
                variant="service-links"
                alt
            />

            {trustCards.length > 0 && (
                <DispatchCardSection
                    eyebrow="Standards"
                    heading="Item pickup standards."
                    cards={trustCards}
                    variant="detail-grid"
                />
            )}

            <StaticFAQ eyebrow="Items FAQ" heading="Items we take questions." items={FAQS} />
            <CtaBand
                heading={{ lead: "Ready to haul it away?", accent: "Start with item details." }}
                lede={`Book online with item details, pickup address, access notes, schedule window, and quote review for ${cityState}.`}
            />
        </>
    );
}
