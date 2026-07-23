-- Rollback patient profile persistence (roadmap M5.1).
DROP TABLE IF EXISTS nelyo_patient.patient_identifier;
DROP TABLE IF EXISTS nelyo_patient.patient_profile;
DROP SCHEMA IF EXISTS nelyo_patient;
