"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Calendar, Clock, DollarSign, ArrowRight, Phone } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";
import { Suspense } from "react";

function ThankYouContent() {
    const params = useSearchParams();
    const name = params.get("name") || "there";
    const date = params.get("date") || "";
    const time = params.get("time") || "";
    const price = params.get("price") || "";

    return (
        <div style={{ minHeight: "100vh", background: "var(--background)", padding: "4rem 1.5rem" }}>
            <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
                <div className="fade-up" style={{ marginBottom: "2.5rem" }}>
                    <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, var(--brand), var(--brand-dark))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                        <CheckCircle size={40} color="#fff" />
                    </div>
                    <h1 style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)", color: "var(--navy)", marginBottom: "0.75rem" }}>
                        You&rsquo;re all set, {name.split(" ")[0]}!
                    </h1>
                    <p style={{ color: "var(--muted)", fontSize: "1.1rem", lineHeight: 1.7 }}>
                        Your pickup request has been submitted. We&rsquo;ll reach out shortly to confirm the details.
                    </p>
                </div>

                {(date || time || price) && (
                    <div className="card fade-up" style={{ textAlign: "left", marginBottom: "2rem", animationDelay: "0.1s" }}>
                        <h3 style={{ fontSize: "0.875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand)", marginBottom: "1rem" }}>
                            Booking Summary
                        </h3>
                        {date && (
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 0", borderBottom: "1px solid var(--border)" }}>
                                <Calendar size={18} style={{ color: "var(--brand)" }} />
                                <div>
                                    <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Date</div>
                                    <div style={{ fontWeight: 600 }}>{date}</div>
                                </div>
                            </div>
                        )}
                        {time && (
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 0", borderBottom: "1px solid var(--border)" }}>
                                <Clock size={18} style={{ color: "var(--brand)" }} />
                                <div>
                                    <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Time Window</div>
                                    <div style={{ fontWeight: 600 }}>{time}</div>
                                </div>
                            </div>
                        )}
                        {price && (
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 0" }}>
                                <DollarSign size={18} style={{ color: "var(--brand)" }} />
                                <div>
                                    <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Estimated Price</div>
                                    <div style={{ fontWeight: 600 }}>{price}</div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", animationDelay: "0.2s" }}>
                    <Link href="/" className="btn-primary" style={{ fontSize: "1rem", padding: "0.875rem 2rem" }}>
                        Back to Home <ArrowRight size={16} />
                    </Link>
                    <a href={`tel:${siteConfig.phoneNumber.replace(/\D/g, "")}`} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--muted)", textDecoration: "none", fontSize: "0.95rem" }}>
                        <Phone size={16} /> Questions? Call {siteConfig.phoneNumber}
                    </a>
                </div>
            </div>
        </div>
    );
}

export default function ThankYouPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
            <ThankYouContent />
        </Suspense>
    );
}
