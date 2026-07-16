"use client";

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Facebook, Instagram, Linkedin, X, Youtube } from "lucide-react";
import { useContent } from "../hooks/useContent.js";

export interface SiteFooterLink {
  id: string;
  href: string;
  icon?: ReactNode;
}

export interface SiteFooterGroup {
  id: string;
  links: SiteFooterLink[];
}

export type SiteFooterSocialPlatform =
  | "linkedin"
  | "x"
  | "facebook"
  | "instagram"
  | "youtube";

export interface SiteFooterSocialLink {
  platform: SiteFooterSocialPlatform;
  href: string;
}

export interface SiteFooterSupportBar {
  eyebrowId: string;
  headlineId: string;
  links: SiteFooterLink[];
}

export interface SiteFooterNewsletter {
  eyebrowId: string;
  headlineId: string;
  bodyId: string;
  placeholderId: string;
  ctaLabelId: string;
  disclaimerId?: string;
  contactEmail: string;
}

export interface SiteFooterContact {
  headingId: string;
  email: { labelId: string; address: string };
  phone?: { labelId: string; number: string };
  office?: { labelId: string; valueId: string };
  support?: { labelId: string; valueId: string };
}

export interface SiteFooterBottom {
  copyrightId: string;
  taglineId: string;
  statusLabelId: string;
  statusHref: string;
}

export interface SiteFooterProps {
  brandId: string;
  brandDescriptionId: string;
  brandHref?: string;
  supportBar?: SiteFooterSupportBar;
  newsletter?: SiteFooterNewsletter;
  groups: SiteFooterGroup[];
  contact?: SiteFooterContact;
  socialLinks?: SiteFooterSocialLink[];
  bottom?: SiteFooterBottom;
  closingLineId?: string;
  legalNoticeId?: string;
  className?: string;
}

const socialIcon = (platform: SiteFooterSocialPlatform) => {
  switch (platform) {
    case "linkedin":
      return <Linkedin size={18} strokeWidth={1.9} aria-hidden />;
    case "x":
      return <X size={18} strokeWidth={1.9} aria-hidden />;
    case "facebook":
      return <Facebook size={18} strokeWidth={1.9} aria-hidden />;
    case "instagram":
      return <Instagram size={18} strokeWidth={1.9} aria-hidden />;
    case "youtube":
      return <Youtube size={18} strokeWidth={1.9} aria-hidden />;
  }
};

const socialLabel = (platform: SiteFooterSocialPlatform) => {
  switch (platform) {
    case "linkedin":
      return "LinkedIn";
    case "x":
      return "X (formerly Twitter)";
    case "facebook":
      return "Facebook";
    case "instagram":
      return "Instagram";
    case "youtube":
      return "YouTube";
  }
};

