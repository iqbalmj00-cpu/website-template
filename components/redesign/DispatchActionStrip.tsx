import Link from "next/link";
import { CalendarClock, ClipboardList, MapPinned, Scale3D } from "lucide-react";
import {
    hasConfiguredPricing,
    isSameDayEnabled,
    siteConfig,
    type SiteConfig,
} from "@/lib/siteConfig";

const baseActions = [
    {
        Icon: MapPinned,
        title: "Check the address",
        body: "Coverage starts with the pickup address, configured service area, and route availability.",
        href: "/locations",
    },
    {
        Icon: Scale3D,
        title: "Size up the load",
        body: "Volume, access, weight, and material type explain why the final quote can change.",
        href: "/pricing",
    },
    {
        Icon: ClipboardList,
        title: "Confirm what goes",
        body: "Item lists, photos, stairs, gates, and parking notes keep the booking path practical.",
        href: "/book",
    },
];

export default function DispatchActionStrip({ config = siteConfig }: { config?: SiteConfig } = {}) {
    const pricingConfigured = hasConfiguredPricing(config);
    const sameDay = isSameDayEnabled(config);
    const actions = baseActions.map((action) => {
        if (action.title === "Size up the load") {
            return {
                ...action,
                body: pricingConfigured
                    ? "Configured load tiers provide a planning range before the crew confirms the final quote."
                    : action.body,
            };
        }
        return action;
    });

    return (
        <section
            className="dispatch-action-strip bg-paper px-[clamp(20px,4vw,64px)] py-5 border-b border-line"
            aria-label="Quick booking decisions"
        >
            <div className="mx-auto grid grid-cols-1 gap-3 lg:grid-cols-4" style={{ maxWidth: 1480 }}>
                {actions.map(({ Icon, title, body, href }, index) => (
                    <Link
                        key={title}
                        href={href}
                        className="dispatch-action-item group min-h-[132px] rounded-[14px] border border-line bg-paper-2 p-5 text-ink transition-all duration-200 hover:-translate-y-1 hover:border-brand hover:bg-paper"
                    >
                        <div className="flex items-start gap-4">
                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[12px] bg-brand text-white">
                                <Icon className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <div>
                                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
                                    {String(index + 1).padStart(2, "0")}
                                </div>
                                <h2 className="mt-2 font-display text-[20px] font-bold leading-tight">{title}</h2>
                                <p className="mt-2 text-[13.5px] leading-[1.5] text-muted">{body}</p>
                            </div>
                        </div>
                    </Link>
                ))}
                <div className="dispatch-action-item min-h-[132px] rounded-[14px] border border-line bg-ink p-5 text-paper">
                    <div className="flex items-start gap-4">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[12px] bg-brand text-white">
                            <CalendarClock className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div>
                            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
                                Route status
                            </div>
                            <h2 className="mt-2 font-display text-[20px] font-bold leading-tight">
                                {sameDay ? "Same-day can show when enabled." : "Schedule windows stay capacity-based."}
                            </h2>
                            <p className="mt-2 text-[13.5px] leading-[1.5] text-paper/70">
                                The site only shows same-day language when launch data or pricing settings support it.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
