-- Rollback laboratory persistence (roadmap M5.6).
DROP TABLE IF EXISTS nelyo_laboratory.lab_result_observation;
DROP TABLE IF EXISTS nelyo_laboratory.lab_order;
DROP SCHEMA IF EXISTS nelyo_laboratory;
