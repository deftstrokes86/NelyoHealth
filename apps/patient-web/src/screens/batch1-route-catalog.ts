export type Batch1RouteDefinition = {
  id: string;
  title: string;
  purpose: string;
  category: "Public" | "Authentication";
  primaryAction: string;
  secondaryAction: string;
  primaryActionHref?: string;
  secondaryActionHref?: string;
  sections: Array<{
    heading: string;
    body: string;
  }>;
  marketing?: {
    heroLabel: string;
    heroSummary: string;
    audienceProblem: string;
    painPoints: string[];
    workflowSteps: Array<{
      step: string;
      detail: string;
    }>;
    trustPoints: string[];
    featureProof: Array<{
      heading: string;
      detail: string;
    }>;
    faqs: Array<{
      question: string;
      answer: string;
    }>;
    finalCallout: string;
  };
};

export const batch1RouteCatalog = {
  home: {
    id: "MED-PUB-001",
    title: "Coordinated Healthcare Access for Families and Organizations",
    purpose: "Main story, segment CTAs, trust, and conversion pathways.",
    category: "Public",
    primaryAction: "Create Account",
    secondaryAction: "Sign In",
    primaryActionHref: "/register",
    secondaryActionHref: "/login",
    sections: [
      {
        heading: "Segment pathways",
        body: "Patients, families, employers, HMOs, doctors, and care partners get tailored entry points and role-appropriate journeys."
      },
      {
        heading: "Care journey",
        body: "Intake, triage, consultation, prescriptions or labs, and follow-up are presented as one continuous workflow."
      }
    ],
    marketing: {
      heroLabel: "Public website",
      heroSummary:
        "NelyoHealth connects care access across patients, families, sponsors, and provider partners without weakening privacy and consent boundaries.",
      audienceProblem:
        "Care breaks apart when booking, consultation, diagnostics, medication, and follow-up each live in a different place, leaving families and organizations to stitch the journey together.",
      painPoints: [
        "Long waiting times.",
        "Repeated paperwork.",
        "Fragmented records.",
        "Medication confusion.",
        "Poor follow-up.",
        "No family visibility.",
        "Employers disconnected.",
        "HMOs disconnected."
      ],
      workflowSteps: [
        {
          step: "Intake and triage",
          detail:
            "Users submit concerns, urgency indicators, and care context in structured pathways."
        },
        {
          step: "Consultation and clinical decisions",
          detail:
            "Verified clinicians handle diagnosis and treatment decisions with auditable workflows."
        },
        {
          step: "Fulfillment and follow-up",
          detail:
            "Prescription and lab workflows continue into adherence, result updates, and next-care actions."
        }
      ],
      trustPoints: [
        "Clinical decisions remain with verified clinicians.",
        "Consent and role boundaries are enforced in system behavior, not only in policy text.",
        "Emergency and safeguarding pathways stay visible above commercial conversion."
      ],
      featureProof: [
        {
          heading: "Family and diaspora coordination",
          detail: "Supporter views are funding and consent scoped, preserving patient autonomy."
        },
        {
          heading: "Employer and HMO readiness",
          detail:
            "Aggregate reporting and member activation are structured without default access to raw clinical records."
        },
        {
          heading: "Partner network workflow",
          detail:
            "Doctors, pharmacies, labs, hospitals, and care partners operate in role-specific workflows with explicit boundaries."
        }
      ],
      faqs: [
        {
          question: "Does NelyoHealth replace emergency services?",
          answer:
            "No. Emergency care is never blocked and emergency escalation guidance remains explicit."
        },
        {
          question: "Can sponsors or employers automatically view patient clinical records?",
          answer:
            "No. Access is role-scoped and consent-scoped, with auditability and least-privilege boundaries."
        },
        {
          question: "Can I use one platform for consultation, prescriptions, labs, and follow-up?",
          answer:
            "Yes. The care pathway is designed as a continuous workflow with clear next actions."
        }
      ],
      finalCallout:
        "Start with the pathway that matches your role and move from discovery to safe care execution with clear operational boundaries."
    }
  },
  about: {
    id: "MED-PUB-002",
    title: "About NelyoHealth",
    purpose: "Mission, coordinated care model, and Nigerian healthcare context.",
    category: "Public",
    primaryAction: "Explore Care Journey",
    secondaryAction: "Review Trust and Safety",
    primaryActionHref: "/",
    secondaryActionHref: "/trust-safety",
    sections: [
      {
        heading: "Platform Mission",
        body: "Explain coordinated care access, safe escalation boundaries, and role-based operations across patient and partner journeys."
      },
      {
        heading: "Care Coordination Model",
        body: "Present intake, triage, consultation, fulfillment, and follow-up as one traceable care pathway."
      }
    ],
    marketing: {
      heroLabel: "About",
      heroSummary:
        "NelyoHealth was built to reduce care fragmentation while preserving clinical governance, privacy, and role-specific accountability.",
      audienceProblem:
        "Patients and families often experience disconnected healthcare touchpoints across consultation, diagnostics, medication, and follow-up.",
      painPoints: [
        "Care updates are scattered across multiple providers and communication channels.",
        "Family supporters need clarity without crossing consent boundaries.",
        "Operational delays make follow-up and adherence difficult."
      ],
      workflowSteps: [
        {
          step: "Context intake",
          detail: "Capture concerns and care context in structured role-aware pathways."
        },
        {
          step: "Coordinated care execution",
          detail: "Consultation, prescriptions, and labs flow through connected operational states."
        },
        {
          step: "Accountable continuity",
          detail: "Follow-up, support, and escalation maintain continuity with traceable ownership."
        }
      ],
      trustPoints: [
        "No AI diagnosis or clinician replacement claims.",
        "Consent and RBAC are mandatory boundaries.",
        "Emergency escalation is explicit and never hidden."
      ],
      featureProof: [
        {
          heading: "Nigerian context alignment",
          detail: "Mobile-first interactions and low-bandwidth continuity are prioritized."
        },
        {
          heading: "Family-safe model",
          detail:
            "Supporters can coordinate funding and logistics without taking clinical authority."
        },
        {
          heading: "Cross-partner orchestration",
          detail:
            "Doctors, pharmacies, labs, and referral pathways are connected through deterministic workflows."
        }
      ],
      faqs: [
        {
          question: "Is NelyoHealth only for patients?",
          answer:
            "No. It supports patients, families, diaspora sponsors, employers, HMOs, and provider partners with role-specific flows."
        },
        {
          question: "Do funders control patient treatment decisions?",
          answer:
            "No. Clinical authority remains with qualified clinicians and authorized patients."
        }
      ],
      finalCallout:
        "Explore the role-specific entry points and see how coordinated care is delivered without sacrificing safety and privacy constraints."
    }
  },
  "for-employers": {
    id: "MED-PUB-003",
    title: "For Employers",
    purpose: "Corporate benefits, PMPM model, and utilization outcomes.",
    category: "Public",
    primaryAction: "Request Employer Demo",
    secondaryAction: "Review Privacy Boundaries",
    primaryActionHref: "/book-demo",
    secondaryActionHref: "/trust-safety",
    sections: [
      {
        heading: "Workforce Health Access",
        body: "Show how employer-facing tools support eligibility and aggregate reporting without exposing unauthorized clinical data."
      },
      {
        heading: "Operational Reporting",
        body: "Describe aggregate utilization and productivity reporting with strict consent and data-minimization controls."
      }
    ],
    marketing: {
      heroLabel: "Employers",
      heroSummary:
        "Support employee healthcare access with structured activation and aggregate visibility designed for governance.",
      audienceProblem:
        "Employers need dependable healthcare access benefits without overstepping into private clinical records.",
      painPoints: [
        "Employee support journeys are difficult to coordinate across providers.",
        "Benefit programs often lack clear utilization visibility.",
        "Privacy risk increases when clinical and administrative data boundaries are unclear."
      ],
      workflowSteps: [
        {
          step: "Program setup",
          detail: "Define organizational scope, eligibility, and support pathways."
        },
        {
          step: "Member activation",
          detail: "Employees access care through role-aware onboarding and supported workflows."
        },
        {
          step: "Aggregate reporting",
          detail: "Review non-clinical summary metrics for program oversight and iteration."
        }
      ],
      trustPoints: [
        "No default access to individual clinical notes.",
        "Access controls and consent boundaries are enforced by workflow state.",
        "Escalation pathways remain clinically and operationally scoped."
      ],
      featureProof: [
        {
          heading: "Program governance",
          detail: "Organization-level controls support accountable benefit operations."
        },
        {
          heading: "Operational support",
          detail: "Structured support paths reduce care friction and improve resolution tracking."
        },
        {
          heading: "Future-ready scope",
          detail:
            "Employer-specific capabilities are delivered with explicit approval boundaries and clear operational controls."
        }
      ],
      faqs: [
        {
          question: "Will employers see individual diagnoses?",
          answer:
            "No. Employer surfaces are designed for aggregate, non-clinical oversight unless explicitly authorized by policy and consent."
        },
        {
          question: "Does this guarantee insurance outcomes?",
          answer:
            "No. The platform improves operational access and coordination; it does not guarantee claim or outcome results."
        }
      ],
      finalCallout:
        "Book an employer demo to evaluate governance, activation, and reporting fit for your organization."
    }
  },
  "for-hmos": {
    id: "MED-PUB-004",
    title: "For HMOs",
    purpose: "Member access, utilization reporting, and integration readiness.",
    category: "Public",
    primaryAction: "Request HMO Walkthrough",
    secondaryAction: "Review Integration Scope",
    primaryActionHref: "/book-demo",
    secondaryActionHref: "/help",
    sections: [
      {
        heading: "Member Access Model",
        body: "Present eligibility and support workflows with role-constrained visibility and auditable access behavior."
      },
      {
        heading: "Analytics and Controls",
        body: "Highlight aggregate metrics and operational dashboards without implying unrestricted clinical visibility."
      }
    ],
    marketing: {
      heroLabel: "HMOs",
      heroSummary:
        "Enable digital member care access and operational reporting with integration-ready workflows and strict visibility boundaries.",
      audienceProblem:
        "HMOs need efficient member activation and utilization oversight while avoiding unauthorized clinical-data exposure.",
      painPoints: [
        "Member access often depends on fragmented provider workflows.",
        "Operational reporting can be delayed or inconsistent.",
        "Integration projects risk expanding access beyond policy boundaries."
      ],
      workflowSteps: [
        {
          step: "Member and policy alignment",
          detail: "Map eligible journeys and plan constraints to defined workflows."
        },
        {
          step: "Care-access execution",
          detail: "Members move through consultation and follow-up with clear state tracking."
        },
        {
          step: "Utilization and operations insight",
          detail:
            "Aggregate reporting supports oversight without exposing unauthorized individual clinical records."
        }
      ],
      trustPoints: [
        "Least-privilege data boundaries are enforced.",
        "Consent and auditability remain central to access control.",
        "Clinical decisions remain with clinicians, not payer workflows."
      ],
      featureProof: [
        {
          heading: "Integration narrative",
          detail:
            "Operational readiness is structured around approved interfaces and clear governance controls."
        },
        {
          heading: "Member experience",
          detail: "Clear routing and status updates reduce uncertainty across care workflows."
        },
        {
          heading: "Reporting clarity",
          detail: "HMO oversight focuses on aggregate trends and service operations."
        }
      ],
      faqs: [
        {
          question: "Can HMO teams view all patient clinical details by default?",
          answer:
            "No. Access is scoped by role, consent, and policy; default experience is aggregate and operational."
        },
        {
          question: "Is integration available instantly?",
          answer:
            "Integration is planned and approved through governance controls that preserve privacy, security, and operational quality."
        }
      ],
      finalCallout:
        "Request a walkthrough to review member access operations, reporting scope, and integration readiness."
    }
  },
  "for-diaspora": {
    id: "MED-PUB-005",
    title: "For Diaspora Families",
    purpose: "Hard-currency family support with consent-scoped care visibility.",
    category: "Public",
    primaryAction: "Start Family Support Setup",
    secondaryAction: "Read Consent Boundaries",
    primaryActionHref: "/register",
    secondaryActionHref: "/trust-safety",
    sections: [
      {
        heading: "Family Support",
        body: "Clarify what sponsors can fund, monitor, and coordinate while preserving patient autonomy and consent boundaries."
      },
      {
        heading: "Care Confidence",
        body: "Show reliable updates for medications, labs, and follow-ups without exposing protected provider details pre-authorization."
      }
    ],
    marketing: {
      heroLabel: "Diaspora families",
      heroSummary:
        "Support loved ones from anywhere with funding clarity, consent-scoped visibility, and dependable care follow-through.",
      audienceProblem:
        "Diaspora sponsors often carry financial responsibility without reliable updates on what has been completed and what needs attention next.",
      painPoints: [
        "Family support decisions are delayed by fragmented communication.",
        "Sponsors need clarity without violating adult patient privacy.",
        "Coordination gaps appear around medications, labs, and follow-up tasks."
      ],
      workflowSteps: [
        {
          step: "Support setup",
          detail:
            "Define sponsor relationship and funding responsibilities with explicit boundaries."
        },
        {
          step: "Care progress updates",
          detail: "Receive scoped updates on milestones and pending actions."
        },
        {
          step: "Continuity and escalation",
          detail: "Coordinate follow-up and support actions through structured pathways."
        }
      ],
      trustPoints: [
        "Funding scope does not grant unrestricted clinical access.",
        "Consent status determines what can be seen and acted on.",
        "Provider-detail disclosure remains policy gated."
      ],
      featureProof: [
        {
          heading: "Sponsor confidence",
          detail: "Clear operational state updates reduce uncertainty around support actions."
        },
        {
          heading: "Family coordination",
          detail: "Care plans and next actions are presented with role-appropriate clarity."
        },
        {
          heading: "Boundary-first design",
          detail: "Privacy and consent controls are built into workflows, not buried in legal text."
        }
      ],
      faqs: [
        {
          question: "Can I see full adult medical records as a sponsor?",
          answer:
            "Only within approved and consented scope. Sponsorship does not automatically grant unrestricted clinical access."
        },
        {
          question: "Can I still help if I am outside Nigeria?",
          answer:
            "Yes. The sponsor workflow is designed for remote coordination and funding with role-safe visibility."
        }
      ],
      finalCallout:
        "Create an account to begin family support with explicit consent boundaries and clear care coordination states."
    }
  },
  "for-doctors": {
    id: "MED-PUB-006",
    title: "For Doctors",
    purpose: "Provider recruitment, verification, and clinical workflow standards.",
    category: "Public",
    primaryAction: "Begin Provider Onboarding",
    secondaryAction: "Review Clinical Safety Model",
    primaryActionHref: "/register",
    secondaryActionHref: "/trust-safety",
    sections: [
      {
        heading: "Professional Workflow",
        body: "Outline queue, consultation, notes, prescribing, and referral actions using audited and role-aware interfaces."
      },
      {
        heading: "Verification and Governance",
        body: "Emphasize credential verification, clinical safeguards, and documentation standards across care pathways."
      }
    ],
    marketing: {
      heroLabel: "Doctors",
      heroSummary:
        "Join a clinically governed workflow with verification, role-specific tooling, and auditable care execution.",
      audienceProblem:
        "Clinicians need digital workflows that reduce operational friction while preserving documentation quality and patient safety.",
      painPoints: [
        "Fragmented systems force repeated context switching during patient care.",
        "Verification and governance steps are often inconsistent.",
        "Escalation pathways are unclear across partner networks."
      ],
      workflowSteps: [
        {
          step: "Verification and onboarding",
          detail: "Credential and identity checks establish trusted access."
        },
        {
          step: "Consult workflow",
          detail:
            "Consultation, note-taking, orders, and referrals are integrated in one role-aware flow."
        },
        {
          step: "Follow-up accountability",
          detail:
            "Actions remain traceable through structured status transitions and support escalation."
        }
      ],
      trustPoints: [
        "Clinical decisions stay with qualified clinicians.",
        "Safety alerts and escalation pathways remain prominent.",
        "Audit and boundary controls protect patient confidentiality."
      ],
      featureProof: [
        {
          heading: "Clinical standards",
          detail: "Documentation and action pathways align with governed role boundaries."
        },
        {
          heading: "Operational clarity",
          detail: "Queue and status visibility supports predictable care delivery."
        },
        {
          heading: "Partner continuity",
          detail:
            "Downstream pharmacy, lab, and referral flows are coordinated through explicit transitions."
        }
      ],
      faqs: [
        {
          question: "Do clinicians control sponsor and payer permissions?",
          answer:
            "No. Financial and sponsor scopes remain policy and consent controlled; clinical authority focuses on care decisions."
        },
        {
          question: "Can unverified providers practice on the platform?",
          answer:
            "No. Verification and governance controls are required before clinical participation."
        }
      ],
      finalCallout:
        "Start onboarding to review verification steps, clinical workflow expectations, and operating safeguards."
    }
  },
  "for-care-partners": {
    id: "MED-PUB-007",
    title: "For Care Partners",
    purpose: "Professional care-support participation with permission-scoped tasks.",
    category: "Public",
    primaryAction: "Start Care Partner Verification",
    secondaryAction: "Review Allowed Task Scope",
    primaryActionHref: "/register",
    secondaryActionHref: "/trust-safety",
    sections: [
      {
        heading: "Coordination Role",
        body: "Define non-clinical support responsibilities and escalation paths without blurring clinical authority boundaries."
      },
      {
        heading: "Operational Reliability",
        body: "Describe task handoff, adherence tracking, and reporting with auditable activity and clear accountability."
      }
    ],
    marketing: {
      heroLabel: "Care partners",
      heroSummary:
        "Support patients with verified non-clinical care execution while preserving clear clinical-authority boundaries.",
      audienceProblem:
        "Care support teams need structured coordination tools that avoid role confusion with clinicians.",
      painPoints: [
        "Task ownership can be unclear across home support workflows.",
        "Escalation criteria are inconsistently communicated.",
        "Family and patient expectations are hard to align without explicit boundaries."
      ],
      workflowSteps: [
        {
          step: "Verification",
          detail: "Confirm care-partner credentials and operating scope."
        },
        {
          step: "Task execution",
          detail: "Manage approved non-clinical support tasks with status tracking."
        },
        {
          step: "Escalation and reporting",
          detail:
            "Escalate clinical concerns to authorized clinicians and maintain auditable action logs."
        }
      ],
      trustPoints: [
        "Care partners cannot diagnose, prescribe, or edit clinical instructions.",
        "Safeguarding and risk signals are escalated through approved channels.",
        "Task visibility is permission-scoped and auditable."
      ],
      featureProof: [
        {
          heading: "Clear task boundaries",
          detail: "Role-specific workflows reduce ambiguity and unsafe action overlap."
        },
        {
          heading: "Mobile-ready operations",
          detail: "Field-friendly task progression supports on-the-go coordination."
        },
        {
          heading: "Accountability by design",
          detail: "Status updates and handoffs keep caregivers, families, and clinicians aligned."
        }
      ],
      faqs: [
        {
          question: "Can care partners make treatment decisions?",
          answer:
            "No. Clinical authority remains with verified clinicians; care partners execute approved non-clinical support tasks."
        },
        {
          question: "Can individuals and agencies both participate?",
          answer: "Yes, within verification and scope requirements defined for each partner type."
        }
      ],
      finalCallout:
        "Begin verification to review permitted task scope, escalation pathways, and accountability requirements."
    }
  },
  "for-pharmacies": {
    id: "MED-PUB-008",
    title: "For Pharmacies",
    purpose: "Prescription fulfillment partnership and order lifecycle execution.",
    category: "Public",
    primaryAction: "Join Pharmacy Network",
    secondaryAction: "Review Disclosure Policy",
    primaryActionHref: "/book-demo",
    secondaryActionHref: "/trust-safety",
    sections: [
      {
        heading: "Fulfillment Workflow",
        body: "Show acceptance, preparation, dispatch, and settlement stages with deterministic status progression."
      },
      {
        heading: "Protected Disclosure",
        body: "Reinforce that protected provider details remain locked until exact-order authorization conditions are satisfied."
      }
    ],
    marketing: {
      heroLabel: "Pharmacies",
      heroSummary:
        "Participate in a structured prescription-fulfillment workflow with deterministic statuses and privacy-safe disclosure controls.",
      audienceProblem:
        "Pharmacy fulfillment suffers when orders, communication, and settlement workflows are fragmented.",
      painPoints: [
        "Order visibility can be incomplete or delayed.",
        "Disclosure boundaries are often unclear before authorization.",
        "Status communication across dispatch and handoff is inconsistent."
      ],
      workflowSteps: [
        {
          step: "Order intake",
          detail: "Receive and validate prescription orders through scoped workflows."
        },
        {
          step: "Fulfillment progression",
          detail:
            "Move orders through preparation, dispatch, and completion with explicit status updates."
        },
        {
          step: "Settlement and support",
          detail: "Track settlement and exception handling using traceable operations pathways."
        }
      ],
      trustPoints: [
        "Protected provider details remain gated until authorized conditions are met.",
        "Order visibility is tenant and order scoped.",
        "Operational actions are auditable for compliance and dispute handling."
      ],
      featureProof: [
        {
          heading: "Queue reliability",
          detail: "Pharmacy operators receive structured task progression and exception awareness."
        },
        {
          heading: "Disclosure safeguards",
          detail: "Pre-authorization provider details are constrained by policy and workflow state."
        },
        {
          heading: "Lifecycle consistency",
          detail:
            "From intake to completion, each transition is explicit and operationally accountable."
        }
      ],
      faqs: [
        {
          question: "Can protected provider details appear before authorization?",
          answer:
            "No. Disclosure is exact-order and authorization scoped with server-side enforcement."
        },
        {
          question: "Are settlement outcomes guaranteed?",
          answer: "No. Settlement follows governed workflow states and policy checks."
        }
      ],
      finalCallout:
        "Request partnership details to evaluate fulfillment workflow fit, operational readiness, and disclosure controls."
    }
  },
  "for-labs": {
    id: "MED-PUB-009",
    title: "For Labs",
    purpose: "Diagnostics partnership, scheduling, and secure result delivery.",
    category: "Public",
    primaryAction: "Join Lab Network",
    secondaryAction: "Review Result Governance",
    primaryActionHref: "/book-demo",
    secondaryActionHref: "/trust-safety",
    sections: [
      {
        heading: "Diagnostics Operations",
        body: "Cover order intake, scheduling, specimen handling, result upload, and delay/escalation handling."
      },
      {
        heading: "Safety and Privacy",
        body: "Require secure result handling, auditable visibility, and strict role/tenant boundaries for data access."
      }
    ],
    marketing: {
      heroLabel: "Laboratories",
      heroSummary:
        "Deliver diagnostics through structured scheduling, specimen handling, and results workflows with governed access boundaries.",
      audienceProblem:
        "Diagnostic operations are often slowed by disjointed booking, specimen tracking, and result-delivery workflows.",
      painPoints: [
        "Specimen and appointment coordination can be inconsistent.",
        "Result handoff is vulnerable to delays and unclear ownership.",
        "Access controls around sensitive results are frequently under-specified."
      ],
      workflowSteps: [
        {
          step: "Order and booking",
          detail:
            "Receive orders and manage appointment logistics through defined state transitions."
        },
        {
          step: "Specimen and processing",
          detail: "Track processing milestones and exception paths with clear accountability."
        },
        {
          step: "Result publication",
          detail:
            "Publish results through permission-scoped pathways with escalation support for critical findings."
        }
      ],
      trustPoints: [
        "Result access is role and context constrained.",
        "Critical-result handling follows explicit escalation pathways.",
        "Auditability supports operational and compliance traceability."
      ],
      featureProof: [
        {
          heading: "Operational queue clarity",
          detail:
            "Lab workflows are designed around actionable statuses and controlled transitions."
        },
        {
          heading: "Result governance",
          detail:
            "Sensitive result visibility is constrained by authorization and workflow context."
        },
        {
          heading: "Partner continuity",
          detail: "Diagnostics pathways align with broader care follow-up and support operations."
        }
      ],
      faqs: [
        {
          question: "Can any partner see all results by default?",
          answer:
            "No. Result access is permission scoped and governed by role and authorization context."
        },
        {
          question: "Does this replace laboratory quality controls?",
          answer:
            "No. The platform coordinates workflow and visibility; domain quality controls remain mandatory."
        }
      ],
      finalCallout:
        "Start a lab partnership conversation to assess diagnostics workflow fit, scheduling model, and result-governance alignment."
    }
  },
  "for-hospitals": {
    id: "MED-PUB-010",
    title: "For Hospitals and Specialists",
    purpose: "Referral collaboration and post-discharge coordination.",
    category: "Public",
    primaryAction: "Request Referral Partnership",
    secondaryAction: "View Specialist Network Model",
    primaryActionHref: "/book-demo",
    secondaryActionHref: "/help",
    sections: [
      {
        heading: "Referral Continuity",
        body: "Describe referral intake, specialist routing, and discharge follow-up as a coordinated continuum."
      },
      {
        heading: "Escalation Readiness",
        body: "Keep emergency and critical pathways visible and prioritized above commercial conversion messaging."
      }
    ],
    marketing: {
      heroLabel: "Hospitals and specialists",
      heroSummary:
        "Coordinate referrals, discharge follow-up, and specialist pathways with clear scope and safety-first escalation behavior.",
      audienceProblem:
        "Referral continuity and discharge follow-up can fail when transitions between organizations are opaque.",
      painPoints: [
        "Referral pathways often lack shared status visibility.",
        "Discharge follow-up can be delayed without structured ownership.",
        "Escalation routes are not always clear across institutions."
      ],
      workflowSteps: [
        {
          step: "Referral initiation",
          detail: "Capture referral context and destination routing in defined workflows."
        },
        {
          step: "Specialist coordination",
          detail:
            "Manage specialist intake, scheduling, and handoff states with explicit ownership."
        },
        {
          step: "Post-discharge continuity",
          detail: "Track follow-up tasks and support resolution through operational pathways."
        }
      ],
      trustPoints: [
        "Clinical urgency and safety escalation remain higher priority than commercial messaging.",
        "Partner visibility is constrained by role and authorized context.",
        "Referral activity remains traceable through auditable status transitions."
      ],
      featureProof: [
        {
          heading: "Continuity architecture",
          detail:
            "Referrals and follow-up are modeled as connected transitions, not isolated events."
        },
        {
          heading: "Governed participation",
          detail:
            "Hospital and specialist flows are introduced with explicit scope and approval controls."
        },
        {
          heading: "Safety-led operations",
          detail: "Escalation pathways keep risk communication visible and actionable."
        }
      ],
      faqs: [
        {
          question: "Does this page claim immediate accreditation or partnership?",
          answer:
            "No. Participation details are reviewed and approved through controlled onboarding pathways."
        },
        {
          question: "Can referral data be shared broadly by default?",
          answer: "No. Access is scoped to authorized participants and governed workflows."
        }
      ],
      finalCallout:
        "Contact the team to assess referral-network fit, discharge continuity model, and collaboration scope."
    }
  },
  pricing: {
    id: "MED-PUB-011",
    title: "Pricing and Plans",
    purpose: "Plan options with transparent financial commitments and boundaries.",
    category: "Public",
    primaryAction: "Compare Plan Options",
    secondaryAction: "Contact Support",
    primaryActionHref: "/book-demo",
    secondaryActionHref: "/help",
    sections: [
      {
        heading: "Transparent Charges",
        body: "Show plan tiers and payment terms with explicit commitments, exclusions, and no hidden fee framing."
      },
      {
        heading: "Role-Aware Entitlements",
        body: "Clarify how sponsor, employer, and HMO coverage affects funding, not clinical-record access rights."
      }
    ],
    marketing: {
      heroLabel: "Pricing and plans",
      heroSummary:
        "Review plan structures across individual, sponsor, employer, and HMO contexts with transparent scope and boundaries.",
      audienceProblem:
        "Care funding decisions are difficult when plan scope, exclusions, and access boundaries are not clearly communicated.",
      painPoints: [
        "Plan comparisons can hide operational and scope differences.",
        "Funding assumptions are often confused with clinical access rights.",
        "Support escalation paths for billing exceptions are frequently unclear."
      ],
      workflowSteps: [
        {
          step: "Plan selection",
          detail: "Choose pathways based on care context and funding model."
        },
        {
          step: "Scope confirmation",
          detail: "Review what is included, excluded, and approval dependent."
        },
        {
          step: "Operational support",
          detail: "Use structured support routes for billing and entitlement clarification."
        }
      ],
      trustPoints: [
        "Funding status does not grant unrestricted clinical-record access.",
        "Coverage is communicated with explicit scope and caveats.",
        "Disputes and exceptions route through auditable support pathways."
      ],
      featureProof: [
        {
          heading: "Transparent structure",
          detail: "Pricing narratives separate funding decisions from clinical authority."
        },
        {
          heading: "Role-aware plans",
          detail:
            "Patient, family, employer, and HMO contexts are represented with clear boundaries."
        },
        {
          heading: "Support continuity",
          detail:
            "Billing and entitlement support are integrated with accountable resolution workflows."
        }
      ],
      faqs: [
        {
          question: "Does payment automatically unlock all provider details?",
          answer:
            "Disclosure remains exact-order and authorization scoped under defined policy conditions."
        },
        {
          question: "Are outcomes or approvals guaranteed by plan tier?",
          answer:
            "No. Plan tiers define funding and access scope, not guaranteed clinical or administrative outcomes."
        }
      ],
      finalCallout:
        "Review plans and contact support for scope clarification before selecting a pathway."
    }
  },
  "book-demo": {
    id: "MED-PUB-012",
    title: "Book Demo",
    purpose: "B2B lead capture and scheduling intent.",
    category: "Public",
    primaryAction: "Submit Demo Request",
    secondaryAction: "Review Preparation Checklist",
    primaryActionHref: "/book-demo",
    secondaryActionHref: "/help",
    sections: [
      {
        heading: "Qualified Intake",
        body: "Capture organization profile and implementation context with clear expectations for follow-up response."
      },
      {
        heading: "Evidence-Led Positioning",
        body: "Frame the product through governance, safety, and operational reliability rather than unverified marketing claims."
      }
    ],
    marketing: {
      heroLabel: "Book demo",
      heroSummary:
        "Share organization context and goals to schedule a focused walkthrough of relevant workflows and governance boundaries.",
      audienceProblem:
        "Buyers and partner teams need evidence-based demos tailored to their operational role instead of generic product tours.",
      painPoints: [
        "Demo sessions often miss role-specific priorities.",
        "Governance and privacy boundaries are not addressed early enough.",
        "Implementation expectations are unclear after initial contact."
      ],
      workflowSteps: [
        {
          step: "Intake",
          detail: "Capture organization type, goals, and required workflows."
        },
        {
          step: "Tailored walkthrough",
          detail: "Review relevant pathways with clear scope, constraints, and dependencies."
        },
        {
          step: "Next-step alignment",
          detail: "Document implementation considerations and ownership boundaries."
        }
      ],
      trustPoints: [
        "No unsupported compliance or clinical claims.",
        "Scope limitations are stated explicitly.",
        "Demonstrations are structured around role and governance context."
      ],
      featureProof: [
        {
          heading: "Role-based demo paths",
          detail:
            "Sessions focus on patient, provider, employer, HMO, or partner priorities as requested."
        },
        {
          heading: "Governance clarity",
          detail: "Privacy, consent, and access boundaries are addressed as first-class concerns."
        },
        {
          heading: "Implementation realism",
          detail: "Dependencies, scope boundaries, and approval requirements are made explicit."
        }
      ],
      faqs: [
        {
          question: "Will the demo include real patient data?",
          answer: "No. Demonstrations use synthetic context and approved narratives."
        },
        {
          question: "Can we request a role-specific demo?",
          answer: "Yes. Demo flow is tailored to your organization type and workflow priorities."
        }
      ],
      finalCallout:
        "Submit your request with clear goals so the walkthrough can focus on your highest-priority workflows."
    }
  },
  "trust-safety": {
    id: "MED-PUB-013",
    title: "Trust and Safety",
    purpose: "Verification, privacy controls, and clinical escalation boundaries.",
    category: "Public",
    primaryAction: "Review Safety Controls",
    secondaryAction: "Read Privacy Overview",
    primaryActionHref: "/trust-safety",
    secondaryActionHref: "/help",
    sections: [
      {
        heading: "Safety Controls",
        body: "Document verification, consent checks, role-based access, and deterministic escalation pathways."
      },
      {
        heading: "Boundary Communication",
        body: "State platform limits clearly, including emergency-care boundaries and non-diagnostic AI assistance constraints."
      }
    ],
    marketing: {
      heroLabel: "Trust and safety",
      heroSummary:
        "Understand how verification, consent, privacy boundaries, and escalation pathways are built into NelyoHealth workflows.",
      audienceProblem:
        "Users and partners need confidence that healthcare operations are safe, accountable, and privacy-preserving under real workflow pressure.",
      painPoints: [
        "Safety promises are often generic and not tied to system behavior.",
        "Consent and access controls are unclear during multi-party workflows.",
        "Escalation boundaries are hidden behind marketing narratives."
      ],
      workflowSteps: [
        {
          step: "Verification controls",
          detail:
            "User and provider access pathways include role-specific verification requirements."
        },
        {
          step: "Consent and access governance",
          detail:
            "Visibility and action rights are constrained by role, consent, and authorization scope."
        },
        {
          step: "Escalation and support",
          detail:
            "Urgent, emergency, and safeguarding pathways remain explicit and operationally reachable."
        }
      ],
      trustPoints: [
        "No claim of zero risk or complete risk elimination.",
        "Protected provider disclosure remains policy gated.",
        "Auditability supports accountability across sensitive transitions."
      ],
      featureProof: [
        {
          heading: "Boundary-first architecture",
          detail: "Privacy and authorization controls are embedded in workflow transitions."
        },
        {
          heading: "Clinical governance",
          detail: "Clinical decisions remain with qualified clinicians and approved care pathways."
        },
        {
          heading: "Operational safety",
          detail:
            "Support and escalation routes are designed for real-world interruption and recovery states."
        }
      ],
      faqs: [
        {
          question: "Does NelyoHealth guarantee no incidents?",
          answer:
            "No. It applies governance and controls to reduce risk, detect issues, and support accountable response."
        },
        {
          question: "Are emergency situations handled as ordinary support tickets?",
          answer:
            "No. Emergency pathways are prioritized and separated from routine commercial journeys."
        }
      ],
      finalCallout:
        "Review trust and safety expectations before onboarding your team or family into operational workflows."
    }
  },
  help: {
    id: "MED-PUB-014",
    title: "Help Center",
    purpose: "Public FAQ and support entry.",
    category: "Public",
    primaryAction: "Search Help Topics",
    secondaryAction: "Contact Support",
    primaryActionHref: "/help",
    secondaryActionHref: "/book-demo",
    sections: [
      {
        heading: "Support Navigation",
        body: "Provide fast paths for account, booking, payment, fulfillment, and escalation guidance."
      },
      {
        heading: "Issue Resolution",
        body: "Ensure users receive actionable next steps for common failures, delays, and role-specific constraints."
      }
    ],
    marketing: {
      heroLabel: "Help center",
      heroSummary:
        "Find support pathways for onboarding, bookings, funding, fulfillment, and account access using clear role-aware guidance.",
      audienceProblem:
        "Users need reliable resolution paths when care, account, or funding workflows fail or become unclear.",
      painPoints: [
        "Support requests can be delayed by unclear triage categories.",
        "Users often cannot tell which team owns an issue.",
        "Escalation routes for urgent concerns are easy to miss."
      ],
      workflowSteps: [
        {
          step: "Identify issue type",
          detail:
            "Route account, booking, funding, and fulfillment concerns into role-aware help paths."
        },
        {
          step: "Apply guidance",
          detail: "Provide step-by-step next actions and expected workflow outcomes."
        },
        {
          step: "Escalate safely",
          detail:
            "Escalate unresolved or urgent issues through explicit support and safety channels."
        }
      ],
      trustPoints: [
        "Support pathways do not bypass privacy and authorization boundaries.",
        "Urgent and emergency guidance remains explicit and prioritized.",
        "Resolution messaging is clear about scope and ownership."
      ],
      featureProof: [
        {
          heading: "Structured support categories",
          detail: "Users can navigate to relevant help quickly without exposing sensitive data."
        },
        {
          heading: "Role-aware guidance",
          detail: "Support instructions reflect patient, family, sponsor, and partner contexts."
        },
        {
          heading: "Escalation discipline",
          detail: "Critical concerns route through safety-aligned pathways with clear next steps."
        }
      ],
      faqs: [
        {
          question: "Can support agents view any record by default?",
          answer: "No. Access remains scoped and auditable based on role, case context, and policy."
        },
        {
          question: "Is help center guidance a replacement for emergency care?",
          answer:
            "No. Emergency care guidance is separate and should be used immediately when needed."
        }
      ],
      finalCallout:
        "Use help pathways to resolve routine issues quickly, and escalate urgent concerns through explicit safety routes."
    }
  },
  login: {
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
  register: {
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
