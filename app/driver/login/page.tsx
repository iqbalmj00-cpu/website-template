"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/lib/siteConfig";
import { Lock, Truck } from "lucide-react";

export default function DriverLoginPage() {
    const router = useRouter();
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pin.length < 4) { setError("Enter your 4-digit PIN"); return; }
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/driver/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pin }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Invalid PIN");
            localStorage.setItem("driverToken", data.token);
            localStorage.setItem("driverName", data.staffName);
            router.push("/driver/jobs");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--navy, #0f172a)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
            <div style={{ width: "100%", maxWidth: 380 }}>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(249,115,22,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                        <Truck size={32} color="var(--brand)" />
                    </div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#fff", marginBottom: "0.5rem" }}>
                        Driver Portal
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>
                        {siteConfig.companyName}
                    </p>
                </div>

                <form onSubmit={handleLogin} style={{ background: "#1e293b", borderRadius: 16, padding: "2rem", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <label style={{ display: "block", color: "#94a3b8", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                        Enter your PIN
                    </label>
                    <div style={{ position: "relative", marginBottom: "1rem" }}>
                        <Lock size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                        <input
                            type="password"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="••••"
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            autoFocus
                            style={{
                                width: "100%", padding: "0.875rem 0.875rem 0.875rem 2.75rem",
                                borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)",
                                background: "rgba(255,255,255,0.05)", color: "#fff",
                                fontSize: "1.25rem", letterSpacing: "0.3em", textAlign: "center",
                                outline: "none",
                            }}
                        />
                    </div>
                    {error && (
                        <p style={{ color: "#f87171", fontSize: "0.85rem", textAlign: "center", marginBottom: "0.75rem" }}>{error}</p>
                    )}
                    <button
                        type="submit" disabled={loading}
                        style={{
                            width: "100%", padding: "0.875rem", borderRadius: 12, border: "none",
                            background: "var(--brand)", color: "#fff", fontWeight: 700,
                            fontSize: "1rem", cursor: loading ? "wait" : "pointer",
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? "Logging in..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}
