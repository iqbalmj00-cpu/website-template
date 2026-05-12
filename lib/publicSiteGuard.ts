import { siteConfig } from "./siteConfig";

type PublicSiteIssue = {
    field: string;
    message: string;
};

type PublicSiteStatus = {
    enforced: boolean;
    valid: boolean;
    canExposePublicSite: boolean;
    issues: PublicSiteIssue[];
};

const PLACEHOLDER_VALUES = new Set([
    "your company name",
    "your company",
    "company name",
    "your city",
    "your state",
    "your area",
    "service area",
    "surrounding areas",
    "surrounding communities",
    "near me",
    "nearby",
]);

const SETUP_TITLE = "Website Setup Required";
const SETUP_DESCRIPTION = "This website is not ready for public indexing.";

function clean(value: string | null | undefined): string {
    return (value ?? "").trim();
}

function normalized(value: string | null | undefined): string {
    return clean(value).toLowerCase();
}

function isPlaceholder(value: string | null | undefined): boolean {
    const valueKey = normalized(value);
    if (!valueKey) return true;
    return PLACEHOLDER_VALUES.has(valueKey);
}

function isValidPhone(value: string): boolean {
    const digits = value.replace(/\D/g, "");
    if (digits.length < 10) return false;
    if (/^1?5550{7}$/.test(digits)) return false;
    if (/^0+$/.test(digits)) return false;
    return true;
}

function isValidCanonicalSource(): boolean {
    const siteUrl = clean(siteConfig.siteUrl);
    const subdomain = clean(siteConfig.subdomain);

    if (siteUrl) {
        try {
            const parsed = new URL(siteUrl);
            if (!["http:", "https:"].includes(parsed.protocol)) return false;
            if (["localhost", "127.0.0.1", "::1"].includes(parsed.hostname)) {
                return process.env.SEO_STRICT_SITE_GUARD !== "true";
            }
            return true;
        } catch {
            return false;
        }
    }

    return subdomain.length > 0 && !isPlaceholder(subdomain);
}

export function isPublicSiteGuardEnforced(): boolean {
    return (
        process.env.SEO_STRICT_SITE_GUARD === "true" ||
        process.env.NEXT_PUBLIC_PUBLIC_SITE_MODE === "live" ||
        process.env.VERCEL_ENV === "production"
    );
}

export function getPublicSiteStatus(): PublicSiteStatus {
    const issues: PublicSiteIssue[] = [];

    if (isPlaceholder(siteConfig.companyName)) {
        issues.push({ field: "NEXT_PUBLIC_COMPANY_NAME", message: "Missing real company name." });
    }

    if (isPlaceholder(siteConfig.city)) {
        issues.push({ field: "NEXT_PUBLIC_CITY", message: "Missing real primary city." });
    }

    if (!isValidPhone(siteConfig.phoneNumber)) {
        issues.push({ field: "NEXT_PUBLIC_PHONE_NUMBER", message: "Missing real public phone number." });
    }

    if (isPlaceholder(siteConfig.serviceArea)) {
        issues.push({ field: "NEXT_PUBLIC_SERVICE_AREA", message: "Missing real service-area text." });
    }

    if (!isValidCanonicalSource()) {
        issues.push({ field: "NEXT_PUBLIC_SITE_URL", message: "Missing valid canonical site URL or subdomain." });
    }

    const enforced = isPublicSiteGuardEnforced();
    const valid = issues.length === 0;

    return {
        enforced,
        valid,
        canExposePublicSite: !enforced || valid,
        issues,
    };
}

export function canExposePublicSite(): boolean {
    return getPublicSiteStatus().canExposePublicSite;
}

export function shouldForceNoIndex(): boolean {
    const status = getPublicSiteStatus();
    return status.enforced && !status.valid;
}

export function setupMetadataText(): { title: string; description: string } {
    return {
        title: SETUP_TITLE,
        description: SETUP_DESCRIPTION,
    };
}

export function containsPublicIdentityPlaceholder(value: string): boolean {
    const lower = value.toLowerCase();
    return [
        "your company name",
        "your city",
        "(555) 000-0000",
        "555-000-0000",
    ].some((placeholder) => lower.includes(placeholder))
        || /service area:\s*your area/i.test(value)
        || /serv(?:e|ing)\s+your area/i.test(value);
}
