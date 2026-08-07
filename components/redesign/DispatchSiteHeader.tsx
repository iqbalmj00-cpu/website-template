"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { buildLocationNavItems, buildServiceNavItems, type NavItem } from "@/lib/navItems";
import { formatPhone, hasVerifiedGoogleReviews, siteConfig, telHref, type SiteConfig } from "@/lib/siteConfig";
import { shouldRenderContactPage } from "@/lib/visibility";

type HeaderNavItem = {
    href: string;
    label: string;
    dropdown?: "services" | "locations";
};

function active(pathname: string | null, href: string): boolean {
    if (!pathname) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
}

function navItems(config: SiteConfig, showReviews: boolean): HeaderNavItem[] {
    return [
        { href: "/", label: "Home" },
        { href: "/services", label: "Services", dropdown: "services" },
        { href: "/locations", label: "Locations", dropdown: "locations" },
        { href: "/pricing", label: "Pricing" },
        ...(config.offersDumpsterRental ? [{ href: "/dumpster-rental", label: "Dumpster Rental" }] : []),
        { href: "/how-it-works", label: "How it works" },
        { href: "/about", label: "About" },
        ...(shouldRenderContactPage(config) ? [{ href: "/contact", label: "Contact" }] : []),
        ...(showReviews ? [{ href: "/reviews", label: "Reviews" }] : []),
    ];
}

function DropdownLink({
    item,
    pathname,
    entries,
}: {
    item: HeaderNavItem;
    pathname: string | null;
    entries: NavItem[];
}) {
    const isActive = active(pathname, item.href);
    return (
        <div className="nav-dropdown">
            <Link
                className="nav-dropdown-button"
                href={item.href}
                aria-current={isActive ? "page" : undefined}
            >
                {item.label}
                <ChevronDown size={14} aria-hidden="true" />
            </Link>
            <div className="nav-dropdown-menu" role="menu">
                <Link href={item.href} role="menuitem">
                    All {item.label}
                </Link>
                {entries.map((entry) => (
                    <Link href={entry.href} key={`${item.href}-${entry.href}`} role="menuitem">
                        {entry.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default function DispatchSiteHeader({ config = siteConfig, showReviews }: { config?: SiteConfig; showReviews?: boolean } = {}) {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const phone = config.phoneNumber ? formatPhone(config.phoneNumber) : "";
    const reviewsVisible = showReviews ?? hasVerifiedGoogleReviews(config);
    const serviceItems = buildServiceNavItems(config, 30);
    const locationItems = buildLocationNavItems(config, 30);
    const items = navItems(config, reviewsVisible);

    return (
        <header className="site-header">
            <Link className="brand-lockup" href="/" aria-label={`${config.companyName} home`} onClick={() => setMenuOpen(false)}>
                <span className="brand-word">
                    <strong>{config.companyName}</strong>
                    <span>Hauling and cleanouts</span>
                </span>
            </Link>
            <nav className="nav-links" aria-label="Primary">
                {items.map((item) => {
                    const entries = item.dropdown === "services" ? serviceItems : item.dropdown === "locations" ? locationItems : [];
                    if (item.dropdown && entries.length > 0) {
                        return <DropdownLink key={item.href} item={item} pathname={pathname} entries={entries} />;
                    }
                    return (
                        <Link key={item.href} href={item.href} aria-current={active(pathname, item.href) ? "page" : undefined}>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
            <div className="nav-ctas">
                {phone && <a className="phone-link" href={telHref(config.phoneNumber)}>{phone}</a>}
                <Link className="btn brand" href="/book">Book Now</Link>
                <button
                    className="mobile-menu-toggle"
                    type="button"
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                    aria-controls="dispatch-mobile-nav"
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
                </button>
            </div>
            {menuOpen && (
                <div className="mobile-nav-panel" id="dispatch-mobile-nav">
                    <nav aria-label="Mobile primary">
                        {items.map((item) => {
                            const entries = item.dropdown === "services" ? serviceItems : item.dropdown === "locations" ? locationItems : [];
                            return (
                                <div className="mobile-nav-section" key={item.href}>
                                    <Link
                                        href={item.href}
                                        aria-current={active(pathname, item.href) ? "page" : undefined}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                    {entries.length > 0 && (
                                        <div>
                                            {entries.map((entry) => (
                                                <Link href={entry.href} key={`${item.href}-${entry.href}`} onClick={() => setMenuOpen(false)}>
                                                    {entry.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                    <div className="mobile-nav-actions">
                        <Link className="btn brand" href="/book" onClick={() => setMenuOpen(false)}>Book Now</Link>
                        <Link className="btn light" href="/customer-portal" prefetch={false} onClick={() => setMenuOpen(false)}>Manage Booking</Link>
                        {phone && <a className="btn light" href={telHref(config.phoneNumber)} onClick={() => setMenuOpen(false)}>Call Us</a>}
                    </div>
                </div>
            )}
        </header>
    );
}
