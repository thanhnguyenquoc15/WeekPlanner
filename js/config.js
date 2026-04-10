// ── Runtime config (from js/finance-config.js, gitignored) ────────
const _c = window.APP_CONFIG || window.FINANCE_CONFIG || {};

// ── Running goals ──────────────────────────────────────────────────
export const YEARLY_GOAL_KM = _c.yearlyGoalKm  ?? 500;
export const RACE_DATE      = new Date(_c.raceDate ?? '2026-05-10');
export const RACE_NAME      = _c.raceName      ?? 'May 10 — 21km @ 6:45 /km';

// ── Identity pillars ───────────────────────────────────────────────
export const IDENTITY_META = {
    Runner:    { icon: 'fa-running',      color: '#22c55e', bg: 'rgba(34,197,94,.13)'   },
    Reader:    { icon: 'fa-book-open',    color: '#f59e0b', bg: 'rgba(245,158,11,.13)'  },
    Engineer:  { icon: 'fa-laptop-code',  color: '#3b82f6', bg: 'rgba(59,130,246,.13)'  },
    Explorer:  { icon: 'fa-compass',      color: '#14b8a6', bg: 'rgba(20,184,166,.13)'  },
    Healthy:   { icon: 'fa-heartbeat',    color: '#ef4444', bg: 'rgba(239,68,68,.13)'   },
    Wealthy:   { icon: 'fa-coins',        color: '#eab308', bg: 'rgba(234,179,8,.13)'   },
    Motivator: { icon: 'fa-fire',         color: '#a855f7', bg: 'rgba(168,85,247,.13)'  },
    Player:    { icon: 'fa-gamepad',      color: '#6366f1', bg: 'rgba(99,102,241,.13)'  },
};

export const STORAGE_KEYS = {
    runs:          'lumi_runs',
    calendar:      'lumi_calendar',
    darkMode:      'monk_dark_mode',
    financeCache:  'lumi_finance_cache',
    goalProgress:  'monk_goal_progress',
    activityNotes: 'monk_activity_notes',
};

// ── Finance ────────────────────────────────────────────────────────
export const DAILY_BUDGET_VND  = _c.dailyBudgetVnd ?? 350_000;
export const WEEKLY_BUDGET_VND = DAILY_BUDGET_VND * 7;
