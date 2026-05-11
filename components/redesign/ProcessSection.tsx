"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import {
    isSameDayEnabled,
    siteConfig,
    type SiteConfig,
} from "@/lib/siteConfig";
import BookingDemo from "@/components/redesign/BookingDemo";

const PERIOD = 4200;

const TRUST = [
    { t: "Quote before loading", d: "Review the job details before work starts." },
    { t: "Configured services", d: "Only selected service types appear on the site." },
    { t: "Address-aware booking", d: "Service area checks use configured coverage data." },
    { t: "Clear confirmation", d: "The booking flow shows the submitted request details." },
];

export default function ProcessSection({ config = siteConfig }: { config?: SiteConfig }) {
    const [active, setActive] = useState(0);
    const wrapRef = useRef<HTMLElement>(null);
    const visibleRef = useRef(false);

    const stepRows = [
        { num: "01", name: "Tell us about you", desc: "Name, phone, address, and pickup details." },
        { num: "02", name: "Show us how much", desc: "Use the load step to describe the job size." },
        {
            num: "03",
            name: "Pick a day & time",
            desc: isSameDayEnabled(config)
                ? "Same-day windows appear when available."
                : "Choose an available pickup time.",
        },
        { num: "04", name: "You're booked", desc: "Review the confirmation details after submitting." },
    ];

    useEffect(() => {
        const el = wrapRef.current;
        if (!el || !("IntersectionObserver" in window)) {
            visibleRef.current = true;
            return;
        }
        const io = new IntersectionObserver(
            ([entry]) => {
                visibleRef.current = entry.isIntersecting;
            },
            { threshold: 0.25 },
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        const id = window.setInterval(() => {
            if (!visibleRef.current) return;
            if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
            setActive(current => (current + 1) % 4);
        }, PERIOD);
        return () => window.clearInterval(id);
    }, []);

    return (
        <section
            ref={wrapRef}
            className="relative overflow-hidden bg-paper py-[100px] px-[clamp(20px,4vw,64px)] scroll-mt-[104px]"
        >
            <div
                aria-hidden="true"
                className="absolute pointer-events-none"
                style={{
                    inset: "-10% -10% auto auto",
                    width: "60%",
                    aspectRatio: "1.4",
                    background: "radial-gradient(ellipse 50% 50% at 70% 30%, rgba(var(--brand-rgb), 0.08), transparent 70%)",
                }}
            />
            <div className="relative max-w-container mx-auto">
                <header className="text-center mb-14">
                    <div className="eyebrow inline-flex">How booking works</div>
                    <h2 className="font-display font-extrabold text-[clamp(36px,5vw,60px)] leading-[1.02] tracking-[-0.022em] mt-3.5 text-balance">
                        Show us how much.<br />Pick a time.{" "}
                        <span className="relative inline-block text-brand">
                            We&apos;re there.
                            <span
                                aria-hidden="true"
                                className="absolute -inset-x-0.5 bottom-1 h-2 rounded-sm -z-10"
                                style={{ background: "rgba(var(--brand-rgb), 0.18)", transform: "skewX(-6deg)" }}
                            />
                        </span>
                    </h2>
                    <p className="text-[17px] leading-[1.55] text-muted mt-4 max-w-[56ch] mx-auto">
                        Watch the booking flow below. The same structure is used on the live booking page.
                    </p>
                </header>

                <BookingDemo config={config} />

                <ol className="mt-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {stepRows.map((row, i) => {
                        const isOn = active === i;
                        return (
                            <li
                                key={row.num}
                                aria-current={isOn ? "step" : undefined}
                                className={`relative flex flex-col gap-2 px-6 py-5 border rounded transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-brand ${
                                    isOn ? "bg-paper border-brand/35 shadow-brand" : "bg-paper-2 border-line"
                                }`}
                            >
                                <div
                                    className={`grid place-items-center w-8 h-8 rounded-full font-display font-bold text-[13px] leading-none border-[1.5px] transition-colors duration-300 ${
                                        isOn ? "bg-brand text-white border-brand" : "bg-paper text-ink border-line"
                                    }`}
                                >
                                    {row.num}
                                </div>
                                <div className="font-display font-bold text-[16px] leading-[1.2] tracking-[-0.01em]">{row.name}</div>
                                <div className="text-[13.5px] leading-[1.5] text-muted">{row.desc}</div>
                            </li>
                        );
                    })}
                </ol>

                <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {TRUST.map((t) => (
                        <div key={t.t} className="flex items-start gap-3 px-5 py-4 bg-paper-2 border border-line rounded">
                            <div className="grid place-items-center w-8 h-8 rounded-lg bg-green/10 border border-green/30 text-green shrink-0">
                                <Check className="w-4 h-4" strokeWidth={2.4} aria-hidden="true" />
                            </div>
                            <div>
                                <div className="font-display font-bold text-[14.5px] leading-[1.15]">{t.t}</div>
                                <div className="text-[12.5px] leading-[1.4] text-muted mt-0.5">{t.d}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex gap-3.5 justify-center flex-wrap">
                    <Link href="/book" className="btn btn-primary px-7 py-4 text-[15px]">
                        Get Instant Quote <ArrowRight className="w-4 h-4" strokeWidth={2.4} aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
