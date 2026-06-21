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

- id
- user_id
- period_start_date
- period_end_date
- weight
- waist
- chest
- neck
- biceps_left
- biceps_right
- thigh_left
- thigh_right
- confidence_level
- self_satisfaction_level
- food_control_level
- notes
- created_at
- updated_at

