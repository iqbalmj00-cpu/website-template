import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: `Customer Reviews | ${siteConfig.companyName}`,
    description: `See what real customers say about ${siteConfig.companyName}. Read reviews from homeowners, property managers, and businesses.`,
};

export default function ReviewsPage() {
    const { companyName, phoneNumber, testimonials } = siteConfig;

    const defaultReviews = [
        { name: "Happy Customer", role: "Homeowner", text: "Fast, professional, and the price was exactly what they quoted. Highly recommend!" },
        { name: "Satisfied Client", role: "Property Manager", text: "We use them for all our rental turnovers. Always on time and always thorough." },
        { name: "Repeat Customer", role: "Business Owner", text: "Third time using them. Consistent quality every single time. Great crew." },
    ];

    const reviews = testimonials.length > 0 ? testimonials : defaultReviews;

    return (
        <>
            <Navbar />
            <main>
                {/* Hero */}
                <section style={{ background: "var(--navy, #0f172a)", padding: "7rem 1.5rem 5rem", textAlign: "center" }}>
                    <div style={{ maxWidth: 800, margin: "0 auto" }}>
                        <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: "1.5rem" }}>
                            Customer <span style={{ color: "var(--brand)" }}>Reviews</span>
                        </h1>
                        <p style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.65)", maxWidth: 550, margin: "0 auto" }}>
                            Don&apos;t take our word for it. Here&apos;s what real customers say about {companyName}.
                        </p>
                    </div>
                </section>

                {/* Reviews Grid */}
                <section style={{ padding: "5rem 1.5rem", background: "var(--background)" }}>
                    <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
                        {reviews.map((review, i) => (
                            <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "2rem", border: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
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
                <section style={{ background: "var(--navy, #0f172a)", padding: "5rem 1.5rem", textAlign: "center" }}>
                    <div style={{ maxWidth: 700, margin: "0 auto" }}>
                        <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "#fff", marginBottom: "1rem" }}>Join Our Happy Customers</h2>
                        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.1rem", marginBottom: "2rem" }}>Book your pickup today and see why our customers keep coming back.</p>
                        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                            <Link href="/book" className="btn-primary" style={{ padding: "1rem 2rem", fontSize: "1rem" }}>📋 Book Now</Link>
                            <a href={`tel:${phoneNumber.replace(/\D/g, "")}`} style={{ padding: "1rem 2rem", borderRadius: 999, border: "2px solid #fff", color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: "1rem" }}>📞 {phoneNumber}</a>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
