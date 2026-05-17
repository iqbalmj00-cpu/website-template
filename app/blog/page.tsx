import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/redesign/PageHero";
import { DispatchCardSection } from "@/components/redesign/DispatchBlocks";
import { siteConfig } from "@/lib/siteConfig";
import { fetchBlogs } from "@/lib/blogData";
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

    const blogCards = blogs.map((post) => ({
        eyebrow: [post.category, post.readTime].filter(Boolean).join(" / ") || (post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Guide"),
        title: post.title,
        desc: post.description,
        href: `/blog/${post.slug}`,
        actionLabel: "Read guide",
    }));

    return (
        <>
            <PageHero
                crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }]}
                eyebrow="Blog"
                titleStart={`The ${companyName}`}
                titleAccent=" blog."
                lede={`Tips, guides, and junk removal insights from ${city} service experts.`}
                primaryCta={{ label: "Book Now", href: "/book" }}
            />
            <DispatchCardSection
                eyebrow="Published guides"
                heading="Junk removal articles and planning resources."
                body="Blog posts appear only when the client has enabled and published dashboard-backed content."
                cards={blogCards}
                variant="service-links"
            />
        </>
    );
}
