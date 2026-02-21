"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronLeft, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";
import {
    STEPS, JUNK_CATEGORIES, CATEGORY_ITEMS, VOLUME_OPTIONS,
    LOCATION_OPTIONS, TIME_SLOTS, PILE_SIZES,
} from "@/lib/wizardData";

/* ── Types ─────────────────────────────────────────────────────────────── */
type ItemQtyMap = Record<string, Record<string, number>>;
type ContactInfo = { name: string; phone: string; email: string; address: string; notes: string };

/* ── Truck SVG ─────────────────────────────────────────────────────────── */
function TruckVisual({ fillPercent }: { fillPercent: number }) {
    const fill = Math.min(fillPercent, 1.0);
    return (
        <svg viewBox="0 0 320 140" style={{ width: "100%", maxWidth: 340 }}>
            <rect x="10" y="30" width="200" height="80" rx="4" fill="var(--foreground)" stroke="#334155" strokeWidth="2" />
            <rect x="12" y={30 + 78 * (1 - fill)} width="196" height={78 * fill} rx="2" fill="var(--brand)" opacity="0.9" style={{ transition: "all 0.4s ease" }} />
            {[0.25, 0.5, 0.75].map((line) => (
                <line key={line} x1="12" y1={30 + 78 * (1 - line)} x2="208" y2={30 + 78 * (1 - line)} stroke="#475569" strokeWidth="1" strokeDasharray="4 3" />
            ))}
            <path d="M210 50 L210 110 L280 110 L280 70 Q280 50 260 50 Z" fill="var(--foreground)" />
            <rect x="240" y="60" width="30" height="20" rx="4" fill="#94CED8" opacity="0.4" />
            <circle cx="60" cy="118" r="16" fill="#1E293B" /><circle cx="60" cy="118" r="8" fill="#475569" />
            <circle cx="170" cy="118" r="16" fill="#1E293B" /><circle cx="170" cy="118" r="8" fill="#475569" />
            <circle cx="260" cy="118" r="14" fill="#1E293B" /><circle cx="260" cy="118" r="7" fill="#475569" />
            <text x="108" y={30 + 78 * (1 - fill) - 6} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--brand)">
                {fillPercent > 1 ? "1+ Loads" : `${Math.round(fill * 100)}%`}
            </text>
        </svg>
    );
}

/* ── Calendar ──────────────────────────────────────────────────────────── */
function Calendar({ selected, onSelect }: { selected: Date | null; onSelect: (d: Date) => void }) {
    const today = new Date();
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [viewYear, setViewYear] = useState(today.getFullYear());

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const isSame = (d: Date | null, day: number) =>
        d && d.getDate() === day && d.getMonth() === viewMonth && d.getFullYear() === viewYear;
    const isPast = (day: number) => {
        const d = new Date(viewYear, viewMonth, day);
        return d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <button onClick={prevMonth} style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer", color: "var(--foreground)" }}>←</button>
                <span style={{ fontWeight: 700, fontSize: 16, color: "var(--foreground)" }}>
                    {new Date(viewYear, viewMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
                <button onClick={nextMonth} style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer", color: "var(--foreground)" }}>→</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, textAlign: "center" }}>
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                    <div key={d} style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", padding: "4px 0" }}>{d}</div>
                ))}
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                    <button key={day} onClick={() => !isPast(day) && onSelect(new Date(viewYear, viewMonth, day))}
                        style={{
                            width: 38, height: 38, borderRadius: "50%", border: "none", fontSize: 14, fontWeight: 600, cursor: isPast(day) ? "default" : "pointer",
                            background: isSame(selected, day) ? "var(--brand)" : "transparent", color: isSame(selected, day) ? "#fff" : isPast(day) ? "#CBD5E1" : "var(--foreground)",
                            transition: "all 0.15s", margin: "0 auto", fontFamily: "inherit",
                        }}>
                        {day}
                    </button>
                ))}
            </div>
        </div>
    );
}

