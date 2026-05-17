"use client";

import { useState, type CSSProperties } from "react";

export type VisualPricingTier = {
    tag: string;
    name: string;
    note: string;
    range: string;
    fill: number;
};

export type VisualPricingFactor = {
    key: string;
    title: string;
    detail: string;
};

export default function VisualPricingScaleClient({
    tiers,
    factors,
    disclaimer,
    sectionId,
    eyebrow = "Load pricing",
    title = "Pick the load that fits the job.",
    factorsEyebrow = "Final quote factors",
    factorsTitle = "What affects your final quote.",
}: {
    tiers: VisualPricingTier[];
    factors: VisualPricingFactor[];
    disclaimer: string;
    sectionId?: string;
    eyebrow?: string;
    title?: string;
    factorsEyebrow?: string;
    factorsTitle?: string;
}) {
    const [active, setActive] = useState(Math.max(0, tiers.length - 1));
    const tier = tiers[active] || tiers[0];
    if (!tier) return null;
    const progress = tiers.length > 1 ? (active / (tiers.length - 1)) * 100 : 100;

    return (
        <section className="syj-ps-section" id={sectionId}>
            <div className="syj-ps-inner">
                <div className="syj-ps-main">
                    <div className="syj-ps-eyebrow">
                        <span className="syj-ps-eyebrow-rule" />
                        {eyebrow}
                    </div>
                    <h2 className="syj-ps-title">{title}</h2>

                    <div className="syj-ps-scale" role="tablist" aria-label="Load tiers">
                        <div className="syj-ps-track" aria-hidden="true">
                            <span className="syj-ps-track-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="syj-ps-nodes">
                            {tiers.map((row, index) => {
                                const isActive = index === active;
                                const isPassed = index <= active;
                                return (
                                    <button
                                        key={`${row.name}-${row.range}`}
                                        type="button"
                                        role="tab"
                                        aria-selected={isActive}
                                        className={`syj-ps-node${isActive ? " is-active" : ""}${isPassed ? " is-passed" : ""}`}
                                        onClick={() => setActive(index)}
                                    >
                                        <span className="syj-ps-node-dot">
                                            <span
                                                className="syj-ps-node-fill"
                                                style={{ transform: `scale(${0.34 + row.fill * 0.66})` } as CSSProperties}
                                            />
                                        </span>
                                        <span className="syj-ps-node-tag">{row.tag}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="syj-ps-readout" key={tier.name}>
                        <div className="syj-ps-readout-head">
                            <div>
                                <span className="syj-ps-readout-tag">{tier.tag}</span>
                                <h3 className="syj-ps-readout-name">{tier.name}</h3>
                                <p className="syj-ps-readout-note">{tier.note}</p>
                            </div>
                            <div className="syj-ps-readout-price">
                                <span className="syj-ps-readout-price-label">Planning range</span>
                                <span className="syj-ps-readout-price-value">{tier.range}</span>
                            </div>
                        </div>
                    </div>

                    <ul className="syj-ps-list">
                        {tiers.map((row, index) => (
                            <li
                                key={`${row.name}-row`}
                                className={`syj-ps-list-row${index === active ? " is-active" : ""}`}
                                onClick={() => setActive(index)}
                            >
                                <span className="syj-ps-list-name">{row.name}</span>
                                <span className="syj-ps-list-dots" aria-hidden="true" />
                                <span className="syj-ps-list-range">{row.range}</span>
                            </li>
                        ))}
                    </ul>

                    <p className="syj-ps-disclaimer">{disclaimer}</p>
                </div>

                <aside className="syj-ps-panel">
                    <div className="syj-ps-eyebrow">
                        <span className="syj-ps-eyebrow-rule" />
                        {factorsEyebrow}
                    </div>
                    <h2 className="syj-ps-panel-title">{factorsTitle}</h2>

                    <ul className="syj-ps-factors">
                        {factors.map((factor) => (
                            <li key={factor.key} className="syj-ps-factor">
                                <span className="syj-ps-factor-key">{factor.key}</span>
                                <div className="syj-ps-factor-text">
                                    <span className="syj-ps-factor-title">{factor.title}</span>
                                    <span className="syj-ps-factor-detail">{factor.detail}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </aside>
            </div>
        </section>
    );
}
