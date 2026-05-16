/**
 * PageHero — non-home hero aligned with the homepage hero visual system.
 * It keeps the oversized editorial headline, orange marker accent, pill CTAs,
 * and proof row, but swaps the homepage trust rail for a page-action card.
 */

import Link from "next/link"
import { ArrowRight, Calendar, ChevronRight, Clock, MapPin, Phone, ShieldCheck, Star } from "lucide-react"
import SafeImage from "@/components/SafeImage"
import {
  siteConfig,
  type SiteConfig,
  telHref,
  formatPhone,
  isSameDayEnabled,
  getReviewSummary,
  getCredentials,
  fmt24to12,
} from "@/lib/siteConfig"
import {
  focalPointToObjectPosition,
  getJunkRemovalThemeProfile,
  resolveJunkRemovalImage,
  type JunkRemovalImageRole,
} from "@/lib/templateAssets/junkRemoval"
import { shouldShowHeroRating } from "@/lib/visibility"

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeroProps {
  crumbs: BreadcrumbItem[]
  titleStart: string
  titleAccent: string
  lede: string
  eyebrow?: string
  primaryCta?: { label: string; href: string }
  hideTrustPanel?: boolean
  media?: {
    role?: JunkRemovalImageRole
    src?: string | null
    alt?: string
    routeKey?: string
    serviceTitle?: string
    locationName?: string
    caption?: string
  }
  config?: SiteConfig
}

