import {
    getGoogleTestimonials,
    getReviewSummary,
    hasInsurance,
    hasLicense,
    isSameDayEnabled,
    siteConfig,
    type SiteConfig,
} from "@/lib/siteConfig";

export function shouldRenderTrustBar(config: SiteConfig = siteConfig): boolean {
    if (!config.designConfig.showTrustBar) return false;
    return hasLicense(config)
        || hasInsurance(config)
        || config.certifications.length > 0
        || config.recyclingRate !== null
        || isSameDayEnabled(config)
        || Boolean(config.yearFounded);
}

export function shouldRenderSameDayBanner(config: SiteConfig = siteConfig): boolean {
    return isSameDayEnabled(config);
}

export function shouldRenderServiceAreas(config: SiteConfig = siteConfig): boolean {
    const namedAreas = [config.city, ...config.serviceArea.split(/[,;]/)]
        .map((area) => area.trim())
        .filter((area) => area && area.toLowerCase() !== "your area");
    return namedAreas.length > 0 || config.serviceAreaZips.length > 0;
}

export function shouldRenderRecyclingImpact(config: SiteConfig = siteConfig): boolean {
    return config.recyclingRate !== null && config.recyclingRate > 0;
}

export function shouldRenderFounder(config: SiteConfig = siteConfig): boolean {
    return Boolean(config.founderName.trim() || config.aboutStory.trim() || config.yearFounded);
}

export function shouldShowHeroRating(config: SiteConfig = siteConfig): boolean {
    const summary = getReviewSummary(config);
    return Boolean(summary && summary.totalCount > 0 && summary.averageRating > 0);
}

export function shouldRenderReviewAggregate(config: SiteConfig = siteConfig): boolean {
    return shouldShowHeroRating(config);
}

export function shouldRenderFeaturedReviews(config: SiteConfig = siteConfig): boolean {
    return getGoogleTestimonials(4, config).length >= 4;
}
