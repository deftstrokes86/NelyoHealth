import type { ContentEntry } from "../../schema.js";
import { authCreateAccountEntries } from "./auth-create-account.js";
import { authForgotPasswordEntries } from "./auth-forgot-password.js";
import { authResetPasswordEntries } from "./auth-reset-password.js";
import { authSigninEntries } from "./auth-signin.js";
import { marketingAccessibilityEntries } from "./marketing-accessibility.js";
import { marketingContactEntries } from "./marketing-contact.js";
import { marketingCookieConsentEntries } from "./marketing-cookie-consent.js";
import { marketingCtaEntries } from "./marketing-cta.js";
import { marketingEmergencyEntries } from "./marketing-emergency.js";
import { marketingErrorPagesEntries } from "./marketing-error-pages.js";
import { marketingFaqEntries } from "./marketing-faq.js";
import { marketingFooterEntries } from "./marketing-footer.js";
import { marketingFooterPagesEntries } from "./marketing-footer-pages.js";
import { marketingHelpWidgetEntries } from "./marketing-help-widget.js";
import { marketingNavEntries } from "./marketing-nav.js";
import { marketingFamilyHealthEntries } from "./marketing-family-health.js";
import { marketingHomeEntries } from "./marketing-home.js";
import { marketingHowItWorksEntries } from "./marketing-how-it-works.js";
import { marketingLegalEntries } from "./marketing-legal.js";
import { marketingMicrocopyEntries } from "./marketing-microcopy.js";
import { marketingPrivacyOverviewEntries } from "./marketing-privacy-overview.js";
import { marketingSeoEntries } from "./marketing-seo.js";
import { marketingSegmentDoctorsEntries } from "./marketing-segment-doctors.js";
import { marketingSegmentEmployersEntries } from "./marketing-segment-employers.js";
import { marketingSegmentFamilyDiasporaEntries } from "./marketing-segment-family-diaspora.js";
import { marketingSegmentHmosEntries } from "./marketing-segment-hmos.js";
import { marketingSegmentHomeCareEntries } from "./marketing-segment-home-care.js";
import { marketingSegmentHospitalsEntries } from "./marketing-segment-hospitals.js";
import { marketingSegmentLaboratoriesEntries } from "./marketing-segment-laboratories.js";
import { marketingSegmentMedicalRecordsEntries } from "./marketing-segment-medical-records.js";
import { marketingSegmentPatientsEntries } from "./marketing-segment-patients.js";
import { marketingSegmentPharmaciesEntries } from "./marketing-segment-pharmacies.js";
import { marketingTrustAndSafetyEntries } from "./marketing-trust-and-safety.js";

export const marketingContentEntries: ContentEntry[] = [
  ...marketingHomeEntries,
  ...marketingHowItWorksEntries,
  ...marketingSegmentPatientsEntries,
  ...marketingSegmentFamilyDiasporaEntries,
  ...marketingSegmentDoctorsEntries,
  ...marketingSegmentPharmaciesEntries,
  ...marketingSegmentLaboratoriesEntries,
  ...marketingSegmentEmployersEntries,
  ...marketingSegmentHmosEntries,
  ...marketingSegmentHospitalsEntries,
  ...marketingSegmentHomeCareEntries,
  ...marketingSegmentMedicalRecordsEntries,
  ...marketingTrustAndSafetyEntries,
  ...marketingPrivacyOverviewEntries,
  ...marketingAccessibilityEntries,
  ...marketingFaqEntries,
  ...marketingContactEntries,
  ...marketingLegalEntries,
  ...marketingEmergencyEntries,
  ...marketingCtaEntries,
  ...marketingMicrocopyEntries,
  ...marketingSeoEntries,
  ...marketingErrorPagesEntries,
  ...marketingCookieConsentEntries,
  ...marketingFooterPagesEntries,
  ...marketingFooterEntries,
  ...marketingHelpWidgetEntries,
  ...marketingNavEntries,
  ...marketingFamilyHealthEntries,
  ...authSigninEntries,
  ...authCreateAccountEntries,
  ...authForgotPasswordEntries,
  ...authResetPasswordEntries
];

export const marketingContentById = new Map(
  marketingContentEntries.map((entry) => [entry.id, entry])
);
