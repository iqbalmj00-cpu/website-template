import { siteConfig } from "@/lib/siteConfig";

type PublicSiteIssue = {
    field: string;
    message: string;
};

export function getPublicSiteStatus(): { ok: boolean; issues: PublicSiteIssue[] } {
    const issues: PublicSiteIssue[] = [];

    if (!siteConfig.companyName || siteConfig.companyName === "Your Company Name") {
        issues.push({ field: "companyName", message: "Company name is required." });
    }
    if (!siteConfig.city || siteConfig.city === "Your City") {
        issues.push({ field: "city", message: "Primary city is required." });
    }
    if (!siteConfig.phoneNumber || siteConfig.phoneNumber === "(555) 000-0000") {
        issues.push({ field: "phoneNumber", message: "Public phone number is required." });
    }

    return { ok: issues.length === 0, issues };
}

export function canExposePublicSite(): boolean {
    return getPublicSiteStatus().ok;
}
