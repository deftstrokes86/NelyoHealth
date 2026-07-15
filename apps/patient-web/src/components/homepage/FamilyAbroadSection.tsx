"use client";

import "./family-abroad.css";
import { motion, useReducedMotion } from "framer-motion/react";
import {
  Bell,
  Check,
  CheckCircle,
  CircleUserRound,
  HeartPulse,
  Laptop,
  MapPin,
  Smartphone,
  UserRound
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useContent } from "@nelyohealth/ui-foundation";
import {
  familyAbroadCards,
  familyAbroadNotifications,
  familyAbroadProviders,
  familyAbroadStoryLineIds,
  familyAbroadTrustBadgeIds
} from "./family-abroad-data";
import type { FamilyAbroadCardSpec } from "./family-abroad-data";

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

// Illustration coordinate space: viewBox 0 0 1000 420.
const FAMILY_POINT = { x: 110, y: 210 };
const HUB_POINT = { x: 500, y: 210 };
const PARENT_POINT = { x: 830, y: 210 };
const PROVIDER_RADIUS = 150;

const providerPosition = (angleDegrees: number) => {
  const radians = (angleDegrees * Math.PI) / 180;
  return {
    x: PARENT_POINT.x + PROVIDER_RADIUS * Math.cos(radians),
    y: PARENT_POINT.y + PROVIDER_RADIUS * Math.sin(radians)
  };
};

const curvePath = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  bend: number
) => {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy) || 1;
  const nx = -dy / length;
  const ny = dx / length;
  const cx = mx + nx * bend;
  const cy = my + ny * bend;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
};

const familyToHubPath = curvePath(FAMILY_POINT.x, FAMILY_POINT.y, HUB_POINT.x, HUB_POINT.y, -36);
const hubToParentPath = curvePath(HUB_POINT.x, HUB_POINT.y, PARENT_POINT.x, PARENT_POINT.y, 36);

const providerConnectors = familyAbroadProviders.map((provider) => {
  const position = providerPosition(provider.angleDegrees);
  return {
    provider,
    position,
    path: curvePath(HUB_POINT.x, HUB_POINT.y, position.x, position.y, 24)
  };
});

