-- Weekly reviews keep only the user's written reflection. Every numeric metric
-- (averages, totals, changes) is derived from daily_logs on read, so it is no
-- longer stored here to avoid duplication and staleness.

ALTER TABLE weekly_reviews
    DROP COLUMN avg_weight,
    DROP COLUMN weight_change,
    DROP COLUMN avg_sleep_hours,
    DROP COLUMN avg_steps,
    DROP COLUMN training_cnt,
    DROP COLUMN days_without_overeating,
    DROP COLUMN avg_energy_level,
    DROP COLUMN avg_stress_level,
    DROP COLUMN avg_mood_level,
    DROP COLUMN avg_calories;

ALTER TABLE weekly_reviews RENAME COLUMN biggest_problem TO biggest_challenge;

ALTER TABLE weekly_reviews
    ADD COLUMN main_trigger_note TEXT,
    ADD COLUMN notes TEXT;