export default function PageHero({
  crumbs,
  eyebrow,
  titleStart,
  titleAccent,
  lede,
  primaryCta = { label: "Get Instant Quote", href: "/book" },
  hideTrustPanel = false,
  media,
  config = siteConfig,
}: PageHeroProps) {
  const { city, state, phoneNumber, serviceArea, maxRadius, sameDayCutoffTime, companyName } = config
  const currentPage = crumbs[crumbs.length - 1]?.label ?? "This page"
  const themeProfile = getJunkRemovalThemeProfile(config)
  const mediaImage = media
    ? resolveJunkRemovalImage({
        config,
        role: media.role ?? "hero",
        routeKey: media.routeKey ?? currentPage,
        overrideSrc: media.src,
        alt: media.alt,
        serviceTitle: media.serviceTitle,
        locationName: media.locationName,
      })
    : null
  const sameDay = isSameDayEnabled(config)
  const cutoffLabel = sameDayCutoffTime ? fmt24to12(sameDayCutoffTime) : ""
  const showRating = shouldShowHeroRating(config)
  const reviewSummary = showRating ? getReviewSummary(config) : null
  const credentials = getCredentials(config)
  const proofLabels = [
    ...(credentials.some((credential) => credential.label === "License") ? ["Licensed"] : []),
    ...(credentials.some((credential) => credential.label === "Insurance") ? ["Insured"] : []),
    ...credentials
      .filter((credential) => credential.label === "Certification")
      .map((credential) => credential.value),
  ]

  const areaLabel =
    serviceArea && serviceArea !== "your area"
      ? serviceArea
      : city
        ? `${city}${state ? `, ${state}` : ""}`
        : ""

  let computedEyebrow = eyebrow
  if (!computedEyebrow) {
    computedEyebrow = [city, state].filter(Boolean).join(" · ")
  }

  return (
    <section className="relative overflow-hidden bg-paper px-[clamp(20px,5vw,72px)] py-[clamp(64px,7vw,104px)] border-b border-line">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 44% 76% at 100% 15%, rgba(var(--brand-rgb), 0.16), transparent 66%)",
        }}
      />

      <div
        className={`relative mx-auto grid grid-cols-1 items-start gap-12 ${
          hideTrustPanel ? "" : "lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.82fr)] lg:gap-16"
        }`}
        style={{ maxWidth: 1140 }}
      >
        <div className="min-w-0">
          <nav
            aria-label="Breadcrumb"
            className="mb-9 inline-flex items-center gap-2 font-mono text-[10px] font-semibold tracking-[0.24em] uppercase text-muted"
          >
            {crumbs.map((crumb, index) => (
              <span key={`${crumb.label}-${index}`} className="inline-flex items-center gap-2">
                {index > 0 && (
                  <ChevronRight className="h-3 w-3 text-brand" strokeWidth={2.4} aria-hidden="true" />
                )}
                {crumb.href && index < crumbs.length - 1 ? (
                  <Link href={crumb.href} className="hover:text-brand transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-ink">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>

          {computedEyebrow && (
            <div className="mb-8 flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-brand">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand" />
              {computedEyebrow}
            </div>
          )}

          <h1 className="font-display text-[clamp(50px,6.2vw,78px)] font-extrabold leading-[0.99] tracking-normal text-ink">
            <span className="block text-balance">{titleStart.trim()}</span>
            <span className="hero-marker mt-2 inline-block pr-2">
              <span className="text-brand italic" style={{ fontFamily: "var(--font-display)" }}>
                {titleAccent}
              </span>
            </span>
          </h1>

          <p className="mt-7 max-w-[58ch] text-[17px] leading-[1.55] text-muted">{lede}</p>

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
              {reviewSummary && proofLabels.length > 0 && (
                <span className="hidden h-4 w-px bg-line sm:block" aria-hidden="true" />
              )}
              {proofLabels.length > 0 && (
                <div className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-brand" aria-hidden="true" />
                  <span>{proofLabels.slice(0, 2).join(" · ")}</span>
                </div>
              )}
            </div>
          )}

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href={primaryCta.href} className="btn-primary rounded-full text-[15px] shadow-[0_18px_38px_rgba(var(--brand-rgb),0.25)]">
              {primaryCta.label}
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
            </Link>
            {phoneNumber && (
              <a
                href={telHref(phoneNumber)}
                aria-label={`Call ${companyName} at ${formatPhone(phoneNumber)}`}
                className="inline-flex min-h-[54px] items-center gap-3 rounded-full border border-line bg-paper px-5 pr-7 font-display text-[15px] font-bold text-ink transition-colors hover:border-brand hover:text-brand"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand/10 text-brand">
                  <Phone className="h-4 w-4" strokeWidth={2.3} aria-hidden="true" />
                </span>
                Call
                <span className="font-body font-semibold text-muted">{formatPhone(phoneNumber)}</span>
              </a>
            )}
          </div>
        </div>

        {!hideTrustPanel && (
          <aside className={`overflow-hidden ${mediaImage ? themeProfile.mediaFrameClass : "rounded-[18px] border border-line bg-white/88 shadow-[0_26px_70px_rgba(20,20,20,0.08)] backdrop-blur"}`}>
            {mediaImage && (
              <figure className="relative border-b border-line">
                <SafeImage
                  src={mediaImage.src}
                  fallbackSrc="/images/default-hero.png"
                  alt={mediaImage.alt}
                  width={1800}
                  height={1125}
                  loading="eager"
                  style={{
                    display: "block",
                    width: "100%",
                    aspectRatio: "16 / 11",
                    height: "auto",
                    minHeight: 260,
                    objectFit: "cover",
                    objectPosition: focalPointToObjectPosition(mediaImage.focalPoint),
                  }}
                />
                <figcaption className="absolute left-4 top-4 rounded-full border border-white/25 bg-black/45 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
                  {media?.caption || themeProfile.mediaBadge}
                </figcaption>
              </figure>
            )}
            <div className="p-6">
              <div
                className="inline-flex items-center gap-2.5 rounded-full px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-green"
                style={{ backgroundColor: "rgba(20, 53, 40, 0.16)" }}
              >
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                Plan this pickup
              </div>

              <h2 className="mt-6 font-display text-[30px] font-extrabold leading-[1.02] text-ink">
                Ready when you are.
              </h2>
              <p className="mt-3 text-[14.5px] leading-[1.55] text-muted">
                Use the booking wizard to send item details, access notes, and photos when available.
              </p>

              <div className="mt-6 grid gap-3">
                <Link href={primaryCta.href} className="btn-primary justify-center rounded-full">
                  {primaryCta.label}
                  <ArrowRight className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
                </Link>
                {phoneNumber && (
                  <a
                    href={telHref(phoneNumber)}
                    className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full border border-line bg-paper px-5 font-display text-[15px] font-bold text-ink transition-colors hover:border-brand hover:text-brand"
                  >
                    <Phone className="h-4 w-4 text-brand" aria-hidden="true" />
                    {formatPhone(phoneNumber)}
                  </a>
                )}
              </div>
            </div>

            {(areaLabel || (sameDay && cutoffLabel)) && (
              <div className="grid gap-4 border-t border-line p-6">
                {areaLabel && (
                  <div className="flex items-center gap-3 text-[14px] text-ink">
                    <MapPin className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                    <span className="min-w-0 flex-1">{areaLabel}</span>
                    {maxRadius && (
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                        {maxRadius}mi radius
                      </span>
                    )}
                  </div>
                )}
                {sameDay && cutoffLabel && (
                  <div className="flex items-center gap-3 text-[14px] text-ink">
                    <Clock className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                    <span className="min-w-0 flex-1">Same-day cutoff at {cutoffLabel}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                      Live
                    </span>
                  </div>
                )}
              </div>
            )}
          </aside>
        )}
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
