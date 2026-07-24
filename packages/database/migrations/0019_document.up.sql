-- Document persistence (roadmap M5.8 — Core Resource Platform: Documents).
--
-- The authoritative document resource: access-controlled METADATA for files whose
-- bytes live in object storage. The DB row references the object by storage_key;
-- an authorized read is what grants access to that key (and, downstream, a signed
-- URL). Like messaging, uploading is NOT tied to an encounter (a patient may
-- upload an insurance card between visits), so the upload path uses a
-- non-encounter authorization action.
--
-- Context isolation: patient_ref, organization_ref, and uploaded_by_ref are soft
-- UUID references — NO cross-context foreign keys (and no intra-schema FK: a
-- document is a single record).
--
-- PHI discipline: the title may reveal a condition and the storage_key is a
-- pointer to protected bytes; both live ONLY in this access-controlled store.
-- Canonical document events carry the document / actor references and the
-- document TYPE (category) only — never the title or the storage key.

CREATE SCHEMA IF NOT EXISTS nelyo_document;

CREATE TABLE nelyo_document.document (
  document_id UUID PRIMARY KEY,
  patient_ref UUID NOT NULL,
  organization_ref UUID NOT NULL,
  uploaded_by_ref UUID NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN (
    'clinical-note', 'lab-report', 'imaging', 'consent-form', 'referral-letter',
    'insurance-card', 'other'
  )),
  -- May reveal a condition; access-controlled; never copied into events.
  title TEXT NOT NULL,
  -- Object-storage pointer to the protected bytes; access-controlled.
  storage_key TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size_bytes BIGINT,
  status TEXT NOT NULL CHECK (status IN ('active', 'archived')),
  uploaded_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- A patient's documents (the decision subject), newest first.
CREATE INDEX document_patient_org_idx
  ON nelyo_document.document (patient_ref, organization_ref, uploaded_at DESC);
