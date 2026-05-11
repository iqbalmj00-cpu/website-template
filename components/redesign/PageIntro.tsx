/**
 * PageIntro — editorial two-column lead block: left side is body copy, right
 * side is an inverted ink card with a numbered stats list. Used on home and
 * on per-page intro sections to give the page identity.
 *
 * Server component — takes all content as props. No siteConfig access here
 * (the page composes it from siteConfig and passes it in).
 */

import type { ReactNode } from "react"

export interface PageIntroRow {
  n: string
  t: string
  d: string
}

interface PageIntroProps {
  eyebrow?: string
  headline?: string
  body?: ReactNode
  rightEyebrow?: string
  rightHeading?: string
  rightRows?: PageIntroRow[]
}

const DEFAULT_ROWS: PageIntroRow[] = [
  { n: "01", t: "Tell us what needs to go", d: "Photos · item list · access notes" },
  { n: "02", t: "Review the quote first", d: "Final price before loading" },
  { n: "03", t: "Crew handles the removal", d: "Lift · load · sweep when included" },
]

const DEFAULT_BODY = (
  <>
    <p>
      Most of the time, removing junk is the easiest part of cleaning out a space. The hard part is
      the lifting — and the part where it actually leaves your property.{" "}
      <strong className="text-ink font-semibold">That&apos;s the part we handle.</strong>
    </p>
    <p>
      This page lays out what can be booked, how quotes are confirmed, and what details can affect
      the final price before loading begins.
    </p>
  </>
)

export default function PageIntro({
  eyebrow = "— What this page covers",
  headline = "The straightforward take — what it costs, what's included, and how soon we can be at your curb.",
  body = DEFAULT_BODY,
  rightEyebrow = "— By the numbers",
  rightHeading = "At a glance",
  rightRows = DEFAULT_ROWS,
}: PageIntroProps = {}) {
  return (
    <section className="bg-paper py-20 px-[clamp(20px,4vw,64px)]">
      <div
        className="mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)] gap-16 items-start"
        style={{ maxWidth: 1480 }}
      >
        <div>
          <div className="inline-flex items-center gap-2.5 font-mono text-[12px] font-medium uppercase tracking-[0.18em] text-brand mb-[18px]">
            <span aria-hidden="true" className="w-6 h-[2px] bg-current rounded-sm" />
            {eyebrow.replace(/^—\s*/, "")}
          </div>
          <h2 className="font-display font-bold text-[clamp(28px,3.6vw,44px)] leading-[1.06] tracking-[-0.018em] text-pretty">
            {headline}
          </h2>
          <div className="mt-[22px] flex flex-col gap-[18px] text-[17px] leading-[1.65] text-muted max-w-[60ch]">
            {body}
          </div>
        </div>

        {/* Inverted ink stats card */}
        <aside className="relative bg-ink text-paper rounded-[14px] p-8 overflow-hidden self-stretch">
          <div
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{
              inset: "auto -10% -40% auto",
              width: "70%",
              aspectRatio: "1",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 50% 50%, rgba(var(--brand-rgb), 0.30), transparent 70%)",
            }}
          />
          <span className="relative block font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-brand mb-1.5">
            {rightEyebrow}
          </span>
          <h3 className="relative font-display font-bold text-[22px] leading-[1.15] tracking-[-0.01em] mb-[22px]">
            {rightHeading}
          </h3>
          <div className="relative flex flex-col">
            {rightRows.map((row, i) => (
              <div
                key={row.n}
                className="grid grid-cols-[56px_1fr] gap-[18px] items-baseline py-4"
                style={
                  i < rightRows.length - 1
                    ? { borderBottom: "1px solid rgba(250, 246, 239, 0.10)" }
                    : undefined
                }
              >
                <div className="font-display font-extrabold text-[36px] leading-none tracking-[-0.02em] text-brand tabular-nums">
                  {row.n}
                </div>
                <div>
                  <div className="font-display font-semibold text-[17px] leading-tight">{row.t}</div>
                  <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-paper/60 mt-1">
                    {row.d}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}
