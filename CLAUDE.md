# CLAUDE.md — WeekPlanner / Monk Mode

## What this project is
A personal life dashboard hosted locally (file:// or simple HTTP). Two pages:
- `index.html` — weekly planner, habits, running tracker, nutrition/menu
- `finance.html` — financial dashboard (budget, spending, net worth, DCA simulator)

No build step, no bundler. Plain HTML + Tailwind CDN + Chart.js CDN + vanilla JS modules.

---

## Architecture

### Frontend
- **Tailwind CSS** via CDN. Dark mode config must be set as `window.tailwind = { config: { darkMode: 'class' } }` BEFORE the CDN script tag. Never use `tailwind.config = ...` (throws ReferenceError). Never use `@apply` in `<style>` tags (doesn't work with CDN).
- **Chart.js v4** + `chartjs-plugin-annotation@3` via CDN.
- **JS modules** (`type="module"`) for `index.html`. `finance-app.js` is a plain script (non-module).
- Shared CSS in `css/style.css`. Key classes: `.planner-card`, `.app-tab-btn`, `.cal-row`, `.habit-row`.

### Backend — Google Apps Script
- File: `google-apps-script.js` — deploy as Web App (Execute as: Me, Anyone can access).
- Current deployment URL stored in `js/finance-app.js` → `APPS_SCRIPT_URL`.
- **CORS is bypassed via JSONP**: browser injects `<script>` tag with `?callback=fnName`, Apps Script wraps response as `fnName({...})`.
- `SpreadsheetApp.getActiveSpreadsheet()` — script must be deployed FROM the correct spreadsheet.

### Google Sheet
- Sheet ID: `1CiqGXiSISyLr9WHShaiJ-OWIeNLnwWOkOi8NwbJPg4c`
- Tabs: `Budget Config`, `Transactions`, `Assets`, `Liabilities`, `Loans Given`
- Service account credentials: `/Users/thanhnguyenquoc/.openclaw/workspace/spend-less-bot/credentials.json`

---

## Known gotchas

### Date/month_key stored as Date objects in Sheets
When Apps Script writes strings like `'2026-04-10'` or `'2026-04'` to cells via `setValues()`, Google Sheets auto-converts them to Date objects. Reading back with `getValues()` returns JavaScript Date objects, not strings.
- **Fix**: always use `extractDateKey(val)` and `extractMonthKey(val)` helpers (in `google-apps-script.js`) when reading date/month columns from the Transactions sheet.
- `extractDateKey`: handles both Date objects and strings → returns `YYYY-MM-DD`
- `extractMonthKey`: handles both Date objects and strings → returns `YYYY-MM`

### Transactions sheet column layout (0-indexed)
```
0:id  1:date  2:source  3:category  4:sub_category  5:description
6:type  7:amount  8:ref  9:fee  10:bucket_id  11:tags
12:is_daily  13:confirmed  14:month_key
```
- Row 1 is the header — `getValues().slice(1)` skips it.
- `r[13]` (confirmed) and `r[14]` (month_key) are the key filter columns.

### Timezone mismatch
Apps Script runs on Google's servers (UTC). User is UTC+7. The `getOverview` function accepts a `today` parameter sent from the browser (`todayKey()`) to avoid server-side date being off by one day.

### Every code change requires a redeploy
Apps Script changes are NOT live until you:
1. Open the script editor
2. Deploy → Manage deployments → Edit → New version → Deploy

The deployment URL changes each time you do "New deployment" (not "Manage"). Always update `APPS_SCRIPT_URL` in `finance-app.js` when the URL changes.

### JSONP vs fetch
`fetch()` fails with CORS. Only JSONP works. The `api()` function in `finance-app.js` handles this — it creates a unique callback name, injects a `<script>` tag, waits for callback, cleans up. 20s timeout.

### Promise.all fragility
`loadAll()` was previously using `Promise.all` for overview+trend+networth. Now restructured: overview is awaited first (blocking), trend and networth are fired independently with `.catch()`. If trend/networth fail, the main dashboard still renders.

---

## Amount parsing (VND)
`parseUserAmount()` in `finance-app.js` handles:
- `150k` → 150,000
- `1.5tr` → 1,500,000
- `20tr` → 20,000,000
- `20.000.000` (vi-VN dots as thousands sep) → 20,000,000
- `20,000,000` → 20,000,000

---

## File map
```
index.html              — main planner page
finance.html            — financial dashboard page
google-apps-script.js   — Apps Script backend (deploy to Google)
css/style.css           — shared styles
js/main.js              — entry point for index.html
js/finance-app.js       — all finance page logic (single file, no modules)
js/config.js            — storage keys, constants
js/data.js              — loads week.yml / schedule data
js/habits.js            — habit tracking
js/nutrition.js         — meal / macro tracking
js/charts.js            — Chart.js wrappers for planner
js/ui.js                — dark mode, tabs, UI helpers
js/storage.js           — localStorage wrapper
data/week.yml           — weekly schedule data
data/runs.json          — running activity seed data
```

---

## Style conventions
- Brand purple: `#7542A8` (light) / `#a78bfa` (dark) — class `text-purple-brand`
- All pages: `container mx-auto p-4 sm:p-6 max-w-7xl`
- Cards: `planner-card` class
- Same MONK MODE header + tab nav on every page
- Dark mode default: on (saved to `localStorage` key `monk_dark_mode`)

---

## How Claude should work on this project

### 1. Plan First
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately — don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes — don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests — then resolve them
- Zero context switching required from the user

### Task Management
1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

### Core Principles
- **Simplicity First**: Make every change as simple as possible. Impact minimal code
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards
