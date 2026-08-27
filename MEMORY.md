# Project Memory

## Product Decisions

- The app is a personal Android PWA for recording meal expenses as quickly as possible.
- The primary flow is open, enter amount, save; amount is the only required input.
- Date defaults to today. Meal type and note are optional secondary fields.
- Data stays on the device. There is no account, backend, cloud sync, analytics, or tracking.
- Portability is provided by JSON backup/merge restore and CSV export.
- The app will be deployed as a static site with GitHub Pages.

## Technical Decisions

- Use Vanilla TypeScript, Vite, native CSS, localStorage, a Web App Manifest, and a manual service worker.
- Store currency amounts as integer cents and default the UI to CNY.
- Use relative asset paths so the app works under a GitHub Pages repository subpath.
- The canonical project path is `D:\Codex\projects\meal-ledger`.

## Verification Baseline

- Run type checking, focused domain tests, and a production build before delivery.
- Verify the rendered app at an Android-sized viewport and test the primary interaction flow.

## Verified Environment

- On 2026-08-27, the project built with Node 24.19.0, npm 11.17.0, Vite 8.2.2, and TypeScript 7.0.2.
- The 390 x 844 browser QA covered add, edit, invalid amount rejection, history, settings, persistence after reload, and all three primary screen layouts.
- The GitHub Pages workflow follows the current official action majors: checkout v6, setup-node v6, configure-pages v5, upload-pages-artifact v4, and deploy-pages v4.

## Deployment

- The public repository is `https://github.com/KQ-KUN/meal-ledger` with `main` as the default branch.
- The live app is `https://kq-kun.github.io/meal-ledger/` and GitHub Pages uses the repository workflow.
- The first successful deployment was workflow run `33060680168` on 2026-08-27.
