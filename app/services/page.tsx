import type { Metadata } from "next";
import Link from "next/link";
import { Truck, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
    title: `Our Services | ${siteConfig.companyName}`,
    description: `Junk removal services in ${siteConfig.serviceArea}. ${siteConfig.services.join(", ")} and more.`,
};

const SERVICE_DETAILS: Record<string, { icon: string; description: string }> = {
    "Furniture Removal": { icon: "🛋️", description: "Sofas, chairs, tables, dressers, bed frames — we handle it all. No need to disassemble anything." },
    "Appliance Disposal": { icon: "🧊", description: "Refrigerators, washers, dryers, ovens, and more. We disconnect and haul away safely." },
    "Yard Waste": { icon: "🌿", description: "Branches, stumps, soil, old fencing, and landscaping debris. We clear it out." },
    "Garage Cleanouts": { icon: "🏠", description: "Years of accumulated stuff? We'll empty the whole garage in one visit." },
    "Construction Debris": { icon: "🧱", description: "Drywall, lumber, tile, concrete, roofing — post-renovation cleanup done right." },
    "Estate Cleanouts": { icon: "🏡", description: "Full property cleanouts handled with care and respect. We donate what we can." },
    "E-Waste Recycling": { icon: "🖥️", description: "TVs, computers, printers, and electronics recycled responsibly." },
    "Mattresses": { icon: "🛏️", description: "Mattresses, box springs, and bed frames picked up and disposed of properly." },
    "General Junk": { icon: "📦", description: "Boxes, bags, miscellaneous items — if it fits in our truck, we'll haul it." },
};

export default function ServicesPage() {
    return (
        <>
            <section style={{ background: "var(--navy)", padding: "5rem 1.5rem 4rem", textAlign: "center" }}>
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "#f8fafc", marginBottom: "1rem" }}>
                        Our Services
                    </h1>
                    <p style={{ color: "#94a3b8", fontSize: "1.1rem", lineHeight: 1.7 }}>
                        From single items to full property cleanouts — {siteConfig.companyName} handles it all in {siteConfig.serviceArea}.
                    </p>
                </div>
            </section>

            <section className="section">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
                    {siteConfig.services.map((service) => {
                        const details = SERVICE_DETAILS[service] || { icon: "📦", description: "Professional junk removal service." };
                        return (
                            <div key={service} className="card" style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                                <div style={{ fontSize: 32, flexShrink: 0 }}>{details.icon}</div>
                                <div>
                                    <h3 style={{ fontSize: "1.1rem", color: "var(--navy)", marginBottom: "0.5rem" }}>{service}</h3>
                                    <p style={{ color: "var(--muted)", fontSize: "0.925rem", lineHeight: 1.65 }}>{details.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section style={{ padding: "5rem 1.5rem", background: "var(--navy)", textAlign: "center" }}>
                <div style={{ maxWidth: 600, margin: "0 auto" }}>
                    <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "#f8fafc", marginBottom: "1rem" }}>
                        Need something hauled?
                    </h2>
                    <p style={{ color: "#94a3b8", fontSize: "1rem", lineHeight: 1.7, marginBottom: "2rem" }}>
                        Book your pickup in 2 minutes. We do the heavy lifting.
                    </p>
                    <Link href="/book" className="btn-primary" style={{ fontSize: "1.05rem", padding: "1rem 2rem" }}>
                        Book My Pickup <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </>
    );
}
