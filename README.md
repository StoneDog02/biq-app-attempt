# BODYiQ Mobile App

Wellness mobile app for BODYiQ — Expo (React Native) + TypeScript + Supabase.

## Prerequisites

- Node.js 20+ (`node -v`)
- Xcode (iOS Simulator)
- [Expo account](https://expo.dev) (for EAS builds)
- [Supabase project](https://supabase.com) with migrations applied

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment variables**

   Copy `.env.example` to `.env` and add your Supabase credentials:

   ```bash
   cp .env.example .env
   ```

   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Apply database migrations**

   ```bash
   npx supabase db push
   ```

   Or run the SQL in `supabase/migrations/20260624150000_initial_schema.sql` via the Supabase dashboard.

4. **Start the dev server**

   ```bash
   npx expo start
   ```

   Press `i` for iOS Simulator.

## Project structure

```
app/           Expo Router screens (auth, onboarding, tabs)
src/           Components, hooks, services, theme, types
supabase/      Migrations and Edge Functions
docs/plans/    Version-controlled build plans (Phases 0–5)
Journal/       Daily development diary
.cursor/rules/ Agent context rules
```

## Documentation

- **[Build plans](docs/plans/)** — phased roadmap and sprint plans (master: `bodyiq-mobile-app.md`, active: `phase-2-nutrition.md`)
- **[Journal](Journal/)** — daily dev diary of work completed

## EAS Build (TestFlight)

```bash
npm install -g eas-cli
eas login
eas init          # links project and sets projectId in app.config.ts
eas build --profile preview --platform ios
eas submit --platform ios
```

Update `eas.json` submit section with your Apple ID and team details before submitting.

## Phase 1 features

- Email/password auth
- 15+ minute onboarding intake with save/resume
- Engagement tiers and reminder presets
- Today's Plan dashboard
- Habit tracking (water, steps, stretching)
- Local push notification scheduling

## Design

Black (`#0A0A0A`), white, copper accent (`#C37663`) — matching [bodyiq.com](https://bodyiq.com).
