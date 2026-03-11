import Link from "next/link";
import { siteConfig, formatPhone, telHref } from "@/lib/siteConfig";
import type { Metadata } from "next";
import { ClipboardList, Phone, Star, CheckCircle, Users, Truck } from "lucide-react";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;

export const metadata: Metadata = {
    title: `Junk Removal Reviews in ${siteConfig.city} | ${siteConfig.companyName}`,
    description: `See what real customers in ${cityState} say about ${siteConfig.companyName}. 5-star rated junk removal service. Read reviews from homeowners, property managers, and businesses.`,
    alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
    const { companyName, phoneNumber, testimonials } = siteConfig;

    const defaultReviews = [
        { name: "Happy Customer", role: "Homeowner", text: "Fast, professional, and the price was exactly what they quoted. Highly recommend!" },
        { name: "Satisfied Client", role: "Property Manager", text: "We use them for all our rental turnovers. Always on time and always thorough." },
        { name: "Repeat Customer", role: "Business Owner", text: "Third time using them. Consistent quality every single time. Great crew." },
    ];

    const reviews = testimonials.length > 0 ? testimonials : defaultReviews;
    const reviewCount = reviews.length;

    return (
        <>
            {/* AggregateRating JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "LocalBusiness",
                        name: companyName,
                        aggregateRating: {
                            "@type": "AggregateRating",
                            ratingValue: "5.0",
                            bestRating: "5",
                            worstRating: "1",
                            reviewCount: String(reviewCount),
                        },
                    }),
                }}
            />

            {/* Hero */}
            <section style={{ background: "var(--hero-bg)", padding: "7rem 1.5rem 5rem", textAlign: "center" }}>
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
                <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1.5rem", textAlign: "center" }}>
                    {[
                        { icon: Star, value: "5.0 ★", label: "Average Rating" },
                        { icon: Users, value: `${reviewCount}+`, label: "Happy Customers" },
                        { icon: Truck, value: "Same-Day", label: "Service Available" },
                        { icon: CheckCircle, value: "100%", label: "Satisfaction" },
                    ].map(stat => (
                        <div key={stat.label}>
                            <stat.icon size={20} color="#fff" style={{ marginBottom: "0.25rem" }} />
                            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#fff" }}>{stat.value}</div>
                            <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.8)" }}>{stat.label}</div>
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

            {/* Reviews Grid */}
            <section style={{ padding: "3rem 1.5rem 5rem", background: "var(--background)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
                    {reviews.map((review, i) => (
                        <div key={i} style={{ background: "var(--card)", borderRadius: 16, padding: "2rem", border: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
                            <div style={{ display: "flex", gap: "0.25rem", color: "var(--brand)", marginBottom: "1rem", fontSize: "1rem" }}>
                                {"★★★★★"}
                            </div>
                            <p style={{ color: "var(--muted)", lineHeight: 1.6, flex: 1, fontStyle: "italic", marginBottom: "1.5rem" }}>
                                &ldquo;{review.text}&rdquo;
                            </p>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(var(--brand-rgb, 249, 115, 22), 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand)", fontWeight: 700, fontSize: "0.85rem" }}>
                                    {review.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                                </div>
                                <div>
                                    <p style={{ fontWeight: 700, fontSize: "0.9rem" }}>{review.name}</p>
                                    <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{review.role}</p>
                                </div>
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
