import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: `Items We Don't Take | ${siteConfig.companyName}`,
    description: `For safety and legal reasons, ${siteConfig.companyName} cannot transport certain hazardous materials. See the full list.`,
};

export default function ItemsWeDontTakePage() {
    const { companyName, phoneNumber } = siteConfig;

    const prohibited = [
        { item: "Hazardous Chemicals", detail: "Pesticides, herbicides, pool chemicals, and industrial solvents." },
        { item: "Paint & Solvents", detail: "Liquid paint, paint thinner, varnish, and stains. Dried paint cans are OK." },
        { item: "Asbestos", detail: "Any material containing asbestos requires a licensed abatement contractor." },
        { item: "Car Batteries", detail: "Lead-acid batteries must be recycled at auto parts stores or hazardous waste sites." },
        { item: "Medical Waste", detail: "Needles, sharps, pharmaceuticals, and biohazard materials." },
        { item: "Oil Drums & Tanks", detail: "Full or partially full oil drums, fuel tanks, and chemical containers." },
        { item: "Propane Tanks", detail: "Any pressurized gas tank. Exchange programs at hardware stores." },
        { item: "Explosives & Ammunition", detail: "Firearms, ammunition, fireworks, and flares. Contact local PD for disposal." },
    ];

    return (
        <>
            <Navbar />
            <main>
                {/* Hero */}
                <section style={{ background: "var(--navy, #0f172a)", padding: "7rem 1.5rem 4rem", textAlign: "center" }}>
                    <div style={{ maxWidth: 800, margin: "0 auto" }}>
                        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: "1rem" }}>
                            Items We <span style={{ color: "#ef4444" }}>Don&apos;t</span> Take
                        </h1>
                        <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.65)", maxWidth: 550, margin: "0 auto" }}>
                            For safety and legal reasons, we cannot transport these materials.
                        </p>
                    </div>
                </section>

                {/* List */}
                <section style={{ padding: "5rem 1.5rem", background: "var(--background)" }}>
                    <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {prohibited.map((p) => (
                            <div key={p.item} style={{ background: "#fff", borderRadius: 12, padding: "1.5rem 2rem", border: "1px solid var(--border)", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444", flexShrink: 0, marginTop: 6 }} />
                                <div>
                                    <h3 style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.25rem" }}>{p.item}</h3>
                                    <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.5 }}>{p.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ maxWidth: 600, margin: "3rem auto 0", padding: "1.5rem", background: "#fff", borderRadius: 12, border: "1px solid var(--border)", textAlign: "center" }}>
                        <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>
                            <strong>Need to dispose of restricted items?</strong> Contact your local municipal hazardous waste facility for safe disposal options.
                        </p>
                        <Link href="/items-we-take" style={{ display: "inline-block", marginTop: "1rem", color: "var(--brand)", fontWeight: 600, textDecoration: "none" }}>
                            ← See items we DO take
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
