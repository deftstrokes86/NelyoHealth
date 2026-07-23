-- Rollback appointment persistence (roadmap M5.2).
DROP TABLE IF EXISTS nelyo_appointment.appointment;
DROP TABLE IF EXISTS nelyo_appointment.availability_slot;
DROP SCHEMA IF EXISTS nelyo_appointment;
