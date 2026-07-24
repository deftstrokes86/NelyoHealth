-- Laboratory persistence (roadmap M5.6 — Core Resource Platform: Laboratories).
--
-- The authoritative lab-order resource and its result observations. A clinician
-- orders a test (typically from a consultation); the laboratory reports one or
-- more result observations against the order.
--
-- Context isolation: patient_ref, ordering_clinician_ref, organization_ref,
-- consultation_ref, and resulted_by_ref are soft UUID references — NO
-- cross-context foreign keys. The only foreign key is intra-schema
-- (observation -> order).
--
-- PHI discipline: the test name/code, clinical reason, and every result
-- observation (analyte, value, reference range, interpretation) are PROTECTED
-- clinical data and live ONLY in this access-controlled store. Canonical
-- laboratory events carry the order / observation / actor references and
-- non-clinical metadata (priority, operational status) only.

CREATE SCHEMA IF NOT EXISTS nelyo_laboratory;

CREATE TABLE nelyo_laboratory.lab_order (
  order_id UUID PRIMARY KEY,
  patient_ref UUID NOT NULL,
  ordering_clinician_ref UUID NOT NULL,
  organization_ref UUID NOT NULL,
  consultation_ref UUID,
  test_code TEXT,
  test_name TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('routine', 'urgent', 'stat')),
  clinical_reason TEXT,
  status TEXT NOT NULL CHECK (status IN ('ordered', 'collected', 'resulted', 'cancelled')),
  cancellation_reason_code TEXT,
  ordered_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE nelyo_laboratory.lab_result_observation (
  observation_id UUID PRIMARY KEY,
  order_ref UUID NOT NULL
    REFERENCES nelyo_laboratory.lab_order (order_id) ON DELETE CASCADE,
  analyte_name TEXT NOT NULL,
  value TEXT NOT NULL,
  unit TEXT,
  reference_range TEXT,
  interpretation TEXT CHECK (interpretation IN ('normal', 'low', 'high', 'abnormal', 'critical')),
  resulted_by_ref UUID NOT NULL,
  resulted_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- A patient's lab orders (the decision subject), newest first.
CREATE INDEX lab_order_patient_org_idx
  ON nelyo_laboratory.lab_order (patient_ref, organization_ref, ordered_at DESC);

-- An ordering clinician's orders.
CREATE INDEX lab_order_clinician_idx
  ON nelyo_laboratory.lab_order (ordering_clinician_ref, organization_ref);

-- Result observations for an order.
CREATE INDEX lab_result_observation_order_idx
  ON nelyo_laboratory.lab_result_observation (order_ref, resulted_at ASC);
