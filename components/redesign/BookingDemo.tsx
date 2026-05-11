"use client"

/**
 * BookingDemo — Next.js–ready port of *just* the browser-mockup animation
 * (the 4-scene loop: contact form → truck fill → calendar → confirmation).
 *
 * No section heading, no step rows, no trust signals, no final CTA. The
 * integrator wraps this in whatever section / heading they want.
 *
 * Drop this file into `website-template/components/redesign/BookingDemo.tsx`
 * and use it like:
 *
 *   import BookingDemo from "@/components/redesign/BookingDemo";
 *
 *   <section className="py-[100px] px-[clamp(20px,4vw,64px)] bg-paper">
 *     <div className="max-w-[1280px] mx-auto">
 *       <h2>Show us how much. Pick a time. We&apos;re there.</h2>
 *       <BookingDemo />
 *     </div>
 *   </section>
 *
 * Production-template adaptations vs. the Vite source:
 *  1. `"use client"` directive (uses useState, useEffect, IntersectionObserver, setInterval).
 *  2. Reads `siteConfig` as a static const, not via React Context hook.
 *  3. Uses `rgba(var(--brand-rgb), X)` (production's comma-separated CSS var form),
 *     not the Vite codebase's `rgb(var(--brand-rgb) / X)` space-separated form.
 *  4. All 12 keyframes inlined in a trailing `<style>` block — no globals.css edit needed.
 *  5. Tokens used (`bg-paper`, `bg-paper-2`, `text-ink`, `text-muted`, `text-brand`,
 *     `bg-brand`, `border-line`, `bg-green`, `border-green`, `text-green`) all exist
 *     in the production tailwind config. Tokens the production config lacks
 *     (`bg-line-strong`, etc.) are substituted with inline rgba() values.
 */

import { useEffect, useRef, useState, type ReactNode } from "react"
import {
  PhoneIncoming,
  Truck,
  Calendar,
  Check,
  ArrowRight,
  Lock,
  Home,
  Building2,
  Phone,
  CreditCard,
} from "lucide-react"
import { siteConfig, isSameDayEnabled, type SiteConfig } from "@/lib/siteConfig"

/** How long each scene stays on screen (ms). */
const PERIOD = 4200

/* ── Helpers ─────────────────────────────────────────────────────────────── */

/** Compose a plausible demo address from the operator's NAP, with neutral
 *  placeholders when fields aren't configured. */
function buildDemoAddress(streetAddress: string, city: string, state: string, zip: string): string {
  const parts: string[] = []
  parts.push(streetAddress || "Pickup address")
  const locality = [city || "Your City", state].filter(Boolean).join(", ")
  parts.push(`${locality}${zip ? ` ${zip}` : ""}`)
  return parts.join(" · ")
}

/** Compose the URL bar text from subdomain or siteUrl. */
function buildDemoHost(siteUrl: string, subdomain: string): string {
  if (subdomain) return `${subdomain}.scaleyourjunk.com/book`
  if (siteUrl) return `${siteUrl.replace(/^https?:\/\//i, "").replace(/\/+$/, "")}/book`
  return "yourcompany.com/book"
}

