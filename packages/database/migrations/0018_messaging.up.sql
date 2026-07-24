-- Secure messaging persistence (roadmap M5.7 — Core Resource Platform: Messages).
--
-- The authoritative secure-messaging resource: threads between a patient and
-- their care circle, each carrying messages. Unlike clinical writes, sending a
-- message is NOT tied to an encounter — patients message their providers between
-- visits — so the send path uses a non-encounter authorization action.
--
-- Context isolation: patient_ref, organization_ref, started_by_ref, and
-- sender_ref are soft UUID references — NO cross-context foreign keys. The only
-- foreign key is intra-schema (message -> thread).
--
-- PHI discipline: the thread subject and every message body may carry clinical
-- narrative and live ONLY in this access-controlled store. Canonical messaging
-- events carry the thread / message / actor references and non-clinical metadata
-- (sender role, operational status) only — never the subject or the body.

CREATE SCHEMA IF NOT EXISTS nelyo_messaging;

CREATE TABLE nelyo_messaging.message_thread (
  thread_id UUID PRIMARY KEY,
  patient_ref UUID NOT NULL,
  organization_ref UUID NOT NULL,
  -- May reveal a condition; access-controlled; never copied into events.
  subject TEXT,
  status TEXT NOT NULL CHECK (status IN ('open', 'closed')),
  started_by_ref UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE nelyo_messaging.message (
  message_id UUID PRIMARY KEY,
  thread_ref UUID NOT NULL
    REFERENCES nelyo_messaging.message_thread (thread_id) ON DELETE CASCADE,
  sender_ref UUID NOT NULL,
  sender_role TEXT NOT NULL,
  -- Message body; access-controlled; never copied into events or audit detail.
  body TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL,
  read_at TIMESTAMPTZ,
  read_by_ref UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- A patient's threads (the decision subject), most-recently-active first.
CREATE INDEX message_thread_patient_org_idx
  ON nelyo_messaging.message_thread (patient_ref, organization_ref, updated_at DESC);

-- Messages within a thread, oldest first.
CREATE INDEX message_thread_ref_idx
  ON nelyo_messaging.message (thread_ref, sent_at ASC);
