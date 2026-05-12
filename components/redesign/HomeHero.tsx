/**
 * HomeHero — screenshot-matched editorial hero with no right-side animation.
 * The open right side is intentionally left available for the approved custom
 * hero animation once it is provided.
 */

import { ArrowRight, Phone, ShieldCheck, Star } from "lucide-react"
import {
  siteConfig,
  type SiteConfig,
  telHref,
  formatPhone,
  isSameDayEnabled,
  getReviewSummary,
  getCredentials,
} from "@/lib/siteConfig"
import { shouldShowHeroRating } from "@/lib/visibility"

export default function HomeHero({ config = siteConfig }: { config?: SiteConfig } = {}) {
  const {
    city,
    state,
    heroHeadline,
    heroAccentText,
    tagline,
    phoneNumber,
    companyName,
  } = config

  const sameDay = isSameDayEnabled(config)
  const eyebrowParts = [city, state].filter(Boolean)
  if (sameDay) eyebrowParts.push("Same-day junk removal")
  const eyebrow = eyebrowParts.join(" · ")

  const showRating = shouldShowHeroRating(config)
  const reviewSummary = showRating ? getReviewSummary(config) : null
  const credentials = getCredentials(config)
  const proofLabels = [
    ...(credentials.some((credential) => credential.label === "License") ? ["Licensed"] : []),
    ...(credentials.some((credential) => credential.label === "Insurance") ? ["Insured"] : []),
    ...(credentials.some((credential) => credential.label === "Certification")
      ? credentials
          .filter((credential) => credential.label === "Certification")
          .map((credential) => credential.value)
      : []),
  ]

  return (
    <section className="relative overflow-hidden bg-paper px-[clamp(20px,5vw,72px)] py-[clamp(70px,8vw,118px)] border-b border-line">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 44% 76% at 100% 15%, rgba(var(--brand-rgb), 0.18), transparent 66%)",
        }}
      />

      <div
        className="relative mx-auto"
        style={{ maxWidth: 1240 }}
      >
        <div className="min-w-0">
          {eyebrow && (
            <div className="mb-8 flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-brand">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand" />
              {eyebrow}
            </div>
          )}

          <h1 className="font-display text-[clamp(68px,8.4vw,118px)] font-extrabold leading-[0.94] tracking-normal text-ink">
            <span className="block text-balance">{heroHeadline}</span>
            <span className="hero-marker mt-2 inline-block pr-2">
              <span className="text-ink"> </span>
              <span
                className="text-brand italic"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {heroAccentText}
              </span>
            </span>
          </h1>

          <p className="mt-8 max-w-[72ch] text-[clamp(20px,1.7vw,25px)] leading-[1.5] text-muted">
            {tagline}
          </p>

          {(reviewSummary || proofLabels.length > 0) && (
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-[13px] text-ink">
              {reviewSummary && (
                <div className="inline-flex items-center gap-2">
                  <span className="inline-flex text-brand" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="h-3.5 w-3.5 fill-current" strokeWidth={1.8} />
                    ))}
                  </span>
                  <strong className="font-display text-[14px]">{reviewSummary.averageRating.toFixed(1)}</strong>
                  <span className="text-muted">
                    · {reviewSummary.totalCount.toLocaleString()} review{reviewSummary.totalCount === 1 ? "" : "s"}
                  </span>
                </div>
              )}
              {reviewSummary && proofLabels.length > 0 && <span className="hidden h-4 w-px bg-line sm:block" aria-hidden="true" />}
              {proofLabels.length > 0 && (
                <div className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-brand" aria-hidden="true" />
                  <span>{proofLabels.slice(0, 2).join(" · ")}</span>
                </div>
              )}
            </div>
          )}

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a href="/book" className="btn-primary rounded-full text-[15px] shadow-[0_18px_38px_rgba(var(--brand-rgb),0.25)]">
              Get Instant Quote
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
            </a>
            {phoneNumber && (
              <a
                href={telHref(phoneNumber)}
                aria-label={`Call ${companyName} at ${formatPhone(phoneNumber)}`}
                className="inline-flex min-h-[54px] items-center gap-3 rounded-full border border-line bg-paper px-5 pr-7 font-display text-[15px] font-bold text-ink transition-colors hover:border-brand hover:text-brand"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand/10 text-brand">
                  <Phone className="h-4 w-4" strokeWidth={2.3} aria-hidden="true" />
                </span>
                Call Us
                <span className="font-body font-semibold text-muted">{formatPhone(phoneNumber)}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .hero-marker {
          background-image: linear-gradient(
            180deg,
            transparent 58%,
            rgba(var(--brand-rgb), 0.18) 58%,
            rgba(var(--brand-rgb), 0.18) 91%,
            transparent 91%
          );
          background-repeat: no-repeat;
          background-size: 100% 100%;
          -webkit-box-decoration-break: clone;
          box-decoration-break: clone;
        }
      `}</style>
    </section>
  )
}
