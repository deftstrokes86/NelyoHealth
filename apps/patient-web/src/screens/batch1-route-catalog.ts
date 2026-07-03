export type Batch1RouteDefinition = {
  id: string;
  title: string;
  purpose: string;
  category: "Public" | "Authentication";
  primaryAction: string;
  secondaryAction: string;
  sections: Array<{
    heading: string;
    body: string;
  }>;
};

export const batch1RouteCatalog = {
  "about": {
    id: "MED-PUB-002",
    title: "About NelyoHealth",
    purpose: "Mission, coordinated care model, and Nigerian healthcare context.",
    category: "Public",
    primaryAction: "Explore Care Journey",
    secondaryAction: "Review Trust and Safety",
    sections: [
      {
        heading: "Platform Mission",
        body: "Explain coordinated care access, safe escalation boundaries, and role-based operations across patient and partner journeys."
      },
      {
        heading: "Care Coordination Model",
        body: "Present intake, triage, consultation, fulfillment, and follow-up as one traceable care pathway."
      }
    ]
  },
  "for-employers": {
    id: "MED-PUB-003",
    title: "For Employers",
    purpose: "Corporate benefits, PMPM model, and utilization outcomes.",
    category: "Public",
    primaryAction: "Request Employer Demo",
    secondaryAction: "Review Privacy Boundaries",
    sections: [
      {
        heading: "Workforce Health Access",
        body: "Show how employer-facing tools support eligibility and aggregate reporting without exposing unauthorized clinical data."
      },
      {
        heading: "Operational Reporting",
        body: "Describe aggregate utilization and productivity reporting with strict consent and data-minimization controls."
      }
    ]
  },
  "for-hmos": {
    id: "MED-PUB-004",
    title: "For HMOs",
    purpose: "Member access, utilization reporting, and integration readiness.",
    category: "Public",
    primaryAction: "Request HMO Walkthrough",
    secondaryAction: "Review Integration Scope",
    sections: [
      {
        heading: "Member Access Model",
        body: "Present eligibility and support workflows with role-constrained visibility and auditable access behavior."
      },
      {
        heading: "Analytics and Controls",
        body: "Highlight aggregate metrics and operational dashboards without implying unrestricted clinical visibility."
      }
    ]
  },
  "for-diaspora": {
    id: "MED-PUB-005",
    title: "For Diaspora Families",
    purpose: "Hard-currency family support with consent-scoped care visibility.",
    category: "Public",
    primaryAction: "Start Family Support Setup",
    secondaryAction: "Read Consent Boundaries",
    sections: [
      {
        heading: "Family Support",
        body: "Clarify what sponsors can fund, monitor, and coordinate while preserving patient autonomy and consent boundaries."
      },
      {
        heading: "Care Confidence",
        body: "Show reliable updates for medications, labs, and follow-ups without exposing protected provider details pre-authorization."
      }
    ]
  },
  "for-doctors": {
    id: "MED-PUB-006",
    title: "For Doctors",
    purpose: "Provider recruitment, verification, and clinical workflow standards.",
    category: "Public",
    primaryAction: "Begin Provider Onboarding",
    secondaryAction: "Review Clinical Safety Model",
    sections: [
      {
        heading: "Professional Workflow",
        body: "Outline queue, consultation, notes, prescribing, and referral actions using audited and role-aware interfaces."
      },
      {
        heading: "Verification and Governance",
        body: "Emphasize credential verification, clinical safeguards, and documentation standards across care pathways."
      }
    ]
  },
  "for-care-partners": {
    id: "MED-PUB-007",
    title: "For Care Partners",
    purpose: "Professional care-support participation with permission-scoped tasks.",
    category: "Public",
    primaryAction: "Start Care Partner Verification",
    secondaryAction: "Review Allowed Task Scope",
    sections: [
      {
        heading: "Coordination Role",
        body: "Define non-clinical support responsibilities and escalation paths without blurring clinical authority boundaries."
      },
      {
        heading: "Operational Reliability",
        body: "Describe task handoff, adherence tracking, and reporting with auditable activity and clear accountability."
      }
    ]
  },
  "for-pharmacies": {
    id: "MED-PUB-008",
    title: "For Pharmacies",
    purpose: "Prescription fulfillment partnership and order lifecycle execution.",
    category: "Public",
    primaryAction: "Join Pharmacy Network",
    secondaryAction: "Review Disclosure Policy",
    sections: [
      {
        heading: "Fulfillment Workflow",
        body: "Show acceptance, preparation, dispatch, and settlement stages with deterministic status progression."
      },
      {
        heading: "Protected Disclosure",
        body: "Reinforce that protected provider details remain locked until exact-order authorization conditions are satisfied."
      }
    ]
  },
  "for-labs": {
    id: "MED-PUB-009",
    title: "For Labs",
    purpose: "Diagnostics partnership, scheduling, and secure result delivery.",
    category: "Public",
    primaryAction: "Join Lab Network",
    secondaryAction: "Review Result Governance",
    sections: [
      {
        heading: "Diagnostics Operations",
        body: "Cover order intake, scheduling, specimen handling, result upload, and delay/escalation handling."
      },
      {
        heading: "Safety and Privacy",
        body: "Require secure result handling, auditable visibility, and strict role/tenant boundaries for data access."
      }
    ]
  },
  "for-hospitals": {
    id: "MED-PUB-010",
    title: "For Hospitals and Specialists",
    purpose: "Referral collaboration and post-discharge coordination.",
    category: "Public",
    primaryAction: "Request Referral Partnership",
    secondaryAction: "View Specialist Network Model",
    sections: [
      {
        heading: "Referral Continuity",
        body: "Describe referral intake, specialist routing, and discharge follow-up as a coordinated continuum."
      },
      {
        heading: "Escalation Readiness",
        body: "Keep emergency and critical pathways visible and prioritized above commercial conversion messaging."
      }
    ]
  },
  "pricing": {
    id: "MED-PUB-011",
    title: "Pricing and Plans",
    purpose: "Plan options with transparent financial commitments and boundaries.",
    category: "Public",
    primaryAction: "Compare Plan Options",
    secondaryAction: "Contact Support",
    sections: [
      {
        heading: "Transparent Charges",
        body: "Show plan tiers and payment terms with explicit commitments, exclusions, and no hidden fee framing."
      },
      {
        heading: "Role-Aware Entitlements",
        body: "Clarify how sponsor, employer, and HMO coverage affects funding, not clinical-record access rights."
      }
    ]
  },
  "book-demo": {
    id: "MED-PUB-012",
    title: "Book Demo",
    purpose: "B2B lead capture and scheduling intent.",
    category: "Public",
    primaryAction: "Submit Demo Request",
    secondaryAction: "Review Preparation Checklist",
    sections: [
      {
        heading: "Qualified Intake",
        body: "Capture organization profile and implementation context with clear expectations for follow-up response."
      },
      {
        heading: "Evidence-Led Positioning",
        body: "Frame the product through governance, safety, and operational reliability rather than unverified marketing claims."
      }
    ]
  },
  "trust-safety": {
    id: "MED-PUB-013",
    title: "Trust and Safety",
    purpose: "Verification, privacy controls, and clinical escalation boundaries.",
    category: "Public",
    primaryAction: "Review Safety Controls",
    secondaryAction: "Read Privacy Overview",
    sections: [
      {
        heading: "Safety Controls",
        body: "Document verification, consent checks, role-based access, and deterministic escalation pathways."
      },
      {
        heading: "Boundary Communication",
        body: "State platform limits clearly, including emergency-care boundaries and non-diagnostic AI assistance constraints."
      }
    ]
  },
  "help": {
    id: "MED-PUB-014",
    title: "Help Center",
    purpose: "Public FAQ and support entry.",
    category: "Public",
    primaryAction: "Search Help Topics",
    secondaryAction: "Contact Support",
    sections: [
      {
        heading: "Support Navigation",
        body: "Provide fast paths for account, booking, payment, fulfillment, and escalation guidance."
      },
      {
        heading: "Issue Resolution",
        body: "Ensure users receive actionable next steps for common failures, delays, and role-specific constraints."
      }
    ]
  },
  "login": {
    id: "MED-AUTH-001",
    title: "Unified Login",
    purpose: "Single secure login with role-aware routing.",
    category: "Authentication",
    primaryAction: "Sign In",
    secondaryAction: "Recover Access",
    sections: [
      {
        heading: "Secure Access",
        body: "Support role-aware redirects, session hardening, and clear handling of unauthorized/forbidden outcomes."
      },
      {
        heading: "Operational Clarity",
        body: "Present concise error and recovery guidance without exposing sensitive account state or internals."
      }
    ]
  },
  "register": {
    id: "MED-AUTH-002",
    title: "Create Account",
    purpose: "Multi-role account creation entry.",
    category: "Authentication",
    primaryAction: "Create Account",
    secondaryAction: "Use Existing Account",
    sections: [
      {
        heading: "Account Setup",
        body: "Collect minimum viable account data first, then continue role-specific onboarding in controlled steps."
      },
      {
        heading: "Boundary Acknowledgment",
        body: "Make privacy, consent, and role limitations explicit during registration progression."
      }
    ]
  },
  "forgot-password": {
    id: "MED-AUTH-003",
    title: "Forgot Password",
    purpose: "Password reset initiation.",
    category: "Authentication",
    primaryAction: "Request Reset Link",
    secondaryAction: "Return to Login",
    sections: [
      {
        heading: "Safe Recovery",
        body: "Enable recovery without account enumeration, while preserving clear feedback for legitimate users."
      },
      {
        heading: "Delivery Reliability",
        body: "Provide deterministic states for pending, delayed, expired, and failed recovery delivery paths."
      }
    ]
  },
  "reset-password": {
    id: "MED-AUTH-004",
    title: "Reset Password",
    purpose: "Password reset completion.",
    category: "Authentication",
    primaryAction: "Set New Password",
    secondaryAction: "Cancel and Return",
    sections: [
      {
        heading: "Credential Reset",
        body: "Validate token freshness and enforce strong credential policy with explicit success/failure outcomes."
      },
      {
        heading: "Post-Reset Routing",
        body: "Redirect users safely to authenticated entry points without leaking prior session context."
      }
    ]
  },
  "account/mfa/setup": {
    id: "MED-AUTH-005",
    title: "MFA Setup",
    purpose: "Enroll additional authentication factors.",
    category: "Authentication",
    primaryAction: "Enroll Factor",
    secondaryAction: "Skip For Now",
    sections: [
      {
        heading: "Factor Enrollment",
        body: "Support authenticator, SMS, or email setup with deterministic verification and backup flow handling."
      },
      {
        heading: "Security Guidance",
        body: "Explain high-impact action protection and account-recovery implications in plain, concise language."
      }
    ]
  },
  "account/mfa/challenge": {
    id: "MED-AUTH-006",
    title: "MFA Challenge",
    purpose: "Step-up challenge for sensitive actions.",
    category: "Authentication",
    primaryAction: "Verify Challenge",
    secondaryAction: "Use Recovery Path",
    sections: [
      {
        heading: "Step-Up Verification",
        body: "Require additional proof for sensitive transitions with strict timeout and retry semantics."
      },
      {
        heading: "Failure Handling",
        body: "Provide clear lockout, retry, and support escalation messaging without disclosing sensitive internals."
      }
    ]
  },
  "onboarding/role": {
    id: "MED-AUTH-007",
    title: "Role Selection",
    purpose: "Select or request platform role.",
    category: "Authentication",
    primaryAction: "Select Role",
    secondaryAction: "Review Role Guide",
    sections: [
      {
        heading: "Role Contracts",
        body: "Define role authority clearly, including care coordination versus clinical authority boundaries."
      },
      {
        heading: "Progressive Onboarding",
        body: "Transition into role-specific onboarding only after explicit role confirmation and required acknowledgments."
      }
    ]
  },
  "account/consents": {
    id: "MED-AUTH-008",
    title: "Consent Center",
    purpose: "View, grant, revoke, and audit consents.",
    category: "Authentication",
    primaryAction: "Update Consent",
    secondaryAction: "View Audit Trail",
    sections: [
      {
        heading: "Consent Controls",
        body: "Enable explicit grant/revoke behavior with readable summaries and effective-date visibility."
      },
      {
        heading: "Audit Transparency",
        body: "Show consent history with actor, timestamp, and scope to support accountability and trust."
      }
    ]
  }
} as const satisfies Record<string, Batch1RouteDefinition>;

export type Batch1RouteKey = keyof typeof batch1RouteCatalog;
