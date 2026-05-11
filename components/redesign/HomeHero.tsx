/**
 * HomeHero — screenshot-matched editorial hero:
 * oversized headline, orange marker accent, pill CTAs, proof row, and a
 * right-side booking-flow preview. All copy still comes from dashboard config or
 * verified/provided proof fields.
 */

import { ArrowRight, CalendarDays, Check, ClipboardList, Clock, MapPin, Phone, ShieldCheck, Star, Truck } from "lucide-react"
import {
  siteConfig,
  type SiteConfig,
  telHref,
  formatPhone,
  isSameDayEnabled,
  fmt24to12,
  getReviewSummary,
  getCredentials,
  hasConfiguredPricing,
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
    sameDayCutoffTime,
    serviceArea,
    maxRadius,
    companyName,
  } = config

  const sameDay = isSameDayEnabled(config)
  const cutoffLabel = sameDayCutoffTime ? fmt24to12(sameDayCutoffTime) : ""
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

  const trustItems = [
    "Local service team",
    hasConfiguredPricing(config) ? "Estimate in booking wizard" : "Final quote before loading",
    ...(sameDay ? ["Same-day may be available"] : []),
    ...(proofLabels.length > 0 ? [proofLabels.slice(0, 2).join(" & ")] : []),
  ].slice(0, 4)

  const areaLabel =
    serviceArea && serviceArea !== "your area"
      ? serviceArea
      : city
        ? `${city}${state ? `, ${state}` : ""}`
        : ""
  const serviceCount = config.services.length
  const primaryService = config.services[0] || "Junk removal"
  const bookingWindowLabel = sameDay && cutoffLabel ? `Book by ${cutoffLabel}` : "Choose a pickup window"
  const quoteLabel = hasConfiguredPricing(config) ? "Estimate after details" : "Final quote before loading"

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
        className="relative mx-auto grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.78fr)] lg:gap-14"
        style={{ maxWidth: 1240 }}
      >
        <div className="min-w-0">
          {eyebrow && (
            <div className="mb-8 flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-brand">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand" />
              {eyebrow}
            </div>
          )}

          <h1 className="font-display text-[clamp(60px,7vw,92px)] font-extrabold leading-[0.96] tracking-normal text-ink">
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

          <p className="mt-8 max-w-[56ch] text-[clamp(18px,1.45vw,21px)] leading-[1.55] text-muted">
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

        <aside
          className="hero-booking-card relative overflow-hidden rounded-[24px] border border-line bg-white/90 p-5 shadow-[0_30px_80px_rgba(20,20,20,0.10)] backdrop-blur"
          aria-label="Animated booking preview"
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-8 top-5 h-28 rounded-full bg-brand/10 blur-3xl"
          />

          <div className="relative rounded-[18px] border border-line bg-paper/70 p-4">
            <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
              <div
                className="inline-flex min-w-0 items-center gap-2.5 rounded-full px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-green"
                style={{
                  backgroundColor: "rgba(20, 53, 40, 0.14)",
                }}
              >
                <span className="relative h-2 w-2 shrink-0 rounded-full bg-green">
                  <span
                    aria-hidden="true"
                    className="absolute -inset-[3px] rounded-full bg-green opacity-45"
                    style={{ animation: "heroPulse 1.6s ease-out infinite" }}
                  />
                </span>
                <span className="truncate">
                  {sameDay
                    ? `Booking today${cutoffLabel ? ` · ${cutoffLabel}` : ""}`
                    : "Online quote flow"}
                </span>
              </div>
              <div className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-line" />
                <span className="h-2.5 w-2.5 rounded-full bg-line" />
                <span className="h-2.5 w-2.5 rounded-full bg-brand" />
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1.05fr_0.95fr]">
                <div className="hero-demo-panel rounded-[16px] border border-line bg-white p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">
                        Step 01
                      </div>
                      <div className="mt-1 font-display text-[17px] font-bold text-ink">
                        Pickup details
                      </div>
                    </div>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand/10 text-brand">
                      <ClipboardList className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
                    </span>
                  </div>

                  <div className="grid gap-2.5">
                    <div className="hero-step-row flex items-center gap-2 rounded-full bg-paper px-3 py-2 text-[12px] text-muted">
                      <span className="h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
                      <span className="truncate">{primaryService}</span>
                    </div>
                    <div className="hero-step-row flex items-center gap-2 rounded-full bg-paper px-3 py-2 text-[12px] text-muted">
                      <span className="h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
                      <span className="truncate">
                        {serviceCount > 1 ? `${serviceCount} configured services` : "Item details"}
                      </span>
                    </div>
                    <div className="hero-step-row flex items-center gap-2 rounded-full bg-paper px-3 py-2 text-[12px] text-muted">
                      <span className="h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
                      <span className="truncate">{quoteLabel}</span>
                    </div>
                  </div>
                </div>

                <div className="hero-demo-panel rounded-[16px] border border-line bg-white p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">
                        Step 02
                      </div>
                      <div className="mt-1 font-display text-[17px] font-bold text-ink">
                        Load preview
                      </div>
                    </div>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand/10 text-brand">
                      <Truck className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
                    </span>
                  </div>

                  <div className="relative h-24 overflow-hidden rounded-[14px] border border-line bg-paper">
                    <div className="absolute inset-x-4 bottom-4 h-9 rounded-[10px] border-2 border-ink/70 bg-white" />
                    <div className="hero-load-fill absolute bottom-[18px] left-5 h-6 w-[62%] origin-left rounded-md bg-brand/80" />
                    <div className="absolute bottom-[18px] left-[31%] h-6 w-7 rounded-md bg-brand/35" />
                    <div className="absolute bottom-[18px] left-[49%] h-6 w-8 rounded-md bg-brand/25" />
                    <div className="absolute bottom-3 left-8 h-5 w-5 rounded-full border-[5px] border-ink/70 bg-paper" />
                    <div className="absolute bottom-3 right-8 h-5 w-5 rounded-full border-[5px] border-ink/70 bg-paper" />
                    <div className="hero-truck absolute left-5 top-4 h-2 w-12 rounded-full bg-brand/35" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[0.88fr_1.12fr]">
                <div className="hero-demo-panel rounded-[16px] border border-line bg-white p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">
                        Step 03
                      </div>
                      <div className="mt-1 font-display text-[17px] font-bold text-ink">
                        Pickup window
                      </div>
                    </div>
                    <CalendarDays className="h-5 w-5 shrink-0 text-brand" strokeWidth={2.2} aria-hidden="true" />
                  </div>
                  <div className="grid grid-cols-3 gap-2" aria-hidden="true">
                    {["AM", "PM", "EVE"].map((slot, index) => (
                      <span
                        key={slot}
                        className={`hero-slot rounded-[12px] border px-2 py-3 text-center font-mono text-[10px] font-bold uppercase tracking-[0.12em] ${
                          index === 1
                            ? "border-brand bg-brand text-white"
                            : "border-line bg-paper text-muted"
                        }`}
                      >
                        {slot}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 text-[12px] leading-snug text-muted">{bookingWindowLabel}</div>
                </div>

                <div className="hero-confirm-panel rounded-[16px] border border-line bg-ink p-4 text-paper">
                  <div className="flex items-start gap-3">
                    <span className="hero-confirm-check grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand text-white">
                      <Check className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">
                        Ready to confirm
                      </div>
                      <div className="mt-1 font-display text-[18px] font-bold leading-tight">
                        Quote request prepared
                      </div>
                      <div className="mt-2 text-[12px] leading-snug text-paper/70">
                        Customer details go to the booking wizard before any real estimate is shown.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {trustItems.length > 0 && (
                <div className="grid gap-2">
                  {trustItems.slice(0, 3).map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-full border border-line bg-white px-3 py-2 text-[13px] text-ink">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand/10 text-brand">
                        <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                      </span>
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {(areaLabel || (sameDay && cutoffLabel)) && (
            <div className="relative mt-4 grid gap-3 rounded-[18px] border border-line bg-white/78 p-4">
              {areaLabel && (
                <div className="flex items-center gap-3 text-[14px] text-ink">
                  <MapPin className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate">{areaLabel}</span>
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
      </div>

      <style>{`
        @keyframes heroPulse {
          0% { transform: scale(1); opacity: 0.45; }
          100% { transform: scale(2.5); opacity: 0; }
        }
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
        .hero-booking-card {
          animation: heroCardFloat 7s ease-in-out infinite;
          transform: translateZ(0);
        }
        .hero-demo-panel {
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.75);
        }
        .hero-step-row {
          animation: heroRowPulse 5.2s ease-in-out infinite;
        }
        .hero-step-row:nth-child(2) {
          animation-delay: 0.45s;
        }
        .hero-step-row:nth-child(3) {
          animation-delay: 0.9s;
        }
        .hero-load-fill {
          animation: heroLoadFill 5.4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
          transform: scaleX(0.42);
          will-change: transform;
        }
        .hero-truck {
          animation: heroTruckScan 5.4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
          will-change: transform, opacity;
        }
        .hero-slot {
          transition: transform 180ms ease, box-shadow 180ms ease;
        }
        .hero-slot:nth-child(2) {
          animation: heroSlotPulse 3.4s ease-in-out infinite;
        }
        .hero-confirm-panel {
          box-shadow: inset 0 1px 0 rgba(250,246,239,0.08);
        }
        .hero-confirm-check {
          animation: heroConfirmPop 3.2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
          will-change: transform;
        }
        @keyframes heroCardFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -8px, 0); }
        }
        @keyframes heroRowPulse {
          0%, 100% { transform: translateX(0); opacity: 0.72; }
          45%, 60% { transform: translateX(4px); opacity: 1; }
        }
        @keyframes heroLoadFill {
          0%, 14% { transform: scaleX(0.22); }
          52%, 72% { transform: scaleX(1); }
          100% { transform: scaleX(0.42); }
        }
        @keyframes heroTruckScan {
          0%, 12% { transform: translateX(0); opacity: 0.35; }
          52%, 72% { transform: translateX(210px); opacity: 0.82; }
          100% { transform: translateX(78px); opacity: 0.45; }
        }
        @keyframes heroSlotPulse {
          0%, 100% {
            transform: translateY(0);
            box-shadow: 0 0 0 0 rgba(var(--brand-rgb), 0.22);
          }
          50% {
            transform: translateY(-2px);
            box-shadow: 0 10px 22px rgba(var(--brand-rgb), 0.20);
          }
        }
        @keyframes heroConfirmPop {
          0%, 56%, 100% { transform: scale(1); }
          68% { transform: scale(1.12); }
          80% { transform: scale(0.98); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-booking-card,
          .hero-step-row,
          .hero-load-fill,
          .hero-truck,
          .hero-slot:nth-child(2),
          .hero-confirm-check {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  )
}
