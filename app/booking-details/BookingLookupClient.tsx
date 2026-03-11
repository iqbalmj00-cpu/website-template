"use client";

import { siteConfig } from "@/lib/siteConfig";
import { useState } from "react";
import { Search, Phone, Calendar } from "lucide-react";

export default function BookingLookupClient() {
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<null | { found: boolean; customer?: { name: string }; jobs?: { jobId: string; title: string; scheduledDate: string; status: string }[] }>(null);
    const [error, setError] = useState("");

    const formatPhone = (val: string) => {
        const digits = val.replace(/\D/g, "").slice(0, 10);
        if (digits.length <= 3) return digits;
        if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    };

    const handleLookup = async () => {
        const digits = phone.replace(/\D/g, "");
        if (digits.length < 10) { setError("Please enter a valid 10-digit phone number"); return; }
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`/api/booking-lookup?phone=${encodeURIComponent(`+1${digits}`)}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Lookup failed");
            setResult(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const statusColors: Record<string, string> = {
        scheduled: "#3b82f6",
        en_route: "#f59e0b",
        working: "#8b5cf6",
        completed: "#22c55e",
        cancelled: "#ef4444",
    };

    return (
        <>
            <section style={{ background: "var(--hero-bg)", padding: "7rem 1.5rem 4rem", textAlign: "center" }}>
                <div style={{ maxWidth: 600, margin: "0 auto" }}>
                    <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "var(--hero-text)", marginBottom: "1rem" }}>
                        Check Your <span style={{ color: "var(--brand)" }}>Booking</span>
                    </h1>
                    <p style={{ color: "var(--hero-muted)", fontSize: "1.05rem" }}>
                        Enter the phone number you used when booking to see your appointment details.
                    </p>
                </div>
            </section>

            <section style={{ padding: "3rem 1.5rem", background: "var(--card)" }}>
                <div style={{ maxWidth: 500, margin: "0 auto" }}>
                    <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
                        <div style={{ flex: 1, position: "relative" }}>
                            <Phone size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
                            <input
                                type="tel"
                                placeholder="(555) 123-4567"
                                value={phone}
                                onChange={(e) => setPhone(formatPhone(e.target.value))}
                                onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                                style={{
                                    width: "100%", padding: "0.875rem 0.875rem 0.875rem 2.75rem",
                                    borderRadius: 12, border: "1px solid var(--border)",
                                    fontSize: "1rem", outline: "none",
                                }}
                            />
                        </div>
                        <button
                            onClick={handleLookup}
                            disabled={loading}
                            className="btn-primary"
                            style={{ padding: "0 1.5rem", display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}
                        >
                            <Search size={18} /> {loading ? "..." : "Look Up"}
                        </button>
                    </div>

                    {error && (
                        <div style={{ padding: "0.75rem 1rem", background: "#fef2f2", color: "#dc2626", borderRadius: 8, fontSize: "0.9rem", marginBottom: "1rem" }}>
                            {error}
                        </div>
                    )}

                    {result && !result.found && (
                        <div style={{ textAlign: "center", padding: "2rem", background: "var(--background)", borderRadius: 16, border: "1px solid var(--border)" }}>
                            <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>No bookings found</p>
                            <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                                We couldn&apos;t find any bookings with that phone number. Need to schedule a pickup?
                            </p>
                        </div>
                    )}

                    {result?.found && result.jobs && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <p style={{ fontWeight: 700 }}>Hi, {result.customer?.name || "there"}! Here are your bookings:</p>
                            {result.jobs.map(job => (
                                <div key={job.jobId} style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: 12, padding: "1.25rem" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                                        <h3 style={{ fontWeight: 700 }}>{job.title || "Junk Removal"}</h3>
                                        <span style={{
                                            padding: "0.2rem 0.75rem", borderRadius: "var(--btn-radius)", fontSize: "0.75rem", fontWeight: 700,
                                            background: `${statusColors[job.status] || "#6b7280"}20`,
                                            color: statusColors[job.status] || "#6b7280",
                                            textTransform: "uppercase",
                                        }}>
                                            {job.status}
                                        </span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--muted)", fontSize: "0.9rem" }}>
                                        <Calendar size={14} />
                                        {new Date(job.scheduledDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
