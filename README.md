# WiseZebra Math Adaptive Assessment and Practice System

A GitHub-ready demo codebase for a web-based math diagnostic and practice system for Grades 1 to 6, plus a Grade 6 bridge and prealgebra transition using the official WZ 1 to WZ 15 progression.

## Version 1 scope

- **Student side**
  - Guest mode only
  - Student name required before starting
  - Optional parent email
  - Child-friendly interface
  - Rule-based adaptive diagnostic
  - Student result page with level, strengths, support areas, and next practice
  - Paid personalized practice offers after diagnostic
    - **$0.99** for 1 generated practice set
    - **$2.99** for 5 generated practice sets (one workweek)
- **Teacher/admin side**
  - Teacher-facing internal report separated from student view
  - Teacher report routed to **wisezebrami@gmail.com**
  - Admin-only dashboard preview
  - Question bank with rich tags and filters
  - Session, profile, practice, and packet management structure
  - Teacher packet template with answers, explanations, common errors, hints, and teaching notes
- **Backend**
  - Supabase schema and seed data
  - Core adaptive engine logic in TypeScript

## Tech stack

- **Frontend**: Next.js App Router + TypeScript
- **Backend**: Supabase
- **Email**: Resend-ready template layer

## Project structure

```text
app/
  admin/
  student/
components/
emails/
lib/
  adaptive-engine.ts
  mock-data.ts
  supabase.ts
supabase/
  migrations/
  seed/
types/
```

## Minimum database tables

- `questions`
- `question_tags`
- `student_sessions`
- `session_answers`
- `session_profiles`
- `practice_sets`
- `practice_items`
- `teacher_packets`
- `admin_users`

## Local run instructions

1. Copy `.env.example` to `.env.local`
2. Add your Supabase and Resend credentials
3. Install packages
   ```bash
   npm install
   ```
4. Run the app
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000`

## Supabase setup

Run the SQL files in order:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/seed/seed.sql`

## Adaptive engine logic summary

- Start near the middle WZ range by domain
- Track **confidence by domain**
- Move **up after repeated success**
- Move **down after repeated struggle**
- Stop when confidence is strong enough across domains or max question count is reached
- Generate practice with a **60 / 25 / 15** current-review-challenge mix

## What is included now

- Full project structure
- Database schema
- Seed data
- Demo student workflow pages
- Demo student practice pricing page
- Demo teacher report page
- Demo admin dashboard pages
- Adaptive engine starter logic
- Teacher packet template
- API routes for diagnostic completion, practice generation, and teacher email sending
- GitHub-ready README

## Real data and email flow shape

Current route structure:

- `POST /api/diagnostic/complete`
  - creates a student session
  - creates a session profile
  - prepares a teacher packet
  - sends the teacher version to `wisezebrami@gmail.com`
- `POST /api/practice/purchase`
  - creates practice set records
  - supports `single` and `weekly` package types
- `POST /api/teacher/send`
  - sends or simulates a teacher packet email

If `RESEND_API_KEY` is not configured, email sending is safely simulated for development.

## What to build next

- Real authentication for admin users
- Real server actions and Supabase CRUD wiring
- Actual assessment state persistence
- Packet email sending integration
- Stronger question bank coverage across all WZ levels and skills
- Analytics and reporting
