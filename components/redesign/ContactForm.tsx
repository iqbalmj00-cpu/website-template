"use client"

/**
 * ContactForm — two-column contact section: left has the heading, lede, and
 * a reply-window/phone trust strip; right has the form (name, email, phone,
 * ZIP, service-type chips, message).
 *
 * Client component — every field tracks focus + value state for the floating
 * label animation. Service-type chips are derived from the dashboard's
 * configured services so the form never offers a service this operator
 * doesn't provide.
 *
 * Backend wiring: posts to the template CRM endpoint and keeps the visible
 * fields derived from configured services.
 */

import { useState } from "react"
import { Clock, Phone, ArrowRight } from "lucide-react"
import { siteConfig, telHref, formatPhone, groupBusinessHours, type SiteConfig } from "@/lib/siteConfig"
import { resolveServiceCatalogIds } from "@/lib/catalogs/services"

interface FieldProps {
  label: string
  type?: string
  name: string
  maxLength?: number
  multiline?: boolean
}

function Field({ label, type = "text", name, maxLength, multiline }: FieldProps) {
  const [val, setVal] = useState("")
  const [focus, setFocus] = useState(false)
  const lifted = focus || val.length > 0
  const common =
    "w-full bg-paper border border-line rounded px-4 pt-6 pb-2 font-body text-[15px] text-ink transition-colors focus:bg-paper focus:border-brand"
  return (
    <label className="relative block">
      <span
        className={`absolute left-4 transition-all duration-200 ease-out pointer-events-none font-body ${
          lifted
            ? "top-1.5 text-[10px] tracking-[0.14em] uppercase text-brand font-semibold"
            : "top-1/2 -translate-y-1/2 text-[14px] text-muted"
        }`}
      >
        {label}
      </span>
      {multiline ? (
        <textarea
          name={name}
          rows={4}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className={`${common} resize-none`}
        />
      ) : (
        <input
          type={type}
          name={name}
          maxLength={maxLength}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className={common}
        />
      )}
    </label>
  )
}

