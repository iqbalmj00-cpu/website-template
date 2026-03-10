"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MapPin, AlertTriangle } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";

/* ── Types ─────────────────────────────────────────────────────────────── */
type PlaceResult = {
    address: string;
    zip: string;
    city: string;
    state: string;
    lat: number;
    lng: number;
};

type Props = {
    value: string;
    onChange: (value: string) => void;
    onPlaceSelect: (place: PlaceResult) => void;
    placeholder?: string;
};

/* ── Google Maps script loader ─────────────────────────────────────────── */
let googleLoaded = false;
let googleLoadPromise: Promise<void> | null = null;

function loadGoogleMaps(apiKey: string): Promise<void> {
    if (googleLoaded) return Promise.resolve();
    if (googleLoadPromise) return googleLoadPromise;

    googleLoadPromise = new Promise((resolve, reject) => {
        if (typeof window === "undefined") return reject();
        if ((window as any).google?.maps?.places) {
            googleLoaded = true;
            return resolve();
        }
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => { googleLoaded = true; resolve(); };
        script.onerror = () => reject(new Error("Failed to load Google Maps"));
        document.head.appendChild(script);
    });

    return googleLoadPromise;
}

/* ── Component ─────────────────────────────────────────────────────────── */
export default function AddressAutocomplete({ value, onChange, onPlaceSelect, placeholder }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<any>(null);
    const [ready, setReady] = useState(false);
    const [serviceAreaError, setServiceAreaError] = useState<string | null>(null);
    const hasApiKey = !!siteConfig.googleMapsKey;

    // Load Google Maps
    useEffect(() => {
        if (!hasApiKey) return;
        loadGoogleMaps(siteConfig.googleMapsKey).then(() => setReady(true)).catch(() => { });
    }, [hasApiKey]);

    // Initialize Autocomplete
    useEffect(() => {
        if (!ready || !inputRef.current || autocompleteRef.current) return;

        const google = (window as any).google;
        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
            componentRestrictions: { country: "us" },
            fields: ["formatted_address", "address_components", "geometry"],
            types: ["address"],
        });

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (!place?.formatted_address) return;

            const components = place.address_components || [];
            let zip = "";
            let city = "";
            let state = "";

            for (const c of components) {
                if (c.types.includes("postal_code")) zip = c.short_name;
                if (c.types.includes("locality")) city = c.long_name;
                if (c.types.includes("administrative_area_level_1")) state = c.short_name;
            }

            const lat = place.geometry?.location?.lat() || 0;
            const lng = place.geometry?.location?.lng() || 0;

            // Validate service area
            const zips = siteConfig.serviceAreaZips;
            if (zips.length > 0 && zip && !zips.includes(zip)) {
                setServiceAreaError(
                    `Sorry, we don't currently service this area. Please call us at ${siteConfig.phoneNumber} for assistance.`
                );
            } else {
                setServiceAreaError(null);
            }

            onChange(place.formatted_address);
            onPlaceSelect({ address: place.formatted_address, zip, city, state, lat, lng });
        });

        autocompleteRef.current = autocomplete;
    }, [ready, onChange, onPlaceSelect]);

    // If no API key, render a plain input (graceful fallback)
    if (!hasApiKey) {
        return (
            <div>
                <input
                    className="input"
                    placeholder={placeholder || "1234 Main St, City, State"}
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                        onPlaceSelect({ address: e.target.value, zip: "", city: "", state: "", lat: 0, lng: 0 });
                    }}
                />
            </div>
        );
    }

    return (
        <div>
            <div style={{ position: "relative" }}>
                <MapPin size={16} style={{
                    position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                    color: serviceAreaError ? "#DC2626" : "var(--muted)", pointerEvents: "none",
                }} />
                <input
                    ref={inputRef}
                    className="input"
                    placeholder={placeholder || "Start typing your address..."}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    style={{ paddingLeft: 38 }}
                />
            </div>
            {serviceAreaError && (
                <div style={{
                    marginTop: 8, padding: "10px 14px", borderRadius: 10,
                    background: "#FEF2F2", border: "1px solid #FECACA",
                    fontSize: 13, color: "#DC2626", display: "flex", alignItems: "flex-start", gap: 8,
                }}>
                    <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>{serviceAreaError}</span>
                </div>
            )}
        </div>
    );
}
