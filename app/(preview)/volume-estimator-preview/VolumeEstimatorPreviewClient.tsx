"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Check, ChevronLeft, Truck } from "lucide-react";
import { VolumeEstimator } from "@/components/booking/VolumeEstimator";
import { roundTo5, siteConfig } from "@/lib/siteConfig";
import { MULTI_LOAD_EDGE_CASE_ID } from "@/lib/bookingLogic";
import { EDGE_CASES, LOAD_TIERS, LOCATION_OPTIONS } from "@/lib/wizardData";

function EdgeToggle({
    item,
    checked,
    onChange,
}: {
    item: typeof EDGE_CASES[number];
    checked: boolean;
    onChange: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onChange}
            style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 0",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "inherit",
            }}
        >
            <span
                style={{
                    width: 22,
                    height: 22,
                    borderRadius: 7,
                    border: checked ? "2px solid var(--brand)" : "2px solid var(--border, #cbd5e1)",
                    background: checked ? "var(--brand)" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                {checked && <Check size={13} color="#fff" strokeWidth={3} />}
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 14, fontWeight: 700, color: "var(--foreground)", lineHeight: 1.25 }}>
                    {item.label}
                </span>
                {item.detail && (
                    <span style={{ display: "block", fontSize: 12, color: "var(--muted)", lineHeight: 1.35, marginTop: 2 }}>
                        {item.detail}
                    </span>
                )}
            </span>
        </button>
    );
}

