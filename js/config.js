// ── App-wide constants ─────────────────────────────────────────────
export const YEARLY_GOAL_KM = 500;
export const RACE_DATE      = new Date('2026-05-10');

export const STORAGE_KEYS = {
    runs:          'lumi_runs',
    calendar:      'lumi_calendar',
    darkMode:      'monk_dark_mode',
    financeCache:  'lumi_finance_cache',
};

// ── Finance ────────────────────────────────────────────────────────
// Change BOT_URL when switching from ngrok to Mac mini local IP
export const BOT_URL          = 'https://anastacia-inobservant-penicillately.ngrok-free.dev';
export const DAILY_BUDGET_VND = 350_000;
export const WEEKLY_BUDGET_VND = DAILY_BUDGET_VND * 7;   // 2,450,000đ
