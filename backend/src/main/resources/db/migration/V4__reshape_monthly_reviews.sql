-- Reshape monthly_reviews: give measurements explicit units, add new body
-- measurements, mental-state scores, reflection prompts, and a completion stamp.

ALTER TABLE monthly_reviews RENAME COLUMN weight TO measured_weight_kg;
ALTER TABLE monthly_reviews RENAME COLUMN waist TO waist_cm;
ALTER TABLE monthly_reviews RENAME COLUMN chest TO chest_cm;
ALTER TABLE monthly_reviews RENAME COLUMN neck TO neck_cm;
ALTER TABLE monthly_reviews RENAME COLUMN biceps_left TO biceps_left_cm;
ALTER TABLE monthly_reviews RENAME COLUMN biceps_right TO biceps_right_cm;
ALTER TABLE monthly_reviews RENAME COLUMN thigh_left TO thigh_left_cm;
ALTER TABLE monthly_reviews RENAME COLUMN thigh_right TO thigh_right_cm;

ALTER TABLE monthly_reviews
    ADD COLUMN completed_at          TIMESTAMPTZ,
    ADD COLUMN hips_cm               NUMERIC(5, 2),
    ADD COLUMN energy_level          SMALLINT,
    ADD COLUMN stress_level          SMALLINT,
    ADD COLUMN craving_control_level SMALLINT,
    ADD COLUMN what_improved         TEXT,
    ADD COLUMN biggest_obstacle      TEXT,
    ADD COLUMN proudest_moment       TEXT,
    ADD COLUMN noticed_pattern       TEXT,
    ADD COLUMN next_month_focus      TEXT;

-- A review now spans an explicit period; uniqueness covers both bounds.
ALTER TABLE monthly_reviews DROP CONSTRAINT uq_monthly_reviews_user_period;
ALTER TABLE monthly_reviews
    ADD CONSTRAINT uq_monthly_reviews_user_period
        UNIQUE (user_id, period_start_date, period_end_date);
