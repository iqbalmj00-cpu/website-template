import Link from "next/link";
import { formatPhone, hasInsurance, siteConfig, telHref } from "@/lib/siteConfig";
import { getServerConfig } from "@/lib/serverConfig";
import SafeImage from "@/components/SafeImage";
import type { Metadata } from "next";
import {
    ArrowRight,
    Building,
    Building2,
    CheckCircle,
    ClipboardList,
    CreditCard,
    KeyRound,
    Mail,
    Phone,
    Store,
    Truck,
} from "lucide-react";
import { breadcrumbJsonLd, createPageMetadata, faqPageJsonLd, serviceJsonLd } from "@/lib/seo";

const cityState = siteConfig.state ? `${siteConfig.city}, ${siteConfig.state}` : siteConfig.city;
const commercialDumpsterCopy = siteConfig.offersDumpsterRental
    ? `commercial dumpster rental, roll-off dumpster service, construction debris hauling, and business junk removal in ${cityState}`
    : `commercial junk removal, office cleanouts, construction debris pickup, and business cleanout service in ${cityState}`;
const commercialMetaDescription = `Commercial junk removal in ${cityState} for offices, property managers, contractors, retail spaces, warehouses, and business cleanouts.`;

export const metadata: Metadata = {
    ...createPageMetadata({
        title: `Commercial Junk Removal in ${cityState}`,
        description: commercialMetaDescription,
        path: "/commercial",
        image: siteConfig.commercialImageUrl,
    }),
    keywords: [
        `commercial junk removal ${siteConfig.city}`,
        `business junk removal ${siteConfig.city}`,
        `office cleanout ${siteConfig.city}`,
        `property management junk removal ${siteConfig.city}`,
        `construction debris removal ${siteConfig.city}`,
        ...(siteConfig.offersDumpsterRental ? [
            `commercial dumpster rental ${siteConfig.city}`,
            `roll off dumpster rental ${siteConfig.city}`,
        ] : []),
    ],
};

