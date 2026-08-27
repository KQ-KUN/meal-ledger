# Meal Ledger v1 Product and Technical Specification

## Problem

Recording a meal expense should be faster than opening a general accounting app and navigating through categories. The user needs a personal Android home-screen app that opens directly to the amount field and keeps all data on the device.

## Primary User Story

As the only user, I can open the installed app, enter a meal amount, and save it without navigating to another screen or completing optional fields.

## Scope

### Included

- Add an expense with an amount and today's date by default.
- Optionally set another date, meal type, and note.
- Show today's total, current month's total, and today's entries.
- Browse entries grouped by date.
- Edit and delete an entry.
- Export a complete JSON backup.
- Validate and merge a JSON backup.
- Export an Excel-compatible CSV file.
- Install from Android Chrome and launch in standalone mode.
- Continue to open and record expenses after the first successful online load.
- Deploy automatically to GitHub Pages from `main`.

### Excluded

- Accounts, authentication, backend storage, cloud sync, multi-user support.
- Budgets, reminders, charts, receipt scanning, bank integrations, analytics.
- App store packaging.

## Interaction Requirements

- The record screen is always the initial screen.
- The amount input is the dominant element and the only required field.
- Optional fields are hidden behind a disclosure control.
- Saving gives immediate visual feedback, clears the form, and keeps the user on the record screen.
- History and settings remain available without competing with the primary action.
- Destructive actions require confirmation.

## Data Model

```ts
type MealType = "breakfast" | "lunch" | "dinner" | "snack";

type Expense = {
  id: string;
  amountInCents: number;
  date: string;
  mealType?: MealType;
  note?: string;
  createdAt: string;
  updatedAt: string;
};
```

The storage key must be namespaced. Money is stored as integer cents. Dates use local `YYYY-MM-DD` values. Timestamps use ISO 8601 strings.

## Backup Contract

```ts
type Backup = {
  version: 1;
  exportedAt: string;
  expenses: Expense[];
};
```

An import must reject an unsupported version, malformed fields, invalid dates, non-positive amounts, and duplicate identifiers inside the imported file. A valid import merges records by identifier and keeps the record with the latest `updatedAt` timestamp.

## Technical Approach

- Vanilla TypeScript with strict compiler settings.
- Vite for local development and production builds.
- Native browser APIs and CSS; no UI framework.
- `localStorage` for the small personal dataset.
- A manual service worker for app-shell and runtime caching.
- Relative URLs for GitHub Pages repository-path compatibility.
- Node's built-in test runner for focused money and backup checks.

## Acceptance Criteria

1. On launch, the record screen is visible without navigation.
2. A valid amount can be saved with today's date and no optional fields.
3. Invalid, zero, negative, or over-precision amounts cannot be saved.
4. Totals remain exact and update after add, edit, delete, and import operations.
5. Records remain after reload and browser restart unless site storage is cleared.
6. JSON export followed by a cleared store and import restores every record.
7. Invalid JSON cannot change existing records.
8. CSV export contains a UTF-8 BOM and one row per record.
9. The production build uses relative asset paths and is deployable under a GitHub Pages subpath.
10. The manifest provides 192 px and 512 px icons and standalone display mode.
11. After one online load, the app shell and previously loaded assets remain available offline.
12. The primary Android-sized interface has no horizontal overflow and the save action remains easy to reach.

## Known Limitation

Local browser storage can be lost when the user clears site data, uninstalls the browser/app, resets the device, or changes origin. The product mitigates this with explicit JSON backup and CSV export, not cloud storage.
