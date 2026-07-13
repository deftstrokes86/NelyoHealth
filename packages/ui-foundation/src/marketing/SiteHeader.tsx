import { useCallback, useEffect, useState } from "react";
import { Drawer } from "../primitives/Drawer.js";
import { useContent } from "../hooks/useContent.js";
import { ThemeToggle } from "./ThemeToggle.js";

export interface SiteHeaderNavItem {
  id: string;
  href: string;
  segment?: "patient" | "provider" | "organization" | "general";
}

export interface SiteHeaderProps {
  brandId: string;
  brandHref?: string;
  navItems: SiteHeaderNavItem[];
  primaryCtaLabelId: string;
  primaryCtaHref: string;
  secondaryCtaLabelId?: string;
  secondaryCtaHref?: string;
  activeSegment?: "patient" | "provider" | "organization" | "general";
  className?: string;
}

export const SiteHeader = ({
  brandId,
  brandHref = "/",
  navItems,
  primaryCtaLabelId,
  primaryCtaHref,
  secondaryCtaLabelId,
  secondaryCtaHref,
  activeSegment = "general",
  className = ""
}: SiteHeaderProps) => {
  const brand = useContent(brandId);
  const primaryCta = useContent(primaryCtaLabelId);
  const secondaryCta = secondaryCtaLabelId ? useContent(secondaryCtaLabelId) : null;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      if (window.innerWidth >= 900) setDrawerOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      className={`nh-site-header ${className}`.trim()}
      data-active-segment={activeSegment}
    >
      <div className="nh-site-header__inner">
        <a href={brandHref} className="nh-site-header__brand">
          <strong>{brand.title}</strong>
        </a>
        <nav className="nh-site-header__nav" aria-label={brand.title}>
          <ul className="nh-site-header__nav-list">
            {navItems.map((item) => (
              <SiteHeaderNavEntry
                key={item.id}
                item={item}
                activeSegment={activeSegment}
              />
            ))}
          </ul>
        </nav>
        <div className="nh-site-header__trailing">
          <div className="nh-site-header__theme-toggle">
            <ThemeToggle />
          </div>
          {secondaryCta && secondaryCtaHref ? (
            <a
              href={secondaryCtaHref}
              className="nh-site-header__cta nh-site-header__cta--secondary"
            >
              {secondaryCta.title}
            </a>
          ) : null}
          <a
            href={primaryCtaHref}
            className="nh-site-header__cta nh-site-header__cta--primary"
          >
            {primaryCta.title}
          </a>
          <button
            type="button"
            className="nh-site-header__menu-toggle"
            aria-expanded={drawerOpen}
            aria-controls="nh-site-header-drawer"
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            onClick={() => setDrawerOpen((open) => !open)}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        side="right"
        title={brand.title}
        className="nh-site-header__drawer"
      >
        <div id="nh-site-header-drawer" className="nh-site-header__drawer-inner">
          <div className="nh-site-header__drawer-header">
            <strong>{brand.title}</strong>
            <button
              type="button"
              className="nh-site-header__drawer-close"
              onClick={closeDrawer}
              aria-label="Close menu"
            >
              ×
            </button>
          </div>
          <ul className="nh-site-header__drawer-list">
            {navItems.map((item) => (
              <SiteHeaderDrawerEntry
                key={item.id}
                item={item}
                onNavigate={closeDrawer}
              />
            ))}
          </ul>
          <div className="nh-site-header__drawer-footer">
            <ThemeToggle />
            {secondaryCta && secondaryCtaHref ? (
              <a
                href={secondaryCtaHref}
                className="nh-site-header__cta nh-site-header__cta--secondary"
                onClick={closeDrawer}
              >
                {secondaryCta.title}
              </a>
            ) : null}
            <a
              href={primaryCtaHref}
              className="nh-site-header__cta nh-site-header__cta--primary"
              onClick={closeDrawer}
            >
              {primaryCta.title}
            </a>
          </div>
        </div>
      </Drawer>
    </header>
  );
};

const SiteHeaderNavEntry = ({
  item,
  activeSegment
}: {
  item: SiteHeaderNavItem;
  activeSegment: NonNullable<SiteHeaderProps["activeSegment"]>;
}) => {
  const entry = useContent(item.id);
  const active =
    item.segment !== undefined && item.segment === activeSegment;
  return (
    <li>
      <a
        href={item.href}
        className={
          "nh-site-header__nav-link" +
          (active ? " nh-site-header__nav-link--active" : "")
        }
        aria-current={active ? "page" : undefined}
      >
        {entry.title}
      </a>
    </li>
  );
};

const SiteHeaderDrawerEntry = ({
  item,
  onNavigate
}: {
  item: SiteHeaderNavItem;
  onNavigate: () => void;
}) => {
  const entry = useContent(item.id);
  return (
    <li>
      <a
        href={item.href}
        className="nh-site-header__drawer-link"
        onClick={onNavigate}
      >
        {entry.title}
      </a>
    </li>
  );
};
