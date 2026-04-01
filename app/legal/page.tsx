import { siteConfig } from "@/lib/siteConfig";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: `Legal | ${siteConfig.companyName}`,
    description: `Privacy policy and terms of service for ${siteConfig.companyName}.`,
    alternates: { canonical: "/legal" },
};

export default function LegalPage() {
    return (
        <main style={{ padding: "7rem 1.5rem 4rem" }}>
            <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
                <h1 style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: "1.5rem" }}>Legal</h1>
                <p style={{ color: "var(--muted)", fontSize: "1.1rem", marginBottom: "3rem", lineHeight: 1.6 }}>
                    Please visit our dedicated pages for full details.
                </p>
                <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
                    <Link
                        href="/privacy"
                        style={{
                            display: "inline-flex", alignItems: "center", gap: "0.5rem",
                            padding: "1rem 2rem", borderRadius: 12,
                            background: "var(--card)", border: "2px solid var(--brand)",
                            color: "var(--brand)", fontWeight: 700, fontSize: "1rem",
                            textDecoration: "none", transition: "all 0.15s",
                        }}
                    >
                        Privacy Policy →
                    </Link>
                    <Link
                        href="/terms"
                        style={{
                            display: "inline-flex", alignItems: "center", gap: "0.5rem",
                            padding: "1rem 2rem", borderRadius: 12,
                            background: "var(--card)", border: "2px solid var(--brand)",
                            color: "var(--brand)", fontWeight: 700, fontSize: "1rem",
                            textDecoration: "none", transition: "all 0.15s",
                        }}
                    >
                        Terms of Service →
                    </Link>
                </div>
            </div>
        </main>
    );
}
