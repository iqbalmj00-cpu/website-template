import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Breadcrumb = {
    label: string;
    href: string;
};

export default function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
    if (items.length === 0) return null;

    return (
        <nav aria-label="Breadcrumb" className="mx-auto max-w-6xl px-4 pt-6 text-sm text-gray-500">
            <ol className="flex flex-wrap items-center gap-1">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <li key={`${item.href}-${item.label}`} className="flex items-center gap-1">
                            {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400" aria-hidden="true" />}
                            {isLast ? (
                                <span className="font-medium text-gray-700" aria-current="page">
                                    {item.label}
                                </span>
                            ) : (
                                <Link href={item.href} className="transition hover:text-[var(--brand)]">
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
