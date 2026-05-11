/**
 * SiteFooter — full footer with NAP, services, service areas, hours, legal
 * links, and a bottom-bar credential strip. Every section hides when its
 * underlying dashboard data is missing.
 *
 * Server component — no client-side hooks. Drop in after <main> in layout.tsx.
 *
 */

import Link from "next/link"
import { Phone, Mail, MapPin, ArrowUpRight, ExternalLink } from "lucide-react"
import {
  siteConfig,
  type SiteConfig,
  formatPhone,
  telHref,
  groupBusinessHours,
  getCredentials,
  hasVerifiedGoogleReviews,
  getReviewSummary,
} from "@/lib/siteConfig"
import { resolveServiceCatalogIds } from "@/lib/catalogs/services"
import { buildLocationNavItems } from "@/lib/navItems"

function splitWordmark(name: string): { lead: string; tail: string } {
  const t = name.trim()
  if (!t) return { lead: "", tail: "" }
  const i = t.indexOf(" ")
  if (i === -1) return { lead: t, tail: "" }
  return { lead: t.slice(0, i), tail: t.slice(i + 1) }
}

function getLogoInitial(name: string): string {
  const t = name.trim()
  return t.length > 0 ? t.charAt(0).toUpperCase() : "J"
}

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Pricing", href: "/pricing" },
]

const LEGAL_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
]

/** Dark-background border color — production lacks `line-inv` so we inline
 *  the equivalent rgba (paper @ 10% alpha) for the few footer borders. */
const INV_BORDER = "rgba(250, 246, 239, 0.10)"

