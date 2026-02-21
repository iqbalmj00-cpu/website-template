"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { siteConfig } from "@/lib/siteConfig";
import { ArrowLeft, MapPin, Clock, Phone, Navigation, Camera, CheckCircle } from "lucide-react";
import Link from "next/link";

type JobDetail = {
    jobId: string;
    title: string;
    customerName: string;
    customerPhone: string;
    address: string;
    scheduledDate: string;
    timeSlot: string;
    status: string;
    volume: string;
    notes: string;
    quotedPrice: number;
    items: string;
};

export default function DriverJobDetailPage() {
    const router = useRouter();
    const params = useParams();
    const jobId = params.id as string;

    const [job, setJob] = useState<JobDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const getToken = () => localStorage.getItem("driverToken");

    useEffect(() => {
        const token = getToken();
        if (!token) { router.push("/driver/login"); return; }

        fetch("/api/driver/bootstrap", { headers: { Authorization: `Bearer ${token}` } })
            .then(res => { if (!res.ok) throw new Error(); return res.json(); })
            .then(data => {
                const found = data.jobs?.find((j: JobDetail) => j.jobId === jobId);
                if (found) setJob(found);
            })
            .catch(() => router.push("/driver/login"))
            .finally(() => setLoading(false));
    }, [jobId, router]);

    const updateStatus = async (newStatus: string) => {
        setUpdating(true);
        try {
            const res = await fetch("/api/driver/update-status", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ jobId, status: newStatus }),
            });
            if (!res.ok) throw new Error();
            setJob(prev => prev ? { ...prev, status: newStatus } : null);
        } catch { /* silently fail */ }
        finally { setUpdating(false); }
    };

    const statusFlow: Record<string, { next: string; label: string; color: string }> = {
        scheduled: { next: "en_route", label: "Start Route", color: "#3b82f6" },
        en_route: { next: "working", label: "Arrived — Start Job", color: "#f59e0b" },
        working: { next: "completed", label: "Mark Complete", color: "#22c55e" },
    };

    if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
    if (!job) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Job not found</div>;

    const nextAction = statusFlow[job.status];

    return (
        <div style={{ minHeight: "100vh", background: "var(--background)" }}>
            {/* Header */}
            <div style={{ background: "var(--navy, #0f172a)", padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                <Link href="/driver/jobs" style={{ color: "#94a3b8" }}>
                    <ArrowLeft size={22} />
                </Link>
                <h1 style={{ color: "#fff", fontWeight: 700, fontSize: "1.1rem" }}>{job.title || "Junk Removal"}</h1>
            </div>

            <div style={{ maxWidth: 600, margin: "0 auto", padding: "1.5rem" }}>
                {/* Customer Info */}
                <div style={{ background: "#fff", borderRadius: 12, padding: "1.25rem", border: "1px solid var(--border)", marginBottom: "1rem" }}>
                    <h3 style={{ fontWeight: 700, marginBottom: "0.75rem" }}>Customer</h3>
                    <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>{job.customerName}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <a href={`tel:${job.customerPhone}`} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--brand)", textDecoration: "none", fontWeight: 600, fontSize: "0.9rem" }}>
                            <Phone size={15} /> {job.customerPhone || "No phone"}
                        </a>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", color: "var(--muted)", fontSize: "0.9rem" }}>
                            <MapPin size={15} style={{ flexShrink: 0, marginTop: 2 }} /> {job.address || "Address pending"}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--muted)", fontSize: "0.9rem" }}>
                            <Clock size={15} /> {job.timeSlot || "TBD"}
                        </div>
                    </div>
                </div>

                {/* Job Details */}
                <div style={{ background: "#fff", borderRadius: 12, padding: "1.25rem", border: "1px solid var(--border)", marginBottom: "1rem" }}>
                    <h3 style={{ fontWeight: 700, marginBottom: "0.75rem" }}>Job Details</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                        <div>
                            <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Volume</p>
                            <p style={{ fontWeight: 600 }}>{job.volume || "—"}</p>
                        </div>
                        <div>
                            <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Quoted Price</p>
                            <p style={{ fontWeight: 600 }}>{job.quotedPrice ? `$${job.quotedPrice}` : "—"}</p>
                        </div>
                    </div>
                    {job.items && (
                        <div style={{ marginTop: "0.75rem" }}>
                            <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Items</p>
                            <p style={{ fontSize: "0.9rem" }}>{job.items}</p>
                        </div>
                    )}
                    {job.notes && (
                        <div style={{ marginTop: "0.75rem", padding: "0.75rem", background: "rgba(249,115,22,0.06)", borderRadius: 8, border: "1px solid rgba(249,115,22,0.15)" }}>
                            <p style={{ color: "var(--muted)", fontSize: "0.8rem", marginBottom: "0.25rem" }}>Notes</p>
                            <p style={{ fontSize: "0.9rem" }}>{job.notes}</p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {job.address && (
                        <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(job.address)}`}
                            target="_blank" rel="noopener noreferrer"
                            style={{
                                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                                padding: "0.875rem", borderRadius: 12, background: "#1e293b", color: "#fff",
                                textDecoration: "none", fontWeight: 700, fontSize: "0.95rem",
                            }}
                        >
                            <Navigation size={18} /> Open in Maps
                        </a>
                    )}

                    {nextAction && (
                        <button
                            onClick={() => updateStatus(nextAction.next)}
                            disabled={updating}
                            style={{
                                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                                padding: "1rem", borderRadius: 12, border: "none",
                                background: nextAction.color, color: "#fff",
                                fontWeight: 700, fontSize: "1rem", cursor: updating ? "wait" : "pointer",
                                opacity: updating ? 0.7 : 1,
                            }}
                        >
                            {nextAction.next === "completed" ? <CheckCircle size={20} /> : null}
                            {updating ? "Updating..." : nextAction.label}
                        </button>
                    )}

                    {job.status === "completed" && (
                        <div style={{ textAlign: "center", padding: "1.5rem", background: "#f0fdf4", borderRadius: 12, border: "1px solid #bbf7d0" }}>
                            <CheckCircle size={32} color="#22c55e" style={{ marginBottom: "0.5rem" }} />
                            <p style={{ fontWeight: 700, color: "#166534" }}>Job Completed</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
