"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { loadGoogleMapsLibrary } from "@/lib/googleMapsLoader";
import { siteConfig, type SiteConfig } from "@/lib/siteConfig";

type GoogleMapConstructor = new (element: HTMLElement, options: Record<string, unknown>) => {
    fitBounds: (bounds: unknown, padding?: number) => void;
};
type GoogleCircleConstructor = new (options: Record<string, unknown>) => {
    getBounds: () => unknown;
};

type MapsLibrary = {
    Map: GoogleMapConstructor;
    Circle: GoogleCircleConstructor;
};

function cleanSlug(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

function areaNames(config: SiteConfig, limit = 10): string[] {
    const values = [config.city, ...config.serviceArea.split(/[,;]/)];
    const seen = new Set<string>();
    const result: string[] = [];

    for (const value of values) {
        const clean = value.replace(/\s+/g, " ").trim();
        const key = clean.toLowerCase();
        if (!clean || seen.has(key)) continue;
        if (["your area", "service area", "surrounding areas", "near me", "nearby"].includes(key)) continue;
        if (/^\d{5}(?:-\d{4})?$/.test(clean)) continue;
        seen.add(key);
        result.push(clean);
    }

    return result.slice(0, limit);
}

function milesToMeters(miles: number): number {
    return miles * 1609.344;
}

export default function ServiceAreaMap({
    config = siteConfig,
    className = "",
}: {
    config?: SiteConfig;
    className?: string;
}) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [failed, setFailed] = useState(false);
    const areas = useMemo(() => areaNames(config), [config]);
    const hasMapConfig = Boolean(
        config.googleMapsKey
        && config.centerLat !== null
        && config.centerLng !== null
        && config.maxRadius
        && config.maxRadius > 0,
    );

    useEffect(() => {
        if (!hasMapConfig || !mapRef.current) return;
        let cancelled = false;

        loadGoogleMapsLibrary<MapsLibrary>(config.googleMapsKey, "maps")
            .then(({ Map, Circle }) => {
                if (cancelled || !mapRef.current || config.centerLat === null || config.centerLng === null || !config.maxRadius) return;

                const center = { lat: config.centerLat, lng: config.centerLng };
                const map = new Map(mapRef.current, {
                    center,
                    zoom: 10,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                    clickableIcons: false,
                    gestureHandling: "cooperative",
                    zoomControl: true,
                    styles: [
                        { featureType: "poi", stylers: [{ visibility: "off" }] },
                        { featureType: "transit", stylers: [{ visibility: "off" }] },
                    ],
                });

                const circle = new Circle({
                    center,
                    radius: milesToMeters(config.maxRadius),
                    map,
                    strokeColor: "#ff6a00",
                    strokeOpacity: 0.95,
                    strokeWeight: 3,
                    fillColor: "#ff6a00",
                    fillOpacity: 0.18,
                });

                map.fitBounds(circle.getBounds(), 32);
            })
            .catch(() => {
                if (!cancelled) setFailed(true);
            });

        return () => {
            cancelled = true;
        };
    }, [config.centerLat, config.centerLng, config.googleMapsKey, config.maxRadius, hasMapConfig]);

    if (!hasMapConfig || failed) {
        return (
            <div className={`service-area-map fallback ${className}`} aria-label="Service area coverage">
                <div className="coverage-fallback">
                    <span className="eyebrow">Service coverage</span>
                    <h3>Address coverage is confirmed during booking.</h3>
                    <p>
                        {config.companyName} uses the pickup address and configured service area to confirm whether a job is in range.
                    </p>
                    {areas.length > 0 && (
                        <div className="area-chips">
                            {areas.map((area) => (
                                <Link className="area-chip" href={`/locations/${cleanSlug(area)}`} key={area}>
                                    {area}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={`service-area-map ${className}`} aria-label="Google map showing service area radius">
            <div ref={mapRef} className="service-area-map-canvas" />
            <div className="map-radius-badge">
                <span>Service radius</span>
                <strong>{config.maxRadius} mi</strong>
            </div>
        </div>
    );
}
