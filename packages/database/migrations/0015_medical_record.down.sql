-- Rollback medical record persistence (roadmap M5.4).
DROP TABLE IF EXISTS nelyo_medical_record.medical_record_entry;
DROP TABLE IF EXISTS nelyo_medical_record.medical_record;
DROP FUNCTION IF EXISTS nelyo_medical_record.reject_clinical_content_change();
DROP SCHEMA IF EXISTS nelyo_medical_record;
