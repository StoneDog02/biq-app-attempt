---
name: Phase 4 Care Base
overview: "Add Phase 4 Commerce & Telehealth as a Care tab (6 tabs total): supplement daily check-in, Today's Plan integration, and lightweight sub-routes for shop catalog, patient portal, telehealth, and longevity labs—static/mock data first, real Shopify/CareValidate/storage deferred."
todos:
  - id: phase-4-docs
    content: Mirror plan to docs/plans/phase-4-care.md; update README index + bodyiq-roadmap.mdc
    status: completed
  - id: phase-4a-schema
    content: Supabase migration for supplement_logs + lab_reports tables + RLS
    status: pending
  - id: phase-4a-services
    content: Add supplementPlanner.ts, care.ts, useCare.ts; update seedDailyPlan
    status: pending
  - id: phase-4a-tab
    content: Care tab + Level 1 check-in + Level 2 quick log UI
    status: pending
  - id: phase-4a-today
    content: Today's Plan supplements status chip + mark supplements complete on check-in
    status: pending
  - id: phase-4-stack
    content: app/care/ stack with back button; wire links from Care tab
    status: pending
  - id: phase-4b-shop
    content: Static products JSON + shop list + product/[id] detail with checkout stub
    status: pending
  - id: phase-4c-portal
    content: Mock portal data + portal screen (plan, Rx, subscriptions, history)
    status: pending
  - id: phase-4d-telehealth
    content: Telehealth intro screen + links to shop + CareValidate stub CTA
    status: pending
  - id: phase-4e-labs
    content: Labs list + lab/[id] report view + upload UI stub; mock report seed
    status: pending
  - id: phase-4-journal
    content: Journal entry for Phase 4 care base layout
    status: pending
isProject: false
---

# Phase 4 — Care Base Layout

## Recommendation

**Phase 4 — Commerce & Telehealth** per the [master roadmap](bodyiq-mobile-app.md): a **Care tab** (6 tabs) mirroring Nutrition and Fitness.

| Domain | Tab | Logging | Today's Plan | Sub-routes |
|--------|-----|---------|--------------|------------|
| Nutrition (done) | Nutrition | `food_logs` | Meals + chip | scan, meal-plan, photo, voice |
| Fitness (done) | Fitness | `workout_logs` | Workout + chip | programs, exercises, recovery |
| **Care (next)** | **Care** | **`supplement_logs`** | **Supplements + chip** | **shop, portal, telehealth, labs** |

**Guiding principle:** default to a one-tap supplement check-in; shop, portal, telehealth, and labs are opt-in paths surfaced only when relevant.

---

## Phase 4a — Foundation

- Care tab + `supplement_logs` migration
- Level 1 check-in; Level 2 quick log at `tracking_level >= 2`
- Services: `care.ts`, `useCare.ts`, `supplementPlanner.ts`
- Today's Plan supplements status chip

## Phase 4b — Shop catalog

- Static products JSON; shop list + product detail with checkout stub

## Phase 4c — Patient portal

- Mock portal data; plan, Rx, subscriptions, service history sections

## Phase 4d — Telehealth

- Intro screen + shop links + CareValidate stub CTA

## Phase 4e — Longevity Report

- `lab_reports` migration; labs list + report detail + upload stub

## Not in this sprint

Shopify Storefront API, CareValidate checkout, Edge Functions, real cart/checkout, PDF lab parsing, live patient portal data.

## Nav update (06/25/2026)

Care removed from the tab bar (5 tabs). Supplement check-in and care sub-routes are reachable via **Profile → Care & wellness** and **Today's Plan → Log supplements**. Hidden route: `app/(tabs)/care.tsx` (`href: null`).
