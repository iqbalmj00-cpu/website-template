import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { fetchBlogs } from "@/lib/blogData";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Newspaper, Clock, ArrowRight } from "lucide-react";
import { createPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = createPageMetadata({
    title: `Junk Removal Blog in ${siteConfig.city}`,
    description: `Published junk removal guides from ${siteConfig.companyName} in ${siteConfig.city}.`,
    path: "/blog",
    noIndex: !siteConfig.enableBlog,
});

export default async function BlogPage() {
    const blogs = await fetchBlogs();
    const { companyName, city } = siteConfig;

    if (!siteConfig.enableBlog || blogs.length === 0) notFound();

    return (
        <>
            {/* Hero */}
            <section style={{ background: "var(--hero-bg)", padding: "9rem 1.5rem 4rem", textAlign: "center" }}>
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 1rem", borderRadius: "var(--btn-radius)", background: "var(--hero-badge-bg)", border: "1px solid var(--hero-badge-border)", color: "var(--brand)", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1.5rem" }}>
                        <Newspaper size={14} /> Blog
                    </span>
                    <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "var(--hero-text)", marginBottom: "1rem" }}>
                        The {companyName} <span style={{ color: "var(--brand)" }}>Blog</span>
                    </h1>
                    <p style={{ color: "var(--hero-muted)", fontSize: "1.1rem" }}>
                        Tips, guides, and junk removal insights from your {city} experts.
                    </p>
                </div>
            </section>

            <section style={{ padding: "4rem 1.5rem", background: "var(--background)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem" }}>
                        {blogs.map((post) => (
                            <Link key={post.slug} href={`/blog/${post.slug}`} style={{
                                textDecoration: "none", color: "inherit",
                                background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16,
                                overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s",
                                display: "flex", flexDirection: "column",
                            }}>
                                <div style={{ padding: "1rem 1.5rem 0" }}>
                                    {post.category && (
                                        <span style={{
                                            display: "inline-block", padding: "0.25rem 0.75rem", borderRadius: 20,
                                            background: "rgba(var(--brand-rgb, 249, 115, 22), 0.1)",
                                            color: "var(--brand)", fontSize: "0.7rem", fontWeight: 700,
                                            textTransform: "uppercase", letterSpacing: "0.05em",
                                        }}>
                                            {post.category}
                                        </span>
                                    )}
                                </div>

                                <div style={{ padding: "1rem 1.5rem 1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                                    <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--foreground)", marginBottom: "0.75rem", lineHeight: 1.3 }}>
                                        {post.title}
                                    </h2>
                                    <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6, flex: 1, marginBottom: "1rem" }}>
                                        {post.description}
                                    </p>

                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--muted)" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                            {post.publishedAt && (
                                                <span>{new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                                            )}
                                            {post.readTime && (
                                                <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                                    <Clock size={12} /> {post.readTime}
                                                </span>
                                            )}
                                        </div>
                                        <span style={{ color: "var(--brand)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                            Read <ArrowRight size={14} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
