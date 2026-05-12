import type { ReactNode } from "react"

/**
 * FAQ catalog — master pool of questions the template can answer.
 * The page-level FAQ components filter this pool based on site config.
 *
 * Some questions are templated with `{{tokens}}` resolved at render
 * time from siteConfig (city, phone, etc).
 */

export interface FaqCategory {
  id: string
  label: string
  iconKey: 'pricing' | 'items' | 'scheduling' | 'areas' | 'disposal' | 'commercial'
}

export interface FaqItem {
  id: string
  category: FaqCategory['id']
  question: string
  /** Plain answer text. Use {{city}}, {{phone}}, {{state}}, {{serviceArea}} tokens. */
  answer: string
  /** Render only if this predicate returns true (e.g. dumpster-only Q). */
  showIf?: 'dumpster' | 'same-day' | 'commercial'
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  { id: 'pricing', label: 'Pricing', iconKey: 'pricing' },
  { id: 'items', label: 'Items', iconKey: 'items' },
  { id: 'scheduling', label: 'Scheduling', iconKey: 'scheduling' },
  { id: 'areas', label: 'Service Areas', iconKey: 'areas' },
  { id: 'disposal', label: 'Disposal', iconKey: 'disposal' },
  { id: 'commercial', label: 'Commercial', iconKey: 'commercial' },
]

