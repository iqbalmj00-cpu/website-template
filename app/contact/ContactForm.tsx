"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type FormState = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
    const [state, setState] = useState<FormState>("idle");
    const [error, setError] = useState("");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        const name = String(data.get("name") || "").trim();
        const phone = String(data.get("phone") || "").trim();
        const email = String(data.get("email") || "").trim();
        const message = String(data.get("message") || "").trim();

        if (!name || !message || (!phone && !email)) {
            setState("error");
            setError("Enter your name, message, and either a phone number or email.");
            return;
        }

        setState("loading");
        setError("");

        try {
            const response = await fetch("/api/crm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    phone,
                    email,
                    message,
                    source: "CONTACT_PAGE",
                    _hp: String(data.get("_hp") || ""),
                }),
            });

            if (!response.ok) {
                const body = await response.json().catch(() => ({}));
                throw new Error(body.error || "Unable to send message.");
            }

            form.reset();
            setState("success");
        } catch (err) {
            setState("error");
            setError(err instanceof Error ? err.message : "Unable to send message.");
        }
    }

    const inputStyle: React.CSSProperties = {
        width: "100%",
        border: "1px solid var(--border)",
        borderRadius: 10,
        background: "var(--background)",
        color: "var(--foreground)",
        font: "inherit",
        minHeight: 48,
        padding: "0.85rem 1rem",
    };

    return (
        <form onSubmit={handleSubmit} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
                <label htmlFor="contact-company">Company</label>
                <input id="contact-company" name="_hp" tabIndex={-1} autoComplete="off" />
            </div>

            <div>
                <label htmlFor="contact-name" style={{ display: "block", fontWeight: 700, marginBottom: "0.4rem" }}>Name</label>
                <input id="contact-name" name="name" type="text" autoComplete="name" required style={inputStyle} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: "1rem" }}>
                <div>
                    <label htmlFor="contact-phone" style={{ display: "block", fontWeight: 700, marginBottom: "0.4rem" }}>Phone</label>
                    <input id="contact-phone" name="phone" type="tel" autoComplete="tel" style={inputStyle} />
                </div>
                <div>
                    <label htmlFor="contact-email" style={{ display: "block", fontWeight: 700, marginBottom: "0.4rem" }}>Email</label>
                    <input id="contact-email" name="email" type="email" autoComplete="email" style={inputStyle} />
                </div>
            </div>

            <div>
                <label htmlFor="contact-message" style={{ display: "block", fontWeight: 700, marginBottom: "0.4rem" }}>Message</label>
                <textarea id="contact-message" name="message" rows={5} required style={{ ...inputStyle, resize: "vertical", minHeight: 140 }} />
            </div>

            {state === "success" && (
                <div role="status" style={{ border: "1px solid rgba(22, 163, 74, 0.35)", background: "rgba(22, 163, 74, 0.08)", borderRadius: 10, color: "#15803d", padding: "0.85rem 1rem", fontWeight: 700 }}>
                    Your message was sent. We will follow up using the contact details you provided.
                </div>
            )}

            {state === "error" && (
                <div role="alert" style={{ border: "1px solid rgba(220, 38, 38, 0.35)", background: "rgba(220, 38, 38, 0.08)", borderRadius: 10, color: "#b91c1c", padding: "0.85rem 1rem", fontWeight: 700 }}>
                    {error}
                </div>
            )}

            <button type="submit" className="btn-primary" disabled={state === "loading"} style={{ justifyContent: "center", minHeight: 50, opacity: state === "loading" ? 0.7 : 1 }}>
                <Send size={18} /> {state === "loading" ? "Sending..." : "Send Message"}
            </button>
        </form>
    );
}
