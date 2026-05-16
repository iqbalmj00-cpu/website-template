"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { formatPhone, hasVerifiedGoogleReviews, siteConfig, telHref, type SiteConfig } from "@/lib/siteConfig";

const NAV = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/locations", label: "Locations" },
    { href: "/pricing", label: "Pricing" },
    { href: "/how-it-works", label: "How it works" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/reviews", label: "Reviews" },
] as const;

function initial(name: string): string {
    const clean = name.trim();
    return clean ? clean.charAt(0).toUpperCase() : "J";
}

function active(pathname: string | null, href: string): boolean {
    if (!pathname) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
}

export default function DispatchSiteHeader({ config = siteConfig, showReviews }: { config?: SiteConfig; showReviews?: boolean } = {}) {
    const pathname = usePathname();
    const phone = config.phoneNumber ? formatPhone(config.phoneNumber) : "";
    const navItems = NAV.filter((item) => item.href !== "/reviews" || (showReviews ?? hasVerifiedGoogleReviews(config)));

    return (
        <header className="site-header">
            <Link className="brand-lockup" href="/" aria-label={`${config.companyName} home`}>
                <span className="brand-mark">{initial(config.companyName)}</span>
                <span className="brand-word">
                    <strong>{config.companyName}</strong>
                    <span>Hauling and cleanouts</span>
                </span>
            </Link>
            <nav className="nav-links" aria-label="Primary">
                {navItems.map((item) => {
                    return (
                        <Link key={item.href} href={item.href} aria-current={active(pathname, item.href) ? "page" : undefined}>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
            <div className="nav-ctas">
                {phone && <a className="phone-link" href={telHref(config.phoneNumber)}>{phone}</a>}
                <Link className="btn light" href="/customer-portal" prefetch={false}>Portal</Link>
                <Link className="btn brand" href="/book">Book now</Link>
            </div>
        </header>
    );
}
