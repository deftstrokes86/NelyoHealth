"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ChevronDown, ChevronRight, Menu as MenuIcon, Search, X } from "lucide-react";
import { useContent } from "../hooks/useContent.js";
import { useDismissable } from "../hooks/useDismissable.js";
import { useFocusTrap } from "../hooks/useFocusTrap.js";
import { ThemeToggle } from "./ThemeToggle.js";
import { CommandPalette } from "./CommandPalette.js";
import type { CommandPaletteItem } from "./CommandPalette.js";

export interface SiteHeaderMenuItem {
  id: string;
  bodyId: string;
  icon: ReactNode;
  /** Destination. Omit for `comingSoon` cards, which render as non-navigable. */
  href?: string;
  /** Per-item CTA label override (falls back to the menu's `itemCtaLabelId`). */
  ctaLabelId?: string;
  /** Renders a "Coming Soon" badge and a non-navigable card. */
  comingSoon?: boolean;
}

export interface SiteHeaderMenuGroup {
  headingId: string;
  items: SiteHeaderMenuItem[];
}

export interface SiteHeaderMenuBanner {
  headlineId: string;
  bodyId: string;
  ctaLabelId: string;
  href: string;
}

export interface SiteHeaderMenuFeatured {
  headlineId: string;
  bodyId: string;
  ctaLabelId: string;
  href: string;
  icon: ReactNode;
}

export interface SiteHeaderMenu {
  triggerLabelId: string;
  /** Flat item list (Platform / Resources / Company). Ignored when `groups` is set. */
  items: SiteHeaderMenuItem[];
  itemCtaLabelId?: string;
  featured?: SiteHeaderMenuFeatured;
  columns?: 2 | 3 | 4;
  /** Grouped, column-per-audience layout (Who We Serve). Takes precedence over `items`. */
  groups?: SiteHeaderMenuGroup[];
  comingSoonLabelId?: string;
  banner?: SiteHeaderMenuBanner;
}

export interface SiteHeaderMobileGroupLabels {
  platformId: string;
  serveId: string;
  resourcesId: string;
  companyId: string;
}

export interface SiteHeaderSearchConfig {
  triggerLabelId: string;
  placeholderId: string;
  emptyId: string;
  dialogLabelId: string;
  pagesGroupLabelId: string;
  faqGroupLabelId: string;
  items: CommandPaletteItem[];
}

export interface SiteHeaderProps {
  brandId: string;
  brandHref?: string;
  platformMenu: SiteHeaderMenu;
  serveMenu: SiteHeaderMenu;
  resourcesMenu: SiteHeaderMenu;
  companyMenu: SiteHeaderMenu;
  mobileGroupLabels: SiteHeaderMobileGroupLabels;
  search: SiteHeaderSearchConfig;
  primaryCtaLabelId: string;
  primaryCtaHref: string;
  secondaryCtaLabelId: string;
  secondaryCtaHref: string;
  className?: string;
}

type MenuKey = "platform" | "serve" | "resources" | "company";

