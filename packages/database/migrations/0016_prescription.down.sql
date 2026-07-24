-- Rollback prescription persistence (roadmap M5.5).
DROP TABLE IF EXISTS nelyo_prescription.prescription_dispense;
DROP TABLE IF EXISTS nelyo_prescription.prescription;
DROP SCHEMA IF EXISTS nelyo_prescription;
