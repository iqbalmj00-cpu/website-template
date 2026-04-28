import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig, formatPhone, telHref } from "@/lib/siteConfig";
import { fetchBlogs, fetchBlogBySlug } from "@/lib/blogData";
import FAQAccordion from "@/components/FAQAccordion";
import type { Metadata } from "next";
import { ChevronRight, Phone } from "lucide-react";
import { createPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

/* ── SSG: pre-render all blog slugs ───────────────────────────────────── */
export async function generateStaticParams() {
    const blogs = await fetchBlogs();
    return blogs.map((b) => ({ slug: b.slug }));
}

/* ── SEO metadata ─────────────────────────────────────────────────────── */
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const post = await fetchBlogBySlug(params.slug);
    if (!post) {
        return createPageMetadata({
            title: "Post Not Found",
            description: "This blog post is not available.",
            path: `/blog/${params.slug}`,
            noIndex: true,
        });
    }

    const meta = post.content?.meta;
    return createPageMetadata({
        title: meta?.title || post.title,
        description: meta?.description || post.description,
        path: meta?.canonical || `/blog/${post.slug}`,
    });
}

/* ── Page ──────────────────────────────────────────────────────────────── */
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = await fetchBlogBySlug(params.slug);
    if (!post) notFound();

    const { content } = post;
    const phoneNumber = siteConfig.phoneNumber;

    return (
        <>
            {/* JSON-LD Structured Data */}
            {content.structuredData && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(content.structuredData) }}
                />
            )}

            {/* Breadcrumbs */}
            {content.breadcrumbs?.length > 0 && (
                <nav style={{ background: "var(--card)", borderBottom: "1px solid var(--border)", padding: "0.75rem 1.5rem" }}>
                    <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap", fontSize: "0.8rem", color: "var(--muted)" }}>
                        {content.breadcrumbs.map((crumb, i) => (
                            <span key={i} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                {i > 0 && <ChevronRight size={12} />}
                                {crumb.href ? (
                                    <Link href={crumb.href} style={{ color: "var(--brand)", textDecoration: "none", fontWeight: 600 }}>
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span style={{ color: "var(--foreground)", fontWeight: 600 }}>{crumb.label}</span>
                                )}
                            </span>
                        ))}
                    </div>
                </nav>
            )}

            {/* Hero */}
            <section style={{ background: "var(--hero-bg)", padding: "9rem 1.5rem 4rem", textAlign: "center" }}>
                <div style={{ maxWidth: 800, margin: "0 auto" }}>
                    {post.category && (
                        <span style={{
                            display: "inline-block", padding: "0.3rem 0.75rem", borderRadius: 20, marginBottom: "1.25rem",
                            background: "rgba(var(--brand-rgb, 249, 115, 22), 0.1)", color: "var(--brand)",
                            fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
                        }}>
                            {post.category}
                        </span>
                    )}
                    <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "var(--hero-text)", lineHeight: 1.15, marginBottom: "1rem" }}>
                        {content.heroHeadline || post.title}
                    </h1>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5rem", color: "var(--hero-muted)", fontSize: "0.85rem" }}>
                        {post.publishedAt && (
                            <span>{new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                        )}
                        {post.readTime && <span>{post.readTime}</span>}
                    </div>
                </div>
            </section>

            {/* Sections */}
            {content.sections?.length > 0 && (
                <article style={{ padding: "4rem 1.5rem", background: "var(--background)" }}>
                    <div style={{ maxWidth: 800, margin: "0 auto" }}>
                        {content.sections.map((section, i) => (
                            <div key={i} style={{ marginBottom: "3rem" }}>
                                {section.heading && (
                                    <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--foreground)", marginBottom: "1rem" }}>
                                        {section.heading}
                                    </h2>
                                )}
                                <div
                                    className="blog-content"
                                    style={{ color: "var(--muted)", fontSize: "1rem", lineHeight: 1.8 }}
                                    dangerouslySetInnerHTML={{ __html: section.body }}
                                />
                            </div>
                        ))}
                    </div>
                </article>
            )}

            {/* FAQ Accordion */}
            {content.faq?.length > 0 && (
                <section style={{ padding: "4rem 1.5rem", background: "var(--card)" }}>
                    <div style={{ maxWidth: 800, margin: "0 auto" }}>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--foreground)", marginBottom: "1.5rem", textAlign: "center" }}>
                            Frequently Asked Questions
                        </h2>
                        <FAQAccordion items={content.faq} />
                    </div>
                </section>
            )}

            {/* CTA Block */}
            {content.cta && (
                <section style={{ padding: "5rem 1.5rem", background: "var(--hero-bg)", textAlign: "center" }}>
                    <div style={{ maxWidth: 600, margin: "0 auto" }}>
                        <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 900, color: "var(--hero-text)", marginBottom: "1rem" }}>
                            {content.cta.heading}
                        </h2>
                        <p style={{ color: "var(--hero-muted)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "2rem" }}>
                            {content.cta.body}
                        </p>
                        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                            <Link href={content.cta.buttonHref} className="btn-primary" style={{ padding: "0.875rem 2rem", fontSize: "1rem" }}>
                                {content.cta.buttonLabel}
                            </Link>
                            <a href={telHref(phoneNumber)} style={{
                                padding: "0.875rem 2rem", borderRadius: "var(--btn-radius)", border: "2px solid var(--hero-border)",
                                color: "var(--hero-text)", textDecoration: "none", fontWeight: 700, fontSize: "1rem",
                                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                            }}>
                                <Phone size={18} /> {formatPhone(phoneNumber)}
                            </a>
                        </div>
                    </div>
                </section>
            )}

            {/* Related Pages */}
            {content.relatedPages?.length > 0 && (
                <section style={{ padding: "3rem 1.5rem", background: "var(--background)", borderTop: "1px solid var(--border)" }}>
                    <div style={{ maxWidth: 800, margin: "0 auto" }}>
                        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Related Pages
                        </h3>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                            {content.relatedPages.map((page, i) => (
                                <Link key={i} href={page.href} style={{
                                    padding: "0.5rem 1rem", borderRadius: 8, background: "var(--card)",
                                    border: "1px solid var(--border)", color: "var(--brand)", textDecoration: "none",
                                    fontWeight: 600, fontSize: "0.85rem",
                                }}>
                                    {page.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Blog content styling */}
            <style>{`
                .blog-content p { margin-bottom: 1rem; }
                .blog-content ul, .blog-content ol { margin-bottom: 1rem; padding-left: 1.5rem; }
                .blog-content li { margin-bottom: 0.5rem; }
                .blog-content a { color: var(--brand); text-decoration: underline; }
                .blog-content h3 { font-size: 1.2rem; font-weight: 700; color: var(--foreground); margin: 1.5rem 0 0.75rem; }
                .blog-content h4 { font-size: 1.05rem; font-weight: 600; color: var(--foreground); margin: 1.25rem 0 0.5rem; }
                .blog-content strong { color: var(--foreground); }
                .blog-content blockquote { border-left: 3px solid var(--brand); padding-left: 1rem; margin: 1.5rem 0; font-style: italic; color: var(--muted); }
            `}</style>
        </>
    );
}