export default function SiteFooter({ config = siteConfig }: { config?: SiteConfig } = {}) {
  const {
    companyName,
    city,
    state,
    streetAddress,
    phoneNumber,
    tagline,
    yearFounded,
    services,
    businessHours,
    gbpUrl,
    enableBlog,
  } = config

  // emailAddress is optional in the production contract — opt into it
  // gracefully so this file compiles whether or not the field exists.
  const emailAddress = (config as { emailAddress?: string }).emailAddress

  const initial = getLogoInitial(companyName)
  const { lead, tail } = splitWordmark(companyName)
  const captionParts: string[] = []
  if (city) captionParts.push(city)
  if (yearFounded) captionParts.push(`est. ${yearFounded}`)
  const caption = captionParts.join(" · ")
  const formattedPhone = formatPhone(phoneNumber)
  const phoneHref = telHref(phoneNumber)
  const year = new Date().getFullYear()
  const credentials = getCredentials(config)
  const hoursRows = businessHours ? groupBusinessHours(businessHours) : []
  const reviewSummary = hasVerifiedGoogleReviews(config) ? getReviewSummary(config) : null
  const companyLinks = [
    COMPANY_LINKS[0],
    ...(hasVerifiedGoogleReviews(config) ? [{ label: "Reviews", href: "/reviews" }] : []),
    ...(enableBlog ? [{ label: "Blog", href: "/blog" }] : []),
    ...COMPANY_LINKS.slice(1),
  ]

  // Bottom-bar badges: short verbs for license/insurance; cert values verbatim.
  const credentialBadges: string[] = []
  if (credentials.some((c) => c.label === "License")) credentialBadges.push("Licensed")
  if (credentials.some((c) => c.label === "Insurance")) credentialBadges.push("Insured")
  for (const cert of credentials.filter((c) => c.label === "Certification")) {
    credentialBadges.push(cert.value)
  }
  const licenseValue = credentials.find((c) => c.label === "License")?.value ?? ""

  // Match dashboard service names to catalog entries for tidy display labels.
  const catalogServices = resolveServiceCatalogIds(services).slice(0, 8)
  const serviceLabels =
    catalogServices.length > 0
      ? catalogServices.map((s) => ({ label: s.name, slug: s.id }))
      : services.slice(0, 8).map((s) => ({ label: s, slug: s.toLowerCase().replace(/\s+/g, "-") }))
  const locationLinks = buildLocationNavItems(config, 10)

  const addressLines: string[] = []
  if (streetAddress) addressLines.push(streetAddress)
  if (city || state) addressLines.push([city, state].filter(Boolean).join(", "))

  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto px-[clamp(20px,4vw,64px)] pt-20 pb-10" style={{ maxWidth: 1480 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 lg:gap-12">
          {/* Brand + NAP column */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-3" aria-label={`${companyName} — home`}>
              <span className="grid place-items-center w-10 h-10 rounded-[10px] bg-brand text-white font-display font-extrabold text-[18px]">
                {initial}
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display font-extrabold text-[18px] tracking-[-0.018em]">
                  <span className="text-brand">{lead}</span>
                  {tail && <> {tail}</>}
                </span>
                {caption && (
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/60 mt-0.5">
                    {caption}
                  </span>
                )}
              </span>
            </Link>

            <p className="text-[14.5px] leading-[1.6] text-paper/70 max-w-[34ch]">{tagline}</p>

            <ul className="flex flex-col gap-3 mt-1">
              {addressLines.length > 0 && (
                <li className="flex items-start gap-3">
                  <span
                    className="grid place-items-center w-9 h-9 rounded-[10px] bg-ink-2 text-brand shrink-0"
                    style={{ border: `1px solid ${INV_BORDER}` }}
                  >
                    <MapPin className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <address className="text-[14px] leading-[1.5] text-paper/85 not-italic">
                    {addressLines.map((line, i) => (
                      <span key={i} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </li>
              )}
              {phoneNumber && (
                <li className="flex items-center gap-3">
                  <span
                    className="grid place-items-center w-9 h-9 rounded-[10px] bg-ink-2 text-brand shrink-0"
                    style={{ border: `1px solid ${INV_BORDER}` }}
                  >
                    <Phone className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <a
                    href={phoneHref}
                    className="font-display font-semibold text-[15px] text-paper hover:text-brand transition-colors"
                  >
                    {formattedPhone}
                  </a>
                </li>
              )}
              {emailAddress && (
                <li className="flex items-center gap-3">
                  <span
                    className="grid place-items-center w-9 h-9 rounded-[10px] bg-ink-2 text-brand shrink-0"
                    style={{ border: `1px solid ${INV_BORDER}` }}
                  >
                    <Mail className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <a
                    href={`mailto:${emailAddress}`}
                    className="font-display font-semibold text-[14.5px] text-paper hover:text-brand transition-colors break-all"
                  >
                    {emailAddress}
                  </a>
                </li>
              )}
              {gbpUrl && (
                <li className="flex items-center gap-3">
                  <span
                    className="grid place-items-center w-9 h-9 rounded-[10px] bg-ink-2 text-brand shrink-0"
                    style={{ border: `1px solid ${INV_BORDER}` }}
                  >
                    <ExternalLink className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <a
                    href={gbpUrl}
                    target="_blank"
                    rel="noopener"
                    className="font-display font-semibold text-[14px] text-paper hover:text-brand transition-colors"
                  >
                    View us on Google
                  </a>
                </li>
              )}
            </ul>
          </div>

          {serviceLabels.length > 0 && (
            <FooterCol
              heading="Services"
              items={serviceLabels.map((s) => ({ label: s.label, href: `/services/${s.slug}` }))}
            />
          )}

          {locationLinks.length > 0 && (
            <FooterCol
              heading="Service Areas"
              items={locationLinks}
            />
          )}

          <div className="flex flex-col gap-7">
            <FooterCol heading="Company" items={companyLinks} />
            {hoursRows.length > 0 && (
              <div className="flex flex-col gap-3.5">
                <h4 className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-brand">
                  Hours
                </h4>
                <ul className="flex flex-col gap-1.5 text-[12.5px]">
                  {hoursRows.map((row) => (
                    <li key={row.days} className="flex justify-between gap-3 text-paper/75">
                      <span>{row.days}</span>
                      <span className="font-mono">{row.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <FooterCol heading="Legal" items={LEGAL_LINKS} small />
          </div>
        </div>

        <div
          className="mt-16 pt-7 flex flex-col md:flex-row md:items-center md:justify-between gap-x-6 gap-y-3 text-[12.5px] text-paper/60"
          style={{ borderTop: `1px solid ${INV_BORDER}` }}
        >
          <div className="font-mono tracking-[0.10em]">
            © {year} {companyName}
            {credentialBadges.length > 0 && <> · {credentialBadges.join(" · ")}</>}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono tracking-[0.10em]">
            {licenseValue && <span className="text-brand">{licenseValue}</span>}
            {reviewSummary && (
              <span>
                {reviewSummary.totalCount} verified Google review{reviewSummary.totalCount === 1 ? "" : "s"}
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

interface FooterColItem {
  label: string
  href: string
}

function FooterCol({
  heading,
  items,
  small,
}: {
  heading: string
  items: FooterColItem[]
  small?: boolean
}) {
  return (
    <div className="flex flex-col gap-3.5">
      <h4 className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-brand">
        {heading}
      </h4>
      <ul className="flex flex-col gap-2">
        {items.map((it) => (
          <li key={`${it.label}-${it.href}`}>
            <Link
              href={it.href}
              className={`group inline-flex items-center gap-1 ${
                small ? "text-[12.5px]" : "text-[14px]"
              } text-paper/75 hover:text-brand transition-colors`}
            >
              {it.label}
              <ArrowUpRight
                className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
