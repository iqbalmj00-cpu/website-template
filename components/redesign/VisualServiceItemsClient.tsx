"use client";

import { useState } from "react";
import {
    Armchair,
    Bed,
    Briefcase,
    Building2,
    Droplets,
    Footprints,
    HardHat,
    Home,
    Laptop,
    Package,
    Refrigerator,
    Shield,
    TreePine,
    Truck,
    Waves,
    Wind,
    Wrench,
    type LucideIcon,
} from "lucide-react";

export type VisualServiceItem = {
    name: string;
    detail: string;
    reviewedFor: string;
    scopeNote: string;
};

const ICONS: LucideIcon[] = [Package, Home, Truck, Shield, Wrench, Building2];

function iconForItem(name: string, index: number): LucideIcon {
    const key = name.toLowerCase();
    if (key.includes("acrylic") || key.includes("hot tub") || key.includes("spa")) return Waves;
    if (key.includes("wood") || key.includes("yard") || key.includes("brush") || key.includes("tree")) return TreePine;
    if (key.includes("swim") || key.includes("water")) return Droplets;
    if (key.includes("inflatable")) return Wind;
    if (key.includes("cover")) return Shield;
    if (key.includes("step") || key.includes("surround")) return Footprints;
    if (key.includes("furniture") || key.includes("sofa") || key.includes("couch")) return Armchair;
    if (key.includes("appliance") || key.includes("refrigerator") || key.includes("washer")) return Refrigerator;
    if (key.includes("mattress") || key.includes("bed")) return Bed;
    if (key.includes("electronic") || key.includes("tv") || key.includes("computer")) return Laptop;
    if (key.includes("construction") || key.includes("demolition")) return HardHat;
    if (key.includes("manager") || key.includes("commercial")) return Briefcase;
    return ICONS[index % ICONS.length];
}

export default function VisualServiceItemsClient({
    eyebrow,
    title,
    intro,
    items,
}: {
    eyebrow: string;
    title: string;
    intro: string;
    items: VisualServiceItem[];
}) {
    const [active, setActive] = useState(0);
    const current = items[active] || items[0];
    if (!current) return null;
    const CurrentIcon = iconForItem(current.name, active);

    return (
        <section className="syj-hi-section">
            <div className="syj-hi-inner">
                <header className="syj-hi-head">
                    <div className="syj-hi-head-main">
                        <div className="syj-hi-eyebrow">
                            <span className="syj-hi-eyebrow-rule" />
                            {eyebrow}
                        </div>
                        <h2 className="syj-hi-title">{title}</h2>
                    </div>
                    <p className="syj-hi-intro">{intro}</p>
                </header>

                <div className="syj-hi-body">
                    <div className="syj-hi-list" role="tablist" aria-label="Accepted item types">
                        {items.map((item, index) => {
                            const Icon = iconForItem(item.name, index);
                            const isActive = index === active;
                            return (
                                <button
                                    key={item.name}
                                    type="button"
                                    role="tab"
                                    aria-selected={isActive}
                                    className={`syj-hi-item${isActive ? " is-active" : ""}`}
                                    onClick={() => setActive(index)}
                                >
                                    <span className="syj-hi-item-icon">
                                        <Icon aria-hidden="true" />
                                    </span>
                                    <span className="syj-hi-item-name">{item.name}</span>
                                    <span className="syj-hi-item-idx">{String(index + 1).padStart(2, "0")}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="syj-hi-detail" key={current.name}>
                        <span aria-hidden="true" className="syj-hi-detail-watermark">
                            <CurrentIcon />
                        </span>
                        <div className="syj-hi-detail-header">
                            <span className="syj-hi-detail-icon">
                                <CurrentIcon aria-hidden="true" />
                            </span>
                            <span className="syj-hi-detail-tag">Accepted item · {String(active + 1).padStart(2, "0")}</span>
                            <h3 className="syj-hi-detail-name">{current.name}</h3>
                            <p className="syj-hi-detail-text">{current.detail}</p>
                        </div>
                        <dl className="syj-hi-detail-rows">
                            <div className="syj-hi-detail-row">
                                <dt>Reviewed for</dt>
                                <dd>{current.reviewedFor}</dd>
                            </div>
                            <div className="syj-hi-detail-row">
                                <dt>Scope note</dt>
                                <dd>{current.scopeNote}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </section>
    );
}
