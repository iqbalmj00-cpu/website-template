"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQAccordion({ items }: { items: { question: string; answer: string }[] }) {
    return (
        <div>
            {items.map((item) => (
                <FAQItem key={item.question} q={item.question} a={item.answer} />
            ))}
        </div>
    );
}

function FAQItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ borderBottom: "1px solid var(--border)" }}>
            <button onClick={() => setOpen(o => !o)}
                style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "1.25rem 0", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
                    textAlign: "left",
                }}>
                <span style={{ fontWeight: 600, fontSize: "1rem", color: "var(--foreground)", paddingRight: "1rem" }}>{q}</span>
                <ChevronDown size={20} style={{ color: "var(--muted)", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0)", flexShrink: 0 }} />
            </button>
            <div
                style={{
                    maxHeight: open ? 1000 : 0,
                    overflow: "hidden",
                    opacity: open ? 1 : 0,
                    transition: "max-height 0.2s ease, opacity 0.2s ease",
                    paddingBottom: open ? "1.25rem" : 0,
                    color: "var(--muted)",
                    fontSize: "0.95rem",
                    lineHeight: 1.7,
                }}
            >
                {a}
            </div>
        </div>
    );
}