const FamilyAbroadIllustration = () => {
  return (
    <div
      className="nh-family-abroad__illustration"
      role="img"
      aria-label="You, connected through NelyoHealth to Mum in Nigeria, with her doctor, hospital, laboratory, pharmacy, medical record, and caregiver all coordinated in one place"
    >
      <span className="nh-family-abroad__bg-circle nh-family-abroad__bg-circle--a" aria-hidden />
      <span className="nh-family-abroad__bg-circle nh-family-abroad__bg-circle--b" aria-hidden />

      <svg
        className="nh-family-abroad__connections"
        viewBox="0 0 1000 420"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        focusable="false"
      >
        <path d={familyToHubPath} className="nh-family-abroad__connection nh-family-abroad__connection--spine" />
        <path d={hubToParentPath} className="nh-family-abroad__connection nh-family-abroad__connection--spine" />
        {providerConnectors.map(({ provider, path }) => (
          <path key={provider.id} d={path} className="nh-family-abroad__connection" />
        ))}
      </svg>

      <div
        className="nh-family-abroad__dot nh-family-abroad__dot--spine-a"
        style={{ offsetPath: `path('${familyToHubPath}')` }}
      />
      <div
        className="nh-family-abroad__dot nh-family-abroad__dot--spine-b"
        style={{ offsetPath: `path('${hubToParentPath}')` }}
      />
      {providerConnectors.map(({ provider, path }, index) => (
        <div
          key={provider.id}
          className="nh-family-abroad__dot"
          style={{ offsetPath: `path('${path}')`, animationDelay: `${index * 0.4}s` }}
        />
      ))}

      {/* Left zone — the diaspora family member */}
      <div
        className="nh-family-abroad__zone nh-family-abroad__zone--you"
        style={{ left: `${(FAMILY_POINT.x / 1000) * 100}%`, top: `${(FAMILY_POINT.y / 420) * 100}%` }}
      >
        <span className="nh-family-abroad__badge">You</span>
        <span className="nh-family-abroad__avatar nh-family-abroad__avatar--you">
          <CircleUserRound size={40} strokeWidth={1.5} />
        </span>
        <span className="nh-family-abroad__location">
          <MapPin size={12} strokeWidth={2} /> London, UK
        </span>
        <div className="nh-family-abroad__icon-row" aria-hidden>
          <Laptop size={16} strokeWidth={1.7} />
          <Smartphone size={16} strokeWidth={1.7} />
          <Bell size={16} strokeWidth={1.7} />
        </div>
        <p className="nh-family-abroad__caption">Managing Mum's healthcare remotely.</p>
      </div>

      {/* Centre zone — the NelyoHealth hub */}
      <div
        className="nh-family-abroad__zone nh-family-abroad__zone--hub"
        style={{ left: `${(HUB_POINT.x / 1000) * 100}%`, top: `${(HUB_POINT.y / 420) * 100}%` }}
      >
        <span className="nh-family-abroad__hub-pulse" aria-hidden />
        <span className="nh-family-abroad__hub">
          <HeartPulse size={34} strokeWidth={1.6} />
        </span>
        <span className="nh-family-abroad__hub-label">NelyoHealth</span>
        <span className="nh-family-abroad__hub-tagline">Your trusted healthcare hub</span>
      </div>

      {/* Right zone — the parent in Nigeria and her care team */}
      <div
        className="nh-family-abroad__zone nh-family-abroad__zone--parent"
        style={{ left: `${(PARENT_POINT.x / 1000) * 100}%`, top: `${(PARENT_POINT.y / 420) * 100}%` }}
      >
        <span className="nh-family-abroad__badge">Mum</span>
        <span className="nh-family-abroad__avatar nh-family-abroad__avatar--parent">
          <UserRound size={40} strokeWidth={1.5} />
        </span>
        <span className="nh-family-abroad__location">
          <MapPin size={12} strokeWidth={2} /> Enugu, Nigeria
        </span>
      </div>

      {providerConnectors.map(({ provider, position }) => {
        const Icon = provider.icon;
        return (
          <div
            key={provider.id}
            className="nh-family-abroad__provider"
            style={{ left: `${(position.x / 1000) * 100}%`, top: `${(position.y / 420) * 100}%` }}
          >
            <span className="nh-family-abroad__provider-icon">
              <Icon size={18} strokeWidth={1.7} />
            </span>
            <span className="nh-family-abroad__provider-label">{provider.label}</span>
            <span className="nh-family-abroad__provider-status">
              <Check size={10} strokeWidth={2.6} /> {provider.status}
            </span>
          </div>
        );
      })}

      <div className="nh-family-abroad__notifications">
        {familyAbroadNotifications.map((notification) => (
          <div key={notification.id} className="nh-family-abroad__notification">
            <CheckCircle size={15} strokeWidth={1.8} className="nh-family-abroad__notification-icon" />
            <p className="nh-family-abroad__notification-text">{notification.text}</p>
            <span className="nh-family-abroad__notification-time">{notification.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const FamilyAbroadMobileStory = () => (
  <div className="nh-family-abroad__mobile-story">
    <div className="nh-family-abroad__mobile-node">
      <span className="nh-family-abroad__badge">You</span>
      <span className="nh-family-abroad__avatar nh-family-abroad__avatar--you">
        <CircleUserRound size={32} strokeWidth={1.5} />
      </span>
      <span className="nh-family-abroad__location">
        <MapPin size={12} strokeWidth={2} /> London, UK
      </span>
    </div>

    <span className="nh-family-abroad__mobile-connector" aria-hidden />

    <div className="nh-family-abroad__mobile-node">
      <span className="nh-family-abroad__hub" style={{ width: 64, height: 64 }}>
        <HeartPulse size={26} strokeWidth={1.6} />
      </span>
      <span className="nh-family-abroad__hub-label">NelyoHealth</span>
    </div>

    <span className="nh-family-abroad__mobile-connector" aria-hidden />

    <div className="nh-family-abroad__mobile-providers">
      {familyAbroadProviders.map((provider) => {
        const Icon = provider.icon;
        return (
          <div key={provider.id} className="nh-family-abroad__mobile-provider">
            <span className="nh-family-abroad__provider-icon">
              <Icon size={16} strokeWidth={1.7} />
            </span>
            <span className="nh-family-abroad__provider-label">{provider.label}</span>
          </div>
        );
      })}
    </div>

    <span className="nh-family-abroad__mobile-connector" aria-hidden />

    <div className="nh-family-abroad__mobile-node">
      <span className="nh-family-abroad__badge">Mum</span>
      <span className="nh-family-abroad__avatar nh-family-abroad__avatar--parent">
        <UserRound size={32} strokeWidth={1.5} />
      </span>
      <span className="nh-family-abroad__location">
        <MapPin size={12} strokeWidth={2} /> Enugu, Nigeria
      </span>
    </div>
  </div>
);

interface StoryLineProps {
  contentId: string;
  index: number;
  visible: boolean;
  reduced: boolean;
}

const StoryLine = ({ contentId, index, visible, reduced }: StoryLineProps) => {
  const content = useContent(contentId);
  const shouldAnimate = visible && !reduced;
  return (
    <motion.p
      className="nh-family-abroad__story-line"
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={
        reduced ? { opacity: 1, y: 0 } : shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }
      }
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.05 * index }}
    >
      {content.title}
    </motion.p>
  );
};

interface FeatureCardProps {
  spec: FamilyAbroadCardSpec;
  index: number;
  visible: boolean;
  reduced: boolean;
}

const FeatureCard = ({ spec, index, visible, reduced }: FeatureCardProps) => {
  const headline = useContent(spec.headlineId);
  const body = useContent(spec.bodyId);
  const Icon = spec.icon;
  const shouldAnimate = visible && !reduced;
  return (
    <motion.article
      className="nh-family-abroad__card"
      initial={reduced ? false : { opacity: 0, y: 18 }}
      animate={
        reduced ? { opacity: 1, y: 0 } : shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }
      }
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1], delay: 0.06 * index }}
    >
      <span className="nh-family-abroad__card-icon" aria-hidden>
        <Icon size={22} strokeWidth={1.7} />
      </span>
      <h3 className="nh-family-abroad__card-headline">{headline.title}</h3>
      <p className="nh-family-abroad__card-body">{body.body}</p>
    </motion.article>
  );
};

