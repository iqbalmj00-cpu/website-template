import "server-only";

export function getServerConfig() {
    return {
        dashboardUrl: process.env.DASHBOARD_URL ?? "",
        siteToken: process.env.SITE_TOKEN ?? "",
        stripeConnectAccountId: process.env.STRIPE_CONNECT_ACCOUNT_ID ?? "",
    };
}