export const SiteHeader = ({
  brandId,
  brandHref = "/",
  platformMenu,
  serveMenu,
  resourcesMenu,
  companyMenu,
  mobileGroupLabels,
  search,
  primaryCtaLabelId,
  primaryCtaHref,
  secondaryCtaLabelId,
  secondaryCtaHref,
  className = ""
}: SiteHeaderProps) => {
  const brand = useContent(brandId);
  const searchTriggerLabel = useContent(search.triggerLabelId);
  const primaryCta = useContent(primaryCtaLabelId);
  const secondaryCta = useContent(secondaryCtaLabelId);

  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useDismissable({
    active: openMenu !== null,
    ref: navRef,
    onDismiss: () => setOpenMenu(null)
  });

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
  };

  const openWithHover = (key: MenuKey) => {
    clearCloseTimer();
    setOpenMenu(key);
  };

  const toggleMenu = (key: MenuKey) => {
    clearCloseTimer();
    setOpenMenu((current) => (current === key ? null : key));
  };

  return (
    <header
      className={`nh-site-header ${scrolled ? "nh-site-header--scrolled" : ""} ${className}`.trim()}
      data-scrolled={scrolled}
    >
      <div className="nh-site-header__inner" ref={navRef} onMouseLeave={scheduleClose}>
        <a href={brandHref} className="nh-site-header__brand">
          <strong>{brand.title}</strong>
        </a>

        <nav className="nh-site-header__nav" aria-label={brand.title}>
          <NavMenuTrigger
            menuKey="platform"
            menu={platformMenu}
            open={openMenu === "platform"}
            onHoverOpen={openWithHover}
            onToggle={toggleMenu}
          />
          <NavMenuTrigger
            menuKey="serve"
            menu={serveMenu}
            open={openMenu === "serve"}
            onHoverOpen={openWithHover}
            onToggle={toggleMenu}
          />
          <NavMenuTrigger
            menuKey="resources"
            menu={resourcesMenu}
            open={openMenu === "resources"}
            onHoverOpen={openWithHover}
            onToggle={toggleMenu}
          />
          <NavMenuTrigger
            menuKey="company"
            menu={companyMenu}
            open={openMenu === "company"}
            onHoverOpen={openWithHover}
            onToggle={toggleMenu}
          />
        </nav>

        <div className="nh-site-header__trailing">
          <button
            type="button"
            className="nh-site-header__search-trigger"
            onClick={() => {
              setOpenMenu(null);
              setSearchOpen(true);
            }}
            aria-label={searchTriggerLabel.title}
          >
            <Search size={16} strokeWidth={1.9} aria-hidden="true" />
            <span className="nh-site-header__search-trigger-label">
              {searchTriggerLabel.title}
            </span>
            <span className="nh-site-header__kbd" aria-hidden="true">
              &#8984;K
            </span>
          </button>
          <div className="nh-site-header__theme-toggle">
            <ThemeToggle />
          </div>
          <a
            href={secondaryCtaHref}
            className="nh-site-header__cta nh-site-header__cta--secondary"
          >
            {secondaryCta.title}
          </a>
          <a href={primaryCtaHref} className="nh-site-header__cta nh-site-header__cta--primary">
            {primaryCta.title}
          </a>
          <button
            type="button"
            className="nh-site-header__menu-toggle"
            aria-expanded={mobileOpen}
            aria-controls="nh-site-header-mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? (
              <X size={20} strokeWidth={1.9} aria-hidden="true" />
            ) : (
              <MenuIcon size={20} strokeWidth={1.9} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        brandTitle={brand.title}
        brandHref={brandHref}
        platformMenu={platformMenu}
        serveMenu={serveMenu}
        resourcesMenu={resourcesMenu}
        companyMenu={companyMenu}
        mobileGroupLabels={mobileGroupLabels}
        primaryCtaLabelId={primaryCtaLabelId}
        primaryCtaHref={primaryCtaHref}
        secondaryCtaLabelId={secondaryCtaLabelId}
        secondaryCtaHref={secondaryCtaHref}
      />

      <CommandPalette
        open={searchOpen}
        onOpenChange={setSearchOpen}
        items={search.items}
        placeholderId={search.placeholderId}
        emptyId={search.emptyId}
        dialogLabelId={search.dialogLabelId}
        pagesGroupLabelId={search.pagesGroupLabelId}
        faqGroupLabelId={search.faqGroupLabelId}
      />
    </header>
  );
};