export default function CommercialPage() {
    const { companyName, phoneNumber, city } = siteConfig;
    const { dashboardUrl, siteToken } = getServerConfig();
    const portalConfigured = Boolean(dashboardUrl && siteToken);

    const serviceSchema = serviceJsonLd({
        service: {
            title: siteConfig.offersDumpsterRental ? "Commercial Junk Removal and Dumpster Rental" : "Commercial Junk Removal",
            shortDesc: `${companyName} provides ${commercialDumpsterCopy}.`,
        },
        path: "/commercial",
        description: `${companyName} provides commercial junk removal in ${cityState} for offices, property managers, contractors, retailers, warehouses, and approved business cleanout projects.`,
    });

    const breadcrumbSchema = breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Commercial Junk Removal", path: "/commercial" },
    ]);

    const commercialServices = [
        {
            Icon: Building2,
            title: "Office Cleanouts",
            desc: `Office junk removal in ${cityState} for desks, chairs, cubicles, filing cabinets, electronics, and workspace cleanouts.`,
        },
        {
            Icon: Store,
            title: "Retail & Restaurant Cleanouts",
            desc: "Fixtures, shelving, signage, seating, backroom junk, remodel debris, and bulky items from commercial spaces.",
        },
        {
            Icon: Building,
            title: "Property Management Junk Removal",
            desc: "Tenant moveout junk, apartment bulk item pickup, storage area cleanouts, and multi-property service after access is approved.",
        },
        {
            Icon: ClipboardList,
            title: "Construction Debris Pickup",
            desc: `Commercial debris removal in ${cityState} for renovation debris, contractor cleanup, and jobsite hauling within accepted material limits.`,
        },
        ...(siteConfig.offersDumpsterRental ? [{
            Icon: Truck,
            title: "Commercial Dumpster Rental",
            desc: `Roll-off dumpster rental in ${cityState} for construction, property cleanup, retail remodels, and ongoing commercial disposal needs.`,
        }] : []),
    ];

    const commercialPlanning = [
        "Item volume, material type, and number of loads",
        "Elevator, loading dock, parking, and floor-access requirements",
        "Business hours, building rules, and approved appointment windows",
        "Sorting, staging, PO, invoice, or recurring service needs",
        "Accepted material limits for construction debris, fixtures, and bulky items",
    ];

    const commercialKeywords = [
        `commercial junk removal in ${cityState}`,
        `business junk removal in ${city}`,
        `office cleanout service in ${city}`,
        `property management junk removal in ${city}`,
        `commercial debris removal in ${city}`,
        ...(siteConfig.offersDumpsterRental ? [`commercial dumpster rental in ${city}`, `roll-off dumpster rental in ${cityState}`] : []),
    ];

    const heroKeywords = commercialKeywords.slice(0, 3);

    const heroProofItems = [
        { Icon: CheckCircle, label: "Office and property cleanouts" },
        { Icon: CreditCard, label: "Final price confirmed before work" },
        { Icon: KeyRound, label: "Portal access when configured" },
    ];

    const faqs = [
        {
            q: `Do you offer commercial junk removal in ${cityState}?`,
            a: `Yes. ${companyName} handles commercial junk removal for offices, retail spaces, property managers, contractors, warehouses, and other business customers across ${cityState}.`,
        },
        {
            q: "What can commercial customers do in the customer portal?",
            a: "Commercial customers can request jobs, use saved locations, track active work, view job history, review invoices, manage payment visibility, update account details, and request recurring service for approval.",
        },
        {
            q: "Can property managers save multiple locations?",
            a: "Yes. Commercial accounts can keep saved locations with building or unit details, access notes, and service instructions so repeat jobs are easier to request accurately.",
        },
        {
            q: "How is commercial junk removal pricing calculated?",
            a: "Commercial pricing depends on item volume, material type, building access, loading requirements, scheduling needs, and any approved recurring or account workflow details. The final price is confirmed before loading begins.",
        },
        ...(siteConfig.offersDumpsterRental ? [{
            q: `Do you offer commercial dumpster rental in ${city}?`,
            a: `${companyName} offers dumpster rental for eligible commercial cleanup, construction debris, remodel, and property cleanup needs in ${city}. Availability, container sizes, and accepted materials depend on the job details.`,
        }] : []),
    ];
    const faqSchema = faqPageJsonLd(faqs, "/commercial");

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([serviceSchema, breadcrumbSchema, faqSchema]) }}
            />

            <section style={{ background: "var(--hero-bg)", padding: "9rem 1.5rem 5rem", overflow: "hidden" }}>
                <div data-image-grid style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "2rem", alignItems: "center" }}>
                    <div>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 1rem", borderRadius: "var(--btn-radius)", background: "var(--hero-badge-bg)", border: "1px solid var(--hero-badge-border)", color: "var(--brand)", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "2rem" }}>
                            <Building2 size={16} style={{ color: "var(--brand)" }} /> Commercial Junk Removal
                        </span>
                        <h1 style={{ fontSize: "clamp(2.35rem, 6vw, 3.5rem)", fontWeight: 900, color: "var(--hero-text)", lineHeight: 1.08, marginBottom: "1.5rem" }}>
                            Commercial Junk Removal In <span style={{ color: "var(--brand)" }}>{cityState}</span>
                        </h1>
                        <p style={{ fontSize: "1.15rem", color: "var(--hero-muted)", maxWidth: 640, lineHeight: 1.65 }}>
                            {companyName} helps businesses, property managers, contractors, retailers, and office teams remove bulky items, clear spaces, and plan approved commercial cleanouts{siteConfig.offersDumpsterRental ? " or dumpster rental needs" : ""}. Commercial account tools are available when configured.
                        </p>
                        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "2rem" }}>
                            <Link href="/contact" className="btn-primary">
                                Request Commercial Service <ArrowRight size={18} />
                            </Link>
                            <a href={telHref(phoneNumber)} className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                                <Phone size={18} /> {formatPhone(phoneNumber)}
                            </a>
                        </div>
                        <div style={{ display: "flex", gap: "0.55rem", flexWrap: "wrap", marginTop: "1.35rem", maxWidth: 590 }}>
                            {heroKeywords.map(keyword => (
                                <span key={keyword} style={{ padding: "0.42rem 0.65rem", borderRadius: "999px", background: "rgba(255,255,255,0.055)", color: "var(--hero-muted)", border: "1px solid rgba(255,255,255,0.12)", fontSize: "0.74rem", fontWeight: 750, lineHeight: 1.25 }}>
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div style={{ borderRadius: 20, padding: "0.75rem", background: "linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.035))", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 22px 70px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
                        <div style={{ position: "relative", overflow: "hidden", borderRadius: 14, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}>
                            <SafeImage
                                src={siteConfig.commercialImageUrl || "/images/generated/commercial.png"}
                                alt={`${companyName} commercial junk removal and business cleanout team in ${cityState}`}
                                collapseParentGrid
                                loading="eager"
                                style={{ width: "100%", display: "block", objectFit: "cover", aspectRatio: "16/10" }}
                            />
                            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(5,15,31,0) 52%, rgba(5,15,31,0.28))", pointerEvents: "none" }} />
                        </div>

                        <div style={{ marginTop: "0.75rem", borderRadius: 14, background: "rgba(5,15,31,0.62)", border: "1px solid rgba(255,255,255,0.1)", padding: "1rem", display: "grid", gap: "0.7rem" }}>
                            <p style={{ margin: 0, color: "rgba(255,255,255,0.56)", fontSize: "0.72rem", fontWeight: 850, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                Commercial service details
                            </p>
                            {heroProofItems.map((item) => (
                                <div key={item.label} style={{ display: "grid", gridTemplateColumns: "2rem 1fr", alignItems: "center", gap: "0.7rem", color: "var(--hero-text)", fontWeight: 780 }}>
                                    <span style={{ width: "2rem", height: "2rem", borderRadius: 8, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(var(--brand-rgb), 0.14)", border: "1px solid rgba(var(--brand-rgb), 0.28)" }}>
                                        <item.Icon size={17} style={{ color: "var(--brand)" }} />
                                    </span>
                                    <span>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ padding: "5rem 1.5rem", background: "var(--background)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                        <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.75rem" }}>Commercial Junk Removal Services In {cityState}</h2>
                        <p style={{ color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: 760, margin: "0 auto" }}>
                            Commercial junk removal is planned around the business type, item volume, building access, and approved pickup window. These are core commercial cleanout categories this template supports.
                        </p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: "1rem" }}>
                        {commercialServices.map((svc) => (
                            <div key={svc.title} style={{ background: "var(--card)", borderRadius: 12, padding: "1.5rem", border: "1px solid var(--border)" }}>
                                <svc.Icon size={26} color="var(--brand)" style={{ marginBottom: "0.85rem" }} />
                                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, marginBottom: "0.5rem" }}>{svc.title}</h3>
                                <p style={{ color: "var(--muted)", fontSize: "0.92rem", lineHeight: 1.6 }}>{svc.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section style={{ padding: "5rem 1.5rem", background: "var(--card)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "2rem", alignItems: "center" }}>
                    <div>
                        <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1rem" }}>Portal Support For Commercial Accounts</h2>
                        <p style={{ color: "var(--muted)", fontSize: "1.03rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                            After the hauling scope is clear, commercial account contacts may also need a way to manage service requests, job records, billing details, saved locations, and recurring service information.
                        </p>
                        <div style={{ display: "grid", gap: "0.8rem" }}>
                            {[
                                "Request one-time cleanouts or recurring commercial junk removal",
                                "Track active jobs, completed jobs, uploaded job photos, and service history",
                                "Review invoices, payment status, PDF records, receipts, and open balances",
                                "Keep saved locations, access instructions, and PO details organized",
                                ...(siteConfig.offersDumpsterRental ? ["Request dumpster swaps, pickups, and rental extensions when rentals are active"] : []),
                            ].map((item) => (
                                <div key={item} style={{ display: "flex", gap: "0.65rem", alignItems: "flex-start", color: "var(--foreground)", fontWeight: 700 }}>
                                    <CheckCircle size={18} style={{ color: "var(--brand)", marginTop: 2, flexShrink: 0 }} />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: 14, padding: "1.25rem", boxShadow: "var(--shadow-soft)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid var(--border)", paddingBottom: "1rem", gap: "1rem" }}>
                            <div>
                                <p style={{ fontSize: "0.78rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.05em", marginBottom: "0.25rem" }}>Customer Portal</p>
                                <h3 style={{ fontSize: "1.15rem", fontWeight: 900 }}>{companyName}</h3>
                            </div>
                            <span style={{ padding: "0.35rem 0.7rem", borderRadius: "var(--btn-radius)", background: "rgba(var(--brand-rgb), 0.12)", color: "var(--brand)", fontSize: "0.78rem", fontWeight: 800 }}>Commercial</span>
                        </div>
                        <div style={{ display: "grid", gap: "0.75rem" }}>
                            {[
                                { label: "Next job", value: "Office cleanout request" },
                                { label: "Saved location", value: `${city} commercial property` },
                                { label: "Billing", value: "Open invoices and payment status" },
                                { label: "History", value: "Past jobs and approved recurring service" },
                                { label: "Account", value: "PO numbers and billing contact" },
                            ].map((row) => (
                                <div key={row.label} style={{ display: "grid", gridTemplateColumns: "minmax(88px, 120px) 1fr", gap: "1rem", padding: "0.8rem", border: "1px solid var(--border)", borderRadius: 10, background: "var(--card)" }}>
                                    <span style={{ color: "var(--muted)", fontSize: "0.85rem", fontWeight: 700 }}>{row.label}</span>
                                    <span style={{ color: "var(--foreground)", fontSize: "0.9rem", fontWeight: 800 }}>{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ padding: "5rem 1.5rem", background: "var(--background)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                        <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.75rem" }}>Commercial Pricing And Scheduling Factors</h2>
                        <p style={{ color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: 760, margin: "0 auto" }}>
                            Commercial junk removal pricing depends on the scope of work, access, material type, and timing requirements. The final price is confirmed before loading begins.
                        </p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))", gap: "1rem" }}>
                        {commercialPlanning.map((item) => (
                            <div key={item} style={{ background: "var(--card)", borderRadius: 12, padding: "1.25rem", border: "1px solid var(--border)", display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                                <CheckCircle size={20} color="var(--brand)" style={{ flexShrink: 0, marginTop: 2 }} />
                                <p style={{ color: "var(--muted)", fontSize: "0.94rem", lineHeight: 1.65, margin: 0 }}>{item}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", gap: "0.85rem", flexWrap: "wrap", marginTop: "2rem" }}>
                        <Link href="/services" className="btn-secondary">View Services</Link>
                        <Link href="/pricing" className="btn-secondary">View Pricing</Link>
                        <Link href="/locations" className="btn-secondary">Service Areas</Link>
                        {siteConfig.offersDumpsterRental && <Link href="/dumpster-rental" className="btn-secondary">Dumpster Rental</Link>}
                    </div>
                </div>
            </section>

            <section style={{ padding: "5rem 1.5rem", background: "var(--card)", borderTop: "1px solid var(--border)" }}>
                <div style={{ maxWidth: 960, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                        <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.75rem" }}>Commercial Junk Removal FAQs</h2>
                        <p style={{ color: "var(--muted)", fontSize: "1.02rem", lineHeight: 1.7 }}>
                            Common questions from businesses comparing commercial junk removal, business cleanout, and{siteConfig.offersDumpsterRental ? " dumpster rental" : " debris pickup"} options in {cityState}.
                        </p>
                    </div>
                    <div style={{ display: "grid", gap: "1rem" }}>
                        {faqs.map((faq) => (
                            <div key={faq.q} style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: 12, padding: "1.25rem" }}>
                                <h3 style={{ fontSize: "1rem", fontWeight: 850, marginBottom: "0.5rem" }}>{faq.q}</h3>
                                <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.65 }}>{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section style={{ background: "var(--brand)", padding: "4rem 1.5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 760, margin: "0 auto" }}>
                    <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "var(--hero-text)", marginBottom: "1rem" }}>Need Commercial Junk Removal{siteConfig.offersDumpsterRental ? " Or Dumpster Rental" : ""} In {cityState}?</h2>
                    <p style={{ color: "var(--hero-text)", fontSize: "1.1rem", marginBottom: "2rem", lineHeight: 1.65 }}>
                        Request commercial service, discuss repeat pickup needs, or ask how customer portal access works for your commercial account{hasInsurance() ? " with an insured local provider" : ""}.
                    </p>
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <Link href="/contact" style={{ padding: "1rem 2rem", borderRadius: "var(--btn-radius)", background: "var(--card)", color: "var(--brand)", fontWeight: 700, fontSize: "1rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}><Mail size={18} /> Request a Quote</Link>
                        <a href={telHref(phoneNumber)} style={{ padding: "1rem 2rem", borderRadius: "var(--btn-radius)", border: "2px solid #fff", color: "var(--hero-text)", textDecoration: "none", fontWeight: 700, fontSize: "1rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}><Phone size={18} /> {formatPhone(phoneNumber)}</a>
                        {portalConfigured && (
                            <Link href="/customer-portal" referrerPolicy="no-referrer" style={{ padding: "1rem 2rem", borderRadius: "var(--btn-radius)", border: "2px solid #fff", color: "var(--hero-text)", textDecoration: "none", fontWeight: 700, fontSize: "1rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}><KeyRound size={18} /> Customer Portal</Link>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
