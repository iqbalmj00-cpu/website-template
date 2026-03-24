import { redirect } from "next/navigation";
import { siteConfig } from "@/lib/siteConfig";

/**
 * /customer-portal — Server-side redirect to the ScaleYourJunk customer portal.
 * Constructs the portal login URL using server-only env vars (DASHBOARD_URL + SITE_TOKEN)
 * so the site token never leaks into the client bundle.
 */
export default function CustomerPortalRedirect() {
    const { dashboardUrl, siteToken } = siteConfig;

    if (!dashboardUrl || !siteToken) {
        // Fallback: redirect to homepage if portal isn't configured
        redirect("/");
    }

    redirect(`${dashboardUrl}/portal/login?site=${siteToken}`);
}
