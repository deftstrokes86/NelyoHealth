import type { ClientBase } from "pg";

/**
 * Document repository (roadmap M5.8 — Documents).
 *
 * Owns SQL for the document-metadata resource in nelyo_document. Client-
 * parameterized so callers control the transaction boundary: mutations run inside
 * the transactional-command path (state + outbox + audit in one transaction).
 *
 * The title and storage_key are loaded here for the access-controlled record but
 * the api layer keeps them out of events and audit — the storage_key is a pointer
 * to protected bytes and is only surfaced on an authorized read.
 */

export type DocumentType =
  | "clinical-note"
  | "lab-report"
  | "imaging"
  | "consent-form"
  | "referral-letter"
  | "insurance-card"
  | "other";
export type DocumentStatus = "active" | "archived";

export interface PersistedDocument {
  documentId: string;
  patientRef: string;
  organizationRef: string;
  uploadedByRef: string;
  documentType: DocumentType;
  title: string;
  storageKey: string;
  contentType: string;
  sizeBytes?: number;
  status: DocumentStatus;
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentRow {
  document_id: string;
  patient_ref: string;
  organization_ref: string;
  uploaded_by_ref: string;
  document_type: DocumentType;
  title: string;
  storage_key: string;
  content_type: string;
  size_bytes: string | number | null;
  status: DocumentStatus;
  uploaded_at: string | Date;
  created_at: string | Date;
  updated_at: string | Date;
}

function toIso(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

const DOCUMENT_COLUMNS =
  "document_id, patient_ref, organization_ref, uploaded_by_ref, document_type, title, storage_key, " +
  "content_type, size_bytes, status, uploaded_at, created_at, updated_at";

function mapDocument(row: DocumentRow): PersistedDocument {
  return {
    documentId: row.document_id,
    patientRef: row.patient_ref,
    organizationRef: row.organization_ref,
    uploadedByRef: row.uploaded_by_ref,
    documentType: row.document_type,
    title: row.title,
    storageKey: row.storage_key,
    contentType: row.content_type,
    sizeBytes: row.size_bytes === null ? undefined : Number(row.size_bytes),
    status: row.status,
    uploadedAt: toIso(row.uploaded_at),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at)
  };
}

// ---------- Mutations (run inside the transactional command) ----------

export async function insertDocument(
  client: ClientBase,
  input: {
    documentId: string;
    patientRef: string;
    organizationRef: string;
    uploadedByRef: string;
    documentType: DocumentType;
    title: string;
    storageKey: string;
    contentType: string;
    sizeBytes?: number;
    uploadedAt: string;
    createdAt: string;
    updatedAt: string;
  }
): Promise<void> {
  await client.query(
    `INSERT INTO nelyo_document.document
       (document_id, patient_ref, organization_ref, uploaded_by_ref, document_type, title,
        storage_key, content_type, size_bytes, status, uploaded_at, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'active', $10, $11, $12)`,
    [
      input.documentId,
      input.patientRef,
      input.organizationRef,
      input.uploadedByRef,
      input.documentType,
      input.title,
      input.storageKey,
      input.contentType,
      input.sizeBytes ?? null,
      input.uploadedAt,
      input.createdAt,
      input.updatedAt
    ]
  );
}

export async function setDocumentStatus(
  client: ClientBase,
  input: { documentId: string; status: DocumentStatus; updatedAt: string }
): Promise<boolean> {
  const result = await client.query(
    `UPDATE nelyo_document.document SET status = $2, updated_at = $3 WHERE document_id = $1`,
    [input.documentId, input.status, input.updatedAt]
  );
  return (result.rowCount ?? 0) > 0;
}

// ---------- Reads ----------

export async function loadDocument(
  client: ClientBase,
  documentId: string
): Promise<PersistedDocument | null> {
  const result = await client.query<DocumentRow>(
    `SELECT ${DOCUMENT_COLUMNS} FROM nelyo_document.document WHERE document_id = $1`,
    [documentId]
  );
  const row = result.rows[0];
  return row ? mapDocument(row) : null;
}

export async function listDocumentsForPatient(
  client: ClientBase,
  input: { patientRef: string; organizationRef: string }
): Promise<PersistedDocument[]> {
  const result = await client.query<DocumentRow>(
    `SELECT ${DOCUMENT_COLUMNS} FROM nelyo_document.document
      WHERE patient_ref = $1 AND organization_ref = $2
      ORDER BY uploaded_at DESC`,
    [input.patientRef, input.organizationRef]
  );
  return result.rows.map(mapDocument);
}
