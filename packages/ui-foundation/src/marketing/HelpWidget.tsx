"use client";

import { useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, HeartHandshake, LifeBuoy, Search, X } from "lucide-react";
import { useContent } from "../hooks/useContent.js";
import { useDismissable } from "../hooks/useDismissable.js";
import { useFocusTrap } from "../hooks/useFocusTrap.js";

export interface HelpWidgetCard {
  id: string;
  bodyId: string;
  icon: ReactNode;
  href?: string;
  view?: "emergency";
}

export interface HelpWidgetSearchItem {
  id: string;
  href: string;
  title: string;
  body: string;
}

export interface HelpWidgetEmergency {
  backLabelId: string;
  headlineId: string;
  bodyId: string;
  findHospitalsLabelId: string;
  findHospitalsHref: string;
  callServicesLabelId: string;
  callServicesHref: string;
  followupId: string;
}

export interface HelpWidgetContactPhone {
  labelId: string;
  number: string;
}

export interface HelpWidgetContactWhatsapp {
  labelId: string;
  href: string;
}

export interface HelpWidgetContact {
  headingId: string;
  emailLabelId: string;
  email: string;
  hoursLabelId: string;
  hoursValueId: string;
  phone?: HelpWidgetContactPhone;
  whatsapp?: HelpWidgetContactWhatsapp;
}

export interface HelpWidgetProps {
  triggerLabelId: string;
  headerHeadlineId: string;
  headerBodyId: string;
  searchPlaceholderId: string;
  searchEmptyId: string;
  cards: HelpWidgetCard[];
  searchItems: HelpWidgetSearchItem[];
  emergency: HelpWidgetEmergency;
  contact: HelpWidgetContact;
  microcopyHeadlineId: string;
  microcopyBodyId: string;
  className?: string;
}

type HelpWidgetView = "menu" | "emergency";

