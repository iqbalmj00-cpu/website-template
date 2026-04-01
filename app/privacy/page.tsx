import { siteConfig } from "@/lib/siteConfig";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: `Privacy Policy | ${siteConfig.companyName}`,
    description: `Privacy policy for ${siteConfig.companyName}. Learn how we collect, use, and protect your personal information.`,
    alternates: { canonical: "/privacy" },
};

/* ── Shared styles ── */
const h2Style = { fontSize: "1.75rem", fontWeight: 800 as const, marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: "2px solid var(--brand)" };
const h3Style = { fontSize: "1.1rem", fontWeight: 700 as const, color: "var(--foreground)", marginTop: "2rem", marginBottom: "0.75rem" };
const pStyle = { marginBottom: "1rem" };
const bodyStyle = { color: "var(--muted)", lineHeight: 1.8, fontSize: "0.95rem" };

export default function PrivacyPolicyPage() {
    const { companyName, phoneNumber } = siteConfig;

    return (
        <main style={{ padding: "7rem 1.5rem 4rem" }}>
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
                <h1 style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: "3rem" }}>Privacy Policy</h1>

                <div style={bodyStyle}>
                    <p style={pStyle}><strong>Effective Date:</strong> April 1, 2026</p>
                    <p style={pStyle}>
                        {companyName} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy and is committed to protecting your personal information.
                        This Privacy Policy explains what information we collect, how we use it, and your choices regarding your data.
                    </p>

                    {/* ── Information We Collect ── */}
                    <h2 style={h2Style}>Information We Collect</h2>
                    <h3 style={h3Style}>Personal Information</h3>
                    <p style={pStyle}>
                        We collect information you provide directly to us, including:
                    </p>
                    <ul style={{ marginBottom: "1rem", paddingLeft: "1.5rem" }}>
                        <li style={{ marginBottom: "0.5rem" }}>Name, phone number, and email address</li>
                        <li style={{ marginBottom: "0.5rem" }}>Service address</li>
                        <li style={{ marginBottom: "0.5rem" }}>Details about the services you request (item descriptions, load sizes, project details)</li>
                        <li style={{ marginBottom: "0.5rem" }}>Photos you upload for quote estimates</li>
                        <li style={{ marginBottom: "0.5rem" }}>Payment information (processed securely by our payment provider)</li>
                        <li style={{ marginBottom: "0.5rem" }}>Electronic signatures for service agreements</li>
                    </ul>

                    <h3 style={h3Style}>Automatically Collected Information</h3>
                    <p style={pStyle}>
                        When you use our website, we may automatically collect device information, browser type, IP address, and usage data through cookies and similar technologies.
                    </p>

                    {/* ── How We Use Your Information ── */}
                    <h2 style={h2Style}>How We Use Your Information</h2>
                    <p style={pStyle}>We use the information we collect to:</p>
                    <ul style={{ marginBottom: "1rem", paddingLeft: "1.5rem" }}>
                        <li style={{ marginBottom: "0.5rem" }}>Provide, maintain, and improve our junk removal and dumpster rental services</li>
                        <li style={{ marginBottom: "0.5rem" }}>Schedule and manage your appointments</li>
                        <li style={{ marginBottom: "0.5rem" }}>Send appointment confirmations, reminders, and service updates via SMS (only with your explicit consent)</li>
                        <li style={{ marginBottom: "0.5rem" }}>Process payments and send invoices</li>
                        <li style={{ marginBottom: "0.5rem" }}>Respond to your inquiries and provide customer support</li>
                        <li style={{ marginBottom: "0.5rem" }}>Generate quotes and cost estimates based on photos and descriptions you provide</li>
                    </ul>

                    {/* ── SMS / Text Messaging ── */}
                    <h2 style={h2Style}>SMS / Text Messaging</h2>
                    <p style={pStyle}>
                        If you opt in to receive text messages from {companyName}, we may send you SMS messages related to your service, including booking confirmations, appointment reminders, follow-up messages, and links to our online booking platform.
                    </p>
                    <p style={pStyle}>
                        <strong>Your mobile phone number will not be shared with third parties for marketing or promotional purposes.</strong> We do not sell, rent, or share your mobile number with any third-party entity for their own marketing use.
                    </p>
                    <p style={pStyle}>
                        SMS messaging services for {companyName} are powered by <strong>ScaleYourJunk</strong>, our technology platform provider. ScaleYourJunk facilitates the sending and receiving of text messages on our behalf but does not use your phone number for any purpose other than providing this service.
                    </p>
                    <p style={pStyle}>
                        You may opt out of receiving text messages at any time by replying <strong>STOP</strong> to any message. For help, reply <strong>HELP</strong> or contact us at {phoneNumber}.
                    </p>

                    {/* ── Information Sharing ── */}
                    <h2 style={h2Style}>Information Sharing</h2>
                    <p style={pStyle}>
                        We do not sell your personal information. We may share your information with:
                    </p>
                    <ul style={{ marginBottom: "1rem", paddingLeft: "1.5rem" }}>
                        <li style={{ marginBottom: "0.5rem" }}>Our service crew members, to fulfill your booking and provide on-site services</li>
                        <li style={{ marginBottom: "0.5rem" }}>Payment processors, to securely process transactions</li>
                        <li style={{ marginBottom: "0.5rem" }}>ScaleYourJunk (our technology platform), to facilitate scheduling, SMS messaging, and service operations</li>
                        <li style={{ marginBottom: "0.5rem" }}>As required by law or to protect our legal rights</li>
                    </ul>

                    {/* ── Data Security ── */}
                    <h2 style={h2Style}>Data Security</h2>
                    <p style={pStyle}>
                        We implement reasonable security measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the Internet is 100% secure.
                    </p>

                    {/* ── Your Rights ── */}
                    <h2 style={h2Style}>Your Rights</h2>
                    <p style={pStyle}>
                        You may request access to, correction of, or deletion of your personal information by contacting us. You may also opt out of SMS communications at any time by replying STOP.
                    </p>

                    {/* ── Platform Privacy ── */}
                    <h2 style={h2Style}>Platform Privacy Policy</h2>
                    <p style={pStyle}>
                        Our booking and communication systems are powered by ScaleYourJunk. For information about how ScaleYourJunk handles data as our technology provider, please review the{" "}
                        <a href="https://scaleyourjunk.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand)", fontWeight: 600 }}>
                            ScaleYourJunk Platform Privacy Policy
                        </a>.
                    </p>

                    {/* ── Contact ── */}
                    <h2 style={h2Style}>Contact Us</h2>
                    <p style={pStyle}>
                        For privacy-related questions or to exercise your data rights, contact us at {phoneNumber} or through our Contact page.
                    </p>
                </div>
            </div>
        </main>
    );
}
