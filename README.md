# Meal Ledger

A local-first Android PWA for recording meal expenses with the shortest possible flow: open, enter an amount, save.

## Features

- Fast amount-first entry with optional date, meal type, and note
- Exact daily and monthly totals using integer cents
- History, edit, and delete
- JSON backup and validated merge restore
- Excel-compatible CSV export
- Installable and offline-capable PWA
- Automated GitHub Pages deployment

All expense data stays in the browser's local storage. The repository and GitHub Pages deployment never receive user records.

## Development

```bash
npm install
npm run dev
```

Run the checks:

```bash
npm test
npm run typecheck
npm run build
```

## GitHub Pages

1. Push the repository to GitHub with `main` as the default branch.
2. Open **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push to `main` or run the deployment workflow manually.

The Vite build uses relative asset paths, so it works from a repository subpath such as `https://username.github.io/meal-ledger/`.

## Android Installation

Open the deployed site in Chrome, then use the install prompt or choose **Add to Home screen** from the Chrome menu.

## Data Safety

Browser storage can be cleared by uninstalling the app/browser, clearing site data, resetting the device, or changing the site's origin. Export a JSON backup before any of those actions.
