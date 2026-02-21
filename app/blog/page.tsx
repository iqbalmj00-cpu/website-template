import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: `Blog | ${siteConfig.companyName}`,
    description: `Tips, guides, and news about junk removal from ${siteConfig.companyName} in ${siteConfig.city}.`,
};

export default function BlogPage() {
    const { companyName, city } = siteConfig;

    return (
        <>
            <Navbar />
            <main>
                <section style={{ background: "var(--hero-bg)", padding: "7rem 1.5rem 4rem", textAlign: "center" }}>
                    <div style={{ maxWidth: 700, margin: "0 auto" }}>
                        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "var(--hero-text)", marginBottom: "1rem" }}>
                            The {companyName} <span style={{ color: "var(--brand)" }}>Blog</span>
                        </h1>
                        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.1rem" }}>
                            Tips, guides, and junk removal insights from your {city} experts.
                        </p>
                    </div>
                </section>

                <section style={{ padding: "5rem 1.5rem", background: "var(--card)" }}>
                    <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
                        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(249,115,22,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "2rem" }}>
                            📝
                        </div>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1rem" }}>Coming Soon</h2>
                        <p style={{ color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "2rem" }}>
                            We&apos;re working on helpful guides about decluttering, junk removal tips, recycling best practices, and more. Check back soon!
                        </p>
                        <Link href="/book" className="btn-primary" style={{ padding: "0.875rem 2rem" }}>
                            Book a Pickup Instead →
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
