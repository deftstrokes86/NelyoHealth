"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const primaryMenu = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/trust-safety", label: "Trust & Safety" },
  { href: "/help", label: "Help" }
];

const segmentMenu = [
  { href: "/for-diaspora", label: "Diaspora" },
  { href: "/for-employers", label: "Employers" },
  { href: "/for-hmos", label: "HMOs" },
  { href: "/for-doctors", label: "Doctors" },
  { href: "/for-care-partners", label: "Care Partners" }
];

const desktopMenu = [...primaryMenu, ...segmentMenu];

type SiteNavItem = {
  href: string;
  label: string;
};

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function HeaderBrand() {
  return (
    <Link href="/" className="nh-site-header__brand" aria-label="NelyoHealth home">
      NelyoHealth
    </Link>
  );
}

type HeaderNavListProps = {
  items: SiteNavItem[];
  pathname: string;
  className?: string;
  ariaLabel?: string;
  onNavigate?: () => void;
};

function HeaderNavList({ items, pathname, className, ariaLabel, onNavigate }: HeaderNavListProps) {
  return (
    <ul className={className ?? "nh-site-header__menu"} aria-label={ariaLabel}>
      {items.map((item) => {
        const isActive = isActivePath(pathname, item.href);

        return (
          <li key={item.href} className="nh-site-header__menu-item">
            <Link
              href={item.href}
              onClick={onNavigate}
              className={isActive ? "is-active" : undefined}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

type HeaderActionsProps = {
  onNavigate?: () => void;
};

function HeaderActions({ onNavigate }: HeaderActionsProps) {
  return (
    <div className="nh-site-header__actions">
      <Link
        href="/login"
        onClick={onNavigate}
        className="nh-site-header__action nh-site-header__action--secondary"
      >
        Sign In
      </Link>
      <Link
        href="/register"
        onClick={onNavigate}
        className="nh-site-header__action nh-site-header__action--primary"
      >
        Create Account
      </Link>
    </div>
  );
}

export function MarketingSiteHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="nh-site-header" role="banner">
      <div className="nh-site-header__inner">
        <HeaderBrand />

        <nav
          aria-label="Primary site navigation"
          className="nh-site-header__nav-wrap nh-site-header__nav-wrap--desktop"
        >
          <div className="nh-site-header__nav-pill" role="group" aria-label="Primary routes">
            <HeaderNavList
              items={desktopMenu}
              pathname={pathname}
              className="nh-site-header__menu nh-site-header__menu--desktop"
            />
          </div>
        </nav>

        <div className="nh-site-header__actions-wrap nh-site-header__actions-wrap--desktop">
          <HeaderActions />
        </div>

        <button
          type="button"
          className="nh-site-header__mobile-toggle"
          aria-expanded={isMobileMenuOpen}
          aria-controls="nh-site-header-mobile-panel"
          aria-label={isMobileMenuOpen ? "Close site navigation" : "Open site navigation"}
          onClick={() => setIsMobileMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" className={isMobileMenuOpen ? "is-open" : undefined}>
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      <div
        id="nh-site-header-mobile-panel"
        className={`nh-site-header__mobile-panel ${isMobileMenuOpen ? "is-open" : ""}`.trim()}
      >
        <nav aria-label="Mobile site navigation" className="nh-site-header__mobile-nav">
          <HeaderNavList items={primaryMenu} pathname={pathname} onNavigate={closeMobileMenu} />
          <HeaderNavList
            items={segmentMenu}
            pathname={pathname}
            ariaLabel="Mobile audience routes"
            onNavigate={closeMobileMenu}
          />
        </nav>
        <HeaderActions onNavigate={closeMobileMenu} />
      </div>
    </header>
  );
}
