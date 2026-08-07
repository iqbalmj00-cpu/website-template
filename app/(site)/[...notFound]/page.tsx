import { notFound } from "next/navigation";

/**
 * Catch-all that routes unmatched URLs to the branded 404.
 *
 * There are two root layouts and no `app/layout.tsx`, so Next has no single
 * layout to render a root-level `not-found.tsx` in and served its own unstyled
 * "404: This page could not be found." instead — no company name, no links, no
 * way back to booking. Landing here puts the request inside `(site)`, so the
 * operator's branded page renders instead.
 *
 * Real routes still win: Next matches specific segments before a catch-all.
 * Verified after adding this: `/`, `/book`, `/services/junk-removal`,
 * `/sitemap.xml` and `/robots.txt` all still return 200.
 *
 * Two things this does NOT do:
 *   - Restore the header and footer. Next renders 404s in a bare error
 *     document; see components/NotFoundContent.tsx.
 *   - Cover the three routes with `dynamicParams = false` (`/services/[slug]`,
 *     `/cost/[itemSlug]`, `/locations/[slug]/[serviceSlug]`). An unknown slug
 *     there is refused by the route itself before this is reached, so it still
 *     gets the framework page. Changing that means opting those routes into
 *     request-time rendering — a deliberate SEO trade-off, not one to make
 *     silently.
 */
export default function CatchAllNotFound() {
    notFound();
}
