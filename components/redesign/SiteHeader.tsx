"use client"

/**
 * SiteHeader — sticky top navigation: logo (left) + nav links (centered) +
 * phone number + Book Now button (right). Mobile breakpoint replaces the
 * desktop nav with a hamburger that opens a full-screen sheet.
 *
 * Client component — uses useState (scroll/menu state), useEffect (scroll
 * listener, escape-key handler), and usePathname (active-link highlight).
 */

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Phone, Menu, X, ArrowRight, ChevronDown } from "lucide-react"
import { siteConfig, formatPhone, telHref, type SiteConfig } from "@/lib/siteConfig"
import { buildLocationNavItems, buildServiceNavItems, type NavItem } from "@/lib/navItems"

const NAV: Array<{
  href: string
  label: string
  dropdown?: "services" | "locations"
}> = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services", dropdown: "services" },
  { href: "/locations", label: "Locations", dropdown: "locations" },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const

/** First letter of the company name, uppercased — fallback logo glyph when
 *  the dashboard hasn't uploaded a logoUrl. */
function getLogoInitial(name: string): string {
  const t = name.trim()
  return t.length > 0 ? t.charAt(0).toUpperCase() : "J"
}

/** Split the company name so the first word
 *  can render in brand orange and the rest in ink. */
function splitCompanyWordmark(name: string): { lead: string; tail: string } {
  const t = name.trim()
  if (!t) return { lead: "", tail: "" }
  const i = t.indexOf(" ")
  if (i === -1) return { lead: t, tail: "" }
  return { lead: t.slice(0, i), tail: t.slice(i + 1) }
}

