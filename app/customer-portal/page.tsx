import { redirect } from "next/navigation";
import { siteConfig } from "@/lib/siteConfig";
import type { Metadata } from "next";

/**
 * /customer-portal — Server-side redirect to the ScaleYourJunk customer portal.
 * Constructs the portal login URL using server-only env vars (DASHBOARD_URL + SITE_TOKEN)
 * so the site token never leaks into the client bundle.
 *
 * Privacy note: the redirect URL itself contains the siteToken in the query string.
 * The Referrer-Policy: no-referrer header (set in next.config.mjs) prevents the
 * browser from sending the previous URL as Referer when following the redirect,
 * and noindex below keeps search engines out. Full fix requires dashboard to
 * switch transport off the query string (see dashboard coordination backlog).
 */
export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

export default function CustomerPortalRedirect() {
    const { dashboardUrl, siteToken } = siteConfig;

    if (!dashboardUrl || !siteToken) {
        // Fallback: redirect to homepage if portal isn't configured
        redirect("/");
    }

    redirect(`${dashboardUrl}/portal/login?site=${siteToken}`);
}