/* ── Browser frame ───────────────────────────────────────────────────────── */
function BrowserFrame({ host, children }: { host: string; children: ReactNode }) {
  return (
    <div
      className="relative w-full max-w-[920px] bg-white rounded-[14px] overflow-hidden mx-auto"
      style={{ boxShadow: "0 30px 80px -20px rgba(10,25,47,0.35), 0 15px 35px -15px rgba(10,25,47,0.25)" }}
    >
      <div className="relative h-11 bg-[#F1F5F9] border-b border-[#E2E8F0] flex items-center px-4 shrink-0">
        <div className="flex gap-[7px]">
          <span aria-hidden="true" className="w-[11px] h-[11px] rounded-full bg-[#FF5F57] block" />
          <span aria-hidden="true" className="w-[11px] h-[11px] rounded-full bg-[#FEBC2E] block" />
          <span aria-hidden="true" className="w-[11px] h-[11px] rounded-full bg-[#28C840] block" />
        </div>
        <div
          className="absolute left-1/2 -translate-x-1/2 max-w-[55%] w-[360px] h-[26px] bg-white border border-[#CBD5E1] rounded-full flex items-center justify-center gap-1.5 text-[12px] text-[#1d1d1f]"
          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif' }}
        >
          <Lock className="w-2.5 h-2.5 text-[#64748B] shrink-0" strokeWidth={1.4} aria-hidden="true" />
          <span className="truncate">{host}</span>
        </div>
      </div>
      <div className="relative w-full bg-white overflow-hidden" style={{ aspectRatio: "16/10" }}>
        <span
          aria-hidden="true"
          className="absolute left-0 right-0 top-0 h-3 pointer-events-none z-[5]"
          style={{ background: "linear-gradient(to bottom, rgba(15,23,42,0.12), rgba(15,23,42,0))" }}
        />
        {children}
      </div>
    </div>
  )
}

/* ── Scene cross-fade. `tick` increments on each activation so cascading
      keyframes restart from t=0 — without this, scenes after the first cycle
      would replay with their entrance animations already finished. ─────── */
function SceneShell({ active, tick, children }: { active: boolean; tick: number; children: ReactNode }) {
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-[550ms] ease-out ${
        active ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div key={active ? `on-${tick}` : "off"} className="h-full">
        {children}
      </div>
    </div>
  )
}

/* ── Shared scene header ──────────────────────────────────────────────────── */
function SceneHeader({ Icon, h, d }: { Icon: typeof Truck; h: string; d: string }) {
  return (
    <div
      className="flex gap-3.5 items-center pb-4 border-b border-line shrink-0 opacity-0"
      style={{ animation: "bpFadeUp 0.5s cubic-bezier(0.34,1.4,0.64,1) 0.20s both" }}
    >
      <div
        className="grid place-items-center w-11 h-11 rounded-[12px] text-brand shrink-0"
        style={{
          backgroundColor: "rgba(var(--brand-rgb), 0.10)",
          border: "1px solid rgba(var(--brand-rgb), 0.20)",
        }}
      >
        <Icon className="w-[22px] h-[22px]" strokeWidth={2} aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="font-display font-extrabold text-[22px] leading-[1.05] tracking-[-0.018em] text-ink">
          {h}
        </span>
        <span className="text-[13px] leading-[1.4] text-muted">{d}</span>
      </div>
    </div>
  )
}

function FieldStatic({ label, value, active }: { label: string; value: string; active?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[9.5px] font-semibold tracking-[0.16em] uppercase text-muted">{label}</span>
      <div
        className={`bg-paper-2 border-[1.5px] rounded-[10px] px-3.5 py-2.5 font-display font-semibold text-[14.5px] text-ink min-h-[44px] flex items-center ${
          active ? "border-brand bg-[#fffaf5]" : "border-line"
        }`}
      >
        {value}
        {active && (
          <span
            aria-hidden="true"
            className="ml-1 w-0.5 h-4 bg-brand inline-block"
            style={{ animation: "bpCaret 1s steps(2) infinite" }}
          />
        )}
      </div>
    </div>
  )
}

function Field({
  delay,
  label,
  value,
  active,
}: {
  delay: string
  label: string
  value: string
  active?: boolean
}) {
  return (
    <div
      className="flex flex-col gap-1 opacity-0"
      style={{ animation: `bpFadeUp 0.5s cubic-bezier(0.34,1.4,0.64,1) ${delay} both` }}
    >
      <FieldStatic label={label} value={value} active={active} />
    </div>
  )
}