const NavMenuTrigger = ({
  menuKey,
  menu,
  open,
  onHoverOpen,
  onToggle
}: {
  menuKey: MenuKey;
  menu: SiteHeaderMenu;
  open: boolean;
  onHoverOpen: (key: MenuKey) => void;
  onToggle: (key: MenuKey) => void;
}) => {
  const label = useContent(menu.triggerLabelId);
  const panelId = useId();
  const prefersReducedMotion = useReducedMotion();
  const columns = menu.columns ?? 2;

  return (
    <div className="nh-site-header__menu-item" onMouseEnter={() => onHoverOpen(menuKey)}>
      <button
        type="button"
        className="nh-site-header__nav-trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onToggle(menuKey)}
      >
        {label.title}
        <ChevronDown
          size={15}
          strokeWidth={2}
          className="nh-site-header__nav-trigger-chevron"
          aria-hidden="true"
        />
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            id={panelId}
            className={`nh-site-header__panel nh-site-header__panel--cols-${columns}${
              menu.groups ? " nh-site-header__panel--grouped" : ""
            }`}
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
            transition={{
              duration: prefersReducedMotion ? 0.08 : 0.18,
              ease: [0.2, 0.8, 0.2, 1]
            }}
          >
            {menu.groups ? (
              <>
                <div className="nh-site-header__panel-groups">
                  {menu.groups.map((group) => (
                    <NavMenuGroupView
                      key={group.headingId}
                      group={group}
                      defaultCtaLabelId={menu.itemCtaLabelId}
                      comingSoonLabelId={menu.comingSoonLabelId}
                    />
                  ))}
                </div>
                {menu.banner ? <NavMenuBannerView banner={menu.banner} /> : null}
              </>
            ) : (
              <>
                <ul className="nh-site-header__panel-list">
                  {menu.items.map((item) => (
                    <NavMenuItemView
                      key={item.id}
                      item={item}
                      ctaLabelId={menu.itemCtaLabelId}
                    />
                  ))}
                </ul>
                {menu.featured ? <NavMenuFeaturedView featured={menu.featured} /> : null}
              </>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

const NavMenuItemView = ({
  item,
  ctaLabelId
}: {
  item: SiteHeaderMenuItem;
  ctaLabelId?: string;
}) => {
  const entry = useContent(item.id);
  const body = useContent(item.bodyId);
  const cta = ctaLabelId ? useContent(ctaLabelId) : null;
  return (
    <li className="nh-site-header__panel-item">
      <a href={item.href} className="nh-site-header__panel-link">
        <span className="nh-site-header__panel-icon" aria-hidden="true">
          {item.icon}
        </span>
        <span className="nh-site-header__panel-text">
          <span className="nh-site-header__panel-headline">{entry.title}</span>
          <span className="nh-site-header__panel-body">{body.title}</span>
          {cta ? (
            <span className="nh-site-header__panel-cta">
              {cta.title}
              <ChevronRight size={14} strokeWidth={2} aria-hidden="true" />
            </span>
          ) : null}
        </span>
      </a>
    </li>
  );
};

const NavMenuGroupView = ({
  group,
  defaultCtaLabelId,
  comingSoonLabelId
}: {
  group: SiteHeaderMenuGroup;
  defaultCtaLabelId?: string;
  comingSoonLabelId?: string;
}) => {
  const heading = useContent(group.headingId);
  return (
    <div className="nh-site-header__serve-group">
      <p className="nh-site-header__serve-heading">{heading.title}</p>
      <ul className="nh-site-header__serve-list">
        {group.items.map((item) => (
          <NavMenuAudienceCard
            key={item.id}
            item={item}
            defaultCtaLabelId={defaultCtaLabelId}
            comingSoonLabelId={comingSoonLabelId}
          />
        ))}
      </ul>
    </div>
  );
};

const NavMenuAudienceCard = ({
  item,
  defaultCtaLabelId,
  comingSoonLabelId
}: {
  item: SiteHeaderMenuItem;
  defaultCtaLabelId?: string;
  comingSoonLabelId?: string;
}) => {
  const entry = useContent(item.id);
  const body = useContent(item.bodyId);
  const ctaLabelId = item.ctaLabelId ?? defaultCtaLabelId;
  const cta = ctaLabelId ? useContent(ctaLabelId) : null;
  const comingSoon = comingSoonLabelId ? useContent(comingSoonLabelId) : null;

  const inner = (
    <>
      <span className="nh-site-header__serve-card-head">
        <span className="nh-site-header__serve-card-icon" aria-hidden="true">
          {item.icon}
        </span>
        <span className="nh-site-header__serve-card-title">{entry.title}</span>
        {item.comingSoon && comingSoon ? (
          <span className="nh-site-header__serve-badge">{comingSoon.title}</span>
        ) : null}
      </span>
      <span className="nh-site-header__serve-card-body">{body.title}</span>
      {!item.comingSoon && cta ? (
        <span className="nh-site-header__serve-card-cta">
          {cta.title}
          <ChevronRight size={14} strokeWidth={2} aria-hidden="true" />
        </span>
      ) : null}
    </>
  );

  return (
    <li>
      {item.comingSoon || !item.href ? (
        <div
          className="nh-site-header__serve-card nh-site-header__serve-card--soon"
          aria-disabled="true"
        >
          {inner}
        </div>
      ) : (
        <a href={item.href} className="nh-site-header__serve-card">
          {inner}
        </a>
      )}
    </li>
  );
};

const NavMenuBannerView = ({ banner }: { banner: SiteHeaderMenuBanner }) => {
  const headline = useContent(banner.headlineId);
  const body = useContent(banner.bodyId);
  const cta = useContent(banner.ctaLabelId);
  return (
    <div className="nh-site-header__serve-banner">
      <div className="nh-site-header__serve-banner-copy">
        <p className="nh-site-header__serve-banner-headline">{headline.title}</p>
        <p className="nh-site-header__serve-banner-body">{body.title}</p>
      </div>
      <a href={banner.href} className="nh-site-header__serve-banner-cta">
        {cta.title}
        <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
      </a>
    </div>
  );
};

const NavMenuFeaturedView = ({ featured }: { featured: SiteHeaderMenuFeatured }) => {
  const headline = useContent(featured.headlineId);
  const body = useContent(featured.bodyId);
  const cta = useContent(featured.ctaLabelId);
  return (
    <a href={featured.href} className="nh-site-header__panel-featured">
      <span className="nh-site-header__panel-featured-icon" aria-hidden="true">
        {featured.icon}
      </span>
      <span className="nh-site-header__panel-featured-headline">{headline.title}</span>
      <span className="nh-site-header__panel-featured-body">{body.title}</span>
      <span className="nh-site-header__panel-featured-cta">
        {cta.title}
        <ChevronRight size={14} strokeWidth={2} aria-hidden="true" />
      </span>
    </a>
  );
};

const MobileNav = ({
  open,
  onClose,
  brandTitle,
  brandHref,
  platformMenu,
  serveMenu,
  resourcesMenu,
  companyMenu,
  mobileGroupLabels,
  primaryCtaLabelId,
  primaryCtaHref,
  secondaryCtaLabelId,
  secondaryCtaHref
}: {
  open: boolean;
  onClose: () => void;
  brandTitle: string;
  brandHref: string;
  platformMenu: SiteHeaderMenu;
  serveMenu: SiteHeaderMenu;
  resourcesMenu: SiteHeaderMenu;
  companyMenu: SiteHeaderMenu;
  mobileGroupLabels: SiteHeaderMobileGroupLabels;
  primaryCtaLabelId: string;
  primaryCtaHref: string;
  secondaryCtaLabelId: string;
  secondaryCtaHref: string;
}) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const primaryCta = useContent(primaryCtaLabelId);
  const secondaryCta = useContent(secondaryCtaLabelId);
  const prefersReducedMotion = useReducedMotion();

  useFocusTrap(panelRef, open);
  useDismissable({
    active: open,
    ref: panelRef,
    onDismiss: onClose,
    dismissOnOutsideClick: false
  });

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id="nh-site-header-mobile-nav"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={brandTitle}
          className="nh-site-header__mobile-nav"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -12 }}
          transition={{ duration: prefersReducedMotion ? 0.08 : 0.22 }}
        >
          <div className="nh-site-header__mobile-header">
            <a href={brandHref} className="nh-site-header__mobile-brand" onClick={onClose}>
              <strong>{brandTitle}</strong>
            </a>
            <button
              type="button"
              className="nh-site-header__mobile-close"
              onClick={onClose}
              aria-label="Close menu"
            >
              <X size={20} strokeWidth={1.9} aria-hidden="true" />
            </button>
          </div>
          <div className="nh-site-header__mobile-body">
            <MobileGroup
              labelId={mobileGroupLabels.platformId}
              menu={platformMenu}
              onNavigate={onClose}
              defaultExpanded
            />
            <MobileGroup
              labelId={mobileGroupLabels.serveId}
              menu={serveMenu}
              onNavigate={onClose}
            />
            <MobileGroup
              labelId={mobileGroupLabels.resourcesId}
              menu={resourcesMenu}
              onNavigate={onClose}
            />
            <MobileGroup
              labelId={mobileGroupLabels.companyId}
              menu={companyMenu}
              onNavigate={onClose}
            />
          </div>
          <div className="nh-site-header__mobile-footer">
            <a
              href={secondaryCtaHref}
              className="nh-site-header__cta nh-site-header__cta--secondary"
              onClick={onClose}
            >
              {secondaryCta.title}
            </a>
            <a
              href={primaryCtaHref}
              className="nh-site-header__cta nh-site-header__cta--primary"
              onClick={onClose}
            >
              {primaryCta.title}
            </a>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

const MobileGroup = ({
  labelId,
  menu,
  onNavigate,
  defaultExpanded = false
}: {
  labelId: string;
  menu: SiteHeaderMenu;
  onNavigate: () => void;
  defaultExpanded?: boolean;
}) => {
  const label = useContent(labelId);
  const [expanded, setExpanded] = useState(defaultExpanded);
  const panelId = useId();

  return (
    <div className="nh-site-header__mobile-group">
      <button
        type="button"
        className="nh-site-header__mobile-group-trigger"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((value) => !value)}
      >
        {label.title}
        <ChevronDown
          size={18}
          strokeWidth={2}
          className="nh-site-header__mobile-group-chevron"
          data-expanded={expanded}
          aria-hidden="true"
        />
      </button>
      <div
        id={panelId}
        className="nh-site-header__mobile-group-panel"
        data-expanded={expanded}
      >
        <div className="nh-site-header__mobile-group-inner">
          {menu.groups ? (
            menu.groups.map((group) => (
              <MobileSubGroup
                key={group.headingId}
                group={group}
                comingSoonLabelId={menu.comingSoonLabelId}
                onNavigate={onNavigate}
              />
            ))
          ) : (
            <ul className="nh-site-header__mobile-group-list">
              {menu.items.map((item) => (
                <MobileItemView
                  key={item.id}
                  item={item}
                  comingSoonLabelId={menu.comingSoonLabelId}
                  onNavigate={onNavigate}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const MobileSubGroup = ({
  group,
  comingSoonLabelId,
  onNavigate
}: {
  group: SiteHeaderMenuGroup;
  comingSoonLabelId?: string;
  onNavigate: () => void;
}) => {
  const heading = useContent(group.headingId);
  return (
    <div className="nh-site-header__mobile-subgroup">
      <p className="nh-site-header__mobile-subheading">{heading.title}</p>
      <ul className="nh-site-header__mobile-group-list">
        {group.items.map((item) => (
          <MobileItemView
            key={item.id}
            item={item}
            comingSoonLabelId={comingSoonLabelId}
            onNavigate={onNavigate}
          />
        ))}
      </ul>
    </div>
  );
};

const MobileItemView = ({
  item,
  comingSoonLabelId,
  onNavigate
}: {
  item: SiteHeaderMenuItem;
  comingSoonLabelId?: string;
  onNavigate: () => void;
}) => {
  const entry = useContent(item.id);
  const comingSoon = comingSoonLabelId ? useContent(comingSoonLabelId) : null;
  const label = (
    <>
      <span className="nh-site-header__mobile-link-icon" aria-hidden="true">
        {item.icon}
      </span>
      {entry.title}
      {item.comingSoon && comingSoon ? (
        <span className="nh-site-header__mobile-badge">{comingSoon.title}</span>
      ) : null}
    </>
  );
  return (
    <li>
      {item.comingSoon || !item.href ? (
        <span className="nh-site-header__mobile-link nh-site-header__mobile-link--soon">
          {label}
        </span>
      ) : (
        <a href={item.href} className="nh-site-header__mobile-link" onClick={onNavigate}>
          {label}
        </a>
      )}
    </li>
  );
};
