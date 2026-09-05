"use client";

import { useEffect } from "react";
import { analyticsPageLocation } from "@/lib/analytics";

/**
 * The page_view that `gtag('config', …, { send_page_view: false })` no longer
 * sends for us.
 *
 * Fires once per full page load, which is exactly what the automatic one did,
 * so the operator's page_view count is unchanged. It deliberately does not fire
 * again on client-side navigation: this component lives in the layout and never
 * remounts, and GA4's enhanced measurement already reports history changes —
 * firing here too would double every soft navigation.
 */
export default function AnalyticsPageView() {
    useEffect(() => {
        if (typeof window.gtag !== "function") return;
        window.gtag("event", "page_view", {
            page_location: analyticsPageLocation(window.location.href),
        });
    }, []);

    return null;
}
