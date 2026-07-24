-- Rollback secure messaging persistence (roadmap M5.7).
DROP TABLE IF EXISTS nelyo_messaging.message;
DROP TABLE IF EXISTS nelyo_messaging.message_thread;
DROP SCHEMA IF EXISTS nelyo_messaging;
