"use client"

/**
 * Recycling — configured landfill-diversion target section. Big animated
 * brand-color ring fills to the dashboard-configured recyclingRate (%) as the section
 * scrolls into view.
 *
 * Client component — uses IntersectionObserver to trigger the ring fill
 * animation. Returns null if the dashboard hasn't set a recyclingRate.
 */

import { useEffect, useRef, useState } from "react"
import { siteConfig, type SiteConfig } from "@/lib/siteConfig"
import { shouldRenderRecyclingImpact } from "@/lib/visibility"

export default function Recycling({ config = siteConfig }: { config?: SiteConfig } = {}) {
  const { recyclingRate, city } = config
  const [drawn, setDrawn] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true)
          obs.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  if (!shouldRenderRecyclingImpact(config) || recyclingRate === null) return null

  const RADIUS = 175
  const CIRC = 2 * Math.PI * RADIUS
  const pct = Math.max(0, Math.min(100, recyclingRate))
  const dash = drawn ? CIRC * (pct / 100) : 0

  return (
    <section
      ref={ref}
      className="py-[100px] px-[clamp(20px,4vw,64px)] text-paper relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 80% 20%, rgba(var(--brand-rgb), 0.15), transparent 60%)",
        }}
      />
      <div
        className="relative mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center"
        style={{ maxWidth: 1480 }}
      >
        <div>
          <div className="font-mono text-[12px] tracking-[0.18em] uppercase text-brand mb-3">
            — Sustainability target
          </div>
          <h2 className="font-display font-extrabold text-[clamp(36px,5vw,64px)] leading-[1.02] tracking-[-0.02em] max-w-[18ch]">
            {pct}% landfill-diversion target.
          </h2>
          <p className="text-[16px] leading-[1.6] text-paper/70 mt-5 max-w-[52ch]">
            The crew confirms disposal, donation, or recycling options for each job based on the
            material, schedule, and local availability{city ? ` near ${city}` : ""}.
          </p>
        </div>

        <div className="relative w-full max-w-[400px] mx-auto aspect-square">
          <svg viewBox="0 0 400 400" className="w-full h-full -rotate-90">
            <circle
              cx="200"
              cy="200"
              r={RADIUS}
              fill="none"
              stroke="rgba(250,246,239,0.15)"
              strokeWidth="14"
            />
            <circle
              cx="200"
              cy="200"
              r={RADIUS}
              fill="none"
              stroke="rgb(var(--brand-rgb))"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${CIRC}`}
              style={{ transition: "stroke-dasharray 1.6s cubic-bezier(0.22, 1, 0.36, 1)" }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="font-display font-extrabold text-[clamp(72px,10vw,96px)] leading-none text-paper">
                {pct}%
              </div>
              <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-paper/70 mt-2">
                Diversion target
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
