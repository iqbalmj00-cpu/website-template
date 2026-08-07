"use client";

import { useState } from "react";
import Link from "next/link";
import ServiceIcon from "@/components/ServiceIcon";

export default function ServiceCard({
    iconName,
    title,
    slug,
    shortDesc,
    fullDesc,
}: {
    iconName: string;
    title: string;
    slug: string;
    shortDesc: string;
    fullDesc: string;
}) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            style={{
                background: "var(--card)",
                borderRadius: 16,
                padding: "2rem",
                border: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                transition: "box-shadow 0.3s, transform 0.3s",
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.transform = "none";
            }}
        >
            <div style={{ marginBottom: "1rem", display: "flex" }}><ServiceIcon name={iconName} size={36} color="var(--brand)" /></div>
            <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--foreground)", marginBottom: "0.5rem" }}>
                {title}
            </h3>
            <p style={{ color: "var(--muted)", lineHeight: 1.6, flex: 1 }}>{shortDesc}</p>

            {expanded && (
                <p style={{ color: "var(--muted)", lineHeight: 1.6, marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border)" }}>
                    {fullDesc}
                </p>
            )}

            <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <button
                    onClick={() => setExpanded((e) => !e)}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--foreground)",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                    }}
                >
                    {expanded ? "Show Less ↑" : "Learn More →"}
                </button>
                <Link
                    href={`/services/${slug}`}
                    style={{ color: "var(--brand)", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none" }}
                >
                    View Details →
                </Link>
            </div>
        </div>
    );
}
