/**
 * visibility.ts — Single source of truth for "should this section render?"
 *
 * Every section that depends on dashboard-provided proof goes through here.
 * The rule, from the redesign brief:
 *
 *   "Do not create marketing claims unless the dashboard sends proof for them."
 *
 * Components should not encode their own visibility logic. They render
 * unconditionally; the page-level layout consults these predicates to decide
 * whether to mount them at all.
 */

import {
  siteConfig,
  type SiteConfig,
  hasLicense,
  hasInsurance,
  isSameDayEnabled,
  hasConfiguredPricing,
  hasVerifiedGoogleReviews,
  getGoogleTestimonials,
  getReviewSummary,
} from './siteConfig'

/* ── Per-section predicates ──────────────────────────────────────────── */

/** Trust strip (license / insurance / cert / recycling badge row). */
export function shouldRenderTrustBar(config: SiteConfig = siteConfig): boolean {
  if (!config.designConfig.showTrustBar) return false
  return (
    hasLicense(config) ||
    hasInsurance(config) ||
    config.certifications.length > 0 ||
    config.recyclingRate !== null ||
    isSameDayEnabled(config)
  )
}

/** Same-day banner (slim orange strip at the very top). */
export function shouldRenderSameDayBanner(config: SiteConfig = siteConfig): boolean {
  return isSameDayEnabled(config)
}

/** Service grid / catalog. */
export function shouldRenderServices(config: SiteConfig = siteConfig): boolean {
  return config.services.length > 0
}

/** Pricing preview (3 tiers). */
export function shouldRenderPricingPreview(config: SiteConfig = siteConfig): boolean {
  return hasConfiguredPricing(config)
}

/** Full pricing model (B+V+M+S equation). */
export function shouldRenderPricingModel(config: SiteConfig = siteConfig): boolean {
  return hasConfiguredPricing(config)
}

/** Dumpster rental section. */
export function shouldRenderDumpster(config: SiteConfig = siteConfig): boolean {
  if (!config.offersDumpsterRental) return false
  return Boolean(config.dumpsterPricing && config.dumpsterPricing.tiers.length > 0)
}

/** Reviews preview — only when verified Google review payload exists. */
export function shouldRenderReviewsPreview(config: SiteConfig = siteConfig): boolean {
  return hasVerifiedGoogleReviews(config)
}

/** Full reviews aggregate (cross-platform). */
export function shouldRenderReviewAggregate(config: SiteConfig = siteConfig): boolean {
  return hasVerifiedGoogleReviews(config)
}

/** Featured-reviews grid. */
export function shouldRenderFeaturedReviews(config: SiteConfig = siteConfig): boolean {
  return getGoogleTestimonials(4, config).length >= 4
}

/** Founder story panel. */
export function shouldRenderFounder(config: SiteConfig = siteConfig): boolean {
  return config.founderName.trim().length > 0 && config.aboutStory.trim().length > 0
}

/** Team gallery (multi-portrait grid). */
export function shouldRenderTeamGallery(): boolean {
  // Without dashboard team-photo manifest the gallery shouldn't appear.
  // Placeholder for when dashboard adds a `teamMembers` config field.
  return false
}

/** Recycling impact ring + stats. */
export function shouldRenderRecyclingImpact(config: SiteConfig = siteConfig): boolean {
  return config.recyclingRate !== null && config.recyclingRate > 0
}

/** Why-choose-us 6-card grid. */
export function shouldRenderWhyChooseUs(): boolean {
  // Composed entirely of generic positioning copy + the verifiable trust
  // signals. Always render unless the client opts out.
  return true
}

/** Local explanation block (PageIntro on home). */
export function shouldRenderLocalExplanation(config: SiteConfig = siteConfig): boolean {
  return config.city.trim().length > 0 && config.serviceArea.trim().length > 0
}

/** Service-area preview (12-area grid). */
export function shouldRenderServiceAreas(config: SiteConfig = siteConfig): boolean {
  return config.serviceAreaZips.length > 0 || config.serviceArea.trim().length > 0
}

/** FAQ preview (top 5 q&a accordion). */
export function shouldRenderFaqPreview(): boolean {
  return true
}

/** Full grouped-FAQ page. */
export function shouldRenderGroupedFaq(): boolean {
  return true
}

/** Commercial portal preview. */
export function shouldRenderCommercialPortal(config: SiteConfig = siteConfig): boolean {
  return config.tier === 'growth'
}

/** Final CTA band at page bottom. */
export function shouldRenderFinalCta(): boolean {
  return true
}

/** Blog section (homepage feed). */
export function shouldRenderBlog(config: SiteConfig = siteConfig): boolean {
  return config.enableBlog
}

/* ── Composite checks ────────────────────────────────────────────────── */

/** Does the operator have enough proof to safely make a "trustworthy" claim?
 *  Used by the hero's optional trust strip and by SEO LocalBusiness JSON-LD. */
export function hasMinimumTrustProof(config: SiteConfig = siteConfig): boolean {
  return (
    hasLicense(config) ||
    hasInsurance(config) ||
    config.certifications.length > 0 ||
    hasVerifiedGoogleReviews(config)
  )
}

/** Should the rating callout in the hero be shown?
 *  We require an actual review count threshold from dashboard data. */
export function shouldShowHeroRating(config: SiteConfig = siteConfig): boolean {
  const summary = getReviewSummary(config)
  return Boolean(summary && summary.totalCount >= 5 && getGoogleTestimonials(1, config).length > 0)
}

/** Contact page and every link to it.
 *
 *  Hidden unless the operator has connected a Gmail mailbox in the dashboard.
 *  A submission has nowhere to go without one — the message would be stored as a
 *  lead and never reach a person — so the page is removed rather than shown
 *  collecting messages nobody reads. Same rule as everywhere else here: nothing
 *  is offered to a customer that the operator cannot actually deliver.
 */
export function shouldRenderContactPage(config: SiteConfig = siteConfig): boolean {
  return config.mailboxConnected
}

/** Is the site ready to be indexed publicly?
 *  (Identity + at least one verifiable trust signal.) */
export function shouldAllowIndexing(): boolean {
  return (
    siteConfig.companyName.trim().length > 0 &&
    siteConfig.city.trim().length > 0 &&
    hasMinimumTrustProof()
  )
}
