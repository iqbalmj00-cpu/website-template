"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/lib/siteConfig";
import { ArrowRight, Phone } from "lucide-react";

export default function GetStartedPage() {
    const router = useRouter();
    const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const formatPhone = (val: string) => {
        const d = val.replace(/\D/g, "").slice(0, 10);
        if (d.length <= 3) return d;
        if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
        return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.firstName || !form.phone) { setError("First name and phone are required."); return; }
        setSubmitting(true);
        setError("");
        try {
            const res = await fetch("/api/crm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: `${form.firstName} ${form.lastName}`.trim(),
                    phone: form.phone,
                    email: form.email,
                    description: "Lead from Get Started form",
                    source: "WEBSITE",
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed");
            if (data.leadId) localStorage.setItem("syjLeadId", data.leadId);
            router.push("/book");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    };

    const inputStyle = {
        width: "100%", padding: "0.875rem 1rem", borderRadius: 12,
        border: "1px solid var(--border)", fontSize: "1rem", outline: "none",
        background: "#fff",
    };

    return (
        <>
            <Navbar />
            <main>
                <section style={{ background: "var(--navy, #0f172a)", padding: "7rem 1.5rem 5rem" }}>
                    <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
                        <div>
                            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: "1.5rem" }}>
                                Get Your <span style={{ color: "var(--brand)" }}>Free Quote</span> in Minutes
                            </h1>
                            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.1rem", lineHeight: 1.7, marginBottom: "2rem" }}>
                                Tell us a little about yourself and we&apos;ll get you a fast, no-obligation estimate for junk removal in {siteConfig.city}.
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                {["No obligation — 100% free", "Same-day service available", "Upfront, transparent pricing"].map(t => (
                                    <div key={t} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.7)", fontSize: "0.95rem" }}>
                                        <span style={{ color: "var(--brand)", fontWeight: 700 }}>✓</span> {t}
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: "2rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "#94a3b8" }}>
                                <Phone size={16} style={{ color: "var(--brand)" }} />
                                <span>Or call us: <a href={`tel:${siteConfig.phoneNumber.replace(/\D/g, "")}`} style={{ color: "#fff", fontWeight: 600, textDecoration: "none" }}>{siteConfig.phoneNumber}</a></span>
                            </div>
                        </div>

                        <div style={{ background: "#fff", borderRadius: 20, padding: "2.5rem", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
                            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "1.5rem", textAlign: "center" }}>
                                Start Here
                            </h2>
                            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                                    <input
                                        type="text" placeholder="First Name *" required
                                        value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                        style={inputStyle}
                                    />
                                    <input
                                        type="text" placeholder="Last Name"
                                        value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                                <input
                                    type="email" placeholder="Email"
                                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    style={inputStyle}
                                />
                                <input
                                    type="tel" placeholder="Phone Number *" required
                                    value={form.phone} onChange={(e) => setForm({ ...form, phone: formatPhone(e.target.value) })}
                                    style={inputStyle}
                                />
                                {error && (
                                    <p style={{ color: "#dc2626", fontSize: "0.875rem", textAlign: "center" }}>{error}</p>
                                )}
                                <button
                                    type="submit" disabled={submitting}
                                    className="btn-primary"
                                    style={{ width: "100%", padding: "1rem", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                                >
                                    {submitting ? "Sending..." : <>Get My Free Quote <ArrowRight size={18} /></>}
                                </button>
                            </form>
                            <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.8rem", marginTop: "1rem" }}>
                                🔒 Your info is safe. We&apos;ll never spam you.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
