import { siteConfig } from "./siteConfig";
import { getServerConfig } from "./serverConfig";

/* ── Types ─────────────────────────────────────────────────────────────── */

export type BlogPost = {
    slug: string;
    title: string;
    description: string;
    publishedAt: string;
    category: string;
    tags: string[];
    readTime: string;
    heroHeadline: string;
};

export type BlogSection = { heading: string; body: string };
export type BlogFAQ = { question: string; answer: string };
export type BlogBreadcrumb = { label: string; href?: string };
export type BlogCTA = { heading: string; body: string; buttonLabel: string; buttonHref: string };
export type BlogRelatedPage = { label: string; href: string };

export type BlogPostFull = BlogPost & {
    content: {
        heroHeadline: string;
        breadcrumbs: BlogBreadcrumb[];
        sections: BlogSection[];
        faq: BlogFAQ[];
        cta: BlogCTA;
        structuredData: Record<string, unknown>;
        relatedPages: BlogRelatedPage[];
        meta: { title: string; description: string; canonical: string };
    };
};

/* ── Helpers ───────────────────────────────────────────────────────────── */

function apiUrl(params: Record<string, string>): string {
    const { dashboardUrl } = getServerConfig();
    const base = `${dashboardUrl}/api/agents/blogs/public`;
    const qs = new URLSearchParams({ subdomain: siteConfig.subdomain, ...params });
    return `${base}?${qs.toString()}`;
}

/**
 * Fetch all published blogs for this subdomain.
 * Returns an empty array on any failure so pages degrade gracefully.
 */
export async function fetchBlogs(): Promise<BlogPost[]> {
    const { dashboardUrl, siteToken } = getServerConfig();
    if (!siteConfig.enableBlog || !dashboardUrl || !siteToken || !siteConfig.subdomain) return [];
    try {
        const res = await fetch(apiUrl({ status: "published" }), {
            headers: { "x-site-token": siteToken },
            next: { revalidate: 3600 },
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.blogs ?? [];
    } catch {
        return [];
    }
}

/**
 * Fetch a single blog post by slug.
 * Returns null if not found or on failure.
 */
export async function fetchBlogBySlug(slug: string): Promise<BlogPostFull | null> {
    const { dashboardUrl, siteToken } = getServerConfig();
    if (!siteConfig.enableBlog || !dashboardUrl || !siteToken || !siteConfig.subdomain) return null;
    try {
        const res = await fetch(apiUrl({ slug }), {
            headers: { "x-site-token": siteToken },
            next: { revalidate: 3600 },
        });
        if (!res.ok) return null;
        const data = await res.json();
        // API may return { blogs: [post] } or { blog: post }
        const post = data.blog ?? data.blogs?.[0] ?? null;
        return post;
    } catch {
        return null;
    }
}