export const SiteFooter = ({
  brandId,
  brandDescriptionId,
  brandHref = "/",
  supportBar,
  newsletter,
  groups,
  contact,
  socialLinks,
  bottom,
  closingLineId,
  legalNoticeId,
  className = ""
}: SiteFooterProps) => {
  const brand = useContent(brandId);
  const brandDescription = useContent(brandDescriptionId);
  const legal = legalNoticeId ? useContent(legalNoticeId) : null;
  const closingLine = closingLineId ? useContent(closingLineId) : null;

  return (
    <footer className={`nh-site-footer ${className}`.trim()}>
      {supportBar ? <SiteFooterSupportBarView bar={supportBar} /> : null}
      {newsletter ? <SiteFooterNewsletterView newsletter={newsletter} /> : null}

      <div className="nh-site-footer__main">
        <div className="nh-site-footer__brand">
          <a href={brandHref} className="nh-site-footer__brand-link">
            <strong>{brand.title}</strong>
          </a>
          {brandDescription.body ? (
            <p className="nh-site-footer__brand-body">{brandDescription.body}</p>
          ) : null}

          {socialLinks && socialLinks.length > 0 ? (
            <ul className="nh-site-footer__social">
              {socialLinks.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.href}
                    className="nh-site-footer__social-link"
                    aria-label={socialLabel(social.platform)}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {socialIcon(social.platform)}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}

          {contact ? <SiteFooterContactView contact={contact} /> : null}
        </div>

        <nav className="nh-site-footer__nav" aria-label={brand.title}>
          <ul className="nh-site-footer__groups">
            {groups.map((group) => (
              <SiteFooterGroupView key={group.id} group={group} />
            ))}
          </ul>
        </nav>
      </div>

      <div className="nh-site-footer__bottom">
        {bottom ? <SiteFooterBottomView bottom={bottom} /> : null}
        {legal ? (
          <p className="nh-site-footer__legal">{legal.body || legal.title}</p>
        ) : null}
        {closingLine ? (
          <p className="nh-site-footer__closing">{closingLine.title}</p>
        ) : null}
      </div>
    </footer>
  );
};

const SiteFooterSupportBarView = ({ bar }: { bar: SiteFooterSupportBar }) => {
  const eyebrow = useContent(bar.eyebrowId);
  const headline = useContent(bar.headlineId);
  return (
    <div className="nh-site-footer__support">
      <div className="nh-site-footer__support-inner">
        <div className="nh-site-footer__support-copy">
          <p className="nh-site-footer__support-eyebrow">{eyebrow.title}</p>
          <p className="nh-site-footer__support-headline">{headline.title}</p>
        </div>
        <ul className="nh-site-footer__support-links">
          {bar.links.map((link) => (
            <SiteFooterSupportLinkView key={link.id} link={link} />
          ))}
        </ul>
      </div>
    </div>
  );
};

const SiteFooterSupportLinkView = ({ link }: { link: SiteFooterLink }) => {
  const entry = useContent(link.id);
  return (
    <li>
      <a href={link.href} className="nh-site-footer__support-link">
        {link.icon ? (
          <span className="nh-site-footer__support-link-icon" aria-hidden="true">
            {link.icon}
          </span>
        ) : null}
        {entry.title}
      </a>
    </li>
  );
};

const SiteFooterNewsletterView = ({
  newsletter
}: {
  newsletter: SiteFooterNewsletter;
}) => {
  const eyebrow = useContent(newsletter.eyebrowId);
  const headline = useContent(newsletter.headlineId);
  const body = useContent(newsletter.bodyId);
  const placeholder = useContent(newsletter.placeholderId);
  const cta = useContent(newsletter.ctaLabelId);
  const disclaimer = newsletter.disclaimerId ? useContent(newsletter.disclaimerId) : null;
  const [email, setEmail] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;
    const subject = encodeURIComponent("Newsletter signup");
    const messageBody = encodeURIComponent(
      `Please add ${email} to the NelyoHealth newsletter list.`
    );
    window.location.href = `mailto:${newsletter.contactEmail}?subject=${subject}&body=${messageBody}`;
  };

  return (
    <div className="nh-site-footer__newsletter">
      <div className="nh-site-footer__newsletter-inner">
        <div className="nh-site-footer__newsletter-copy">
          <p className="nh-site-footer__newsletter-eyebrow">{eyebrow.title}</p>
          <h2 className="nh-site-footer__newsletter-headline">{headline.title}</h2>
          <p className="nh-site-footer__newsletter-body">{body.body}</p>
        </div>
        <form className="nh-site-footer__newsletter-form" onSubmit={handleSubmit}>
          <label className="nh-visually-hidden" htmlFor="nh-footer-newsletter-email">
            {eyebrow.title}
          </label>
          <div className="nh-site-footer__newsletter-field">
            <input
              id="nh-footer-newsletter-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={placeholder.title}
              className="nh-site-footer__newsletter-input"
            />
            <button type="submit" className="nh-site-footer__newsletter-submit">
              {cta.title}
            </button>
          </div>
          {disclaimer ? (
            <p className="nh-site-footer__newsletter-disclaimer">{disclaimer.title}</p>
          ) : null}
        </form>
      </div>
    </div>
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

const SiteFooterContactView = ({ contact }: { contact: SiteFooterContact }) => {
  const heading = useContent(contact.headingId);
  const emailLabel = useContent(contact.email.labelId);
  const phoneLabel = contact.phone ? useContent(contact.phone.labelId) : null;
  const officeLabel = contact.office ? useContent(contact.office.labelId) : null;
  const officeValue = contact.office ? useContent(contact.office.valueId) : null;
  const supportLabel = contact.support ? useContent(contact.support.labelId) : null;
  const supportValue = contact.support ? useContent(contact.support.valueId) : null;

  return (
    <div className="nh-site-footer__contact">
      <h3 className="nh-site-footer__contact-heading">{heading.title}</h3>
      <dl className="nh-site-footer__contact-list">
        <div className="nh-site-footer__contact-item">
          <dt>{emailLabel.title}</dt>
          <dd>
            <a href={`mailto:${contact.email.address}`}>{contact.email.address}</a>
          </dd>
        </div>
        {contact.phone && phoneLabel ? (
          <div className="nh-site-footer__contact-item">
            <dt>{phoneLabel.title}</dt>
            <dd>
              <a href={`tel:${contact.phone.number.replace(/[^+\d]/g, "")}`}>
                {contact.phone.number}
              </a>
            </dd>
          </div>
        ) : null}
        {contact.office && officeLabel && officeValue ? (
          <div className="nh-site-footer__contact-item">
            <dt>{officeLabel.title}</dt>
            <dd>{officeValue.title}</dd>
          </div>
        ) : null}
        {contact.support && supportLabel && supportValue ? (
          <div className="nh-site-footer__contact-item">
            <dt>{supportLabel.title}</dt>
            <dd>{supportValue.title}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
};

const SiteFooterBottomView = ({ bottom }: { bottom: SiteFooterBottom }) => {
  const copyright = useContent(bottom.copyrightId);
  const tagline = useContent(bottom.taglineId);
  const statusLabel = useContent(bottom.statusLabelId);
  const year = new Date().getFullYear();

  return (
    <div className="nh-site-footer__bottom-row">
      <p className="nh-site-footer__copyright">
        © {year} {copyright.title}
      </p>
      <p className="nh-site-footer__tagline">{tagline.title}</p>
      <a href={bottom.statusHref} className="nh-site-footer__status">
        {statusLabel.title}
      </a>
    </div>
  );
};
