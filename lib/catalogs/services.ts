/**
 * Service catalog — the master list of services the template knows how to
 * render. The dashboard's `NEXT_PUBLIC_SERVICES` array picks IDs from here
 * (or via display-name fuzzy match for backwards compatibility).
 *
 * Adding a service: add a new entry here. The dashboard will pick it up
 * the next time the catalog is synced.
 */

import type { LucideIcon } from 'lucide-react'
import {
  Trash2,
  Sofa,
  Refrigerator,
  Trees,
  Hammer,
  Wrench,
  Building2,
  Bath,
  Tv,
  Bed,
  Briefcase,
  Archive,
  Home,
} from 'lucide-react'

export interface ServiceCatalogEntry {
  id: string
  /** Display name. Aliases supported for matching against legacy dashboard
   *  values that emit free-text service names. */
  name: string
  aliases?: string[]
  /** One-line teaser used in card grids. */
  blurb: string
  /** Lucide icon to render in the card. */
  Icon: LucideIcon
  /** Optional dashboard-backed display price. Do not use as an unsupported fact. */
  fromPrice?: number
  /** Whether this service is commonly residential, commercial, or both. */
  audience: 'residential' | 'commercial' | 'both'
}

export const SERVICE_CATALOG: ServiceCatalogEntry[] = [
  {
    id: 'junk-removal',
    name: 'Junk Removal',
    aliases: ['General Junk Removal', 'Junk Pickup', 'Junk Hauling'],
    blurb: 'Mixed junk, bulky items, cleanout debris, and approved household clutter.',
    Icon: Trash2,
    audience: 'both',
  },
  {
    id: 'demolition',
    name: 'Light Demolition',
    aliases: ['Demolition', 'Demo', 'Shed Removal', 'Deck Removal'],
    blurb: 'Non-structural tear-outs and debris hauling after scope review.',
    Icon: Hammer,
    audience: 'both',
  },
  {
    id: 'furniture-removal',
    name: 'Furniture Removal',
    aliases: ['Furniture', 'Couches', 'Sofas'],
    blurb: 'Sofas, beds, dressers, tables, and other bulky pieces.',
    Icon: Sofa,
    audience: 'both',
  },
  {
    id: 'appliance-removal',
    name: 'Appliance Removal',
    aliases: ['Appliance Disposal', 'Appliances', 'Refrigerators', 'Washers'],
    blurb: 'Fridges, washers, dryers, stoves, and other accepted appliances.',
    Icon: Refrigerator,
    audience: 'both',
  },
  {
    id: 'estate-cleanout',
    name: 'Estate Cleanouts',
    aliases: ['Estate Cleanout', 'Whole-Home Cleanout', 'Hoarding'],
    blurb: 'Whole-home clearance for approved items and cleanout debris.',
    Icon: Home,
    audience: 'residential',
  },
  {
    id: 'yard-waste-removal',
    name: 'Yard Waste Removal',
    aliases: ['Yard Debris', 'Storm Cleanup', 'Branches'],
    blurb: 'Storm cleanup, branches, soil, sod, fence panels.',
    Icon: Trees,
    audience: 'residential',
  },
  {
    id: 'foreclosure-cleanout',
    name: 'Foreclosure Cleanouts',
    aliases: ['Tenant Turn', 'Eviction', 'Foreclosure Cleanout'],
    blurb: 'Property cleanouts scoped by access, volume, and schedule availability.',
    Icon: Building2,
    audience: 'commercial',
  },
  {
    id: 'construction-debris',
    name: 'Construction Debris',
    aliases: ['Construction Cleanouts', 'Demo Debris', 'Remodel'],
    blurb: 'Drywall, flooring, cabinets, demo loadouts.',
    Icon: Hammer,
    audience: 'commercial',
  },
  {
    id: 'garage-cleanout',
    name: 'Garage Cleanout',
    aliases: ['Garage Cleanout', 'Garage Junk'],
    blurb: 'Garage clutter, shelving, boxes, tools, and bulky stored items.',
    Icon: Wrench,
    audience: 'residential',
  },
  {
    id: 'hot-tub-removal',
    name: 'Hot Tub Removal',
    aliases: ['Spa Removal'],
    blurb: 'Heavy-item pickup reviewed for access, weight, and handling needs.',
    Icon: Bath,
    audience: 'residential',
  },
  {
    id: 'e-waste-recycling',
    name: 'E-Waste Recycling',
    aliases: ['Electronics', 'TVs', 'E-Waste'],
    blurb: 'TVs, monitors, computers, cables, and accepted electronics.',
    Icon: Tv,
    audience: 'both',
  },
  {
    id: 'mattress-disposal',
    name: 'Mattress Disposal',
    aliases: ['Mattresses', 'Beds'],
    blurb: 'Mattresses, box springs, bed frames, and bedroom furniture.',
    Icon: Bed,
    audience: 'residential',
  },
  {
    id: 'commercial-cleanout',
    name: 'Commercial Cleanouts',
    aliases: ['Office Cleanouts', 'Commercial Moves', 'Office Junk'],
    blurb: 'Office furniture, files, fixtures, electronics, and commercial clutter.',
    Icon: Briefcase,
    audience: 'commercial',
  },
  {
    id: 'storage-unit-cleanout',
    name: 'Storage Unit Cleanouts',
    aliases: ['Storage Cleanout', 'Storage Locker'],
    blurb: 'Storage-unit contents and bulky items cleared after scope review.',
    Icon: Archive,
    audience: 'residential',
  },
  {
    id: 'hoarder-cleanout',
    name: 'Hoarder Cleanouts',
    aliases: ['Hoarding Cleanout', 'Hoarding', 'Hoarder Cleanup'],
    blurb: 'Large cleanout projects reviewed for access, volume, and item type.',
    Icon: Archive,
    audience: 'residential',
  },
]

/** Match dashboard's free-form service strings → catalog IDs. */
export function resolveServiceCatalogIds(displayNames: string[]): ServiceCatalogEntry[] {
  const normalized = displayNames.map((n) => n.toLowerCase().trim())
  const seen = new Set<string>()
  const result: ServiceCatalogEntry[] = []
  for (const entry of SERVICE_CATALOG) {
    if (seen.has(entry.id)) continue
    const candidates = [entry.name, entry.id, ...(entry.aliases ?? [])].map((s) => s.toLowerCase())
    if (normalized.some((n) => candidates.includes(n))) {
      result.push(entry)
      seen.add(entry.id)
    }
  }
  return result
}

/** Get the master catalog entry by ID. */
export function getServiceById(id: string): ServiceCatalogEntry | undefined {
  return SERVICE_CATALOG.find((s) => s.id === id)
}
