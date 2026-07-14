"use client";

import { useContent } from "../hooks/useContent.js";

export interface SiteFooterLink {
  id: string;
  href: string;
}

export interface SiteFooterGroup {
  id: string;
  links: SiteFooterLink[];
}

export interface SiteFooterProps {
  brandId: string;
  brandHref?: string;
  groups: SiteFooterGroup[];
  legalNoticeId?: string;
  className?: string;
}

export const SiteFooter = ({
  brandId,
  brandHref = "/",
  groups,
  legalNoticeId,
  className = ""
}: SiteFooterProps) => {
  const brand = useContent(brandId);
  const legal = legalNoticeId ? useContent(legalNoticeId) : null;
  return (
    <footer className={`nh-site-footer ${className}`.trim()}>
      <div className="nh-site-footer__inner">
        <div className="nh-site-footer__brand">
          <a href={brandHref} className="nh-site-footer__brand-link">
            <strong>{brand.title}</strong>
          </a>
          {brand.body ? (
            <p className="nh-site-footer__brand-body">{brand.body}</p>
          ) : null}
        </div>
        <nav className="nh-site-footer__nav" aria-label={brand.title}>
          <ul className="nh-site-footer__groups">
            {groups.map((group) => (
              <SiteFooterGroupView key={group.id} group={group} />
            ))}
          </ul>
        </nav>
      </div>
      {legal ? (
        <div className="nh-site-footer__legal">
          <p>{legal.body || legal.title}</p>
        </div>
      ) : null}
    </footer>
  );
};

const SiteFooterGroupView = ({ group }: { group: SiteFooterGroup }) => {
  const heading = useContent(group.id);
  return (
    <li className="nh-site-footer__group">
      <h3 className="nh-site-footer__group-title">{heading.title}</h3>
      <ul className="nh-site-footer__link-list">
        {group.links.map((link) => (
          <SiteFooterLinkView key={link.id} link={link} />
        ))}
      </ul>
    </li>
  );
};

const SiteFooterLinkView = ({ link }: { link: SiteFooterLink }) => {
  const entry = useContent(link.id);
  return (
    <li>
      <a href={link.href} className="nh-site-footer__link">
        {entry.title}
      </a>
    </li>
  );
};