function PropBtn({ Icon, label, on }: { Icon: typeof Home; label: string; on?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center gap-2 px-3 py-2.5 border-[1.5px] rounded-[10px] font-display font-semibold text-[13px] min-h-[44px] ${
        on ? "border-brand text-brand" : "bg-paper-2 border-line text-ink"
      }`}
      style={on ? { backgroundColor: "rgba(var(--brand-rgb), 0.10)" } : undefined}
    >
      <Icon className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
      {label}
    </div>
  )
}

/* ── SCENE 1 — Contact form ──────────────────────────────────────────────── */
function Scene1({ demoAddress }: { demoAddress: string }) {
  return (
    <div className="absolute inset-0 px-9 pt-8 pb-9 flex flex-col gap-3.5">
      <SceneHeader
        Icon={PhoneIncoming}
        h="Let's get started."
        d="Tell us a bit about yourself so we can prepare your custom quote."
      />

      <div className="flex flex-col gap-2.5 flex-1">
        <Field delay="0.40s" label="Full name" value="Website visitor" active />
        <div
          className="grid grid-cols-2 gap-2.5 opacity-0"
          style={{ animation: "bpFadeUp 0.5s cubic-bezier(0.34,1.4,0.64,1) 0.55s both" }}
        >
          <FieldStatic label="Phone" value="Your phone number" />
          <FieldStatic label="Email" value="you@example.com" />
        </div>
        <Field delay="0.70s" label="Service address" value={demoAddress} />
        <div
          className="opacity-0"
          style={{ animation: "bpFadeUp 0.5s cubic-bezier(0.34,1.4,0.64,1) 0.85s both" }}
        >
          <span className="font-mono text-[9.5px] font-semibold tracking-[0.16em] uppercase text-muted block mb-1">
            Property type
          </span>
          <div className="grid grid-cols-2 gap-2">
            <PropBtn Icon={Home} label="Residential" on />
            <PropBtn Icon={Building2} label="Commercial" />
          </div>
        </div>
      </div>

      <div
        className="bg-brand text-white rounded-[10px] px-[18px] py-3.5 font-display font-bold text-[14px] flex justify-between items-center mt-1 opacity-0"
        style={{
          boxShadow: "0 6px 18px rgba(var(--brand-rgb), 0.28)",
          animation:
            "bpFadeUp 0.5s cubic-bezier(0.34,1.4,0.64,1) 1.05s both, bpSubmitNudge 1s ease-out 1.95s both",
        }}
      >
        Get my free quote
        <ArrowRight className="w-4 h-4" strokeWidth={2.4} aria-hidden="true" />
      </div>
    </div>
  )
}

/* ── SCENE 2 — Truck fill ────────────────────────────────────────────────── */
function Scene2() {
  return (
    <div className="absolute inset-0 px-9 pt-8 pb-9 flex flex-col gap-4">
      <SceneHeader
        Icon={Truck}
        h="How much junk are we hauling?"
        d="Watch the truck fill up — we match the load to a price range."
      />

      <div className="grid grid-cols-[1.4fr_1fr] gap-7 items-center flex-1">
        <div className="relative w-full" style={{ aspectRatio: "2.4/1" }}>
          <span
            aria-hidden="true"
            className="absolute left-[8%] right-[8%] -bottom-0.5 h-2 rounded-full -z-10"
            style={{
              background: "radial-gradient(ellipse, rgba(13,24,20,0.18), transparent 70%)",
              filter: "blur(2px)",
              opacity: 0.75,
            }}
          />
          <svg
            viewBox="0 0 280 130"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
            className="w-full h-full block overflow-visible relative z-10"
          >
            <rect x="0" y="115" width="280" height="2" rx="1" fill="rgba(13,24,20,0.08)" />
            <rect x="14" y="34" width="160" height="56" rx="3" fill="none" stroke="#0d1814" strokeWidth="2" />
            <rect
              x="16"
              y="36"
              width="156"
              height="52"
              rx="2"
              fill="rgb(var(--brand-rgb))"
              style={{
                transformOrigin: "95px 88px",
                animation: "bpTruckFill 1.6s cubic-bezier(0.34,1.4,0.64,1) 0.55s both",
              }}
            />
            <rect
              x="16"
              y="36"
              width="156"
              height="3"
              rx="1"
              fill="rgba(var(--brand-rgb), 0.85)"
              style={{
                transformOrigin: "95px 88px",
                animation: "bpTruckCap 1.6s cubic-bezier(0.34,1.4,0.64,1) 0.55s both",
              }}
            />
            <rect
              x="32"
              y="62"
              width="22"
              height="20"
              rx="2"
              fill="rgba(13,24,20,0.18)"
              style={{ opacity: 0, animation: "bpFadeIn 0.4s ease-out 1.05s both" }}
            />
            <rect
              x="62"
              y="56"
              width="32"
              height="26"
              rx="2"
              fill="rgba(13,24,20,0.18)"
              style={{ opacity: 0, animation: "bpFadeIn 0.4s ease-out 1.30s both" }}
            />
            <path d="M178 50 L222 50 L240 64 L240 96 L178 96 Z" fill="#0d1814" />
            <path d="M188 56 L218 56 L228 64 L188 64 Z" fill="rgba(255,255,255,0.10)" />
            <line x1="188" y1="64" x2="188" y2="96" stroke="#faf6ef" strokeWidth="1" opacity="0.18" />
            <circle cx="46" cy="100" r="11" fill="#0d1814" />
            <circle cx="148" cy="100" r="11" fill="#0d1814" />
            <circle cx="216" cy="100" r="11" fill="#0d1814" />
            <circle cx="46" cy="100" r="3.5" fill="#faf6ef" opacity="0.85" />
            <circle cx="148" cy="100" r="3.5" fill="#faf6ef" opacity="0.85" />
            <circle cx="216" cy="100" r="3.5" fill="#faf6ef" opacity="0.85" />
          </svg>
        </div>

        <div
          className="flex flex-col gap-2 opacity-0"
          style={{ animation: "bpFadeUp 0.5s cubic-bezier(0.34,1.4,0.64,1) 1.45s both" }}
        >
          <span
            className="inline-flex self-start px-2.5 py-1 text-brand rounded-full font-mono text-[9.5px] font-bold tracking-[0.16em] uppercase"
            style={{
              backgroundColor: "rgba(var(--brand-rgb), 0.10)",
              border: "1px solid rgba(var(--brand-rgb), 0.30)",
            }}
          >
            Most common
          </span>
          <span className="font-display font-extrabold text-[22px] leading-[1.1] tracking-[-0.018em] text-ink">
            Pickup Truck Load
          </span>
          <p className="text-[13px] leading-[1.5] text-muted">
            About a pickup bed full — roughly 30 trash bags.
          </p>
        </div>
      </div>

      <div
        className="flex flex-col gap-2.5 opacity-0"
        style={{ animation: "bpFadeUp 0.5s cubic-bezier(0.34,1.4,0.64,1) 1.70s both" }}
      >
        <div className="relative h-[18px]">
          <div className="absolute top-2 left-0 right-0 h-[3px] bg-line rounded-sm" />
          <div
            className="absolute top-2 left-0 h-[3px] bg-brand w-1/4 rounded-sm"
            style={{ boxShadow: "0 1px 4px rgba(var(--brand-rgb), 0.40)" }}
          />
          {[0, 20, 40, 60, 80, 100].map((left, i) => {
            const isPast = i === 0
            const isCurrent = i === 1
            return (
              <span
                key={i}
                className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                  isCurrent
                    ? "w-[18px] h-[18px] bg-white border-[3px] border-brand"
                    : isPast
                      ? "w-[10px] h-[10px] bg-brand"
                      : "w-2 h-2"
                }`}
                style={{
                  left: `${left}%`,
                  boxShadow: isCurrent ? "0 2px 8px rgba(var(--brand-rgb), 0.35)" : undefined,
                  backgroundColor: !isCurrent && !isPast ? "rgba(13, 24, 20, 0.18)" : undefined,
                }}
              />
            )
          })}
        </div>
        <div className="grid grid-cols-6 gap-1 font-mono text-[9.5px] font-semibold tracking-[0.10em] uppercase text-muted text-center">
          <span>⅛ Load</span>
          <span className="text-brand">¼ Load</span>
          <span>½ Load</span>
          <span>¾ Load</span>
          <span>Full Load</span>
          <span>1+ Loads</span>
        </div>
      </div>

      <div
        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] text-[12.5px] leading-[1.4] opacity-0"
        style={{
          backgroundColor: "rgba(20, 53, 40, 0.10)",
          border: "1px solid rgba(20, 53, 40, 0.20)",
          color: "#15692f",
          animation: "bpFadeUp 0.5s cubic-bezier(0.34,1.4,0.64,1) 1.95s both",
        }}
      >
        <span className="grid place-items-center w-[22px] h-[22px] rounded-full bg-green text-white shrink-0">
          <Check className="w-3 h-3" strokeWidth={3} aria-hidden="true" />
        </span>
        <span>
          <b className="font-bold">You only pay for what we haul.</b> Final price confirmed on-site,
          before we lift a thing.
        </span>
      </div>
    </div>
  )
}

