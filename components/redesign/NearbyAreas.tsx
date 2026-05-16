/**
 * NearbyAreas — grid of service-area cards built from configured service area
 * names, falling back to configured ZIP codes when names are unavailable.
 *
 * Server component. Returns null when no service-area data is configured.
 */

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import SafeImage from "@/components/SafeImage"
import { siteConfig, type SiteConfig } from "@/lib/siteConfig"
import {
  focalPointToObjectPosition,
  resolveJunkRemovalImage,
} from "@/lib/templateAssets/junkRemoval"
import { shouldRenderServiceAreas } from "@/lib/visibility"

interface NearbyAreasProps {
  heading?: string
  /** Exclude one location slug — useful on the per-area page so it doesn't list itself. */
  currentSlug?: string
  limit?: number
  config?: SiteConfig
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function unique(values: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const value of values) {
    const clean = value.replace(/\s+/g, " ").trim()
    const key = clean.toLowerCase()
    if (!clean || seen.has(key)) continue
    seen.add(key)
    result.push(clean)
  }
  return result
}

function serviceAreaNames(config: SiteConfig): string[] {
  const names = unique([
    config.city,
    ...config.serviceArea.split(/[,;]/).map((area) => area.trim()),
  ]).filter((name) => {
    const normalized = name.toLowerCase()
    return normalized !== "your area" && normalized !== "service area" && normalized !== "surrounding areas"
  })

  return names
}

export default function NearbyAreas({ heading, currentSlug, limit = 12, config = siteConfig }: NearbyAreasProps = {}) {
  if (!shouldRenderServiceAreas(config)) return null

  const { serviceAreaZips, city, state } = config
  const namedAreas = serviceAreaNames(config)
    .map((name) => ({ name, slug: toSlug(name), href: `/locations/${toSlug(name)}`, meta: state || city }))
    .filter((area) => area.slug && area.slug !== currentSlug)
    .slice(0, limit)
  const zipAreas = serviceAreaZips
    .map((zip) => ({ name: `ZIP ${zip}`, slug: zip, href: "/locations", meta: city }))
    .filter((area) => area.slug !== currentSlug)
    .slice(0, limit)
  const areas = namedAreas.length > 0 ? namedAreas : zipAreas
  if (areas.length === 0) return null

  const headlineParts: string[] = []
  if (city) headlineParts.push(city)
  if (state) headlineParts.push(state)
  const headline =
    heading ??
    (headlineParts.length > 0 ? `Areas we serve near ${headlineParts.join(", ")}.` : "Areas we serve.")
  const areaImage = resolveJunkRemovalImage({
    config,
    role: "locationNeighborhood",
    routeKey: `nearby-${city}-${state}`,
    locationName: city,
  })

  return (
    <section className="bg-paper-2 py-[100px] px-[clamp(20px,4vw,64px)]">
      <div className="mx-auto" style={{ maxWidth: 1480 }}>
        <div className="mb-9 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.54fr)] lg:items-end">
          <h2 className="font-display font-extrabold text-[clamp(36px,4.4vw,52px)] leading-[1.02] tracking-[-0.02em] max-w-[36rem]">
            {headline}
          </h2>
          <figure className="relative overflow-hidden rounded-[14px] border border-line bg-paper shadow-paper">
            <SafeImage
              src={areaImage.src}
              fallbackSrc="/images/default-hero.png"
              alt={areaImage.alt}
              width={900}
              height={560}
              loading="lazy"
              style={{
                display: "block",
                width: "100%",
                aspectRatio: "16 / 8",
                height: "auto",
                objectFit: "cover",
                objectPosition: focalPointToObjectPosition(areaImage.focalPoint),
              }}
            />
          </figure>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {areas.map((area) => (
            <Link
              key={area.slug}
              href={area.href}
              className="group relative bg-paper border border-line rounded-[14px] p-6 flex flex-col gap-1 overflow-hidden transition-all duration-300 ease-out hover:bg-brand hover:text-white hover:border-brand hover:-translate-y-1 hover:translate-x-1"
            >
              <span className="font-display font-semibold text-[18px] leading-tight">{area.name}</span>
              {area.meta && (
                <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted group-hover:text-white/85 transition-colors">
                  {area.meta}
                </span>
              )}
              <ArrowUpRight
                className="absolute top-5 right-5 w-4 h-4 text-muted group-hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
