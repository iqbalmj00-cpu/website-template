import Link from "next/link";
import { siteConfig, formatPhone, telHref, getVerifiableTrustSignals } from "@/lib/siteConfig";
import type { Metadata } from "next";
import { CalendarDays, CheckCircle } from "lucide-react";
import { createPageMetadata, faqPageJsonLd } from "@/lib/seo";
import { getClientServices } from "@/lib/serviceData";

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
    const { phoneNumber } = siteConfig;
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

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(FAQS, "/items-we-take")) }}
            />
            {/* Hero */}
            <section style={{ background: "var(--hero-bg)", padding: "9rem 1.5rem 4rem", textAlign: "center" }}>
                <div style={{ maxWidth: 800, margin: "0 auto" }}>
                    <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 3.5rem)", fontWeight: 900, color: "var(--hero-text)", lineHeight: 1.1, marginBottom: "1rem" }}>
                        Items We <span style={{ color: "var(--brand)" }}>Haul Away</span> in {siteConfig.city}
                    </h1>
                    <p style={{ fontSize: "1.1rem", color: "var(--hero-muted)", maxWidth: 550, margin: "0 auto" }}>
                        If it fits in the truck and is not prohibited, we can probably haul it. We serve {cityState} with junk removal for homes, businesses, moves, and cleanouts.
                    </p>
                </div>
            </section>

            {/* Items Grid */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--background)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))", gap: "1.5rem" }}>
                    {generalItems.map((cat) => (
                        <div key={cat.cat} style={{ background: "var(--card)", borderRadius: 16, padding: "2rem", border: "1px solid var(--border)" }}>
                            <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>{cat.cat}</h2>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {cat.items.map((item) => (
                                    <li key={item} style={{ padding: "0.5rem 0", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--muted)", fontSize: "0.9rem" }}>
                                        <span style={{ color: "var(--brand)" }}>✓</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* How Pickup Works */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--card)", borderTop: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 1050, margin: "0 auto" }}>
                    <div style={{ maxWidth: 760, marginBottom: "2.5rem" }}>
                        <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900, marginBottom: "0.75rem" }}>How Item Pickup Works in {cityState}</h2>
                        <p style={{ color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.7 }}>
                            Accepted items can be picked up from inside, outside, curbside, garages, storage units, offices, and job sites when access is safe. The crew reviews the items, confirms the price, loads the approved junk, and hauls it away.
                        </p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: "1rem" }}>
                        {serviceLinks.map((service) => (
                            <Link key={service.slug} href={`/services/${service.slug}`} className="card" style={{ textDecoration: "none", color: "inherit" }}>
                                <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "0.5rem" }}>{service.title}</h3>
                                <p style={{ color: "var(--muted)", fontSize: "0.92rem", lineHeight: 1.6 }}>{serviceDescriptions[service.slug] || service.shortDesc}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Note */}
            <section style={{ padding: "3rem 1.5rem", background: "var(--card)", borderTop: "1px solid var(--border)", textAlign: "center" }}>
                <div style={{ maxWidth: 600, margin: "0 auto" }}>
                    <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
                        <strong>Not sure if we can take it?</strong> Give us a call at{" "}
                        <a href={telHref(phoneNumber)} style={{ color: "var(--brand)", fontWeight: 600 }}>{formatPhone(phoneNumber)}</a>{" "}
                        and we&apos;ll let you know right away. Common edge cases like pianos, hot tubs, and large safes are usually fine — they just require a heavy item surcharge. If we can&apos;t haul it, we&apos;ll point you to someone who can.
                    </p>
                    <Link href="/items-we-dont-take" style={{ display: "inline-block", marginTop: "1rem", color: "var(--brand)", fontWeight: 600, textDecoration: "none" }}>
                        See items we don&apos;t take →
                    </Link>
                </div>
            </section>

            {/* Service Standards */}
            {trustSignals.length > 0 && (
                <section style={{ padding: "4rem 1.5rem", background: "var(--background)", borderTop: "1px solid var(--border)" }}>
                    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                        <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 900, textAlign: "center", marginBottom: "2rem" }}>Item Pickup Standards</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: "1rem" }}>
                            {trustSignals.map((signal) => (
                                <div key={signal} className="card" style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                                    <CheckCircle size={20} style={{ color: "var(--brand)", flexShrink: 0, marginTop: 2 }} />
                                    <p style={{ color: "var(--muted)", lineHeight: 1.65 }}>{signal}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FAQs */}
            <section style={{ padding: "4rem 1.5rem", background: "var(--background)", borderTop: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 760, margin: "0 auto" }}>
                    <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 900, textAlign: "center", marginBottom: "2rem" }}>Items We Take FAQ</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {FAQS.map((faq) => (
                            <details key={faq.q} style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", background: "var(--card)" }}>
                                <summary style={{ padding: "1rem 1.5rem", fontWeight: 750, cursor: "pointer" }}>{faq.q}</summary>
                                <div style={{ padding: "0 1.5rem 1rem", color: "var(--muted)", lineHeight: 1.7 }}>{faq.a}</div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ background: "var(--brand)", padding: "4rem 1.5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 600, margin: "0 auto" }}>
                    <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "var(--hero-text)", marginBottom: "1rem" }}>Ready to Haul It Away?</h2>
                    <Link href="/book" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "1rem 2rem", borderRadius: "var(--btn-radius)", background: "var(--card)", color: "var(--brand)", fontWeight: 700, fontSize: "1rem", textDecoration: "none" }}><CalendarDays size={18} /> Book Your Pickup</Link>
                </div>
            </section>
        </>
    );
}