export const FAQ_POOL: FaqItem[] = [
  // Pricing
  {
    id: 'pricing-how-calculated',
    category: 'pricing',
    question: 'How is the price calculated?',
    answer:
      'Pricing is confirmed from the configured price book, job size, item type, access, distance, and any enabled surcharges that apply.',
  },
  {
    id: 'pricing-fixed-quote',
    category: 'pricing',
    question: 'Is the quote really fixed?',
    answer:
      'The crew confirms the final price before loading begins. If the job scope changes, the quote is reviewed again before work continues.',
  },
  {
    id: 'pricing-hidden-fees',
    category: 'pricing',
    question: 'Are there hidden fees?',
    answer:
      'Any configured surcharges should be reviewed before loading starts, including item, access, distance, or scheduling charges when they apply.',
  },
  {
    id: 'pricing-minimum',
    category: 'pricing',
    question: 'Do you have a minimum?',
    answer:
      'Minimums depend on the configured price book for this business. The final quote is confirmed before loading begins.',
  },
  {
    id: 'pricing-payment',
    category: 'pricing',
    question: 'Do you take card & cash?',
    answer:
      'Available payment methods depend on this business setup. The booking and confirmation flow will show the options currently supported.',
  },

  // Items
  {
    id: 'items-what-you-take',
    category: 'items',
    question: 'What can you take?',
    answer:
      'The services page lists the item categories configured for this business. Common categories can include furniture, appliances, yard waste, cleanouts, and construction debris when selected.',
  },
  {
    id: 'items-what-not',
    category: 'items',
    question: "What can't you take?",
    answer:
      'Hazardous, regulated, or unsafe materials are not accepted through standard junk removal booking. Ask before booking if an item may require special handling.',
  },
  {
    id: 'items-fridges',
    category: 'items',
    question: 'Do you take refrigerators & ACs?',
    answer: 'Appliance availability and any refrigerant handling fees depend on the configured services and local disposal requirements.',
  },
  {
    id: 'items-hot-tubs',
    category: 'items',
    question: 'Hot tubs & pianos?',
    answer:
      'Large, heavy, or specialty items require job-specific review. Share photos and access details so the crew can confirm whether the item can be removed.',
  },
  {
    id: 'items-construction',
    category: 'items',
    question: 'Construction debris?',
    answer:
      'Construction debris is available only when that service is configured for this business. Material type, weight, and volume can affect the quote.',
  },

  // Scheduling
  {
    id: 'sched-how-fast',
    category: 'scheduling',
    question: 'How fast can you arrive?',
    answer: 'Same-day availability appears only when enabled for this business. Available booking windows are shown during scheduling.',
    showIf: 'same-day',
  },
  {
    id: 'sched-be-home',
    category: 'scheduling',
    question: 'Do I need to be home?',
    answer:
      'Some jobs can be reviewed from photos, while others require someone on site to confirm access and the final quote.',
  },
  {
    id: 'sched-cancellation',
    category: 'scheduling',
    question: 'Cancellation policy?',
    answer:
      'Cancellation and rescheduling policies depend on this business setup. Contact the business before your appointment window if plans change.',
  },
  {
    id: 'sched-weekends',
    category: 'scheduling',
    question: 'After-hours / weekends?',
    answer:
      'Available days and times come from the configured business hours and booking calendar.',
  },

  // Areas
  {
    id: 'area-where',
    category: 'areas',
    question: 'Where do you serve?',
    answer: 'Service is available in {{serviceArea}}. Enter your address during booking so coverage can be checked.',
  },
  {
    id: 'area-beyond',
    category: 'areas',
    question: 'Beyond your radius?',
    answer:
      'Out-of-area availability depends on the configured service radius and distance pricing. Call before booking if the address may be outside the standard area.',
  },
  {
    id: 'area-multi-stop',
    category: 'areas',
    question: 'Multiple stops in one job?',
    answer: 'Multiple-stop jobs require review because routing and access can change the quote.',
  },
  {
    id: 'area-apt-access',
    category: 'areas',
    question: 'Apartment / HOA access?',
    answer:
      'Apartment, HOA, gate, elevator, and parking details should be included during booking so access can be confirmed.',
  },

  // Disposal
  {
    id: 'disposal-where-goes',
    category: 'disposal',
    question: 'Where does the stuff go?',
    answer:
      'Disposal, donation, and recycling options depend on the material and local availability. Ask for job-specific handling details before loading begins.',
  },
  {
    id: 'disposal-receipts',
    category: 'disposal',
    question: 'Donation receipts?',
    answer:
      'Donation receipts are available only when the receiving organization provides one and the item is accepted for donation.',
  },
  {
    id: 'disposal-ewaste',
    category: 'disposal',
    question: 'E-waste handling?',
    answer:
      'Electronics and data-bearing devices may require special handling. Confirm accepted items and any documentation needs before booking.',
  },
  {
    id: 'disposal-mattress-fee',
    category: 'disposal',
    question: 'Mattress fee — why?',
    answer:
      'Mattress fees depend on the configured price book and local disposal rules. Any applicable charge should be confirmed before loading.',
  },
  {
    id: 'disposal-tire-fee',
    category: 'disposal',
    question: 'Tire fee?',
    answer: 'Tire acceptance and fees depend on the configured services and local handling requirements.',
  },

  // Commercial
  {
    id: 'commercial-net-terms',
    category: 'commercial',
    question: 'Property managers — net terms?',
    answer:
      'Commercial account terms depend on this business setup. Contact the business to confirm billing and documentation options.',
    showIf: 'commercial',
  },
  {
    id: 'commercial-recurring',
    category: 'commercial',
    question: 'Recurring service?',
    answer:
      'Recurring service may be available when configured for this business. Confirm frequency, pricing, and service windows directly.',
    showIf: 'commercial',
  },
  {
    id: 'commercial-after-hours',
    category: 'commercial',
    question: 'Office moves / e-waste?',
    answer:
      'Office cleanouts and e-waste require job-specific review, especially when after-hours access or data-bearing devices are involved.',
    showIf: 'commercial',
  },
  {
    id: 'commercial-eviction',
    category: 'commercial',
    question: 'Tenant turn / eviction?',
    answer:
      'Tenant turn and eviction cleanouts require access confirmation, item review, and any documentation requirements before scheduling.',
    showIf: 'commercial',
  },
  {
    id: 'commercial-portal',
    category: 'commercial',
    question: 'Customer portal?',
    answer:
      'The customer portal is available only when configured for this client site.',
    showIf: 'commercial',
  },
]

/** Token-substitute an answer string. */
export function resolveTokens(template: string, tokens: Record<string, string | number | null | undefined>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const value = tokens[key]
    return value == null ? '' : String(value)
  })
}

/** Filter the pool by category and predicates. */
export function filterFaqs(opts: {
  categoryId?: FaqItem['category']
  sameDayEnabled: boolean
  offersDumpsterRental: boolean
  hasCommercial: boolean
}): FaqItem[] {
  return FAQ_POOL.filter((q) => {
    if (opts.categoryId && q.category !== opts.categoryId) return false
    if (q.showIf === 'dumpster' && !opts.offersDumpsterRental) return false
    if (q.showIf === 'same-day' && !opts.sameDayEnabled) return false
    if (q.showIf === 'commercial' && !opts.hasCommercial) return false
    return true
  })
}

/** Render-ready (ReactNode answers with anchors are constructed at use site). */
export type ResolvedFaq = { question: string; answer: ReactNode }
