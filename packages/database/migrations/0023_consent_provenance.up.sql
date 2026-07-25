-- Consent provenance (roadmap M6.3 — Patient-Profile Write Authorization).
--
-- Patient-profile CREATE atomically bootstraps the governing consent it will
-- need (so no profile ever exists without governing consent/relationship rows).
-- That bootstrap consent must record HOW it was captured, distinct from an
-- ordinary patient-driven grant, so it is auditable and correctly represented on
-- the patient's consent dashboard:
--   * self-registration        — the patient created their own profile;
--   * captured-at-registration — org staff registered the patient (treatment scope);
--   * guardian-granted         — a guardian registered a dependent.
-- Ordinary M4.1 grants leave it NULL (patient-driven). Operational label, no PHI.

ALTER TABLE nelyo_consent.consent_version
  ADD COLUMN provenance TEXT;
