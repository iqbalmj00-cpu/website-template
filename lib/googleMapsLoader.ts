type GoogleMapsWindow = Window & {
    google?: {
        maps?: {
            importLibrary?: (name: string) => Promise<unknown>;
        };
    };
};

let scriptPromise: Promise<void> | null = null;

export function loadGoogleMapsScript(apiKey: string): Promise<void> {
    if (typeof window === "undefined") return Promise.reject(new Error("Google Maps is client-only"));

    const w = window as GoogleMapsWindow;
    if (w.google?.maps?.importLibrary) return Promise.resolve();
    if (scriptPromise) return scriptPromise;

    scriptPromise = new Promise((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>('script[src^="https://maps.googleapis.com/maps/api/js"]');
        if (existing) {
            existing.addEventListener("load", () => resolve(), { once: true });
            existing.addEventListener("error", () => reject(new Error("Failed to load Google Maps")), { once: true });
            return;
        }

        const script = document.createElement("script");
        script.id = "google-maps-js";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Google Maps"));
        document.head.appendChild(script);
    });

    return scriptPromise;
}

export async function loadGoogleMapsLibrary<T = unknown>(apiKey: string, name: string): Promise<T> {
    await loadGoogleMapsScript(apiKey);
    const w = window as GoogleMapsWindow;
    if (!w.google?.maps?.importLibrary) {
        throw new Error("Google Maps importLibrary is unavailable");
    }
    return w.google.maps.importLibrary(name) as Promise<T>;
}
