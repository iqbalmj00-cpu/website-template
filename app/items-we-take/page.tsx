import Link from "next/link";
import { siteConfig, formatPhone, telHref } from "@/lib/siteConfig";
import { getClientServices } from "@/lib/serviceData";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: `Items We Take | ${siteConfig.companyName}`,
    description: `See the full list of items ${siteConfig.companyName} can haul away — furniture, appliances, yard waste, construction debris, and more.`,
};

export default function ItemsWeTakePage() {
    const { companyName, phoneNumber } = siteConfig;
    const services = getClientServices();

    const generalItems = [
        { cat: "Furniture", items: ["Sofas & Couches", "Mattresses & Beds", "Tables & Chairs", "Dressers & Desks", "Bookshelves", "Patio Furniture"] },
        { cat: "Appliances", items: ["Refrigerators", "Washers & Dryers", "Ovens & Stoves", "Dishwashers", "Water Heaters", "A/C Units"] },
        { cat: "Electronics", items: ["TVs & Monitors", "Computers & Laptops", "Printers", "Speakers & Stereos", "Gaming Consoles", "Old Cables"] },
        { cat: "Yard & Outdoor", items: ["Branches & Limbs", "Soil & Dirt", "Old Fencing", "Swing Sets", "Trampolines", "Hot Tubs"] },
        { cat: "Construction", items: ["Drywall", "Lumber & Wood", "Tile & Flooring", "Carpet", "Roofing Shingles", "Concrete (small)"] },
        { cat: "Miscellaneous", items: ["Tires", "Bikes & Scooters", "Exercise Equipment", "Old Paint Cans (dried)", "Clothing", "Books & Magazines"] },
    ];

    return (
        <>
            {/* Hero */}
            <section style={{ background: "var(--hero-bg)", padding: "7rem 1.5rem 4rem", textAlign: "center" }}>
                <div style={{ maxWidth: 800, margin: "0 auto" }}>
                    <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 3.5rem)", fontWeight: 900, color: "var(--hero-text)", lineHeight: 1.1, marginBottom: "1rem" }}>
                        Items We <span style={{ color: "var(--brand)" }}>Take</span>
                    </h1>
                    <p style={{ fontSize: "1.1rem", color: "var(--hero-muted)", maxWidth: 550, margin: "0 auto" }}>
                        If it fits in our truck, we can probably haul it. Here&apos;s a look at what we accept.
                    </p>
                </div>
            </section>

            {/* Items Grid */}
            <section style={{ padding: "5rem 1.5rem", background: "var(--background)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
                    {generalItems.map((cat) => (
                        <div key={cat.cat} style={{ background: "var(--card)", borderRadius: 16, padding: "2rem", border: "1px solid var(--border)" }}>
                            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>{cat.cat}</h3>
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

            {/* Note */}
            <section style={{ padding: "3rem 1.5rem", background: "var(--card)", borderTop: "1px solid var(--border)", textAlign: "center" }}>
                <div style={{ maxWidth: 600, margin: "0 auto" }}>
                    <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
                        <strong>Not sure if we can take it?</strong> Give us a call at{" "}
                        <a href={telHref(phoneNumber)} style={{ color: "var(--brand)", fontWeight: 600 }}>{formatPhone(phoneNumber)}</a>{" "}
                        and we&apos;ll let you know. If we can&apos;t haul it, we&apos;ll point you to someone who can.
                    </p>
                    <Link href="/items-we-dont-take" style={{ display: "inline-block", marginTop: "1rem", color: "var(--brand)", fontWeight: 600, textDecoration: "none" }}>
                        See items we don&apos;t take →
                    </Link>
                </div>
            </section >

            {/* CTA */}
            < section style={{ background: "var(--brand)", padding: "4rem 1.5rem", textAlign: "center" }
            }>
                <div style={{ maxWidth: 600, margin: "0 auto" }}>
                    <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "var(--hero-text)", marginBottom: "1rem" }}>Ready to Haul It Away?</h2>
                    <Link href="/book" style={{ display: "inline-block", padding: "1rem 2rem", borderRadius: "var(--btn-radius)", background: "var(--card)", color: "var(--brand)", fontWeight: 700, fontSize: "1rem", textDecoration: "none" }}>📅 Book Your Pickup</Link>
                </div>
            </section >
        </>
    );
}