export default function VolumeEstimatorPreviewClient() {
    const [tierIndex, setTierIndex] = useState(1);
    const [location, setLocation] = useState<string | null>(null);
    const [edgeCases, setEdgeCases] = useState<Record<string, boolean>>({});

    useEffect(() => {
        document.body.style.overflowX = "hidden";
        return () => {
            document.body.style.overflowX = "";
        };
    }, []);

    const volume = LOAD_TIERS[tierIndex].volumeId;
    const pricing = siteConfig.pricing;
    const tierData = pricing.tiers.find(t => t.id === volume);
    const accessSurcharge = pricing.surcharges.find(s => s.id === "access");
    const heavySurcharge = pricing.surcharges.find(s => s.id === "heavy_material");
    const applianceSurcharge = pricing.surcharges.find(s => s.id === "appliance");
    const accessAmount = location && accessSurcharge?.enabled
        ? (accessSurcharge.amountsByLocation?.[location] ?? 0)
        : 0;
    const heavyAmount = edgeCases.heavy && heavySurcharge?.enabled
        ? (heavySurcharge.amountsByTier?.[tierIndex] ?? heavySurcharge.amount)
        : 0;
    const applianceAmount = edgeCases.specialty && applianceSurcharge?.enabled
        ? applianceSurcharge.amount
        : 0;
    const totalAdj = accessAmount + heavyAmount + applianceAmount;
    const isOnSiteEstimate = !!edgeCases.unknown || !!edgeCases[MULTI_LOAD_EDGE_CASE_ID] || volume === "multi";
    const canProceed = !!edgeCases.unknown || location !== null;

    const toggleEdge = (id: string) => {
        setEdgeCases(prev => {
            const next = { ...prev, [id]: !prev[id] };
            if (id === "unknown" && next.unknown) setLocation(null);
            return next;
        });
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--background)", paddingBottom: 96 }}>
            <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 20px 0", display: "flex", gap: 6 }}>
                {[0, 1, 2, 3, 4].map(i => (
                    <div
                        key={i}
                        style={{
                            flex: 1,
                            height: 4,
                            borderRadius: 2,
                            background: i <= 2 ? "var(--brand)" : "#E2E8F0",
                        }}
                    />
                ))}
            </div>

            <div style={{ maxWidth: 720, margin: "0 auto", padding: "8px 20px 0", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--brand)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Step 3 of 5
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--brand)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Load & Access
                </span>
            </div>

            <div className="fade-up" style={{ maxWidth: 920, margin: "0 auto", padding: "32px 20px 140px" }}>
                <div>
                    <div style={{ textAlign: "center", marginBottom: 12 }}>
                        <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(var(--brand-rgb, 249,115,22),0.1)", border: "1px solid rgba(var(--brand-rgb, 249,115,22),0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                            <Truck size={26} color="var(--brand)" />
                        </div>
                        <h1 style={{ fontFamily: "var(--heading-font)", fontSize: 24, fontWeight: 700, color: "var(--foreground)", margin: "0 0 4px", letterSpacing: -0.3 }}>
                            How much junk are we hauling?
                        </h1>
                        <p style={{ fontSize: 14, color: "var(--muted)", margin: 0 }}>
                            Pick the closest real-world load size before we price the visit.
                        </p>
                    </div>

                    <div style={{ margin: "0 12px" }}>
                        <VolumeEstimator
                            levels={LOAD_TIERS}
                            value={tierIndex}
                            onChange={setTierIndex}
                            brandColor={siteConfig.brandColor}
                        />
                    </div>

                    <div style={{ margin: "20px 12px 0", padding: "20px 24px", background: "var(--card, #fff)", borderRadius: "var(--card-radius, 16px)", border: "1px solid var(--border, #e2e8f0)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                            <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 10, background: "rgba(var(--brand-rgb, 249,115,22),0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Truck size={20} color="var(--brand)" />
                            </div>
                            <div style={{ fontFamily: "var(--heading-font)", fontSize: 22, fontWeight: 700, color: "var(--foreground)", lineHeight: 1.2 }}>
                                {LOAD_TIERS[tierIndex].title}
                                {LOAD_TIERS[tierIndex].popular && (
                                    <span style={{ fontSize: 10, fontWeight: 700, color: "var(--brand)", background: "rgba(var(--brand-rgb, 249,115,22),0.06)", padding: "2px 8px", borderRadius: 999, marginLeft: 8, verticalAlign: "middle", letterSpacing: 0.3, textTransform: "uppercase" }}>
                                        Standard option
                                    </span>
                                )}
                            </div>
                        </div>
                        <p style={{ fontSize: 14, color: "var(--muted)", margin: 0, lineHeight: 1.55, paddingLeft: 52 }}>
                            {LOAD_TIERS[tierIndex].desc}
                        </p>
                    </div>

                    <div style={{ margin: "12px 12px 0", padding: "12px 16px", background: "#f0fdf4", borderRadius: 12, border: "1px solid #bbf7d0", display: "flex", alignItems: "center", gap: 10 }}>
                        <Check size={18} color="#16a34a" style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: 12.5, color: "#15803d", lineHeight: 1.4 }}>
                            <strong>You only pay for what we haul.</strong> This is just an estimate we provide you and final price is finalized on-site.
                        </span>
                    </div>

                    {!edgeCases.unknown && (
                        <div style={{ margin: "12px 12px 0", padding: "18px 20px", background: "var(--card, #fff)", borderRadius: "var(--card-radius, 16px)", border: "1px solid var(--border, #e2e8f0)", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
                            <label htmlFor="access-select" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 4 }}>
                                Where is the junk located?
                            </label>
                            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>
                                Helps us plan access and price it accurately.
                            </p>
                            <select
                                id="access-select"
                                className="input"
                                value={location || ""}
                                onChange={(event) => setLocation(event.target.value || null)}
                                style={{ width: "100%", cursor: "pointer" }}
                            >
                                <option value="">Select access location...</option>
                                {LOCATION_OPTIONS.map(loc => {
                                    const surchargeForLoc = accessSurcharge?.enabled
                                        ? (accessSurcharge.amountsByLocation?.[loc.id] ?? 0)
                                        : 0;
                                    return (
                                        <option key={loc.id} value={loc.id}>
                                            {loc.label}{surchargeForLoc > 0 ? ` (+$${surchargeForLoc})` : ""}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    )}

                    <div style={{ margin: "12px 12px 0", padding: "18px 20px", background: "var(--card, #fff)", borderRadius: "var(--card-radius, 16px)", border: "1px solid var(--border, #e2e8f0)", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 4 }}>
                            Does your load include any of the following?
                        </div>
                        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>
                            These may require a custom quote.
                        </div>
                        {EDGE_CASES.map((item, index) => (
                            <div key={item.id}>
                                {index > 0 && <div style={{ height: 1, background: "var(--border, #f1f5f9)" }} />}
                                <EdgeToggle item={item} checked={!!edgeCases[item.id]} onChange={() => toggleEdge(item.id)} />
                            </div>
                        ))}
                        {edgeCases.heavy && heavySurcharge?.enabled && (
                            <div style={{ marginTop: 12, padding: "12px 18px", borderRadius: 12, background: "#FFFBEB", border: "1px solid #FEF3C7", fontSize: 13, color: "#92400E", display: "flex", alignItems: "center", gap: 8 }}>
                                <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                                Heavy or dense items add <strong style={{ margin: "0 2px" }}>${heavyAmount}</strong> to this estimate based on your selected load size.
                            </div>
                        )}
                        {edgeCases.specialty && applianceSurcharge?.enabled && (
                            <div style={{ marginTop: 12, padding: "12px 18px", borderRadius: 12, background: "#FFFBEB", border: "1px solid #FEF3C7", fontSize: 13, color: "#92400E", display: "flex", alignItems: "center", gap: 8 }}>
                                <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                                Appliances and e-waste add <strong style={{ margin: "0 2px" }}>${applianceAmount}</strong> to this estimate due to special handling.
                            </div>
                        )}
                        {isOnSiteEstimate && (
                            <div style={{ marginTop: 12, padding: "10px 14px", background: "#FFFBEB", borderRadius: 10, border: "1px solid #FDE68A", display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: "#92400E", lineHeight: 1.5 }}>
                                <AlertTriangle size={16} style={{ marginTop: 1, flexShrink: 0 }} />
                                <span><strong>No worries.</strong> We&apos;ll send a crew to give you a free, no-obligation estimate on-site before any work begins.</span>
                            </div>
                        )}
                    </div>

                    <div style={{ margin: "12px 12px 0", padding: "20px 24px", background: "var(--card, #fff)", borderRadius: "var(--card-radius, 16px)", border: "1px solid var(--border, #e2e8f0)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                        {isOnSiteEstimate ? (
                            <div style={{ padding: "14px 20px", background: "rgba(var(--foreground-rgb, 0,0,0),0.03)", borderRadius: 12, textAlign: "center" }}>
                                <span style={{ fontFamily: "var(--heading-font)", fontSize: 15, fontWeight: 700, color: "var(--foreground)" }}>
                                    Free On-Site Estimate
                                </span>
                            </div>
                        ) : (
                            <>
                                <div style={{ padding: "14px 20px", background: "linear-gradient(135deg, rgba(var(--brand-rgb, 249,115,22),0.06) 0%, rgba(var(--brand-rgb, 249,115,22),0.02) 100%)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                                    <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>Estimated Range</span>
                                    {tierData && (
                                        <span style={{ fontFamily: "var(--heading-font)", fontSize: 26, fontWeight: 800, color: "var(--foreground)", letterSpacing: -0.5 }}>
                                            ${roundTo5(tierData.min + totalAdj)} - ${roundTo5(tierData.max + totalAdj)}
                                        </span>
                                    )}
                                    <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>Finalized on-site</span>
                                </div>
                                {totalAdj > 0 && (
                                    <div style={{ marginTop: 10, fontSize: 12, color: "var(--muted)", textAlign: "center", lineHeight: 1.5 }}>
                                        {[
                                            accessAmount > 0 && location ? `+$${accessAmount} ${LOCATION_OPTIONS.find(l => l.id === location)?.label.toLowerCase() || "access"}` : null,
                                            heavyAmount > 0 ? `+$${heavyAmount} heavy material` : null,
                                            applianceAmount > 0 ? `+$${applianceAmount} appliance` : null,
                                        ].filter(Boolean).join(" · ")}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "var(--card)", borderTop: "1px solid var(--border, #E2E8F0)", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 50 }}>
                <button type="button" style={{ border: "none", background: "none", fontSize: 15, color: "var(--muted)", fontWeight: 600, cursor: "default", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" }}>
                    <ChevronLeft size={18} /> Back
                </button>
                <button
                    type="button"
                    disabled={!canProceed}
                    style={{
                        padding: "14px 44px",
                        borderRadius: "var(--btn-radius)",
                        border: "none",
                        fontSize: 15,
                        fontWeight: 700,
                        cursor: canProceed ? "pointer" : "not-allowed",
                        fontFamily: "inherit",
                        background: canProceed ? "var(--brand)" : "#E2E8F0",
                        color: canProceed ? "#fff" : "#94A3B8",
                        boxShadow: canProceed ? "0 4px 16px rgba(var(--brand-rgb, 249,115,22),0.3)" : "none",
                    }}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}
