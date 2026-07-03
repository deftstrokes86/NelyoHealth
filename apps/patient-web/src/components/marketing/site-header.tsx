import Link from "next/link";

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

export function MarketingSiteHeader() {
  return (
    <header className="nh-site-header" role="banner">
      <div className="nh-site-header__inner">
        <Link href="/" className="nh-site-header__brand" aria-label="NelyoHealth home">
          NelyoHealth
        </Link>

        <nav aria-label="Primary site navigation" className="nh-site-header__nav-wrap">
          <ul className="nh-site-header__menu">
            {primaryMenu.map((item) => (
              <li key={item.href} className="nh-site-header__menu-item">
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>

          <ul className="nh-site-header__menu nh-site-header__menu--segments" aria-label="Audience routes">
            {segmentMenu.map((item) => (
              <li key={item.href} className="nh-site-header__menu-item">
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nh-site-header__actions">
          <Link href="/login" className="nh-site-header__action nh-site-header__action--secondary">
            Sign In
          </Link>
          <Link href="/register" className="nh-site-header__action nh-site-header__action--primary">
            Create Account
          </Link>
        </div>
      </div>
    </header>
  );
}
