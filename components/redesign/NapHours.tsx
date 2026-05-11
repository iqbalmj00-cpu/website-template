"use client"

/**
 * NapHours — two-card grid: NAP (address / phone / email / service area) on
 * the left, business hours with a "today" highlight on the right. Cards hide
 * individually when their underlying data isn't configured.
 *
 * Client component — uses Date to compute "today" and "open now", which both
 * depend on render-time. Server rendering would freeze these to build time
 * and the "Open now" pill would lie.
 */

import { useEffect, useState } from "react"
import { MapPin, Phone, Mail, Compass } from "lucide-react"
import {
  siteConfig,
  telHref,
  formatPhone,
  groupBusinessHours,
  fmt24to12,
  type BusinessHoursConfig,
  type SiteConfig,
} from "@/lib/siteConfig"

const DAY_FULL: Record<string, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
}
const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]

function nowParts(timezone: string): { day: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone || "America/Chicago",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date())
  const weekday = parts.find((part) => part.type === "weekday")?.value.toLowerCase().slice(0, 3) ?? "sun"
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0)
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0)
  return { day: weekday, minutes: hour * 60 + minute }
}

function isOpenNow(hours: BusinessHoursConfig | null, timezone: string): boolean {
  if (!hours) return false
  const current = nowParts(timezone)
  const key = current.day
  const entry = hours[key]
  if (!entry || entry.closed || !entry.start || !entry.end) return false
  const [sh, sm] = entry.start.split(":").map(Number)
  const [eh, em] = entry.end.split(":").map(Number)
  const startMin = sh * 60 + (sm || 0)
  const endMin = eh * 60 + (em || 0)
  return current.minutes >= startMin && current.minutes < endMin
}

export default function NapHours({ config = siteConfig }: { config?: SiteConfig } = {}) {
  const { streetAddress, city, state, phoneNumber, serviceArea, businessHours, timezone } = config
  const emailAddress = (config as { emailAddress?: string }).emailAddress

  // Compute today + open-now on the client to avoid stale SSR values.
  const [now, setNow] = useState<{ today: string; openNow: boolean }>({ today: "", openNow: false })
  useEffect(() => {
    setNow({ today: nowParts(timezone).day, openNow: isOpenNow(businessHours, timezone) })
    const id = window.setInterval(() => {
      setNow({ today: nowParts(timezone).day, openNow: isOpenNow(businessHours, timezone) })
    }, 60_000)
    return () => window.clearInterval(id)
  }, [businessHours, timezone])

  const napRows: { Icon: typeof MapPin; label: string; value: string; href: string | null }[] = []
  const addressLine = [streetAddress, [city, state].filter(Boolean).join(", ")]
    .filter(Boolean)
    .join(" · ")
  if (addressLine) napRows.push({ Icon: MapPin, label: "Address", value: addressLine, href: null })
  if (phoneNumber) {
    napRows.push({
      Icon: Phone,
      label: "Phone",
      value: formatPhone(phoneNumber),
      href: telHref(phoneNumber),
    })
  }
  if (emailAddress) {
    napRows.push({
      Icon: Mail,
      label: "Email",
      value: emailAddress,
      href: `mailto:${emailAddress}`,
    })
  }
  if (serviceArea && serviceArea !== "your area") {
    napRows.push({ Icon: Compass, label: "Service Area", value: serviceArea, href: null })
  }

  const hoursRows: { key: string; day: string; time: string; today: boolean }[] = []
  if (businessHours) {
    for (const key of DAY_ORDER) {
      const entry = businessHours[key]
      if (!entry) continue
      const time =
        entry.closed || (!entry.start && !entry.end)
          ? "Closed"
          : `${fmt24to12(entry.start)} – ${fmt24to12(entry.end)}`
      hoursRows.push({ key, day: DAY_FULL[key], time, today: key === now.today })
    }
  }

  const grouped = businessHours ? groupBusinessHours(businessHours) : []

  if (napRows.length === 0 && hoursRows.length === 0) return null
  const singleColumn = napRows.length === 0 || hoursRows.length === 0
  const gridClass = singleColumn
    ? "mx-auto grid grid-cols-1 gap-6"
    : "mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6"

  return (
    <section className="bg-paper py-[100px] px-[clamp(20px,4vw,64px)]">
      <div className={gridClass} style={{ maxWidth: 1480 }}>
        {napRows.length > 0 && (
          <div className="bg-paper-2 rounded-[14px] p-9 border border-line flex flex-col gap-5">
            <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-brand">
              Visit / Call
            </div>
            {napRows.map(({ Icon, label, value, href }) => (
              <div
                key={label}
                className="grid grid-cols-[44px_1fr] gap-3.5 items-start py-2 border-b border-line last:border-b-0"
              >
                <div className="grid place-items-center w-11 h-11 rounded-[12px] bg-paper text-brand border border-line">
                  <Icon className="w-[18px] h-[18px]" strokeWidth={2} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted">
                    {label}
                  </div>
                  {href ? (
                    <a
                      href={href}
                      className="font-display font-semibold text-[16px] hover:text-brand transition-colors break-words"
                    >
                      {value}
                    </a>
                  ) : (
                    <div className="font-display font-semibold text-[16px] break-words">{value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {hoursRows.length > 0 && (
          <div className="bg-paper-2 rounded-[14px] p-9 border border-line flex flex-col gap-5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-brand">Hours</div>
              {now.openNow && (
                <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase text-green">
                  <span aria-hidden="true" className="w-2 h-2 rounded-full bg-current" />
                  Open now
                </div>
              )}
            </div>
            <div className="flex flex-col">
              {hoursRows.map(({ key, day, time, today }) => (
                <div
                  key={key}
                  className={`flex justify-between items-center text-[14.5px] gap-3 ${
                    today
                      ? "-mx-3 px-3 py-3 my-0.5 rounded-md text-ink"
                      : "py-3 border-b border-dashed border-line last:border-b-0 text-ink"
                  }`}
                  style={today ? { backgroundColor: "rgba(var(--brand-rgb), 0.10)" } : undefined}
                >
                  <span className="font-semibold flex items-center gap-2.5 min-w-0">
                    {today && (
                      <span
                        aria-hidden="true"
                        className="w-2 h-2 rounded-full bg-brand inline-block shrink-0"
                        style={{ animation: "napTodayPulse 1.4s ease-in-out infinite" }}
                      />
                    )}
                    {day}
                    {today && (
                      <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-brand ml-1">
                        · Today
                      </span>
                    )}
                  </span>
                  <span
                    className={`font-mono text-[13px] ${
                      today ? "text-brand font-semibold" : "text-muted"
                    }`}
                  >
                    {time}
                  </span>
                </div>
              ))}
            </div>
            {grouped.length > 0 && grouped.length < hoursRows.length && (
              <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted pt-3 border-t border-line">
                {grouped.map((g) => `${g.days} ${g.label}`).join(" · ")}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes napTodayPulse { 50% { opacity: 0.35; } }
      `}</style>
    </section>
  )
}
