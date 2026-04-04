import Link from "next/link";
import { siteConfig, formatPhone, telHref } from "@/lib/siteConfig";
import { fetchReviews } from "@/lib/reviewData";
import type { Metadata } from "next";
import { ClipboardList, Phone, Star, CheckCircle, Users, Truck } from "lucide-react";

export const revalidate = 3600;

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;

export const metadata: Metadata = {
    title: `Junk Removal Reviews in ${siteConfig.city} | ${siteConfig.companyName}`,
    description: `See what real customers in ${cityState} say about ${siteConfig.companyName}. 5-star rated junk removal service. Read reviews from homeowners, property managers, and businesses.`,
    alternates: { canonical: "/reviews" },
};

export default async function ReviewsPage() {
    const { companyName, phoneNumber, testimonials } = siteConfig;

    // Fetch real Google reviews from dashboard
    const { reviews: googleReviews, stats } = await fetchReviews(12);

    const defaultReviews = [
        { name: "Happy Customer", role: "Homeowner", text: "Fast, professional, and the price was exactly what they quoted. Highly recommend!" },
        { name: "Satisfied Client", role: "Property Manager", text: "We use them for all our rental turnovers. Always on time and always thorough." },
        { name: "Repeat Customer", role: "Business Owner", text: "Third time using them. Consistent quality every single time. Great crew." },
    ];

    // Priority: Google reviews → siteConfig testimonials → defaults
    const hasGoogleReviews = googleReviews.length > 0;
    const displayReviews = hasGoogleReviews
        ? googleReviews.map(r => ({
            name: r.reviewerName,
            rating: r.rating,
            text: r.body || "",
            role: "Google Review",
            date: r.reviewedAt,
        }))
        : (testimonials.length > 0 ? testimonials : defaultReviews).map(r => ({
            name: r.name,
            rating: 5,
            text: r.text,
            role: r.role,
            date: null as string | null,
        }));

    // Stats: use real data or fallback
    const avgRating = stats?.averageRating ?? 5.0;
    const totalCount = stats?.totalCount ?? displayReviews.length;

    return (
        <>
            {/* AggregateRating JSON-LD — use real stats when available */}
            {(hasGoogleReviews || testimonials.length > 0) && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "LocalBusiness",
                            name: companyName,
                            aggregateRating: {
                                "@type": "AggregateRating",
                                ratingValue: String(avgRating),
                                bestRating: "5",
                                worstRating: "1",
                                reviewCount: String(totalCount),
                            },
                        }),
                    }}
                />
            )}

            {/* Hero */}
            <section style={{ background: "var(--hero-bg)", padding: "9rem 1.5rem 5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 800, margin: "0 auto" }}>
                    <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900, color: "var(--hero-text)", lineHeight: 1.1, marginBottom: "1.5rem" }}>
                        Junk Removal Reviews in{" "}
                        <span style={{ color: "var(--brand)" }}>{siteConfig.city}</span>
                    </h1>
                    <p style={{ fontSize: "1.2rem", color: "var(--hero-muted)", maxWidth: 550, margin: "0 auto" }}>
                        Don&apos;t take our word for it. Here&apos;s what real customers in {cityState} say about {companyName}.
                    </p>
                </div>
            </section>

            {/* Stats Bar */}
            <section style={{ background: "var(--brand)", padding: "1.5rem" }}>
                <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.5rem" }}>
                    {[
                        { icon: Star, value: hasGoogleReviews ? `${avgRating}` : "5-Star", label: hasGoogleReviews ? "Average Rating" : "Rated Service" },
                        { icon: Users, value: hasGoogleReviews ? `${totalCount}+` : "Trusted", label: hasGoogleReviews ? "Google Reviews" : "By Local Customers" },
                        { icon: Truck, value: "Same-Day", label: "Service Available" },
                        { icon: CheckCircle, value: "100%", label: "Satisfaction" },
                    ].map(stat => (
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
                        {companyName} has earned its reputation in {cityState} through reliable service, fair pricing,
                        and crews that treat every home like their own. We&apos;re proud of the relationships we&apos;ve
                        built with homeowners, property managers, and businesses across the area.
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
                    {displayReviews.map((review, i) => (
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
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section style={{ background: "var(--hero-bg)", padding: "5rem 1.5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "var(--hero-text)", marginBottom: "1rem" }}>Join Our Happy Customers</h2>
                    <p style={{ color: "var(--hero-muted)", fontSize: "1.1rem", marginBottom: "2rem" }}>Book your pickup today and see why customers in {siteConfig.city} keep coming back.</p>
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <Link href="/book" className="btn-primary" style={{ padding: "1rem 2rem", fontSize: "1rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}><ClipboardList size={18} /> Book Now</Link>
                        <a href={telHref(phoneNumber)} style={{ padding: "1rem 2rem", borderRadius: "var(--btn-radius)", border: "2px solid var(--hero-text)", color: "var(--hero-text)", textDecoration: "none", fontWeight: 700, fontSize: "1rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}><Phone size={18} /> {formatPhone(phoneNumber)}</a>
                    </div>
                </div>
            </section>
        </>
    );
}
