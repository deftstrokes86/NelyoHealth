export type Batch2RouteDefinition = {
  id: string;
  title: string;
  purpose: string;
  group: "Patient" | "GuardianMinor";
};

export const batch2RouteCatalog = {
  "patient/onboarding": {
    id: "MED-PAT-001",
    title: "Patient Onboarding",
    purpose: "Welcome, care promise, and next steps.",
    group: "Patient"
  },
  "patient/profile/setup": {
    id: "MED-PAT-002",
    title: "Patient Profile Setup",
    purpose: "Demographics, address, and emergency contact.",
    group: "Patient"
  },
  "patient/medical-history/setup": {
    id: "MED-PAT-003",
    title: "Medical History Setup",
    purpose: "Conditions, allergies, medications, and surgeries.",
    group: "Patient"
  },
  "patient/dashboard": {
    id: "MED-PAT-004",
    title: "Patient Dashboard",
    purpose: "Health summary, next actions, and recent activity.",
    group: "Patient"
  },
  "patient/symptoms/new": {
    id: "MED-PAT-005",
    title: "Symptom Intake",
    purpose: "Structured triage form with red-flag capture.",
    group: "Patient"
  },
  "patient/symptoms/review": {
    id: "MED-PAT-006",
    title: "AI-Assisted Intake Review",
    purpose: "Plain-language summary before booking, not diagnosis.",
    group: "Patient"
  },
  "patient/consultations/type": {
    id: "MED-PAT-007",
    title: "Choose Consultation Type",
    purpose: "Chat, audio, video, urgent, and routine options.",
    group: "Patient"
  },
  "patient/doctors/availability": {
    id: "MED-PAT-008",
    title: "Doctor Availability",
    purpose: "Specialty, available slots, and care type.",
    group: "Patient"
  },
  "patient/consultations/book": {
    id: "MED-PAT-009",
    title: "Book Consultation",
    purpose: "Confirm slot, reason, and consent.",
    group: "Patient"
  },
  "patient/checkout": {
    id: "MED-PAT-010",
    title: "Payment or Benefit Check",
    purpose: "Self-pay, corporate/HMO entitlement, and sponsor coverage.",
    group: "Patient"
  },
  "patient/consultations/waiting": {
    id: "MED-PAT-011",
    title: "Waiting Room",
    purpose: "Queue status, instructions, and cancellation controls.",
    group: "Patient"
  },
  "patient/consultations/live": {
    id: "MED-PAT-012",
    title: "Live Consultation",
    purpose: "Secure chat/audio/video consultation interface.",
    group: "Patient"
  },
  "patient/consultations/summary": {
    id: "MED-PAT-013",
    title: "Consultation Summary",
    purpose: "Doctor-approved care plan and follow-up direction.",
    group: "Patient"
  },
  "patient/prescriptions": {
    id: "MED-PAT-014",
    title: "Prescription View",
    purpose: "Medication instructions, refill, and pharmacy routing.",
    group: "Patient"
  },
  "patient/labs/requests": {
    id: "MED-PAT-015",
    title: "Lab Request View",
    purpose: "Diagnostics requested and booking status.",
    group: "Patient"
  },
  "patient/labs/book": {
    id: "MED-PAT-016",
    title: "Book Lab Test",
    purpose: "Lab partner selection and sample collection options.",
    group: "Patient"
  },
  "patient/medications/fulfillment": {
    id: "MED-PAT-017",
    title: "Medication Fulfillment",
    purpose: "Delivery or pickup status tracking.",
    group: "Patient"
  },
  "patient/records": {
    id: "MED-PAT-018",
    title: "Medical Records",
    purpose: "Consultations, prescriptions, labs, and care plans.",
    group: "Patient"
  },
  "patient/care-team": {
    id: "MED-PAT-019",
    title: "Care Team",
    purpose: "Doctors, care partners, sponsors, and guardians as applicable.",
    group: "Patient"
  },
  "patient/notifications": {
    id: "MED-PAT-020",
    title: "Notifications",
    purpose: "Reminders, alerts, and follow-up events.",
    group: "Patient"
  },
  "patient/support": {
    id: "MED-PAT-021",
    title: "Support and Complaints",
    purpose: "Help, disputes, failed consults, and complaint handling.",
    group: "Patient"
  },
  "patient/settings": {
    id: "MED-PAT-022",
    title: "Patient Settings",
    purpose: "Security, preferences, data export, and account controls.",
    group: "Patient"
  },
  "guardian/dashboard": {
    id: "MED-MIN-001",
    title: "Guardian Dashboard",
    purpose: "Dependent overview and care alerts.",
    group: "GuardianMinor"
  },
  "guardian/dependents/add": {
    id: "MED-MIN-002",
    title: "Add Dependent",
    purpose: "Create infant, child, pre-teen, or adolescent profile.",
    group: "GuardianMinor"
  },
  "guardian/dependents/profile": {
    id: "MED-MIN-003",
    title: "Minor Profile Setup",
    purpose: "DOB, growth metrics, allergies, and emergency data.",
    group: "GuardianMinor"
  },
  "guardian/consent": {
    id: "MED-MIN-004",
    title: "Guardian Consent",
    purpose: "Consent for care and data processing.",
    group: "GuardianMinor"
  },
  "adolescent/welcome": {
    id: "MED-MIN-005",
    title: "Adolescent Welcome",
    purpose: "Age-appropriate onboarding pathway.",
    group: "GuardianMinor"
  },
  "adolescent/assent": {
    id: "MED-MIN-006",
    title: "Adolescent Assent",
    purpose: "Plain-language assent acknowledgment.",
    group: "GuardianMinor"
  },
  "guardian/adolescent/privacy": {
    id: "MED-MIN-007",
    title: "Adolescent Privacy Settings",
    purpose: "Visibility boundaries and consent rules.",
    group: "GuardianMinor"
  },
  "guardian/dependents/symptoms": {
    id: "MED-MIN-008",
    title: "Pediatric Symptom Intake",
    purpose: "Age-aware triage and red-flag intake.",
    group: "GuardianMinor"
  },
  "guardian/dependents/emergency-warning": {
    id: "MED-MIN-009",
    title: "Pediatric Emergency Warning",
    purpose: "Immediate escalation guidance for pediatric red flags.",
    group: "GuardianMinor"
  },
  "guardian/dependents/consultations/book": {
    id: "MED-MIN-010",
    title: "Pediatric Consult Booking",
    purpose: "Pediatric doctor routing and booking flow.",
    group: "GuardianMinor"
  },
  "guardian/dependents/consultations/waiting": {
    id: "MED-MIN-011",
    title: "Pediatric Waiting Room",
    purpose: "Guardian-present waiting room and instructions.",
    group: "GuardianMinor"
  },
  "guardian/dependents/consultations/live": {
    id: "MED-MIN-012",
    title: "Pediatric Live Consultation",
    purpose: "Child consultation with guardian participation.",
    group: "GuardianMinor"
  },
  "guardian/dependents/consultations/summary": {
    id: "MED-MIN-013",
    title: "Pediatric Consultation Summary",
    purpose: "Doctor-approved pediatric care plan summary.",
    group: "GuardianMinor"
  },
  "guardian/dependents/prescriptions": {
    id: "MED-MIN-014",
    title: "Child Prescription Instructions",
    purpose: "Weight and age-sensitive medication guidance.",
    group: "GuardianMinor"
  },
  "guardian/dependents/labs": {
    id: "MED-MIN-015",
    title: "Child Lab Requests",
    purpose: "Test orders and lab booking status.",
    group: "GuardianMinor"
  },
  "guardian/dependents/immunizations": {
    id: "MED-MIN-016",
    title: "Immunization Record",
    purpose: "Vaccination history and reminder schedule.",
    group: "GuardianMinor"
  },
  "guardian/dependents/growth": {
    id: "MED-MIN-017",
    title: "Growth and Vitals Chart",
    purpose: "Weight, height, temperature, and key vitals.",
    group: "GuardianMinor"
  },
  "guardian/dependents/school-health": {
    id: "MED-MIN-018",
    title: "School Health Records",
    purpose: "School notes, allergy plans, and emergency instructions.",
    group: "GuardianMinor"
  },
  "guardian/dependents/care-partners": {
    id: "MED-MIN-019",
    title: "Minor Care Partner Access",
    purpose: "Assign care support with strict permission scopes.",
    group: "GuardianMinor"
  },
  "guardian/dependents/safeguarding-alert": {
    id: "MED-MIN-020",
    title: "Safeguarding Alert",
    purpose: "Abuse, exploitation, and self-harm risk workflow.",
    group: "GuardianMinor"
  },
  "guardian/dependents/care-summary": {
    id: "MED-MIN-021",
    title: "Guardian Care Summary",
    purpose: "Parent-facing longitudinal care summary.",
    group: "GuardianMinor"
  },
  "guardian/dependents/access-audit": {
    id: "MED-MIN-022",
    title: "Minor Access Audit",
    purpose: "Access-history review for minor records.",
    group: "GuardianMinor"
  }
} as const satisfies Record<string, Batch2RouteDefinition>;

export type Batch2RouteKey = keyof typeof batch2RouteCatalog;
