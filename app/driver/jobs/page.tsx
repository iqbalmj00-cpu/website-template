"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/lib/siteConfig";
import { MapPin, Clock, ChevronRight, LogOut, Truck } from "lucide-react";
import Link from "next/link";

type Job = {
    jobId: string;
    title: string;
    customerName: string;
    address: string;
    scheduledDate: string;
    timeSlot: string;
    status: string;
    volume: string;
};

export default function DriverJobsPage() {
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [driverName, setDriverName] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("driverToken");
        const name = localStorage.getItem("driverName");
        if (!token) { router.push("/driver/login"); return; }
        setDriverName(name || "Driver");

        fetch("/api/driver/bootstrap", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => { if (!res.ok) throw new Error("Auth failed"); return res.json(); })
            .then(data => setJobs(data.jobs || []))
            .catch(() => { localStorage.removeItem("driverToken"); router.push("/driver/login"); })
            .finally(() => setLoading(false));
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("driverToken");
        localStorage.removeItem("driverName");
        router.push("/driver/login");
    };

    const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
        scheduled: { label: "Scheduled", color: "#3b82f6", bg: "#eff6ff" },
        en_route: { label: "En Route", color: "#f59e0b", bg: "#fffbeb" },
        working: { label: "In Progress", color: "#8b5cf6", bg: "#f5f3ff" },
        completed: { label: "Completed", color: "#22c55e", bg: "#f0fdf4" },
    };

    const timeSlotLabels: Record<string, string> = {
        MORNING: "8 AM – 12 PM",
        AFTERNOON: "12 PM – 4 PM",
        EVENING: "4 PM – 7 PM",
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--background)" }}>
            {/* Header */}
            <div style={{ background: "var(--navy, #0f172a)", padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}>{siteConfig.companyName}</p>
                    <p style={{ color: "#fff", fontWeight: 700 }}>👋 Hey, {driverName}</p>
                </div>
                <button onClick={handleLogout} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, padding: "0.5rem 0.75rem", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.85rem" }}>
                    <LogOut size={16} /> Sign Out
                </button>
            </div>

            {/* Content */}
            <div style={{ maxWidth: 600, margin: "0 auto", padding: "1.5rem" }}>
                <h1 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "1.5rem" }}>
                    Today&apos;s Jobs ({jobs.length})
                </h1>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted)" }}>Loading...</div>
                ) : jobs.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "3rem", background: "#fff", borderRadius: 16, border: "1px solid var(--border)" }}>
                        <Truck size={40} style={{ color: "var(--muted)", marginBottom: "1rem" }} />
                        <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>No jobs today</p>
                        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Check back later or contact dispatch.</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {jobs.map(job => {
                            const sc = statusConfig[job.status] || statusConfig.scheduled;
                            return (
                                <Link key={job.jobId} href={`/driver/jobs/${job.jobId}`} style={{ textDecoration: "none", color: "inherit" }}>
                                    <div style={{
                                        background: "#fff", borderRadius: 12, padding: "1.25rem",
                                        border: "1px solid var(--border)", display: "flex",
                                        justifyContent: "space-between", alignItems: "center",
                                        transition: "box-shadow 0.2s",
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                                <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>{job.title || "Junk Removal"}</h3>
                                                <span style={{ padding: "0.15rem 0.5rem", borderRadius: 999, fontSize: "0.7rem", fontWeight: 700, color: sc.color, background: sc.bg }}>
                                                    {sc.label}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                                <MapPin size={13} /> {job.address || "Address pending"}
                                            </p>
                                            <p style={{ fontSize: "0.85rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                                <Clock size={13} /> {timeSlotLabels[job.timeSlot] || job.timeSlot || "TBD"}
                                            </p>
                                        </div>
                                        <ChevronRight size={20} style={{ color: "var(--muted)" }} />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
