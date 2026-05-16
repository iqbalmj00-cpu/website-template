import { CalendarClock, Phone } from "lucide-react";
import { formatPhone, isSameDayEnabled, siteConfig, telHref } from "@/lib/siteConfig";

export default function SameDayStatusBanner() {
    const enabled = isSameDayEnabled();

    return (
        <section className="border-y border-border bg-card px-5 py-3">
            <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-foreground sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                    <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                    <p className="leading-6">
                        {enabled
                            ? `Same-day pickup may be available in ${siteConfig.city} when route capacity allows.`
                            : "Use the booking flow or call to find the next available pickup window."}
                    </p>
                </div>
                <a
                    href={telHref(siteConfig.phoneNumber)}
                    className="inline-flex items-center gap-2 font-bold text-brand underline-offset-4 hover:underline"
                >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {formatPhone(siteConfig.phoneNumber)}
                </a>
            </div>
        </section>
    );
}
