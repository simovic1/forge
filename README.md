# FORGE

FORGE is a behavior-based fitness tracking application focused on long-term weight loss, habit building, and self-awareness.

Most fitness apps focus only on calories, workouts, or the number on the scale. Momentum connects daily behavior with physical and mental progress by tracking weight, sleep, steps, training, nutrition, stress, mood, emotional eating, and monthly body measurements.

## Goal

The goal is to help users understand why progress succeeds or stalls, build consistency, and create a sustainable lifestyle instead of relying only on motivation.

## MVP Scope

### Included in V1

- User registration and login
- Daily log tracking
- Weekly review
- Monthly review
- Dashboard summary
- Progress charts
- PostgreSQL persistence
- REST API

### Excluded from V1

- Recipe management
- Food database
- MyFitnessPal integration
- AI coach
- Payments
- Social features

## Tech Stack

### Backend

- Java 21
- Spring Boot 3
- Spring Security
- PostgreSQL
- Flyway
- Maven
- Docker

### Web

- Next.js
- TypeScript
- Tailwind CSS
- Recharts

### Mobile

- React Native
- Expo
- TypeScript

## Project Structure

```
momentum/
├── backend/
├── web/
├── mobile/
├── docs/
└── docker-compose.yml
```

## Core Domain
- User
- DailyLog
- WeeklyReview
- MonthlyReview

Daily logs are the source of truth. Weekly and monthly reviews are calculated from daily data and enrighed with user reflection.

## Local Development

Comming soon.

## Roadmap

### Sprint 1
- Monorepo setup
- Spring Boot backend
- PostgreSQL
- Flyway
- Docker Compose
- Health endpoint
- User entity

### Sprint 2
- Authentication
- Daily Log API

### Sprint 3
- Weekly Review
- Monthly Review

### Sprint 4
- Dashboard and charts

## Status
Early development

