import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { formatPhone, isSameDayEnabled, siteConfig, telHref } from "@/lib/siteConfig";

export default function FinalCTA() {
    return (
        <section className="bg-[var(--hero-bg)] px-5 py-16 text-center text-[var(--hero-text)] sm:px-8 lg:px-12 lg:py-24">
            <div className="mx-auto max-w-3xl">
                <h2 className="text-4xl font-black leading-tight sm:text-5xl">Ready to reclaim your space?</h2>
                <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[var(--hero-muted)] sm:text-lg">
                    Book your pickup online in minutes. {isSameDayEnabled()
                        ? `Same-day windows may be available in ${siteConfig.city} when schedule capacity allows.`
                        : "Pickup windows depend on route availability."}
                </p>
                <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                    <Link href="/book" className="btn-primary min-h-[52px] px-7 py-4">
                        Book My Pickup <ArrowRight className="h-5 w-5" aria-hidden="true" />
                    </Link>
                    <a
                        href={telHref(siteConfig.phoneNumber)}
                        className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-button border border-[var(--hero-border)] px-7 py-4 font-black text-[var(--hero-text)] no-underline transition hover:bg-white/10"
                    >
                        <Phone className="h-5 w-5" aria-hidden="true" />
                        {formatPhone(siteConfig.phoneNumber)}
                    </a>
                </div>
            </div>
        </section>
    );
}
