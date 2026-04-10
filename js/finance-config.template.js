// ─────────────────────────────────────────────────────────────────────
// APP CONFIG  —  copy this file to finance-config.js (gitignored)
//
// Setup:
//   1. cp js/finance-config.template.js js/finance-config.js
//   2. Fill in every value below
//   3. Deploy google-apps-script.js as a Google Apps Script Web App
//   4. Generate a token:  openssl rand -hex 32
//   5. Paste the same token into Apps Script → VALID_TOKEN and here → token
// ─────────────────────────────────────────────────────────────────────
window.APP_CONFIG = {

  // ── Google Apps Script (finance + sync) ──────────────────────────
  appsScriptUrl: 'YOUR_APPS_SCRIPT_DEPLOYMENT_URL',
  token:         'YOUR_64_HEX_TOKEN',            // openssl rand -hex 32

  // ── Running goals ─────────────────────────────────────────────────
  yearlyGoalKm:  500,
  raceDate:      '2026-05-10',                   // YYYY-MM-DD
  raceName:      'May 10 — 21km @ 6:45 /km',

  // ── Finance ───────────────────────────────────────────────────────
  dailyBudgetVnd: 350_000,

};