export default function ContactForm({ config = siteConfig }: { config?: SiteConfig } = {}) {
  const { services, phoneNumber, businessHours } = config
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  // Service-type chips: derived from the dashboard's configured services so
  // the form never offers a service this operator doesn't provide. Cap at
  // 6 to keep the chip row on one line at common widths.
  const catalogServices = resolveServiceCatalogIds(services)
  const chipLabels = (catalogServices.length > 0
    ? catalogServices.map((s) => s.name)
    : services
  ).slice(0, 6)
  const allChips = [...chipLabels, "Other"]

  const [active, setActive] = useState<string>(allChips[0] ?? "Other")

  // Reply-window line built from real business hours — so we don't promise
  // a 4-hour reply on Sundays when the operator is actually closed.
  const grouped = businessHours ? groupBusinessHours(businessHours) : []
  const openDaysSummary = grouped
    .filter((g) => g.label !== "Closed")
    .map((g) => g.days)
    .join(", ")

  return (
    <section className="bg-paper py-[100px] px-[clamp(20px,4vw,64px)]">
      <div
        className="mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-14 items-start"
        style={{ maxWidth: 1480 }}
      >
        <div>
          <h2 className="font-display font-extrabold text-[clamp(36px,4.4vw,52px)] leading-[1.02] tracking-[-0.02em]">
            Got a question? Send us a note.
          </h2>
          <p className="text-[16px] leading-[1.6] text-muted mt-5 max-w-[44ch]">
            For urgent pickups, call the number listed here. For everything else, send the job
            details and the team will follow up through the normal customer service process.
          </p>
          <div className="mt-9 flex flex-col gap-5">
            {openDaysSummary && (
              <div className="flex gap-4 items-start">
                <div className="grid place-items-center w-11 h-11 rounded-[12px] bg-paper-2 text-brand border border-line shrink-0">
                  <Clock className="w-[18px] h-[18px]" strokeWidth={2} aria-hidden="true" />
                </div>
                <div>
                  <b className="font-display font-semibold text-[16px]">
                    Business hours
                  </b>
                  <div className="text-[13px] text-muted mt-0.5">{openDaysSummary}</div>
                </div>
              </div>
            )}
            {phoneNumber && (
              <div className="flex gap-4 items-start">
                <div className="grid place-items-center w-11 h-11 rounded-[12px] bg-paper-2 text-brand border border-line shrink-0">
                  <Phone className="w-[18px] h-[18px]" strokeWidth={2} aria-hidden="true" />
                </div>
                <div>
                  <a
                    href={telHref(phoneNumber)}
                    className="font-display font-semibold text-[16px] hover:text-brand transition-colors"
                  >
                    {formatPhone(phoneNumber)}
                  </a>
                  <div className="text-[13px] text-muted mt-0.5">Call for time-sensitive jobs</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            const form = e.currentTarget
            const data = new FormData(form)
            if (String(data.get("company") ?? "").trim()) return
            setStatus("sending")
            fetch("/api/crm", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              // The receiver requires `name` and `phone`, and reads the message
              // as `description`. This form sent firstName/lastName/message, so
              // `name` was always absent and EVERY submission was rejected with
              // "name and phone are required when creating a new lead". Nothing
              // was captured — no lead, no email, no trace.
              body: JSON.stringify({
                name: [data.get("fname"), data.get("lname")]
                  .map((v) => String(v ?? "").trim())
                  .filter(Boolean)
                  .join(" "),
                email: data.get("email"),
                phone: data.get("phone"),
                zip: data.get("zip"),
                serviceType: data.get("serviceType"),
                description: data.get("msg"),
                source: "contact",
                metadata: {
                  formType: "contact",
                  ...(data.get("serviceType") ? { serviceType: String(data.get("serviceType")) } : {}),
                },
              }),
            })
              .then((res) => {
                if (!res.ok) throw new Error("Contact request failed")
                form.reset()
                setStatus("sent")
              })
              .catch(() => setStatus("error"))
          }}
          className="bg-paper-2 border border-line rounded-[14px] p-9 flex flex-col gap-3.5"
        >
          <div className="grid grid-cols-2 gap-3.5">
            <Field label="First name" name="fname" />
            <Field label="Last name" name="lname" />
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            <Field label="Email" name="email" type="email" />
            <Field label="Phone" name="phone" type="tel" />
          </div>
          <Field label="ZIP code" name="zip" maxLength={5} />
          {allChips.length > 1 && (
            <div role="radiogroup" aria-label="Service type">
              <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted mb-2">
                Service type
              </div>
              <div className="flex flex-wrap gap-2">
                {allChips.map((c) => {
                  const isOn = active === c
                  return (
                    <button
                      type="button"
                      key={c}
                      role="radio"
                      aria-checked={isOn}
                      onClick={() => setActive(c)}
                      className={`px-4 min-h-[44px] py-2 rounded-full border text-[13px] font-semibold transition-colors duration-200 ease-out ${
                        isOn
                          ? "bg-brand text-white border-brand"
                          : "bg-paper text-ink border-line hover:border-brand hover:text-brand"
                      }`}
                      style={isOn ? { boxShadow: "0 8px 20px rgba(var(--brand-rgb), 0.28)" } : undefined}
                    >
                      {c}
                    </button>
                  )
                })}
              </div>
              {/* Hidden input so the active service type submits with the form. */}
              <input type="hidden" name="serviceType" value={active} />
            </div>
          )}
          <Field label="Tell us what you've got" name="msg" multiline />
          <label className="hidden">
            Company
            <input name="company" tabIndex={-1} autoComplete="off" />
          </label>
          <button type="submit" className="btn-primary self-start mt-2" disabled={status === "sending"}>
            {status === "sending" ? "Sending..." : "Send message"} <ArrowRight className="w-4 h-4" strokeWidth={2.4} aria-hidden="true" />
          </button>
          {status === "sent" && (
            <p className="text-[13px] font-semibold text-green">Message received. We will follow up soon.</p>
          )}
          {status === "error" && (
            <p className="text-[13px] font-semibold text-red">The message could not be sent. Please call instead.</p>
          )}
        </form>
      </div>
    </section>
  )
}