export const HelpWidget = ({
  triggerLabelId,
  headerHeadlineId,
  headerBodyId,
  searchPlaceholderId,
  searchEmptyId,
  cards,
  searchItems,
  emergency,
  contact,
  microcopyHeadlineId,
  microcopyBodyId,
  className = ""
}: HelpWidgetProps) => {
  const triggerLabel = useContent(triggerLabelId);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<HelpWidgetView>("menu");
  const [query, setQuery] = useState("");
  const prefersReducedMotion = useReducedMotion();

  const panelId = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useFocusTrap(panelRef, open);
  useDismissable({
    active: open,
    ref: containerRef,
    onDismiss: () => {
      setOpen(false);
      setView("menu");
    }
  });

  const close = () => {
    setOpen(false);
    setView("menu");
  };

  return (
    <div ref={containerRef} className={`nh-help-widget ${className}`.trim()}>
      <button
        type="button"
        className="nh-help-widget__trigger"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={triggerLabel.title}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="nh-help-widget__trigger-pulse" aria-hidden="true" />
        <LifeBuoy size={26} strokeWidth={1.9} aria-hidden="true" />
        <span className="nh-help-widget__trigger-label" aria-hidden="true">
          {triggerLabel.title}
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={panelId}
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={triggerLabel.title}
            className="nh-help-widget__panel"
            initial={{
              opacity: 0,
              y: prefersReducedMotion ? 0 : 24,
              scale: prefersReducedMotion ? 1 : 0.97
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: prefersReducedMotion ? 0 : 12,
              scale: prefersReducedMotion ? 1 : 0.98
            }}
            transition={{
              duration: prefersReducedMotion ? 0.08 : 0.25,
              ease: [0.2, 0.8, 0.2, 1]
            }}
          >
            <button
              type="button"
              className="nh-help-widget__close"
              onClick={close}
              aria-label="Close help panel"
            >
              <X size={18} strokeWidth={1.9} aria-hidden="true" />
            </button>

            {view === "emergency" ? (
              <HelpWidgetEmergencyView
                emergency={emergency}
                onBack={() => setView("menu")}
              />
            ) : (
              <HelpWidgetMenu
                headerHeadlineId={headerHeadlineId}
                headerBodyId={headerBodyId}
                searchPlaceholderId={searchPlaceholderId}
                searchEmptyId={searchEmptyId}
                cards={cards}
                searchItems={searchItems}
                contact={contact}
                microcopyHeadlineId={microcopyHeadlineId}
                microcopyBodyId={microcopyBodyId}
                query={query}
                onQueryChange={setQuery}
                onSelectEmergency={() => setView("emergency")}
                prefersReducedMotion={!!prefersReducedMotion}
              />
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

const HelpWidgetMenu = ({
  headerHeadlineId,
  headerBodyId,
  searchPlaceholderId,
  searchEmptyId,
  cards,
  searchItems,
  contact,
  microcopyHeadlineId,
  microcopyBodyId,
  query,
  onQueryChange,
  onSelectEmergency,
  prefersReducedMotion
}: {
  headerHeadlineId: string;
  headerBodyId: string;
  searchPlaceholderId: string;
  searchEmptyId: string;
  cards: HelpWidgetCard[];
  searchItems: HelpWidgetSearchItem[];
  contact: HelpWidgetContact;
  microcopyHeadlineId: string;
  microcopyBodyId: string;
  query: string;
  onQueryChange: (value: string) => void;
  onSelectEmergency: () => void;
  prefersReducedMotion: boolean;
}) => {
  const headline = useContent(headerHeadlineId);
  const body = useContent(headerBodyId);
  const placeholder = useContent(searchPlaceholderId);
  const emptyMessage = useContent(searchEmptyId);
  const searchId = useId();
  const trimmedQuery = query.trim();

  return (
    <div className="nh-help-widget__menu">
      <div className="nh-help-widget__header">
        <span className="nh-help-widget__header-icon" aria-hidden="true">
          <HeartHandshake size={22} strokeWidth={1.8} />
        </span>
        <div>
          <h2 className="nh-help-widget__headline">{headline.title}</h2>
          <p className="nh-help-widget__header-body">{body.body}</p>
        </div>
      </div>

      <label className="nh-visually-hidden" htmlFor={searchId}>
        {placeholder.title}
      </label>
      <div className="nh-help-widget__search">
        <Search size={16} strokeWidth={1.9} aria-hidden="true" />
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={placeholder.title}
          className="nh-help-widget__search-input"
        />
      </div>

      {trimmedQuery ? (
        <HelpWidgetSearchResults
          items={searchItems}
          query={trimmedQuery}
          emptyMessage={emptyMessage.title}
        />
      ) : (
        <ul className="nh-help-widget__cards">
          {cards.map((card, index) => (
            <HelpWidgetCardView
              key={card.id}
              card={card}
              index={index}
              onSelectEmergency={onSelectEmergency}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </ul>
      )}

      <HelpWidgetContactView contact={contact} />

      <div className="nh-help-widget__microcopy">
        <HelpWidgetMicrocopy headlineId={microcopyHeadlineId} bodyId={microcopyBodyId} />
      </div>
    </div>
  );
};

const HelpWidgetCardView = ({
  card,
  index,
  onSelectEmergency,
  prefersReducedMotion
}: {
  card: HelpWidgetCard;
  index: number;
  onSelectEmergency: () => void;
  prefersReducedMotion: boolean;
}) => {
  const entry = useContent(card.id);
  const bodyEntry = useContent(card.bodyId);
  const cardContent = (
    <>
      <span className="nh-help-widget__card-icon" aria-hidden="true">
        {card.icon}
      </span>
      <span className="nh-help-widget__card-text">
        <span className="nh-help-widget__card-headline">{entry.title}</span>
        <span className="nh-help-widget__card-body">{bodyEntry.title}</span>
      </span>
      <ChevronRight
        size={18}
        strokeWidth={1.9}
        className="nh-help-widget__card-chevron"
        aria-hidden="true"
      />
    </>
  );

  return (
    <motion.li
      className="nh-help-widget__card-item"
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.22,
        delay: prefersReducedMotion ? 0 : index * 0.04
      }}
    >
      {card.view === "emergency" ? (
        <button
          type="button"
          className="nh-help-widget__card nh-help-widget__card--emergency"
          onClick={onSelectEmergency}
        >
          {cardContent}
        </button>
      ) : (
        <a href={card.href} className="nh-help-widget__card">
          {cardContent}
        </a>
      )}
    </motion.li>
  );
};

const HelpWidgetSearchResults = ({
  items,
  query,
  emptyMessage
}: {
  items: HelpWidgetSearchItem[];
  query: string;
  emptyMessage: string;
}) => {
  const needle = query.toLowerCase();
  const matches = items.filter(
    (item) =>
      item.title.toLowerCase().includes(needle) ||
      item.body.toLowerCase().includes(needle)
  );

  if (matches.length === 0) {
    return <p className="nh-help-widget__search-empty">{emptyMessage}</p>;
  }

  return (
    <ul className="nh-help-widget__results">
      {matches.map((item) => (
        <li key={item.id}>
          <a href={item.href} className="nh-help-widget__result">
            <span className="nh-help-widget__result-title">{item.title}</span>
            {item.body ? (
              <span className="nh-help-widget__result-body">{item.body}</span>
            ) : null}
          </a>
        </li>
      ))}
    </ul>
  );
};

const HelpWidgetContactView = ({ contact }: { contact: HelpWidgetContact }) => {
  const heading = useContent(contact.headingId);
  const emailLabel = useContent(contact.emailLabelId);
  const hoursLabel = useContent(contact.hoursLabelId);
  const hoursValue = useContent(contact.hoursValueId);
  const phoneLabel = contact.phone ? useContent(contact.phone.labelId) : null;
  const whatsappLabel = contact.whatsapp ? useContent(contact.whatsapp.labelId) : null;

  return (
    <div className="nh-help-widget__contact">
      <h3 className="nh-help-widget__contact-heading">{heading.title}</h3>
      <dl className="nh-help-widget__contact-list">
        <div className="nh-help-widget__contact-item">
          <dt>{emailLabel.title}</dt>
          <dd>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </dd>
        </div>
        {contact.phone && phoneLabel ? (
          <div className="nh-help-widget__contact-item">
            <dt>{phoneLabel.title}</dt>
            <dd>
              <a href={`tel:${contact.phone.number.replace(/[^+\d]/g, "")}`}>
                {contact.phone.number}
              </a>
            </dd>
          </div>
        ) : null}
        {contact.whatsapp && whatsappLabel ? (
          <div className="nh-help-widget__contact-item">
            <dt>{whatsappLabel.title}</dt>
            <dd>
              <a href={contact.whatsapp.href} target="_blank" rel="noreferrer noopener">
                {whatsappLabel.title}
              </a>
            </dd>
          </div>
        ) : null}
        <div className="nh-help-widget__contact-item">
          <dt>{hoursLabel.title}</dt>
          <dd>{hoursValue.title}</dd>
        </div>
      </dl>
    </div>
  );
};

const HelpWidgetMicrocopy = ({
  headlineId,
  bodyId
}: {
  headlineId: string;
  bodyId: string;
}) => {
  const headline = useContent(headlineId);
  const body = useContent(bodyId);
  return (
    <>
      <p className="nh-help-widget__microcopy-headline">{headline.title}</p>
      <p className="nh-help-widget__microcopy-body">{body.title}</p>
    </>
  );
};

const HelpWidgetEmergencyView = ({
  emergency,
  onBack
}: {
  emergency: HelpWidgetEmergency;
  onBack: () => void;
}) => {
  const backLabel = useContent(emergency.backLabelId);
  const headline = useContent(emergency.headlineId);
  const body = useContent(emergency.bodyId);
  const findHospitals = useContent(emergency.findHospitalsLabelId);
  const callServices = useContent(emergency.callServicesLabelId);
  const followup = useContent(emergency.followupId);

  return (
    <div className="nh-help-widget__emergency">
      <button type="button" className="nh-help-widget__back" onClick={onBack}>
        <ChevronLeft size={18} strokeWidth={1.9} aria-hidden="true" />
        {backLabel.title}
      </button>
      <h2 className="nh-help-widget__emergency-headline">{headline.title}</h2>
      <p className="nh-help-widget__emergency-body">
        <strong>{body.title}.</strong> {body.body}
      </p>
      <div className="nh-help-widget__emergency-actions">
        <a
          href={emergency.findHospitalsHref}
          className="nh-help-widget__emergency-action nh-help-widget__emergency-action--secondary"
        >
          {findHospitals.title}
        </a>
        <a
          href={emergency.callServicesHref}
          className="nh-help-widget__emergency-action nh-help-widget__emergency-action--primary"
        >
          {callServices.title}
        </a>
      </div>
      <p className="nh-help-widget__emergency-followup">{followup.title}</p>
    </div>
  );
};