/* ── SCENE 3 — Calendar ──────────────────────────────────────────────────── */
function Scene3({ sameDayHint }: { sameDayHint: string }) {
  const days = Array.from({ length: 28 }, (_, i) => i + 3)
  const now = new Date()
  const monthLabel = now.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  return (
    <div className="absolute inset-0 px-9 pt-8 pb-9 flex flex-col gap-3.5">
      <SceneHeader Icon={Calendar} h="Pick a date & time." d={sameDayHint} />
      <div className="grid grid-cols-[1.3fr_0.85fr] gap-7 flex-1 items-start">
        <div
          className="flex flex-col gap-2.5 opacity-0"
          style={{ animation: "bpFadeUp 0.45s cubic-bezier(0.34,1.4,0.64,1) 0.50s both" }}
        >
          <div className="flex justify-between items-center">
            <span className="font-display font-bold text-[15px] text-ink">{monthLabel}</span>
            <span className="font-mono text-[14px] text-muted inline-flex gap-3.5">‹  ›</span>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div
                key={d}
                className="font-mono text-[9px] font-semibold tracking-[0.14em] uppercase text-muted text-center py-1"
              >
                {d}
              </div>
            ))}
            {days.map((d) => {
              const isPast = d < 10
              const isPick = d === 13
              return (
                <div
                  key={d}
                  className={`aspect-square grid place-items-center font-display font-semibold text-[12.5px] rounded-full relative ${
                    isPast ? "text-muted opacity-40" : "text-ink"
                  } ${isPick ? "bg-brand text-white scale-0" : ""}`}
                  style={
                    isPick
                      ? { animation: "bpCalPick 0.55s cubic-bezier(0.34,1.4,0.64,1) 0.85s both" }
                      : undefined
                  }
                >
                  {d}
                  {isPick && (
                    <span
                      aria-hidden="true"
                      className="absolute -inset-[3px] rounded-full border-2 border-brand opacity-0"
                      style={{ animation: "bpCalRing 1.6s ease-out 1.0s both" }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span
            className="font-mono text-[9.5px] font-semibold tracking-[0.16em] uppercase text-muted mb-1 opacity-0"
            style={{ animation: "bpFadeUp 0.45s cubic-bezier(0.34,1.4,0.64,1) 1.40s both" }}
          >
            Today · arrival windows
          </span>
          {[
            { time: "8 – 11 AM", sub: "Morning", delay: "1.55s", pick: false },
            { time: "11 AM – 1 PM", sub: "", delay: "1.70s", pick: true },
            { time: "1 – 4 PM", sub: "Afternoon", delay: "1.85s", pick: false },
          ].map((s) => (
            <div
              key={s.time}
              className={`flex items-center justify-between px-3.5 py-3 border-[1.5px] rounded-[10px] font-display font-semibold text-[13px] opacity-0 min-h-[44px] ${
                s.pick ? "bg-brand text-white border-brand" : "bg-paper-2 text-ink border-line"
              }`}
              style={{ animation: `bpFadeUp 0.45s cubic-bezier(0.34,1.4,0.64,1) ${s.delay} both` }}
            >
              <span>{s.time}</span>
              {s.pick ? (
                <span
                  className="grid place-items-center w-[18px] h-[18px] rounded-full bg-white text-brand opacity-0"
                  style={{ animation: "bpSlotTick 0.5s cubic-bezier(0.34,1.4,0.64,1) 2.55s both" }}
                >
                  <Check className="w-2.5 h-2.5" strokeWidth={3.6} aria-hidden="true" />
                </span>
              ) : (
                <small className="font-mono text-[9.5px] font-semibold tracking-[0.12em] uppercase text-muted">
                  {s.sub}
                </small>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── SCENE 4 — Confirmation ──────────────────────────────────────────────── */
function Scene4({ demoAddress }: { demoAddress: string }) {
  return (
    <div className="absolute inset-0 px-9 pt-7 pb-8 flex flex-col gap-4">
      <div className="flex gap-3.5 items-center pb-4 border-b border-line relative">
        <div
          className="grid place-items-center w-12 h-12 rounded-full border-2 border-green text-green shrink-0 relative scale-0"
          style={{
            backgroundColor: "rgba(20, 53, 40, 0.10)",
            animation: "bpCheckPop 0.55s cubic-bezier(0.34,1.4,0.64,1) 0.30s both",
          }}
        >
          <span
            aria-hidden="true"
            className="absolute -inset-2 rounded-full border-2 border-green opacity-0 pointer-events-none"
            style={{ animation: "bpConfirmRing 1.5s ease-out 0.65s both" }}
          />
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path
              d="M5 13l4 4L19 7"
              style={{
                strokeDasharray: 36,
                strokeDashoffset: 36,
                animation: "bpDrawCheck 0.5s ease-out 0.65s both",
              }}
            />
          </svg>
        </div>
        <div
          className="flex flex-col gap-0.5 opacity-0"
          style={{ animation: "bpFadeUp 0.5s cubic-bezier(0.34,1.4,0.64,1) 0.55s both" }}
        >
          <span className="font-display font-extrabold text-[22px] leading-[1.05] tracking-[-0.018em] text-ink">
            You&apos;re booked.
          </span>
          <span className="font-mono text-[10.5px] font-semibold tracking-[0.18em] uppercase text-brand">
            Confirmation #JN-9482
          </span>
        </div>
      </div>

      <div
        className="bg-paper-2 border border-line rounded-xl px-5 py-1.5 flex flex-col opacity-0"
        style={{ animation: "bpFadeUp 0.5s cubic-bezier(0.34,1.4,0.64,1) 0.85s both" }}
      >
        {[
          { label: "Date", val: "Wednesday · 11 AM – 1 PM window" },
          { label: "Address", val: demoAddress },
          { label: "Load size", val: "Pickup Truck Load · ~30 bags" },
          { label: "Crew lead", val: "Marcus H. · 2-person crew" },
        ].map((r, i, arr) => (
          <div
            key={r.label}
            className={`grid grid-cols-[100px_1fr] items-baseline gap-3 py-2.5 ${
              i < arr.length - 1 ? "border-b border-dashed border-line" : ""
            }`}
          >
            <span className="font-mono text-[9.5px] font-semibold tracking-[0.16em] uppercase text-muted">
              {r.label}
            </span>
            <span className="font-display font-semibold text-[14px] text-ink leading-[1.3]">
              {r.val}
            </span>
          </div>
        ))}
      </div>

      <div
        className="grid grid-cols-3 gap-2 opacity-0"
        style={{ animation: "bpFadeUp 0.5s cubic-bezier(0.34,1.4,0.64,1) 1.15s both" }}
      >
        {[
          { Icon: Phone, b: "Confirmation by text", s: "In a moment" },
          { Icon: Truck, b: "Crew arrives", s: "Wed, 11 – 1 PM" },
          { Icon: CreditCard, b: "You only pay when done", s: "Card, cash, or Zelle" },
        ].map(({ Icon, b, s }) => (
          <div
            key={b}
            className="flex items-center gap-2 px-3 py-2.5 bg-paper-2 border border-line rounded-[10px] text-[11.5px] leading-[1.3] text-ink-2"
          >
            <span className="grid place-items-center w-[22px] h-[22px] rounded-full bg-brand text-white shrink-0">
              <Icon className="w-3 h-3" strokeWidth={2.4} aria-hidden="true" />
            </span>
            <div>
              <b className="block font-display font-bold text-[12.5px] leading-[1.1] text-ink">{b}</b>
              <span className="block font-mono text-[9.5px] tracking-[0.10em] uppercase text-muted mt-0.5">
                {s}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Main: the browser-mockup animation only ─────────────────────────────── */
export default function BookingDemo({ config = siteConfig }: { config?: SiteConfig } = {}) {
  const { streetAddress, city, state, serviceAreaZips, siteUrl, subdomain } = config
  const demoZip = serviceAreaZips[0] ?? ""
  const demoAddress = buildDemoAddress(streetAddress, city, state, demoZip)
  const demoHost = buildDemoHost(siteUrl, subdomain)
  const sameDayHint = isSameDayEnabled(config)
    ? "Same-day windows usually open. You can reschedule anytime."
    : "Pick the day that works. You can reschedule anytime."

  const [active, setActive] = useState(0)
  const [tick, setTick] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)
  const visibleRef = useRef(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el || !("IntersectionObserver" in window)) {
      visibleRef.current = true
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => {
      // Pause cycling when off-screen OR the tab is hidden — saves CPU
      // when the user isn't looking.
      if (!visibleRef.current) return
      if (typeof document !== "undefined" && document.visibilityState !== "visible") return
      setActive((a) => (a + 1) % 4)
      setTick((t) => t + 1)
    }, PERIOD)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div
      ref={wrapRef}
      className="relative rounded-[14px] p-14 max-md:p-6 flex flex-col items-center gap-6"
      style={{
        background: "radial-gradient(ellipse at top, #f4f6f9 0%, #dce2ec 60%, #c8cfdb 100%)",
      }}
    >
      {/* Screen-reader narration. The visual demo is purely decorative. */}
      <span className="sr-only">
        Animated four-step demonstration of the booking flow: 1) Tell us about you — contact form fills in. 2) Show us how much — the truck cargo bed fills up. 3) Pick a day and time — calendar date and time slot get picked. 4) You&apos;re booked - confirmation card appears. Loops continuously.
      </span>
      <div aria-hidden="true" className="w-full">
        <BrowserFrame host={demoHost}>
          <SceneShell active={active === 0} tick={tick}>
            <Scene1 demoAddress={demoAddress} />
          </SceneShell>
          <SceneShell active={active === 1} tick={tick}>
            <Scene2 />
          </SceneShell>
          <SceneShell active={active === 2} tick={tick}>
            <Scene3 sameDayHint={sameDayHint} />
          </SceneShell>
          <SceneShell active={active === 3} tick={tick}>
            <Scene4 demoAddress={demoAddress} />
          </SceneShell>
        </BrowserFrame>
      </div>

      {/* Co-located keyframes — drop-in friendly, no globals.css edit needed. */}
      <style>{`
        @keyframes bpFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bpFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bpSubmitNudge {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-2px); }
        }
        @keyframes bpCaret { 50% { opacity: 0; } }
        @keyframes bpTruckFill { from { transform: scaleY(0); } to { transform: scaleY(0.55); } }
        @keyframes bpTruckCap  { from { transform: scaleY(0) translateY(0); } to { transform: scaleY(0.55) translateY(-2px); } }
        @keyframes bpCalPick { from { transform: scale(0); } to { transform: scale(1); } }
        @keyframes bpCalRing { 0% { opacity: 0.7; transform: scale(0.8); } 100% { opacity: 0; transform: scale(2); } }
        @keyframes bpSlotTick { from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); } }
        @keyframes bpCheckPop { from { transform: scale(0); } to { transform: scale(1); } }
        @keyframes bpConfirmRing { 0% { opacity: 0.6; transform: scale(0.85); } 100% { opacity: 0; transform: scale(1.7); } }
        @keyframes bpDrawCheck { to { stroke-dashoffset: 0; } }
      `}</style>
    </div>
  )
}
