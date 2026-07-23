-- Rollback break-glass persistence (roadmap M4.3).
DROP TABLE IF EXISTS nelyo_break_glass.break_glass_access;
DROP FUNCTION IF EXISTS nelyo_break_glass.reject_immutable_column_change();
DROP SCHEMA IF EXISTS nelyo_break_glass;
