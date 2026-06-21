# Entities

## users

- id
- email
- password_hash
- name
- created_at

## daily_logs

- id
- user_id
- log_date
- weight
- sleeping_hours
- steps
- training_completed
- protein_grams
- calories
- water_liters
- overeating
- trigger_type
- resisted_trigger
- energy_level
- stress_level
- mood_level
- notes

## weekly_reviews

Only the user's written reflection is stored; all numeric metrics are derived
from daily_logs on read.

- id
- user_id
- week_start_date
- week_end_date
- what_went_well
- biggest_challenge
- main_trigger_note
- next_week_focus
- notes
- created_at
- updated_at

## monthly_reviews

Unique on (user_id, period_start_date, period_end_date).

- id
- user_id
- period_start_date
- period_end_date
- completed_at

Body measurements:

- measured_weight_kg
- waist_cm
- chest_cm
- neck_cm
- hips_cm
- biceps_left_cm
- biceps_right_cm
- thigh_left_cm
- thigh_right_cm

Mental state:

- confidence_level
- self_satisfaction_level
- food_control_level
- energy_level
- stress_level
- craving_control_level

Reflection:

- what_improved
- biggest_obstacle
- proudest_moment
- noticed_pattern
- next_month_focus
- notes

Audit:

- created_at
- updated_at

