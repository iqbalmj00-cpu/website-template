import Link from "next/link";
import { ArrowRight, Home, Search } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";

export default function NotFound() {
    return (
        <section style={{ minHeight: "70vh", background: "var(--hero-bg)", padding: "9rem 1.5rem 5rem", display: "flex", alignItems: "center" }}>
            <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
                <div style={{ width: 72, height: 72, borderRadius: 16, background: "rgba(var(--brand-rgb, 249, 115, 22), 0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                    <Search size={34} style={{ color: "var(--brand)" }} />
                </div>
                <h1 style={{ color: "var(--hero-text)", fontSize: "clamp(2rem, 5vw, 3.4rem)", lineHeight: 1.05, fontWeight: 900, marginBottom: "1rem" }}>
                    Page Not Found
                </h1>
                <p style={{ color: "var(--hero-muted)", fontSize: "1.08rem", lineHeight: 1.7, margin: "0 auto 2rem", maxWidth: 560 }}>
                    This page is not available for {siteConfig.companyName}. Use the links below to get back to active junk removal pages.
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
                    <Link href="/" className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                        <Home size={18} /> Home
                    </Link>
                    <Link href="/book" className="btn-primary">
                        Book Now <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
