"use client";

import "./faq-conversation.css";
import { motion, useReducedMotion } from "framer-motion/react";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useContent } from "@nelyohealth/ui-foundation";
import { faqItems, type FaqItemSpec } from "./faq-conversation-data";

const useOnceInView = (threshold = 0.12) => {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
};

interface FaqAccordionItemProps {
  spec: FaqItemSpec;
  index: number;
  isOpen: boolean;
  onToggle: (id: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => void;
  buttonRef: (node: HTMLButtonElement | null) => void;
}

const FaqAccordionItem = ({ spec, index, isOpen, onToggle, onKeyDown, buttonRef }: FaqAccordionItemProps) => {
  const question = useContent(spec.questionId);
  const answer = useContent(spec.answerId);
  const panelId = `nh-faq-panel-${spec.id}`;
  const buttonId = `nh-faq-button-${spec.id}`;

  return (
    <div className="nh-faq__item">
      <h3 className="nh-faq__item-heading">
        <button
          ref={buttonRef}
          type="button"
          id={buttonId}
          className="nh-faq__question"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => onToggle(spec.id)}
          onKeyDown={(event) => onKeyDown(event, index)}
        >
          <span>{question.title}</span>
          <ChevronDown
            size={20}
            strokeWidth={2}
            className={"nh-faq__chevron" + (isOpen ? " nh-faq__chevron--open" : "")}
            aria-hidden
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="nh-faq__answer"
        data-expanded={isOpen}
      >
        <div>
          <p>{answer.body}</p>
        </div>
      </div>
    </div>
  );
};

export const FaqConversationSection = () => {
  const eyebrow = useContent("marketing-home.faq-conversation.eyebrow");
  const headline = useContent("marketing-home.faq-conversation.headline");
  const body = useContent("marketing-home.faq-conversation.body");
  const panelHeadline = useContent("marketing-home.faq-conversation.panel.headline");
  const panelBody = useContent("marketing-home.faq-conversation.panel.body");
  const ctaPrimary = useContent("marketing-home.faq-conversation.panel.cta.primary");
  const ctaSecondary = useContent("marketing-home.faq-conversation.panel.cta.secondary");

  const reducedMotion = useReducedMotion() ?? false;
  const { ref, visible } = useOnceInView(0.1);
  const [openId, setOpenId] = useState<string | null>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleToggle = useCallback((id: string) => {
    setOpenId((current) => (current === id ? null : id));
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowDown") {
      nextIndex = (index + 1) % faqItems.length;
    } else if (event.key === "ArrowUp") {
      nextIndex = (index - 1 + faqItems.length) % faqItems.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = faqItems.length - 1;
    }
    if (nextIndex === null) return;
    event.preventDefault();
    buttonRefs.current[nextIndex]?.focus();
  }, []);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="nh-faq"
      aria-labelledby="nh-faq-heading"
    >
      <div className="nh-faq__inner">
        <header className="nh-faq__header">
          <motion.p
            className="nh-faq__eyebrow"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={
              reducedMotion ? { opacity: 1, y: 0 } : visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
            }
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {eyebrow.title}
          </motion.p>
          <motion.h2
            id="nh-faq-heading"
            className="nh-faq__headline"
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            animate={
              reducedMotion ? { opacity: 1, y: 0 } : visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }
            }
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          >
            {headline.title}
          </motion.h2>
          <motion.p
            className="nh-faq__body"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={
              reducedMotion ? { opacity: 1, y: 0 } : visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
            }
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
          >
            {body.body}
          </motion.p>
        </header>

        <div className="nh-faq__list">
          {faqItems.map((spec, index) => (
            <FaqAccordionItem
              key={spec.id}
              spec={spec}
              index={index}
              isOpen={openId === spec.id}
              onToggle={handleToggle}
              onKeyDown={handleKeyDown}
              buttonRef={(node) => {
                buttonRefs.current[index] = node;
              }}
            />
          ))}
        </div>

        <div className="nh-faq__panel">
          <h3 className="nh-faq__panel-headline">{panelHeadline.title}</h3>
          <p className="nh-faq__panel-body">{panelBody.body}</p>
          <div className="nh-faq__panel-actions">
            <a className="nh-faq__panel-primary" href="/contact">
              {ctaPrimary.title}
            </a>
            <a className="nh-faq__panel-secondary" href="/faq">
              {ctaSecondary.title}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
