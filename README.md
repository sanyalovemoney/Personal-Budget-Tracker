# BudgetFlow — Personal Budget Tracker

A web app for tracking personal finances: income and expenses by category, monthly budget limits, analytics and spend forecasting, CSV export. It runs either fully locally (LocalStorage, no sign-up) or with cloud sync through Firebase.

The user interface is in Ukrainian.

## Features

- Add, edit and delete income and expense records
- Filter by month, type and category, plus full-text search over notes
- Monthly limits across 8 categories with an over-budget indicator
- Charts: daily income/expense trend and expense breakdown by category
- End-of-month spend forecast based on the current pace
- USD / EUR / UAH switcher with real amount conversion
- Dark mode, persisted between sessions
- CSV export (UTF-8 BOM, with spreadsheet formula injection neutralized)
- Responsive layout down to 390px

## Stack

React 19, Vite 8, Tailwind CSS 4, Chart.js (react-chartjs-2), Firebase 12 (Auth + Firestore), date-fns, lucide-react, Oxlint.

## Getting started

Requires Node.js 20+ (verified on 24).

```bash
npm install
npm run dev
```

Vite prints the local address (http://localhost:5173 by default) — open it in a browser and keep the terminal running.

Other commands:

```bash
npm run build     # production build into dist/
npm run preview   # serve the built bundle locally
npm run lint      # Oxlint
```

## Runtime modes

**Demo mode (default).** With no `.env` file, Firebase is never initialized and all data is kept in the browser's LocalStorage under a guest profile. Nothing needs to be configured.

**Cloud mode.** When Firebase keys are present in `.env`, email/password and Google sign-in become available and transactions and budgets sync to Cloud Firestore. Signing out returns the app to the guest LocalStorage data — account data and guest data are never mixed.

### Firebase setup

1. Create a project in the [Firebase Console](https://console.firebase.google.com/) and register a web app.
2. Enable **Authentication → Sign-in method → Email/Password** (and Google, if you want Google sign-in).
3. Create a **Cloud Firestore** database.
4. Copy `.env.example` to `.env` and fill in the values from the web app settings:

```bash
cp .env.example .env
```

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

`.env` is gitignored. Restart `npm run dev` after changing any variable.

User data is stored under `users/{uid}/transactions` and `users/{uid}/budgets`, so Firestore rules should grant access to the owner only:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Currencies

Amounts are stored in the base currency (USD) and converted only for display and input. Rates are hardcoded in `src/utils/currency.js` (`EXCHANGE_RATES`, with the date in `RATES_UPDATED_AT`) — update that file or wire in an external rates API to change them.

## Project structure

```
src/
  components/
    analytics/   charts and forecasts
    auth/        sign-in / sign-up modal
    budgets/     limit cards and their editor
    expenses/    transaction form, list and rows
    layout/      navbar and page shell
    ui/          Button, Card, Modal, Badge, Alert
  context/       AuthContext, BudgetContext (state, sync, CRUD)
  config/        Firebase initialization
  utils/         categories, currency conversion, formatters, CSV export
  App.jsx        dashboard and modal orchestration
```

## Default categories

Groceries (400), Housing & Utilities (600), Transport & Fuel (150), Entertainment (200), Health & Pharmacy (100), Education & Books (150), Clothing & Shopping (250), Other (100). Limits are in USD; a category without an explicit limit falls back to its default.
