import { siteConfig } from "@/lib/siteConfig";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: `Terms of Service | ${siteConfig.companyName}`,
    description: `Terms of service for ${siteConfig.companyName}. Review our service terms, pricing policies, and SMS messaging terms.`,
    alternates: { canonical: "/terms" },
};

/* ── Shared styles ── */
const h2Style = { fontSize: "1.75rem", fontWeight: 800 as const, marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: "2px solid var(--brand)" };
const h3Style = { fontSize: "1.1rem", fontWeight: 700 as const, color: "var(--foreground)", marginTop: "2rem", marginBottom: "0.75rem" };
const pStyle = { marginBottom: "1rem" };
const bodyStyle = { color: "var(--muted)", lineHeight: 1.8, fontSize: "0.95rem" };

export default function TermsOfServicePage() {
    const { companyName, city, state, phoneNumber } = siteConfig;

    return (
        <main style={{ padding: "7rem 1.5rem 4rem" }}>
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
                <h1 style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: "3rem" }}>Terms of Service</h1>

                <div style={bodyStyle}>
                    <p style={pStyle}><strong>Effective Date:</strong> April 1, 2026</p>
                    <p style={pStyle}>
                        By using the services offered by {companyName} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to these Terms of Service. Please read them carefully.
                    </p>

                    {/* ── Services ── */}
                    <h2 style={h2Style}>Services</h2>
                    <p style={pStyle}>
                        {companyName} provides junk removal, hauling, cleanout, and dumpster rental services in the {city}{state ? `, ${state}` : ""} area. All services are subject to availability and may vary by location.
                    </p>

                    {/* ── Pricing & Payment ── */}
                    <h2 style={h2Style}>Pricing &amp; Payment</h2>
                    <p style={pStyle}>
                        All quotes are estimates unless otherwise stated. Final pricing is determined on-site based on the actual volume of items. We accept cash, credit/debit cards, and digital payments.
                    </p>
                    <p style={pStyle}>
                        For dumpster rentals, pricing includes a base rental period and weight allowance. Overage charges apply for extended rental periods and excess weight as outlined at the time of booking.
                    </p>

                    {/* ── SMS Messaging Terms ── */}
                    <h2 style={h2Style}>SMS Messaging Terms</h2>
                    <p style={pStyle}>
                        By opting in to receive text messages from {companyName}, you agree to the following terms:
                    </p>

                    <h3 style={h3Style}>Message Types</h3>
                    <p style={pStyle}>
                        You may receive the following types of text messages from {companyName}:
                    </p>
                    <ul style={{ marginBottom: "1rem", paddingLeft: "1.5rem" }}>
                        <li style={{ marginBottom: "0.5rem" }}>Booking and appointment confirmations</li>
                        <li style={{ marginBottom: "0.5rem" }}>Appointment reminders and scheduling updates</li>
                        <li style={{ marginBottom: "0.5rem" }}>Links to our online booking and estimating tools</li>
                        <li style={{ marginBottom: "0.5rem" }}>Service follow-up messages</li>
                    </ul>

                    <h3 style={h3Style}>Opting Out</h3>
                    <p style={pStyle}>
                        You can cancel SMS messages at any time by replying <strong>STOP</strong> to any message from {companyName}. After you send STOP, you will receive a one-time confirmation that you have been unsubscribed. You will no longer receive SMS messages from us unless you re-subscribe.
                    </p>

                    <h3 style={h3Style}>Getting Help</h3>
                    <p style={pStyle}>
                        If you experience issues with our messaging program, reply <strong>HELP</strong> to any message from {companyName}, or contact us directly at {phoneNumber}.
                    </p>

                    <h3 style={h3Style}>Message Frequency</h3>
                    <p style={pStyle}>
                        Message frequency varies based on your service activity. You may receive messages related to active bookings, upcoming appointments, or follow-up communications. We do not send unsolicited marketing texts.
                    </p>

                    <h3 style={h3Style}>Carrier Charges</h3>
                    <p style={pStyle}>
                        Message and data rates may apply. Check with your mobile carrier for details about your text messaging plan. {companyName} is not responsible for charges from your wireless provider.
                    </p>

                    <h3 style={h3Style}>Carrier Liability</h3>
                    <p style={pStyle}>
                        Carriers (e.g., T-Mobile, AT&amp;T, Verizon) are not liable for delayed or undelivered messages. Message delivery is subject to effective transmission from your network.
                    </p>

                    {/* ── Prohibited Items ── */}
                    <h2 style={h2Style}>Prohibited Items</h2>
                    <p style={pStyle}>
                        We cannot haul hazardous materials, asbestos, medical waste, explosives, or other regulated substances. See our Items We Don&apos;t Take page for details.
                    </p>

                    {/* ── Liability ── */}
                    <h2 style={h2Style}>Liability</h2>
                    <p style={pStyle}>
                        {companyName} is fully licensed and insured. However, we are not liable for pre-existing damage to items or property not disclosed before the job begins.
                    </p>
                    <p style={pStyle}>
                        Our total liability for any claim arising from our services shall not exceed the amount paid for the specific service giving rise to such claim.
                    </p>

                    {/* ── Cancellations ── */}
                    <h2 style={h2Style}>Cancellations</h2>
                    <p style={pStyle}>
                        You may cancel or reschedule your appointment with at least 24 hours&apos; notice at no charge. Late cancellations may incur a trip fee.
                    </p>

                    {/* ── Changes to Terms ── */}
                    <h2 style={h2Style}>Changes to These Terms</h2>
                    <p style={pStyle}>
                        We reserve the right to modify these Terms of Service at any time. Changes become effective when posted on this page. Your continued use of our services after any modification constitutes acceptance of the updated terms.
                    </p>

                    {/* ── Contact ── */}
                    <h2 style={h2Style}>Contact Us</h2>
                    <p style={pStyle}>
                        If you have questions about these Terms of Service, contact us at {phoneNumber} or through our Contact page.
                    </p>
                </div>
            </div>
        </main>
    );
}
