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

type MapStyle = Array<Record<string, unknown>>;

const MAP_STYLES: Record<string, MapStyle> = {
    classic: [
        { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#41534a" }] },
        { featureType: "all", elementType: "labels.text.stroke", stylers: [{ color: "#fbf4e8" }] },
        { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#cdbca4" }] },
        { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#efe3cf" }] },
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#fff8ec" }] },
        { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#decbb0" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9ddd8" }] },
    ],
    eco: [
        { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#2f5d39" }] },
        { featureType: "all", elementType: "labels.text.stroke", stylers: [{ color: "#f7faf5" }] },
        { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#a8c99b" }] },
        { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#e9f3e2" }] },
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#cfe7c6" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
        { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#c8dfc1" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#c5ddda" }] },
    ],
    editorial: [
        { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#3f3932" }] },
        { featureType: "all", elementType: "labels.text.stroke", stylers: [{ color: "#faf6ef" }] },
        { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#d7c8b2" }] },
        { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f1eadf" }] },
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#fffaf2" }] },
        { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#dfd2bf" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#d7dedc" }] },
    ],
    industrial: [
        { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#c9c6b8" }] },
        { featureType: "all", elementType: "labels.text.stroke", stylers: [{ color: "#111111" }] },
        { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#44413a" }] },
        { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#1b1b1b" }] },
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#343434" }] },
        { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#111111" }] },
        { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#4b4637" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#102526" }] },
    ],
};

function mapStylesForTheme(theme: string): MapStyle {
    return MAP_STYLES[theme] ?? MAP_STYLES.classic;
}

function circleOpacityForTheme(theme: string): number {
    return theme === "industrial" ? 0.24 : 0.18;
}

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
                    disableDefaultUI: true,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                    clickableIcons: false,
                    gestureHandling: "cooperative",
                    zoomControl: false,
                    styles: mapStylesForTheme(config.theme),
                });

                const circleColor = config.brandColor || "#ff6a00";
                const circle = new Circle({
                    center,
                    radius: milesToMeters(config.maxRadius),
                    map,
                    strokeColor: circleColor,
                    strokeOpacity: 0.95,
                    strokeWeight: 3,
                    fillColor: circleColor,
                    fillOpacity: circleOpacityForTheme(config.theme),
                });

                map.fitBounds(circle.getBounds(), 32);
            })
            .catch(() => {
                if (!cancelled) setFailed(true);
            });

        return () => {
            cancelled = true;
        };
    }, [config.brandColor, config.centerLat, config.centerLng, config.googleMapsKey, config.maxRadius, config.theme, hasMapConfig]);

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
