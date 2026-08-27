# Project Instructions

## Communication

- Communicate with the user in Chinese.
- Keep code, comments, file names, commits, README files, and technical docs in English.
- Chinese UI copy is allowed because the product targets a Chinese user.

## Product Scope

- This is a single-user Android PWA for quickly recording meal expenses.
- The primary flow is: open the app, enter an amount, save.
- Store all expense data locally. Do not add accounts, a backend, cloud sync, analytics, or trackers.
- JSON backup/restore and CSV export are the only portability features in v1.

## Engineering

- Follow `docs/spec.md` as the source of truth.
- Use strict TypeScript and native browser features before adding dependencies.
- Represent money as integer cents.
- Validate imported data before it can affect stored data.
- Keep changes minimal and verify type checking, tests, build output, and rendered mobile UI.

## Repository

- The canonical project path is `D:\Codex\projects\meal-ledger`.
- Never commit generated user expense data or secrets.
- Keep GitHub Pages deployment reproducible from the repository.
