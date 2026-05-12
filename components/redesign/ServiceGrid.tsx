import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ServiceIcon from "@/components/ServiceIcon";
import type { ServiceDetail } from "@/lib/serviceData";
import SectionShell from "./SectionShell";

type ServiceGridProps = {
    services: ServiceDetail[];
    city: string;
};

export default function ServiceGrid({ services, city }: ServiceGridProps) {
    if (services.length === 0) return null;

    return (
        <SectionShell
            tone="card"
            align="center"
            eyebrow="Services"
            title="What We Haul Away"
            subtitle={`Common junk removal services available in ${city}.`}
        >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {services.slice(0, 6).map((service) => (
                    <Link
                        key={service.slug}
                        href={`/services/${service.slug}`}
                        className="group flex min-h-[190px] flex-col rounded-card border border-border bg-background p-6 text-foreground no-underline transition hover:-translate-y-1 hover:border-brand hover:shadow-xl"
                    >
                        <div className="mb-5 grid h-12 w-12 place-items-center rounded-skin bg-brand/10 text-brand">
                            <ServiceIcon name={service.icon} size={26} color="var(--brand)" />
                        </div>
                        <h3 className="text-xl font-black">{service.title}</h3>
                        <p className="mt-3 flex-1 text-sm leading-6 text-muted">{service.shortDesc}</p>
                        <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-brand">
                            View service <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                        </span>
                    </Link>
                ))}
            </div>
            <div className="mt-8 text-center">
                <Link href="/services" className="btn-secondary">
                    View All Services
                </Link>
            </div>
        </SectionShell>
    );
}
