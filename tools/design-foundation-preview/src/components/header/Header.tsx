export interface HeaderNavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface HeaderAuthAction {
  label: string;
  href: string;
  tone?: "plain" | "solid";
}

export interface HeaderProps {
  logoLabel: string;
  logoHref?: string;
  navItems: HeaderNavItem[];
  authActions: HeaderAuthAction[];
}

export const HeaderLogo = ({ label, href = "#" }: { label: string; href?: string }) => (
  <a className="site-header__logo" href={href} aria-label={label}>
    <span className="site-header__logo-mark" aria-hidden="true" />
    <span className="site-header__logo-text">{label}</span>
  </a>
);

export const HeaderNavPill = ({ items }: { items: HeaderNavItem[] }) => (
  <nav className="site-header__nav-pill" aria-label="Primary">
    {items.map((item) => (
      <a
        key={item.label}
        href={item.href}
        className={`site-header__nav-link ${item.active ? "site-header__nav-link--active" : ""}`.trim()}
        aria-current={item.active ? "page" : undefined}
      >
        {item.label}
      </a>
    ))}
  </nav>
);

export const HeaderAuth = ({ actions }: { actions: HeaderAuthAction[] }) => (
  <div className="site-header__auth" aria-label="Authentication">
    {actions.map((action) => (
      <a
        key={action.label}
        href={action.href}
        className={`site-header__auth-link ${action.tone === "solid" ? "site-header__auth-link--solid" : ""}`.trim()}
      >
        {action.label}
      </a>
    ))}
  </div>
);

export const SiteHeader = ({ logoLabel, logoHref = "#", navItems, authActions }: HeaderProps) => (
  <header className="site-header">
    <div className="site-header__inner">
      <HeaderLogo label={logoLabel} href={logoHref} />
      <HeaderNavPill items={navItems} />
      <HeaderAuth actions={authActions} />
    </div>
  </header>
);
