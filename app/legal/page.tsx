import { siteConfig } from "@/lib/siteConfig";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: `Legal | ${siteConfig.companyName}`,
    description: `Privacy policy and terms of service for ${siteConfig.companyName}.`,
    alternates: { canonical: "/legal" },
};

export default function LegalPage() {
    const { companyName, city, state } = siteConfig;

    return (
        <>
            <main style={{ padding: "7rem 1.5rem 4rem" }}>
                <div style={{ maxWidth: 800, margin: "0 auto" }}>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: "3rem" }}>Legal</h1>

                    {/* Privacy Policy */}
                    <section style={{ marginBottom: "4rem" }}>
                        <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: "2px solid var(--brand)" }}>Privacy Policy</h2>
                        <div style={{ color: "var(--muted)", lineHeight: 1.8, fontSize: "0.95rem" }}>
                            <p style={{ marginBottom: "1rem" }}><strong>Effective Date:</strong> January 1, 2025</p>
                            <p style={{ marginBottom: "1rem" }}>{companyName} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy and is committed to protecting your personal information.</p>

                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", marginTop: "2rem", marginBottom: "0.75rem" }}>Information We Collect</h3>
                            <p style={{ marginBottom: "1rem" }}>We collect information you provide directly to us, including your name, phone number, email address, service address, and details about the junk removal services you request.</p>

                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", marginTop: "2rem", marginBottom: "0.75rem" }}>How We Use Your Information</h3>
                            <p style={{ marginBottom: "1rem" }}>We use your information to provide our junk removal services, communicate with you about your appointments, send appointment confirmations and reminders, and improve our services.</p>

                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", marginTop: "2rem", marginBottom: "0.75rem" }}>Information Sharing</h3>
                            <p style={{ marginBottom: "1rem" }}>We do not sell your personal information. We may share your information with our service crew members to fulfill your booking and with payment processors to process transactions.</p>

                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", marginTop: "2rem", marginBottom: "0.75rem" }}>Contact Us</h3>
                            <p>For privacy-related questions, contact us at the phone number or email address listed on our Contact page.</p>
                        </div>
                    </section>

                    {/* Terms of Service */}
                    <section>
                        <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: "2px solid var(--brand)" }}>Terms of Service</h2>
                        <div style={{ color: "var(--muted)", lineHeight: 1.8, fontSize: "0.95rem" }}>
                            <p style={{ marginBottom: "1rem" }}><strong>Effective Date:</strong> January 1, 2025</p>

                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", marginTop: "2rem", marginBottom: "0.75rem" }}>Services</h3>
                            <p style={{ marginBottom: "1rem" }}>{companyName} provides junk removal, hauling, and cleanout services in the {city}{state ? `, ${state}` : ""} area. All services are subject to availability.</p>

                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", marginTop: "2rem", marginBottom: "0.75rem" }}>Pricing & Payment</h3>
                            <p style={{ marginBottom: "1rem" }}>All quotes are estimates unless otherwise stated. Final pricing is determined on-site based on the actual volume of items. We accept cash, credit/debit cards, and digital payments.</p>

                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", marginTop: "2rem", marginBottom: "0.75rem" }}>Prohibited Items</h3>
                            <p style={{ marginBottom: "1rem" }}>We cannot haul hazardous materials, asbestos, medical waste, explosives, or other regulated substances. See our Items We Don&apos;t Take page for details.</p>

                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", marginTop: "2rem", marginBottom: "0.75rem" }}>Liability</h3>
                            <p style={{ marginBottom: "1rem" }}>{companyName} is fully licensed and insured. However, we are not liable for pre-existing damage to items or property not disclosed before the job begins.</p>

                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", marginTop: "2rem", marginBottom: "0.75rem" }}>Cancellations</h3>
                            <p>You may cancel or reschedule your appointment with at least 24 hours&apos; notice at no charge. Late cancellations may incur a trip fee.</p>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}
