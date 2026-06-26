# TestFlight Deployment

EAS is configured in `eas.json`. Complete these steps once to ship to TestFlight.

## 1. Expo account

```bash
npm install -g eas-cli
eas login
eas init
```

`eas init` links this repo to an Expo project and writes the `projectId` into `app.config.ts`.

## 2. Supabase

1. Create a Supabase project (or use an existing one).
2. Copy `.env.example` → `.env` and add your URL + anon key.
3. Apply the migration in `supabase/migrations/20260624150000_initial_schema.sql` via the Supabase SQL editor or CLI.

## 3. Apple Developer

- Enroll in the [Apple Developer Program](https://developer.apple.com/programs/) ($99/year).
- Update `eas.json` → `submit.production.ios` with your Apple ID, App Store Connect app ID, and team ID.

## 4. Build & submit

```bash
npm run build:ios:preview    # internal TestFlight build
npm run submit:ios           # upload to App Store Connect
```

Or in one step after configuring credentials:

```bash
eas build --profile preview --platform ios --auto-submit
```

## 5. Verify on device

Install via TestFlight on a physical iPhone. Confirm:

- Sign up / sign in
- Complete onboarding intake
- Today's Plan loads after intake
- Habits log and show 7-day history
- Push notification permission prompt appears
- Profile settings save and reschedule reminders

## Local iOS Simulator (no EAS)

```bash
npm install
cp .env.example .env   # add Supabase keys
npx expo start
# press i for iOS Simulator
```