/** Active-link check that handles both root path and nested routes. */
function isActivePath(pathname: string | null, href: string): boolean {
  if (!pathname) return false
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function SiteHeader({ config = siteConfig }: { config?: SiteConfig } = {}) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const { companyName, city, yearFounded, phoneNumber, designConfig } = config
  const initial = getLogoInitial(companyName)
  const { lead, tail } = splitCompanyWordmark(companyName)
  const captionParts: string[] = []
  if (city) captionParts.push(city)
  if (yearFounded) captionParts.push(`est. ${yearFounded}`)
  const caption = captionParts.join(" · ")
  const formattedPhone = formatPhone(phoneNumber)
  const phoneHref = telHref(phoneNumber)
  const isTransparent = designConfig.navStyle === "transparent" && !scrolled
  const serviceItems = buildServiceNavItems(config)
  const locationItems = buildLocationNavItems(config)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <header
      data-site-header
      data-scrolled={scrolled ? "true" : "false"}
      className={`sticky top-0 z-40 w-full transition-colors duration-200 ${
        isTransparent
          ? "bg-transparent border-b border-transparent"
          : scrolled
            ? "bg-paper/95 backdrop-blur border-b border-line"
            : "bg-paper border-b border-transparent"
      }`}
    >
      {/* Flex row: logo (auto, flush left) | nav (flex-1, links clustered
            visually centered) | cluster (auto, flush right). Tight outer
            padding pulls the chrome to the page edges. */}
      <div className="w-full px-[clamp(16px,2vw,32px)] h-[72px] lg:h-[88px] flex items-center gap-x-8">
        <Link
          href="/"
          className="flex items-center gap-3 shrink-0"
          aria-label={`${companyName} — home`}
        >
          <span className="grid place-items-center w-10 h-10 lg:w-12 lg:h-12 rounded-[10px] lg:rounded-[12px] bg-brand text-white font-display font-extrabold text-[18px] lg:text-[22px]">
            {initial}
          </span>
          <span className="flex flex-col leading-none whitespace-nowrap">
            <span className="font-display font-extrabold text-[18px] lg:text-[20px] tracking-[-0.018em]">
              <span className="text-brand">{lead}</span>
              {tail && <> {tail}</>}
            </span>
            {caption && (
              <span className="font-mono text-[10px] lg:text-[11px] uppercase tracking-[0.18em] text-muted mt-0.5">
                {caption}
              </span>
            )}
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden lg:flex flex-1 items-center justify-center gap-x-3 min-w-0"
        >
          {NAV.map((n) => {
            const active = isActivePath(pathname, n.href)
            const dropdownItems =
              n.dropdown === "services" ? serviceItems : n.dropdown === "locations" ? locationItems : []
            const hasDropdown = dropdownItems.length > 0
            if (hasDropdown) {
              return (
                <DesktopDropdown
                  key={n.href}
                  active={active}
                  href={n.href}
                  label={n.label}
                  items={dropdownItems}
                />
              )
            }
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`inline-flex items-center min-h-[44px] px-2.5 font-body font-semibold text-[15px] tracking-[-0.005em] transition-colors ${
                  active ? "text-brand" : "text-ink hover:text-brand"
                }`}
              >
                {n.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-5 shrink-0">
          {phoneNumber && (
            <a
              href={phoneHref}
              aria-label={`Call us at ${formattedPhone}`}
              className="inline-flex items-center gap-2 min-h-[48px] px-2 font-display font-bold text-[16px] text-ink hover:text-brand transition-colors whitespace-nowrap"
            >
              <Phone className="w-[18px] h-[18px] text-brand" strokeWidth={2.2} aria-hidden="true" />
              {formattedPhone}
            </a>
          )}
          {phoneNumber && <span aria-hidden="true" className="h-7 w-px bg-line" />}
          <Link href="/book" className="btn-primary text-[15px] whitespace-nowrap">
            Book Now <ArrowRight className="w-4 h-4" strokeWidth={2.4} aria-hidden="true" />
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
          className="lg:hidden ml-auto grid place-items-center w-11 h-11 rounded-[10px] bg-paper-2 border border-line text-ink hover:border-brand transition-colors"
        >
          {open ? (
            <X className="w-5 h-5" strokeWidth={2.2} aria-hidden="true" />
          ) : (
            <Menu className="w-5 h-5" strokeWidth={2.2} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile sheet — full-screen overlay. Closes on tap, escape, or
          navigation. Body scroll is locked while open. */}
      {open && (
        <div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="lg:hidden fixed inset-0 z-50 bg-paper flex flex-col overflow-y-auto"
        >
          <div className="px-[clamp(20px,4vw,64px)] h-[72px] flex items-center justify-between gap-6 border-b border-line shrink-0">
            <span className="flex items-center gap-3" aria-hidden="true">
              <span className="grid place-items-center w-10 h-10 rounded-[10px] bg-brand text-white font-display font-extrabold text-[18px]">
                {initial}
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display font-extrabold text-[18px] tracking-[-0.018em]">
                  <span className="text-brand">{lead}</span>
                  {tail && <> {tail}</>}
                </span>
                {caption && (
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted mt-0.5">
                    {caption}
                  </span>
                )}
              </span>
            </span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="grid place-items-center w-11 h-11 rounded-[10px] bg-paper-2 border border-line text-ink hover:border-brand transition-colors"
            >
              <X className="w-5 h-5" strokeWidth={2.2} aria-hidden="true" />
            </button>
          </div>

          <nav
            aria-label="Primary mobile"
            className="px-[clamp(20px,4vw,64px)] py-4 flex flex-col flex-1"
          >
            {NAV.map((n) => {
              const active = isActivePath(pathname, n.href)
              const dropdownItems =
                n.dropdown === "services" ? serviceItems : n.dropdown === "locations" ? locationItems : []
              return (
                <div key={n.href} className="border-b border-line last:border-b-0">
                  <Link
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center min-h-[56px] px-2 font-display font-semibold text-[20px] transition-colors ${
                      active ? "text-brand" : "text-ink hover:text-brand"
                    }`}
                  >
                    {n.label}
                  </Link>
                  {dropdownItems.length > 0 && (
                    <div className="pb-3 pl-5 grid gap-1">
                      {dropdownItems.map((item) => (
                        <Link
                          key={`${n.href}-${item.href}`}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="min-h-[38px] inline-flex items-center rounded px-2 font-body text-[15px] font-semibold text-muted hover:text-brand transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          <div className="px-[clamp(20px,4vw,64px)] py-5 border-t border-line flex flex-col gap-3 shrink-0">
            {phoneNumber && (
              <a
                href={phoneHref}
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 min-h-[52px] px-4 bg-paper-2 border border-line rounded font-display font-bold text-[15px] text-ink hover:border-brand transition-colors"
                aria-label={`Call us at ${formattedPhone}`}
              >
                <Phone className="w-4 h-4 text-brand" strokeWidth={2.2} aria-hidden="true" />
                {formattedPhone}
              </a>
            )}
            <Link
              href="/book"
              onClick={() => setOpen(false)}
              className="btn-primary justify-center"
            >
              Book Now <ArrowRight className="w-4 h-4" strokeWidth={2.4} aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

function DesktopDropdown({
  href,
  label,
  active,
  items,
}: {
  href: string
  label: string
  active: boolean
  items: NavItem[]
}) {
  return (
    <div className="group relative">
      <Link
        href={href}
        className={`inline-flex items-center gap-1 min-h-[44px] px-2.5 font-body font-semibold text-[15px] tracking-[-0.005em] transition-colors ${
          active ? "text-brand" : "text-ink hover:text-brand"
        }`}
      >
        {label}
        <ChevronDown
          className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
          strokeWidth={2.2}
          aria-hidden="true"
        />
      </Link>
      <div className="invisible absolute left-1/2 top-full z-50 w-[280px] -translate-x-1/2 pt-3 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="rounded-[14px] border border-line bg-paper p-2 shadow-[0_18px_50px_rgba(20,20,20,0.12)]">
          <Link
            href={href}
            className="flex min-h-[42px] items-center rounded-[10px] px-3 font-display text-[15px] font-bold text-ink hover:bg-paper-2 hover:text-brand transition-colors"
          >
            All {label}
          </Link>
          <div className="my-1 h-px bg-line" />
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-[40px] items-center rounded-[10px] px-3 text-[14px] font-semibold text-muted hover:bg-paper-2 hover:text-brand transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