interface TrustBadgeProps {
  contentId: string;
}

const TrustBadge = ({ contentId }: TrustBadgeProps) => {
  const content = useContent(contentId);
  return (
    <div className="nh-family-abroad__trust-badge">
      <span className="nh-family-abroad__trust-badge-icon" aria-hidden>
        <Check size={14} strokeWidth={2.4} />
      </span>
      <p className="nh-family-abroad__trust-badge-text">{content.title}</p>
    </div>
  );
};

export const FamilyAbroadSection = () => {
  const eyebrow = useContent("marketing-home.family-abroad.eyebrow");
  const headline = useContent("marketing-home.family-abroad.headline");
  const body = useContent("marketing-home.family-abroad.body");
  const storyTitle = useContent("marketing-home.family-abroad.story.title");
  const trustHeadline = useContent("marketing-home.family-abroad.trust.headline");
  const trustBody = useContent("marketing-home.family-abroad.trust.body");
  const ctaPrimary = useContent("marketing-home.family-abroad.cta.primary");
  const ctaSecondary = useContent("marketing-home.family-abroad.cta.secondary");

  const reducedMotion = useReducedMotion() ?? false;
  const { ref, visible } = useOnceInView(0.12);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="nh-family-abroad"
      aria-labelledby="nh-family-abroad-heading"
    >
      <div className="nh-family-abroad__inner">
        <header className="nh-family-abroad__header">
          <motion.p
            className="nh-family-abroad__eyebrow"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={
              reducedMotion ? { opacity: 1, y: 0 } : visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
            }
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {eyebrow.title}
          </motion.p>
          <motion.h2
            id="nh-family-abroad-heading"
            className="nh-family-abroad__headline"
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            animate={
              reducedMotion ? { opacity: 1, y: 0 } : visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }
            }
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          >
            {headline.title}
          </motion.h2>
          <motion.p
            className="nh-family-abroad__body"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={
              reducedMotion ? { opacity: 1, y: 0 } : visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
            }
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
          >
            {body.body}
          </motion.p>
        </header>

        <motion.div
          className="nh-family-abroad__visual"
          initial={reducedMotion ? false : { opacity: 0, scale: 0.97 }}
          animate={
            reducedMotion
              ? { opacity: 1, scale: 1 }
              : visible
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.97 }
          }
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <FamilyAbroadIllustration />
        </motion.div>

        <FamilyAbroadMobileStory />

        <div className="nh-family-abroad__content">
          <div className="nh-family-abroad__story" aria-labelledby="nh-family-abroad-story-heading">
            <h3 id="nh-family-abroad-story-heading" className="nh-family-abroad__story-title">
              {storyTitle.title}
            </h3>
            {familyAbroadStoryLineIds.map((contentId, index) => (
              <StoryLine
                key={contentId}
                contentId={contentId}
                index={index}
                visible={visible}
                reduced={reducedMotion}
              />
            ))}
          </div>

          <div className="nh-family-abroad__cards" role="list">
            {familyAbroadCards.map((spec, index) => (
              <div key={spec.id} role="listitem">
                <FeatureCard spec={spec} index={index} visible={visible} reduced={reducedMotion} />
              </div>
            ))}
          </div>

          <div className="nh-family-abroad__trust">
            <h3 className="nh-family-abroad__trust-headline">{trustHeadline.title}</h3>
            <p className="nh-family-abroad__trust-body">{trustBody.body}</p>
            <div className="nh-family-abroad__trust-badges">
              {familyAbroadTrustBadgeIds.map((contentId) => (
                <TrustBadge key={contentId} contentId={contentId} />
              ))}
            </div>
          </div>

          <div className="nh-family-abroad__cta">
            <a className="nh-family-abroad__cta-primary" href="/create-account">
              {ctaPrimary.title}
            </a>
            <a className="nh-family-abroad__cta-secondary" href="/diaspora">
              {ctaSecondary.title}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