/* ── Main Wizard ───────────────────────────────────────────────────────── */
export default function BookingWizard() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedItems, setSelectedItems] = useState<ItemQtyMap>({});
    const [pileSizes, setPileSizes] = useState<Record<string, string>>({});
    const [volume, setVolume] = useState<string | null>(null);
    const [location, setLocation] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [contact, setContact] = useState<ContactInfo>({ name: "", phone: "", email: "", address: "", notes: "" });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [leadCaptured, setLeadCaptured] = useState(false);

    const goNext = () => setStep(s => s + 1);
    const goBack = () => setStep(s => s - 1);

    const toggleCategory = (id: string) =>
        setSelectedCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

    const toggleItem = (catId: string, itemId: string) => {
        setSelectedItems(prev => {
            const cur = prev[catId] || {};
            if (cur[itemId]) { const { [itemId]: _, ...rest } = cur; return { ...prev, [catId]: rest }; }
            return { ...prev, [catId]: { ...cur, [itemId]: 1 } };
        });
    };

    const updateQty = (catId: string, itemId: string, delta: number) => {
        setSelectedItems(prev => {
            const cur = prev[catId] || {};
            const qty = (cur[itemId] || 1) + delta;
            if (qty <= 0) { const { [itemId]: _, ...rest } = cur; return { ...prev, [catId]: rest }; }
            return { ...prev, [catId]: { ...cur, [itemId]: qty } };
        });
    };

    const totalItems = Object.values(selectedItems).reduce(
        (s, c) => s + Object.values(c).reduce((a, q) => a + q, 0), 0
    );
    const totalPiles = Object.keys(pileSizes).length;

    /* ── Pricing from config ─────────────────────────────────────── */
    const pricing = siteConfig.pricing;
    const tierData = pricing.tiers.find(t => t.id === volume);
    const stairsSurcharge = pricing.surcharges.find(s => s.id === "stairs");
    const priceAdj = (location === "upstairs" || location === "basement") && stairsSurcharge?.enabled
        ? stairsSurcharge.amount : 0;

    const canProceed = () => {
        switch (step) {
            case 0: return contact.name && contact.phone && contact.email && contact.address;
            case 1: return selectedCategories.length > 0;
            case 2: {
                // Every selected category must have either items (quantity) or a pile size (pile)
                return selectedCategories.every(catId => {
                    const cat = JUNK_CATEGORIES.find(c => c.id === catId);
                    if (!cat) return false;
                    if (cat.inputType === "pile") return !!pileSizes[catId];
                    return Object.values(selectedItems[catId] || {}).some(q => q > 0);
                });
            }
            case 3: return volume !== null;
            case 4: return location !== null;
            case 5: return selectedDate !== null && selectedTime !== null;
            case 6: return true;
            default: return false;
        }
    };

    /* ── Capture lead on Step 0 completion ─────────────────────────── */
    const captureLead = useCallback(async () => {
        if (leadCaptured) { goNext(); return; }
        setSubmitting(true);
        setError("");
        try {
            const res = await fetch("/api/crm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: contact.name,
                    phone: contact.phone,
                    email: contact.email,
                    address: contact.address,
                    description: contact.notes || "Website booking started",
                    source: "WEBSITE",
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to save info.");
            if (data.leadId) localStorage.setItem("syjLeadId", data.leadId);
            setLeadCaptured(true);
            goNext();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }, [contact, leadCaptured]);

    /* ── Final booking submit ─────────────────────────────────────── */
    const handleSubmit = useCallback(async () => {
        setSubmitting(true);
        setError("");
        try {
            const leadId = typeof window !== "undefined" ? localStorage.getItem("syjLeadId") : null;
            // Build item summary from selected items + pile sizes
            const qtyItems = Object.entries(selectedItems)
                .flatMap(([, items]) => Object.entries(items).filter(([, qty]) => qty > 0).map(([name, qty]) => qty > 1 ? `${name} (×${qty})` : name));
            const pileItems = Object.entries(pileSizes)
                .map(([catId, size]) => {
                    const cat = JUNK_CATEGORIES.find(c => c.id === catId);
                    return `${cat?.label || catId}: ${PILE_SIZES.find(p => p.id === size)?.label || size}`;
                });
            const itemSummary = [...qtyItems, ...pileItems].join(", ") || `${tierData?.label || ""} junk removal`;

            const payload: Record<string, unknown> = {
                type: "booking",
                name: contact.name,
                phone: contact.phone,
                email: contact.email,
                address: contact.address,
                date: selectedDate?.toISOString().split("T")[0],
                timeSlot: selectedTime?.toUpperCase(),
                items: itemSummary,
                notes: contact.notes || "",
                metadata: {
                    categories: selectedCategories,
                    pileSizes,
                    volume: volume,
                    location: location,
                    priceRange: tierData ? [tierData.min + priceAdj, tierData.max + priceAdj] : null,
                    surcharges: priceAdj > 0 ? [{ id: "stairs", label: stairsSurcharge?.label, amount: priceAdj }] : [],
                },
                source: "WEBSITE",
            };
            if (leadId) payload.leadId = leadId;

            const res = await fetch("/api/crm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Booking failed");

            if (data.leadId) localStorage.setItem("syjLeadId", data.leadId);

            const params = new URLSearchParams({
                name: contact.name,
                date: selectedDate?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) || "",
                time: TIME_SLOTS.find(t => t.id === selectedTime)?.label || "",
                price: tierData ? `$${tierData.min + priceAdj} – $${tierData.max + priceAdj}` : "",
            });
            router.push(`/thank-you?${params.toString()}`);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }, [contact, selectedCategories, selectedItems, pileSizes, volume, location, selectedDate, selectedTime, tierData, priceAdj, stairsSurcharge, router]);

    const formatPhone = (val: string) => {
        const digits = val.replace(/\D/g, "").slice(0, 10);
        if (digits.length <= 3) return digits;
        if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    };

    /* ── Selection summary for Step 2 ─────────────────────────────── */
    const selectionSummary = () => {
        const parts: string[] = [];
        if (totalItems > 0) parts.push(`${totalItems} item${totalItems !== 1 ? "s" : ""}`);
        if (totalPiles > 0) parts.push(`${totalPiles} pile${totalPiles !== 1 ? "s" : ""}`);
        return parts.join(" + ") + " selected";
    };

    /* ── Render ──────────────────────────────────────────────────────────── */
    return (
        <div style={{ minHeight: "100vh", background: "var(--background)" }}>
            {/* Progress bar */}
            <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 20px 0", display: "flex", gap: 6 }}>
                {STEPS.map((_, i) => (
                    <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? "var(--brand)" : "#E2E8F0", transition: "background 0.3s" }} />
                ))}
            </div>
            <div style={{ maxWidth: 720, margin: "0 auto", padding: "8px 20px 0", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--brand)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Step {step + 1} of {STEPS.length}
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--brand)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {STEPS[step]}
                </span>
            </div>

            {/* Content */}
            <div key={step} className="fade-up" style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px 140px" }}>

                {/* ── STEP 0: Contact Info (Lead Capture) ────────────────────────── */}
                {step === 0 && (
                    <div>
                        <div style={{ textAlign: "center", marginBottom: 32 }}>
                            <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 26 }}>👋</div>
                            <h1 style={{ fontSize: 26, marginBottom: 8, color: "var(--foreground)" }}>Let&apos;s get started!</h1>
                            <p style={{ color: "var(--muted)", fontSize: 15 }}>Tell us a bit about yourself so we can prepare your custom quote.</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div>
                                <label className="label">Full Name *</label>
                                <input className="input" placeholder="John Smith" value={contact.name} onChange={e => setContact(c => ({ ...c, name: e.target.value }))} />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <div>
                                    <label className="label">Phone *</label>
                                    <input className="input" placeholder="(555) 123-4567" value={contact.phone} onChange={e => setContact(c => ({ ...c, phone: formatPhone(e.target.value) }))} />
                                </div>
                                <div>
                                    <label className="label">Email *</label>
                                    <input className="input" type="email" placeholder="john@email.com" value={contact.email} onChange={e => setContact(c => ({ ...c, email: e.target.value }))} />
                                </div>
                            </div>
                            <div>
                                <label className="label">Service Address *</label>
                                <input className="input" placeholder="1234 Main St, City, State" value={contact.address} onChange={e => setContact(c => ({ ...c, address: e.target.value }))} />
                            </div>
                            <div>
                                <label className="label">Notes (optional)</label>
                                <textarea className="input" rows={3} placeholder="Gate code, special instructions, etc." value={contact.notes} onChange={e => setContact(c => ({ ...c, notes: e.target.value }))} style={{ resize: "vertical" }} />
                            </div>
                        </div>

                        {error && (
                            <div style={{ marginTop: 16, padding: "12px 18px", borderRadius: 12, background: "#FEF2F2", border: "1px solid #FECACA", fontSize: 14, color: "#DC2626" }}>
                                {error}
                            </div>
                        )}

                        <button onClick={captureLead} disabled={!canProceed() || submitting}
                            style={{
                                width: "100%", marginTop: 24, padding: 18, borderRadius: "var(--btn-radius)", border: "none",
                                background: canProceed() && !submitting ? "linear-gradient(135deg, var(--brand), var(--brand-dark))" : "#E2E8F0",
                                color: canProceed() && !submitting ? "#fff" : "#94A3B8",
                                fontSize: 17, fontWeight: 700, cursor: canProceed() && !submitting ? "pointer" : "not-allowed",
                                fontFamily: "var(--heading-font)", boxShadow: canProceed() && !submitting ? "0 8px 24px rgba(249,115,22,0.3)" : "none",
                                transition: "all 0.2s",
                            }}>
                            {submitting ? "Saving..." : "Get My Free Quote →"}
                        </button>
                        <p style={{ textAlign: "center", fontSize: 12, color: "var(--muted)", marginTop: 12 }}>
                            No obligation — we&apos;ll prepare a custom quote based on your items.
                        </p>
                    </div>
                )}

                {/* ── STEP 1: Junk Type ──────────────────────────────────────────── */}
                {step === 1 && (
                    <div>
                        <div style={{ textAlign: "center", marginBottom: 32 }}>
                            <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 26 }}>🗑️</div>
                            <h1 style={{ fontSize: 26, marginBottom: 8, color: "var(--foreground)" }}>What kind of junk are we hauling?</h1>
                            <p style={{ color: "var(--muted)", fontSize: 15 }}>Select all categories that apply.</p>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 12 }}>
                            {JUNK_CATEGORIES.map(cat => (
                                <div key={cat.id} className="card" onClick={() => toggleCategory(cat.id)}
                                    style={{ textAlign: "center", cursor: "pointer", position: "relative", background: selectedCategories.includes(cat.id) ? "#FFF7ED" : "var(--card)", borderColor: selectedCategories.includes(cat.id) ? "var(--brand)" : undefined }}>
                                    {selectedCategories.includes(cat.id) && (
                                        <div style={{ position: "absolute", top: 10, right: 10, width: 22, height: 22, borderRadius: "50%", background: "var(--brand)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Check size={14} />
                                        </div>
                                    )}
                                    <div style={{ fontSize: 32, marginBottom: 8 }}>{cat.icon}</div>
                                    <div style={{ fontWeight: 600, fontSize: 14, color: "var(--foreground)", marginBottom: 4 }}>{cat.label}</div>
                                    <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.4 }}>{cat.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── STEP 2: Items / Pile Size ──────────────────────────────────── */}
                {step === 2 && (
                    <div>
                        <div style={{ textAlign: "center", marginBottom: 32 }}>
                            <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 26 }}>📋</div>
                            <h1 style={{ fontSize: 26, marginBottom: 8, color: "var(--foreground)" }}>Tell us what you have</h1>
                            <p style={{ color: "var(--muted)", fontSize: 15 }}>Pick items or estimate pile sizes for each category.</p>
                        </div>
                        {selectedCategories.map(catId => {
                            const cat = JUNK_CATEGORIES.find(c => c.id === catId);
                            if (!cat) return null;

                            /* ── PILE input ─────────────────────────────── */
                            if (cat.inputType === "pile") {
                                const selected = pileSizes[catId];
                                return (
                                    <div key={catId} style={{ marginBottom: 28 }}>
                                        <h3 style={{ fontFamily: "var(--heading-font)", fontSize: 15, fontWeight: 700, color: "var(--foreground)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.02em" }}>
                                            {cat.icon} {cat.label} — How big is the pile?
                                        </h3>
                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
                                            {PILE_SIZES.map(size => (
                                                <div key={size.id}
                                                    onClick={() => setPileSizes(prev => ({ ...prev, [catId]: size.id }))}
                                                    style={{
                                                        background: selected === size.id ? "#FFF7ED" : "var(--card)",
                                                        border: `2px solid ${selected === size.id ? "var(--brand)" : "var(--border, #E2E8F0)"}`,
                                                        borderRadius: 14, padding: "16px 14px", textAlign: "center", cursor: "pointer", transition: "all 0.15s",
                                                        position: "relative",
                                                    }}>
                                                    {selected === size.id && (
                                                        <div style={{ position: "absolute", top: 8, right: 8, width: 20, height: 20, borderRadius: "50%", background: "var(--brand)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                            <Check size={12} />
                                                        </div>
                                                    )}
                                                    <div style={{ fontSize: 24, marginBottom: 6 }}>{size.icon}</div>
                                                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--foreground)", marginBottom: 4 }}>{size.label}</div>
                                                    <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.4 }}>{size.desc}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }

                            /* ── QUANTITY input ─────────────────────────── */
                            const items = CATEGORY_ITEMS[catId] || [];
                            return (
                                <div key={catId} style={{ marginBottom: 28 }}>
                                    <h3 style={{ fontFamily: "var(--heading-font)", fontSize: 15, fontWeight: 700, color: "var(--foreground)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.02em" }}>
                                        {cat.icon} {cat.label}
                                    </h3>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
                                        {items.map(item => {
                                            const qty = (selectedItems[catId] || {})[item.id];
                                            const active = !!qty;
                                            return (
                                                <div key={item.id} onClick={() => !active && toggleItem(catId, item.id)}
                                                    style={{
                                                        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 12,
                                                        background: active ? "#FFF7ED" : "var(--card)", border: `2px solid ${active ? "var(--brand)" : "var(--border, #E2E8F0)"}`, cursor: "pointer", transition: "all 0.15s",
                                                    }}>
                                                    <div>
                                                        <div style={{ fontWeight: 600, fontSize: 13, color: "var(--foreground)" }}>{item.label}</div>
                                                        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{item.weight === "heavy" ? "⚠️ Heavy" : item.weight === "medium" ? "Medium" : "Light"}</div>
                                                    </div>
                                                    {active ? (
                                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }} onClick={e => e.stopPropagation()}>
                                                            <button onClick={() => updateQty(catId, item.id, -1)} style={{ width: 30, height: 30, borderRadius: "50%", border: "2px solid var(--brand)", background: "none", color: "var(--brand)", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                                                            <span style={{ fontWeight: 700, fontSize: 16, color: "var(--brand)", minWidth: 20, textAlign: "center" }}>{qty}</span>
                                                            <button onClick={() => updateQty(catId, item.id, 1)} style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: "var(--brand)", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                                                        </div>
                                                    ) : (
                                                        <span style={{ padding: "4px 16px", borderRadius: 20, border: "1.5px solid var(--border, #E2E8F0)", fontSize: 12, fontWeight: 600, color: "var(--muted)" }}>Add</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                        {(totalItems > 0 || totalPiles > 0) && (
                            <div style={{ padding: "12px 18px", borderRadius: 12, background: "#FFF7ED", border: "1px solid #FFEDD5", textAlign: "center", fontWeight: 600, fontSize: 14, color: "#EA580C", marginTop: 8 }}>
                                {selectionSummary()}
                            </div>
                        )}
                    </div>
                )}

                {/* ── STEP 3: Volume ──────────────────────────────────────────────── */}
                {step === 3 && (
                    <div>
                        <div style={{ textAlign: "center", marginBottom: 32 }}>
                            <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 26 }}>🚛</div>
                            <h1 style={{ fontSize: 26, marginBottom: 8, color: "var(--foreground)" }}>How much space will it take?</h1>
                            <p style={{ color: "var(--muted)", fontSize: 15 }}>Estimate how much of our {pricing.truckSize} truck your junk will fill.</p>
                        </div>
                        <div style={{ textAlign: "center", marginBottom: 28 }}>
                            <TruckVisual fillPercent={VOLUME_OPTIONS.find(v => v.id === volume)?.truckFill ?? 0} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                            {VOLUME_OPTIONS.map(v => {
                                const tier = pricing.tiers.find(t => t.id === v.id);
                                return (
                                    <div key={v.id} onClick={() => setVolume(v.id)}
                                        style={{
                                            background: volume === v.id ? "#FFF7ED" : "var(--card)", border: `2px solid ${volume === v.id ? "var(--brand)" : "var(--border, #E2E8F0)"}`,
                                            borderRadius: 14, padding: "16px 18px", textAlign: "left", cursor: "pointer", transition: "all 0.2s",
                                        }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                                            <span style={{ fontWeight: 700, fontSize: 15, color: "var(--foreground)" }}>{v.label}</span>
                                            <span style={{ fontSize: 12, fontWeight: 700, padding: "2px 10px", borderRadius: 20, background: volume === v.id ? "#FFEDD5" : "var(--border, #F1F5F9)", color: volume === v.id ? "var(--brand)" : "var(--muted)" }}>{v.fraction}</span>
                                        </div>
                                        <div style={{ fontSize: 12, color: "var(--muted)" }}>{v.desc}</div>
                                        {tier && (
                                            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--brand)", marginTop: 8 }}>${tier.min} – ${tier.max}</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ── STEP 4: Location ────────────────────────────────────────────── */}
                {step === 4 && (
                    <div>
                        <div style={{ textAlign: "center", marginBottom: 32 }}>
                            <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 26 }}>📍</div>
                            <h1 style={{ fontSize: 26, marginBottom: 8, color: "var(--foreground)" }}>Where is the junk located?</h1>
                            <p style={{ color: "var(--muted)", fontSize: 15 }}>This helps us plan access and determine crew size.</p>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                            {LOCATION_OPTIONS.map(loc => (
                                <div key={loc.id} className="card" onClick={() => setLocation(loc.id)}
                                    style={{ textAlign: "center", cursor: "pointer", position: "relative", background: location === loc.id ? "#FFF7ED" : "var(--card)", borderColor: location === loc.id ? "var(--brand)" : undefined }}>
                                    {location === loc.id && (
                                        <div style={{ position: "absolute", top: 10, right: 10, width: 22, height: 22, borderRadius: "50%", background: "var(--brand)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Check size={14} />
                                        </div>
                                    )}
                                    <div style={{ fontSize: 32, marginBottom: 8 }}>{loc.icon}</div>
                                    <div style={{ fontWeight: 600, fontSize: 14, color: "var(--foreground)", marginBottom: 4 }}>{loc.label}</div>
                                    <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.4 }}>{loc.desc}</div>
                                </div>
                            ))}
                        </div>
                        {(location === "upstairs" || location === "basement") && stairsSurcharge?.enabled && (
                            <div style={{ marginTop: 16, padding: "12px 18px", borderRadius: 12, background: "#FFFBEB", border: "1px solid #FEF3C7", fontSize: 13, color: "#92400E", display: "flex", alignItems: "center", gap: 8 }}>
                                ⚠️ Stairs access may add ${stairsSurcharge.amount} to the estimate due to extra labor.
                            </div>
                        )}
                    </div>
                )}

                {/* ── STEP 5: Schedule ────────────────────────────────────────────── */}
                {step === 5 && (
                    <div>
                        <div style={{ textAlign: "center", marginBottom: 32 }}>
                            <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 26 }}>📅</div>
                            <h1 style={{ fontSize: 26, marginBottom: 8, color: "var(--foreground)" }}>Pick a date & time</h1>
                            <p style={{ color: "var(--muted)", fontSize: 15 }}>You can reschedule after booking if needed.</p>
                        </div>
                        <div style={{ background: "var(--card)", borderRadius: 16, padding: 24, border: "1px solid var(--border, #E2E8F0)", marginBottom: 24 }}>
                            <Calendar selected={selectedDate} onSelect={setSelectedDate} />
                        </div>
                        {selectedDate && (
                            <div>
                                <div style={{ fontFamily: "var(--heading-font)", fontSize: 16, fontWeight: 700, color: "var(--foreground)", marginBottom: 12, textAlign: "center" }}>
                                    Available times for {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                                    {TIME_SLOTS.map(slot => (
                                        <button key={slot.id} onClick={() => setSelectedTime(slot.id)}
                                            style={{
                                                border: `2px solid ${selectedTime === slot.id ? "var(--brand)" : "var(--border, #E2E8F0)"}`, background: selectedTime === slot.id ? "#FFF7ED" : "var(--card)",
                                                borderRadius: 12, padding: 16, textAlign: "center", cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
                                            }}>
                                            <div style={{ fontWeight: 600, fontSize: 14, color: selectedTime === slot.id ? "var(--brand)" : "var(--foreground)" }}>{slot.label}</div>
                                            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{slot.period}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ── STEP 6: Quote Summary & Book ──────────────────────────────────── */}
                {step === 6 && (
                    <div>
                        <div style={{ textAlign: "center", marginBottom: 32 }}>
                            <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, var(--brand), var(--brand-dark))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                                <Check size={24} color="#fff" />
                            </div>
                            <h1 style={{ fontSize: 26, marginBottom: 8, color: "var(--foreground)" }}>Your Junk Removal Estimate</h1>
                            <p style={{ color: "var(--muted)", fontSize: 15 }}>Review your details below. Final price confirmed on-site.</p>
                        </div>
                        <div style={{ background: "var(--card)", borderRadius: 20, border: "1px solid var(--border, #E2E8F0)", overflow: "hidden", marginBottom: 24, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
                            <div style={{ background: "var(--hero-bg)", padding: "32px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
                                <div style={{ fontSize: 12, color: "var(--hero-muted, #94A3B8)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4, position: "relative", zIndex: 1 }}>
                                    Estimated Price Range
                                </div>
                                <div style={{ fontFamily: "var(--heading-font)", fontSize: 44, fontWeight: 800, color: "var(--hero-text)", letterSpacing: "-0.03em", position: "relative", zIndex: 1 }}>
                                    ${tierData ? tierData.min + priceAdj : "—"} – ${tierData ? tierData.max + priceAdj : "—"}
                                </div>
                                {priceAdj > 0 && <div style={{ fontSize: 12, color: "#FBBF24", marginTop: 6, position: "relative", zIndex: 1 }}>Includes +${priceAdj} {stairsSurcharge?.label?.toLowerCase() || "stairs"} surcharge</div>}
                            </div>
                            <div style={{ padding: 24 }}>
                                {[
                                    { label: "Name", value: contact.name },
                                    { label: "Phone", value: contact.phone },
                                    { label: "Address", value: contact.address },
                                    { label: "Junk Types", value: selectedCategories.map(c => JUNK_CATEGORIES.find(x => x.id === c)?.label).join(", ") },
                                    { label: "Details", value: selectionSummary() },
                                    { label: "Truck Load", value: tierData?.label || "—" },
                                    { label: "Location", value: LOCATION_OPTIONS.find(l => l.id === location)?.label || "—" },
                                    { label: "Date", value: selectedDate?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) || "—" },
                                    { label: "Time", value: TIME_SLOTS.find(t => t.id === selectedTime)?.label || "—" },
                                ].map((row, i) => (
                                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < 8 ? "1px solid var(--border, #F1F5F9)" : "none" }}>
                                        <span style={{ fontSize: 14, color: "var(--muted)", fontWeight: 500 }}>{row.label}</span>
                                        <span style={{ fontSize: 14, color: "var(--foreground)", fontWeight: 600, textAlign: "right", maxWidth: "60%" }}>{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div style={{ marginTop: 16, padding: "12px 18px", borderRadius: 12, background: "#FEF2F2", border: "1px solid #FECACA", fontSize: 14, color: "#DC2626" }}>
                                {error}
                            </div>
                        )}

                        <button onClick={handleSubmit} disabled={submitting}
                            style={{
                                width: "100%", marginTop: 24, padding: 18, borderRadius: "var(--btn-radius)", border: "none",
                                background: !submitting ? "linear-gradient(135deg, var(--brand), var(--brand-dark))" : "#E2E8F0",
                                color: !submitting ? "#fff" : "#94A3B8",
                                fontSize: 17, fontWeight: 700, cursor: !submitting ? "pointer" : "not-allowed",
                                fontFamily: "var(--heading-font)", boxShadow: !submitting ? "0 8px 24px rgba(249,115,22,0.3)" : "none",
                                transition: "all 0.2s",
                            }}>
                            {submitting ? "Booking..." : "Confirm & Book My Pickup →"}
                        </button>
                        <p style={{ textAlign: "center", fontSize: 12, color: "var(--muted)", marginTop: 12 }}>
                            No commitment — final price confirmed when our crew arrives.
                        </p>
                    </div>
                )}
            </div>

            {/* ── Footer Nav (Steps 1-5 only) ─────────────────────────────────── */}
            {step > 0 && step < 6 && (
                <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "var(--card)", borderTop: "1px solid var(--border, #E2E8F0)", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 50 }}>
                    <button onClick={goBack} style={{ border: "none", background: "none", fontSize: 15, color: "var(--muted)", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" }}>
                        <ChevronLeft size={18} /> Back
                    </button>
                    <button onClick={goNext} disabled={!canProceed()}
                        style={{
                            padding: "14px 44px", borderRadius: "var(--btn-radius)", border: "none", fontSize: 15, fontWeight: 700, cursor: canProceed() ? "pointer" : "not-allowed",
                            fontFamily: "inherit", transition: "all 0.2s",
                            background: canProceed() ? "var(--brand)" : "#E2E8F0",
                            color: canProceed() ? "#fff" : "#94A3B8",
                            boxShadow: canProceed() ? "0 4px 16px rgba(249,115,22,0.3)" : "none",
                        }}>
                        Continue
                    </button>
                </div>
            )}
        </div>
    );
}
