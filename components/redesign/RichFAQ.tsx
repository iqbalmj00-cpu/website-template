"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { formatPhone, siteConfig, telHref, type SiteConfig } from "@/lib/siteConfig";

export type RichFAQItem = {
    q: string;
    a: string;
};

type RichFAQProps = {
    items: RichFAQItem[];
    eyebrow?: string;
    heading?: string;
    body?: string;
    config?: SiteConfig;
    tone?: "paper" | "paper-2";
};

export default function RichFAQ({
    items,
    eyebrow = "FAQ",
    heading = "Junk removal questions before booking.",
    body,
    config = siteConfig,
    tone = "paper",
}: RichFAQProps) {
    const [openIndex, setOpenIndex] = useState(0);
    if (items.length === 0) return null;

    const phone = config.phoneNumber ? formatPhone(config.phoneNumber) : "";
    const answerCount = items.length;

    return (
        <section className={`section rich-faq-section rich-faq-section--${tone}`} id="faq">
            <div className="rich-faq-shell">
                <div className="rich-faq-head">
                    <div>
                        <span className="eyebrow">{eyebrow}</span>
                        <h2>{heading}</h2>
                    </div>
                    <p>{body || "Review pricing, scheduling, accepted items, service-area coverage, and what to expect before pickup."}</p>
                    <span className="rich-faq-count">{answerCount} answer{answerCount === 1 ? "" : "s"}</span>
                </div>

                <div className="rich-faq-board">
                    {items.map((faq, index) => {
                        const isOpen = openIndex === index;
                        const questionId = `faq-question-${index}`;
                        const answerId = `faq-answer-${index}`;
                        return (
                            <div className="rich-faq-row" key={`${faq.q}-${index}`}>
                                <button
                                    type="button"
                                    className="rich-faq-trigger"
                                    aria-expanded={isOpen}
                                    aria-controls={answerId}
                                    id={questionId}
                                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                                >
                                    <span className="rich-faq-number">Q.{String(index + 1).padStart(2, "0")}</span>
                                    <span className="rich-faq-question">{faq.q}</span>
                                    <span className="rich-faq-icon" aria-hidden="true">
                                        <Plus size={18} strokeWidth={2.6} />
                                    </span>
                                </button>
                                <div
                                    className="rich-faq-answer"
                                    id={answerId}
                                    role="region"
                                    aria-labelledby={questionId}
                                    hidden={!isOpen}
                                >
                                    <p>{faq.a}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="rich-faq-footer">
                    <div>
                        <strong>Need help choosing?</strong>
                        <span>Use the booking flow or call with the pickup details before scheduling.</span>
                    </div>
                    {phone ? (
                        <a className="btn brand" href={telHref(config.phoneNumber)} aria-label={`Call ${phone}`}>
                            Call Us <ArrowRight size={16} strokeWidth={2.4} aria-hidden="true" />
                        </a>
                    ) : (
                        <Link className="btn brand" href="/book">
                            Book Now <ArrowRight size={16} strokeWidth={2.4} aria-hidden="true" />
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}
