import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/redesign/PageHero";
import StaticFAQ from "@/components/redesign/StaticFAQ";
import CtaBand from "@/components/redesign/CtaBand";
import { DispatchCardSection } from "@/components/redesign/DispatchBlocks";
import { siteConfig } from "@/lib/siteConfig";
import { fetchBlogs, fetchBlogBySlug } from "@/lib/blogData";
import { createPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
    const blogs = await fetchBlogs();
    return blogs.map((b) => ({ slug: b.slug }));
}

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
        path: `/blog/${post.slug}`,
        canonicalPath: meta?.canonical || `/blog/${post.slug}`,
    });
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = await fetchBlogBySlug(params.slug);
    if (!post) notFound();

    const { content } = post;
    const crumbs = content.breadcrumbs?.length > 0
        ? content.breadcrumbs
        : [
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.title, href: `/blog/${post.slug}` },
        ];
    const metaLine = [
        post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : null,
        post.readTime,
    ].filter(Boolean).join(" / ");
    const relatedCards = content.relatedPages?.map((page) => ({
        title: page.label,
        desc: "Continue to this related website page for more service details.",
        href: page.href,
        actionLabel: "Open page",
    })) || [];
    const faqItems = content.faq?.map((item) => ({
        q: item.question,
        a: item.answer,
    })) || [];

    return (
        <>
            {content.structuredData && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(content.structuredData) }}
                />
            )}

            <PageHero
                crumbs={crumbs}
                eyebrow={post.category || "Blog guide"}
                titleStart={content.heroHeadline || post.title}
                titleAccent=""
                lede={metaLine || post.description}
                primaryCta={{ label: "Book Now", href: "/book" }}
            />

            {content.sections?.length > 0 && (
                <article className="section blog-article">
                    <div className="blog-article-inner">
                        {content.sections.map((section, index) => (
                            <section className="blog-article-section" key={`${section.heading || "section"}-${index}`}>
                                {section.heading && <h2>{section.heading}</h2>}
                                <div className="blog-content" dangerouslySetInnerHTML={{ __html: section.body }} />
                            </section>
                        ))}
                    </div>
                </article>
            )}

            {faqItems.length > 0 && (
                <StaticFAQ eyebrow="Blog FAQ" heading="Frequently asked questions." items={faqItems} />
            )}

            {content.cta && (
                <CtaBand
                    heading={{ lead: content.cta.heading, accent: "" }}
                    lede={content.cta.body}
                />
            )}

            <DispatchCardSection
                eyebrow="Related pages"
                heading="Continue reading."
                cards={relatedCards}
                variant="service-links"
                alt
            />
        </>
    );
}
