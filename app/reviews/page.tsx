import Link from "next/link";
import { isSameDayEnabled, siteConfig, formatPhone, telHref } from "@/lib/siteConfig";
import { fetchReviews } from "@/lib/reviewData";
import type { Metadata } from "next";
import { ClipboardList, Phone, Star, CheckCircle, Users, Truck } from "lucide-react";
import { createPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;

export const metadata: Metadata = createPageMetadata({
    title: `Junk Removal Reviews in ${siteConfig.city}`,
    description: `Read available customer reviews for ${siteConfig.companyName}, a junk removal service in ${cityState}.`,
    path: "/reviews",
});

export default async function ReviewsPage() {
    const { companyName, phoneNumber, testimonials } = siteConfig;

    // Fetch real Google reviews from dashboard
    const { reviews: googleReviews, stats } = await fetchReviews(12);

    // Priority: Google reviews -> operator-provided testimonials -> clean empty state.
    const hasGoogleReviews = googleReviews.length > 0;
    const displayReviews = hasGoogleReviews
        ? googleReviews.map(r => ({
            name: r.reviewerName,
            rating: r.rating,
            text: r.body || "",
            role: "Google Review",
            date: r.reviewedAt,
        }))
        : testimonials.map(r => ({
            name: r.name,
            rating: 5,
            text: r.text,
            role: r.role,
            date: null as string | null,
        }));

    const avgRating = stats?.averageRating;
    const totalCount = stats?.totalCount;
    const statsItems = [
        ...(hasGoogleReviews && avgRating ? [{ icon: Star, value: `${avgRating}`, label: "Average Rating" }] : []),
        ...(hasGoogleReviews && totalCount ? [{ icon: Users, value: `${totalCount}`, label: "Google Reviews" }] : []),
        { icon: Truck, value: "Online", label: "Booking Available" },
        ...(isSameDayEnabled() ? [{ icon: CheckCircle, value: "Same-Day", label: "May Be Available" }] : []),
    ];

    return (
        <>
            {/* Hero */}
            <section style={{ background: "var(--hero-bg)", padding: "9rem 1.5rem 5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 800, margin: "0 auto" }}>
                    <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900, color: "var(--hero-text)", lineHeight: 1.1, marginBottom: "1.5rem" }}>
                        Junk Removal Reviews in{" "}
                        <span style={{ color: "var(--brand)" }}>{siteConfig.city}</span>
                    </h1>
                    <p style={{ fontSize: "1.2rem", color: "var(--hero-muted)", maxWidth: 550, margin: "0 auto" }}>
                        {displayReviews.length > 0
                            ? `Read available customer feedback for ${companyName} in ${cityState}.`
                            : `Customer reviews for ${companyName} will appear here when real review data is available.`}
                    </p>
                </div>
            </section>

            {/* Stats Bar */}
            <section style={{ background: "var(--brand)", padding: "1.5rem" }}>
                <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.5rem" }}>
                    {statsItems.map(stat => (
                        <div key={stat.label} style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: "center" }}>
                            <stat.icon size={22} color="#fff" style={{ flexShrink: 0 }} />
                            <div>
                                <div style={{ fontSize: "1.35rem", fontWeight: 900, color: "#fff", lineHeight: 1.2 }}>{stat.value}</div>
                                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.8)" }}>{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Intro */}
            <section style={{ padding: "3rem 1.5rem 0", background: "var(--background)" }}>
                <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
                    <p style={{ color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.8 }}>
                        Customer feedback helps future customers compare service quality, communication, and pricing expectations.
                        This page only shows real Google reviews or testimonials provided through the client configuration.
                    </p>
                </div>
            </section>

            {/* Google attribution */}
            {hasGoogleReviews && (
                <section style={{ padding: "1.5rem 1.5rem 0", background: "var(--background)" }}>
                    <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
                        <p style={{ fontSize: "0.85rem", color: "var(--muted)", fontWeight: 600 }}>
                            ★ Reviews from Google
                        </p>
                    </div>
                </section>
            )}

            {/* Reviews Grid */}
            <section style={{ padding: "2rem 1.5rem 5rem", background: "var(--background)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
                    {displayReviews.length > 0 ? displayReviews.map((review, i) => (
                        <div key={i} style={{ background: "var(--card)", borderRadius: 16, padding: "2rem", border: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
                            <div style={{ display: "flex", gap: "0.25rem", color: "var(--brand)", marginBottom: "1rem", fontSize: "1rem" }}>
                                {Array.from({ length: 5 }, (_, s) => (
                                    <span key={s} style={{ color: s < review.rating ? "var(--brand)" : "var(--border)" }}>★</span>
                                ))}
                            </div>
                            {review.text && (
                                <p style={{ color: "var(--muted)", lineHeight: 1.6, flex: 1, fontStyle: "italic", marginBottom: "1.5rem" }}>
                                    &ldquo;{review.text}&rdquo;
                                </p>
                            )}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(var(--brand-rgb, 249, 115, 22), 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand)", fontWeight: 700, fontSize: "0.85rem" }}>
                                        {review.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 700, fontSize: "0.9rem" }}>{review.name}</p>
                                        <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{review.role}</p>
                                    </div>
                                </div>
                                {review.date && (
                                    <p style={{ color: "var(--muted)", fontSize: "0.75rem" }}>
                                        {new Date(review.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                                    </p>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div style={{ gridColumn: "1 / -1", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: "2rem", textAlign: "center" }}>
                            <h2 style={{ fontSize: "1.3rem", fontWeight: 850, marginBottom: "0.75rem" }}>No Reviews Published Yet</h2>
                            <p style={{ color: "var(--muted)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>
                                Customer reviews will appear here after they are available from the connected review source or client-provided testimonials.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section style={{ background: "var(--hero-bg)", padding: "5rem 1.5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "var(--hero-text)", marginBottom: "1rem" }}>Ready To Book Junk Removal?</h2>
                    <p style={{ color: "var(--hero-muted)", fontSize: "1.1rem", marginBottom: "2rem" }}>Book your pickup and approve the final quote before loading begins.</p>
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <Link href="/book" className="btn-primary" style={{ padding: "1rem 2rem", fontSize: "1rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}><ClipboardList size={18} /> Book Junk Removal in {siteConfig.city}</Link>
                        <a href={telHref(phoneNumber)} style={{ padding: "1rem 2rem", borderRadius: "var(--btn-radius)", border: "2px solid var(--hero-text)", color: "var(--hero-text)", textDecoration: "none", fontWeight: 700, fontSize: "1rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}><Phone size={18} /> {formatPhone(phoneNumber)}</a>
                    </div>
                </div>
            </section>
        </>
    );
}
