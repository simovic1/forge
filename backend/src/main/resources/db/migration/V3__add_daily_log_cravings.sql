-- Craving tracking on daily logs: an intensity score (1–10), the food craved,
-- and whether the user resisted it.
ALTER TABLE daily_logs
    ADD COLUMN craving_level    SMALLINT,
    ADD COLUMN craved_food      TEXT,
    ADD COLUMN resisted_craving BOOLEAN;
