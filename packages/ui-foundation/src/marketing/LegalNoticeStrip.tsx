"use client";

import { useContent } from "../hooks/useContent.js";

export interface LegalNoticeStripProps {
  noticeId: string;
  effectiveDate?: string;
  approvalStatus?: "draft" | "pending" | "approved";
  className?: string;
}

export const LegalNoticeStrip = ({
  noticeId,
  effectiveDate,
  approvalStatus = "draft",
  className = ""
}: LegalNoticeStripProps) => {
  const notice = useContent(noticeId);
  const pending = approvalStatus !== "approved";
  return (
    <section
      className={`nh-legal-notice-strip ${className}`.trim()}
      data-approval-status={approvalStatus}
      aria-label={notice.title}
    >
      {pending ? (
        <p className="nh-legal-notice-strip__ribbon" role="status">
          DRAFT — PENDING APPROVAL
        </p>
      ) : null}
      <h2 className="nh-legal-notice-strip__heading">{notice.title}</h2>
      <p className="nh-legal-notice-strip__body">{notice.body}</p>
      {effectiveDate ? (
        <p className="nh-legal-notice-strip__effective">
          Effective date: {effectiveDate}
        </p>
      ) : null}
    </section>
  );
};
