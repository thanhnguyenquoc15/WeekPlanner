// ====================================================
// MONK MODE FINANCE — Google Apps Script
// ====================================================
// Setup:
//   1. Open your Google Sheet
//   2. Extensions → Apps Script
//   3. Paste this entire file (replace any existing code)
//   4. Deploy → New deployment → Web app
//      Execute as: Me
//      Who has access: Anyone
//   5. Copy the deployment URL
//   6. Paste it into js/finance-app.js as APPS_SCRIPT_URL
// ====================================================

const SS = SpreadsheetApp.getActiveSpreadsheet();

// ── Auth token ────────────────────────────────────────────────────────
// Set this to a secret token. Must match window.FINANCE_CONFIG.token in
// js/finance-config.js (gitignored — never commit that file).
// Generate one: openssl rand -hex 32
const VALID_TOKEN = 'REPLACE_WITH_YOUR_SECRET_TOKEN';

function doGet(e) {
  const p      = e.parameter || {};
  const action = (p.action || 'overview').toLowerCase();
  const rawCb  = p.callback || '';
  // Validate callback: strict alphanumeric + underscore, no $ or dots
  const cb = /^[A-Za-z_][A-Za-z0-9_]{0,64}$/.test(rawCb) ? rawCb : '';

  // ── Token auth ────────────────────────────────────────────────────
  if (p.token !== VALID_TOKEN) {
    const deny = JSON.stringify({ error: 'Unauthorized' });
    if (cb) return ContentService.createTextOutput(cb + '(' + deny + ')')
                   .setMimeType(ContentService.MimeType.JAVASCRIPT);
    return ContentService.createTextOutput(deny)
                   .setMimeType(ContentService.MimeType.JSON);
  }

  let result;

  try {
    switch (action) {
      case 'overview':   result = getOverview(p.month, p.today); break;
      case 'trend':      result = getMonthlyTrend();             break;
      case 'networth':   result = getNetWorth();                 break;
      case 'logspend':   result = logSpend(p);                   break;
      // ── Runs ──────────────────────────────────────────────────────
      case 'getruns':    result = getRuns();                      break;
      case 'addrun':     result = addRun(p);                      break;
      case 'deleterun':  result = deleteRun(p.id);                break;
      // ── Habits ────────────────────────────────────────────────────
      case 'gethabits':  result = getHabits();                    break;
      case 'sethabit':   result = setHabit(p.date, p.progress);   break;
      case 'debug':      result = debugSheets();                  break;
      default:           result = { error: 'Unknown action: ' + action };
    }
  } catch (err) {
    result = { error: err.message };
  }

  const json = JSON.stringify(result);

  // JSONP — wraps response so browser <script> tag can read it cross-origin
  if (cb) {
    return ContentService
      .createTextOutput(cb + '(' + json + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Overview: budget + spending for a given month ────────────────────
function getOverview(monthKey, todayStr) {
  if (!monthKey) {
    const now = new Date();
    monthKey = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
  }
  // Use browser-supplied today to avoid server timezone mismatch (e.g. UTC vs UTC+7)
  const todayKey = todayStr || fmtDate(new Date());

  const budgetSheet = SS.getSheetByName('Budget Config');
  const txSheet     = SS.getSheetByName('Transactions');
  if (!budgetSheet || !txSheet) {
    return { month: monthKey, total_allocated: 0, total_spent: 0, days_left: daysLeftInMonth(), buckets: [], days: [] };
  }

  const budgetRows = budgetSheet.getDataRange().getValues().slice(1);
  const txRows     = txSheet.getDataRange().getValues().slice(1);

  // Build buckets map for this month
  const buckets = {};
  for (const r of budgetRows) {
    if (String(r[0]) !== monthKey) continue;
    if (String(r[5]).toUpperCase() !== 'TRUE') continue;
    const id = String(r[1]);
    buckets[id] = {
      id,
      name:      String(r[2]),
      allocated: parseAmt(r[3]),
      daily_cap: parseAmt(r[4]) || null,
      spent:     0,
    };
  }

  // Daily totals map: dateKey → amount
  const dailyTotals = {};

  // Sum transactions by bucket + day
  for (const r of txRows) {
    if (r.length < 15) continue;
    if (String(r[13]).toUpperCase() !== 'TRUE') continue;  // N: confirmed
    if (extractMonthKey(r[14]) !== monthKey) continue;      // O: month_key (may be Date obj)
    const amount   = parseAmt(r[7]);                        // H: amount
    const bucketId = String(r[10]);                         // K: parent category
    const dateKey  = extractDateKey(r[1]);                  // B: date (may be Date obj)

    if (buckets[bucketId]) buckets[bucketId].spent += amount;
    if (dateKey) dailyTotals[dateKey] = (dailyTotals[dateKey] || 0) + amount;
  }

  // Build last-7-days array using browser-supplied today (avoids server TZ offset)
  const today = new Date(todayKey + 'T12:00:00');
  const days  = [];
  for (let i = 6; i >= 0; i--) {
    const d   = new Date(today);
    d.setDate(today.getDate() - i);
    const key = fmtDate(d);
    days.push({
      date:     key,
      label:    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()],
      spent:    Math.round(dailyTotals[key] || 0),
      is_today: i === 0,
    });
  }

  const bArr         = Object.values(buckets);
  const totalAlloc   = bArr.reduce((s, b) => s + b.allocated, 0);
  const totalSpent   = bArr.reduce((s, b) => s + b.spent, 0);

  return {
    month:           monthKey,
    total_allocated: Math.round(totalAlloc),
    total_spent:     Math.round(totalSpent),
    days_left:       daysLeftInMonth(),
    buckets:         bArr,
    days,
  };
}

// ── Monthly trend: last 6 months ─────────────────────────────────────
function getMonthlyTrend() {
  const txSheet     = SS.getSheetByName('Transactions');
  const budgetSheet = SS.getSheetByName('Budget Config');
  if (!txSheet) return { error: 'Transactions sheet not found' };

  const txRows     = txSheet.getDataRange().getValues().slice(1);
  const budgetRows = budgetSheet ? budgetSheet.getDataRange().getValues().slice(1) : [];

  // Last 6 months
  const months = [];
  const today  = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push(d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'));
  }

  const spend = {}; const alloc = {};
  for (const m of months) { spend[m] = 0; alloc[m] = 0; }

  for (const r of txRows) {
    if (r.length < 15 || String(r[13]).toUpperCase() !== 'TRUE') continue;
    const mk = extractMonthKey(r[14]);
    if (spend[mk] !== undefined) spend[mk] += parseAmt(r[7]);
  }
  for (const r of budgetRows) {
    const mk = String(r[0]);
    if (alloc[mk] !== undefined && String(r[5]).toUpperCase() === 'TRUE') alloc[mk] += parseAmt(r[3]);
  }

  return {
    months: months.map(m => {
      const [y, mo] = m.split('-');
      return { month: m, label: mo + '/' + y, spent: Math.round(spend[m]), allocated: Math.round(alloc[m]) };
    }),
  };
}

// ── Net worth ─────────────────────────────────────────────────────────
function getNetWorth() {
  const assets = []; const liabs = []; const loans = [];

  const aSheet  = SS.getSheetByName('Assets');
  const lSheet  = SS.getSheetByName('Liabilities');
  const lgSheet = SS.getSheetByName('Loans Given');

  if (aSheet) {
    for (const r of aSheet.getDataRange().getValues().slice(1)) {
      if (!r[0]) continue;
      assets.push({ id: String(r[0]), name: String(r[1]), type: String(r[2]), value: parseAmt(r[3]) });
    }
  }

  if (lSheet) {
    for (const r of lSheet.getDataRange().getValues().slice(1)) {
      if (!r[0] || String(r[11]).toUpperCase() !== 'TRUE') continue;
      const bal  = parseAmt(r[4]);
      const rate = parseFloat(r[5]) || 0;
      liabs.push({
        id: String(r[0]), name: String(r[1]),
        balance: bal, annual_rate: rate,
        monthly_interest: Math.round(bal * rate / 100 / 12),
        payment_type: String(r[6]), fixed_monthly: parseAmt(r[7]),
        months_remaining: parseInt(r[8]) || 0,
      });
    }
  }

  if (lgSheet) {
    for (const r of lgSheet.getDataRange().getValues().slice(1)) {
      if (!r[0] || String(r[7]).toUpperCase() !== 'TRUE') continue;
      const bal  = parseAmt(r[3]);
      const rate = parseFloat(r[4]) || 0;
      loans.push({
        id: String(r[0]), borrower: String(r[1]),
        balance: bal, annual_rate: rate,
        monthly_interest: Math.round(bal * rate / 100 / 12),
      });
    }
  }

  const ta = assets.reduce((s, a) => s + a.value, 0);
  const tl = liabs.reduce((s, l) => s + l.balance, 0);
  const tlo = loans.reduce((s, l) => s + l.balance, 0);

  return {
    assets, liabilities: liabs, loans_given: loans,
    total_assets:      Math.round(ta),
    total_liabilities: Math.round(tl),
    total_loans_given: Math.round(tlo),
    net_worth:         Math.round(ta + tlo - tl),
  };
}

// ── Log daily spend (writes to Transactions sheet) ────────────────────
function logSpend(params) {
  const txSheet = SS.getSheetByName('Transactions');
  if (!txSheet) return { error: 'Transactions sheet not found' };

  const date     = params.date  || fmtDate(new Date());
  const amount   = parseFloat(params.amount) || 0;
  const bucketId = params.bucket || 'daily_spending';
  const desc     = params.desc   || 'Manual entry (web)';

  if (amount <= 0) return { error: 'Invalid amount' };

  const monthKey = date.substring(0, 7);
  const nextRow  = txSheet.getLastRow() + 1;
  const isDaily  = bucketId === 'daily_spending' ? 'TRUE' : 'FALSE';

  txSheet.getRange(nextRow, 1, 1, 15).setValues([[
    '', date, '', '', '', desc, 'Tiền ra', amount,
    'WEB-' + Date.now(), 0, bucketId, '', isDaily, 'TRUE', monthKey,
  ]]);

  return { ok: true, row: nextRow, amount, date, bucket: bucketId };
}

// ── Runs ──────────────────────────────────────────────────────────────
// Sheet columns: id | date | dist | dur | pace | cal | src

function getRunsSheet() {
  let sh = SS.getSheetByName('Runs');
  if (!sh) {
    sh = SS.insertSheet('Runs');
    sh.getRange(1, 1, 1, 7).setValues([['id','date','dist','dur','pace','cal','src']]);
    sh.getRange(1, 1, 1, 7).setFontWeight('bold');
  }
  return sh;
}

function getRuns() {
  const sh   = getRunsSheet();
  const rows = sh.getDataRange().getValues().slice(1);
  return rows
    .filter(r => r[0])
    .map(r => ({
      id:   Number(r[0]),
      date: String(r[1]),
      dist: parseFloat(r[2]) || 0,
      dur:  parseFloat(r[3]) || 0,
      pace: String(r[4]),
      cal:  parseInt(r[5])   || 0,
      src:  String(r[6] || ''),
    }))
    .sort((a, b) => b.id - a.id);   // newest first
}

function addRun(p) {
  const sh   = getRunsSheet();
  const id   = parseInt(p.id)   || Date.now();
  const dist = parseFloat(p.dist) || 0;
  const dur  = parseFloat(p.dur)  || 0;
  if (dist <= 0 || dur <= 0) return { error: 'Invalid dist/dur' };
  sh.appendRow([id, p.date || fmtDate(new Date()), dist, dur, p.pace || '', parseInt(p.cal) || 0, p.src || '']);
  return { ok: true, id };
}

function deleteRun(id) {
  const sh   = getRunsSheet();
  const rows = sh.getDataRange().getValues();
  for (let i = rows.length - 1; i >= 1; i--) {
    if (String(rows[i][0]) === String(id)) {
      sh.deleteRow(i + 1);
      return { ok: true };
    }
  }
  return { error: 'Run not found' };
}

// ── Habits ────────────────────────────────────────────────────────────
// Sheet columns: date | progress_json
// progress_json is a JSON array of checked indices, e.g. [0,2,5]

function getHabitsSheet() {
  let sh = SS.getSheetByName('Habits');
  if (!sh) {
    sh = SS.insertSheet('Habits');
    sh.getRange(1, 1, 1, 2).setValues([['date', 'progress_json']]);
    sh.getRange(1, 1, 1, 2).setFontWeight('bold');
  }
  return sh;
}

function getHabits() {
  const sh   = getHabitsSheet();
  const rows = sh.getDataRange().getValues().slice(1);
  const out  = {};
  for (const r of rows) {
    if (!r[0]) continue;
    const date = r[0] instanceof Date ? fmtDate(r[0]) : String(r[0]);
    try { out[date] = JSON.parse(r[1]); } catch { out[date] = []; }
  }
  return out;
}

function setHabit(date, progressJson) {
  if (!date) return { error: 'Missing date' };
  const sh   = getHabitsSheet();
  const rows = sh.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    const d = rows[i][0] instanceof Date ? fmtDate(rows[i][0]) : String(rows[i][0]);
    if (d === date) {
      sh.getRange(i + 1, 2).setValue(progressJson || '[]');
      return { ok: true, updated: true };
    }
  }
  sh.appendRow([date, progressJson || '[]']);
  return { ok: true, inserted: true };
}

// ── Helpers ───────────────────────────────────────────────────────────
function parseAmt(val) {
  return parseFloat(String(val).trim().replace(/,/g, '')) || 0;
}

function fmtDate(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

// Extract YYYY-MM-DD from either a Date object or a string
function extractDateKey(val) {
  if (val instanceof Date) return fmtDate(val);
  const s = String(val);
  const iso = s.match(/(\d{4}-\d{2}-\d{2})/);
  if (iso) return iso[1];
  const vn = s.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (vn) return vn[3] + '-' + vn[2] + '-' + vn[1];
  return null;
}

// Extract YYYY-MM from either a Date object or a string like "2026-04"
function extractMonthKey(val) {
  if (val instanceof Date) {
    return val.getFullYear() + '-' + String(val.getMonth() + 1).padStart(2, '0');
  }
  const s = String(val).trim();
  const m = s.match(/^(\d{4}-\d{2})/);
  return m ? m[1] : s;
}

// Legacy alias (keep for any external callers)
function extractDate(s) {
  return extractDateKey(s);
}

function daysLeftInMonth() {
  const t = new Date();
  return new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate() - t.getDate();
}

// ── Debug: return raw sheet data ─────────────────────────────────────
function debugSheets() {
  const txSheet     = SS.getSheetByName('Transactions');
  const budgetSheet = SS.getSheetByName('Budget Config');
  const txRows  = txSheet     ? txSheet.getDataRange().getValues()     : [];
  const budRows = budgetSheet ? budgetSheet.getDataRange().getValues() : [];
  return {
    tx_row_count:     txRows.length,
    tx_first_5_rows:  txRows.slice(0, 5).map(r => r.map(v => String(v))),
    bud_row_count:    budRows.length,
    bud_first_3_rows: budRows.slice(0, 3).map(r => r.map(v => String(v))),
  };
}

// ── Seed dummy data ───────────────────────────────────────────────────
// Run this ONCE from the Apps Script editor to populate Assets,
// Liabilities, and Loans Given with sample data.
// Select "seedDummyData" in the function dropdown and click ▶ Run.
function seedDummyData() {
  const today = fmtDate(new Date());

  // ── Assets ────────────────────────────────────────────────────────
  // Columns: id | name | type | value_vnd | currency | native_amount | notes | last_updated
  const aSheet = SS.getSheetByName('Assets');
  if (aSheet) {
    // Clear existing data rows (keep header)
    const aLast = aSheet.getLastRow();
    if (aLast > 1) aSheet.getRange(2, 1, aLast - 1, 8).clearContent();

    aSheet.getRange(2, 1, 7, 8).setValues([
      ['asset_btc',   'Bitcoin',           'Crypto',       45000000,  'VND', 45000000,  'BTC holdings',       today],
      ['asset_eth',   'Ethereum',          'Crypto',       12000000,  'VND', 12000000,  'ETH holdings',       today],
      ['asset_re1',   'Apartment Deposit', 'Real Estate',  200000000, 'VND', 200000000, 'Deposit at block B', today],
      ['asset_sav',   'Vietcombank Savings','Savings',     85000000,  'VND', 85000000,  '6-month term',       today],
      ['asset_cash',  'Cash on Hand',      'Cash',         5000000,   'VND', 5000000,   'Wallet + home',      today],
      ['asset_bank1', 'Techcombank',       'Bank Account', 32000000,  'VND', 32000000,  'Main account',       today],
      ['asset_bank2', 'MB Bank',           'Bank Account', 18000000,  'VND', 18000000,  'Secondary',          today],
    ]);
  }

  // ── Liabilities ───────────────────────────────────────────────────
  // Columns: id | name | creditor | principal | current_balance | annual_rate_pct |
  //          payment_type | fixed_monthly | months_remaining | start_date | notes | active
  const lSheet = SS.getSheetByName('Liabilities');
  if (lSheet) {
    const lLast = lSheet.getLastRow();
    if (lLast > 1) lSheet.getRange(2, 1, lLast - 1, 12).clearContent();

    lSheet.getRange(2, 1, 3, 12).setValues([
      ['liab_1', 'Family Loan',     'Uncle Minh',  200000000, 200000000, 8,  'interest_only', 0,       0,  '2024-01-01', 'Interest only, pay when able', 'TRUE'],
      ['liab_2', 'Friend Loan',     'Anh Duc',     100000000, 100000000, 10, 'interest_only', 0,       0,  '2024-06-01', 'Interest only monthly',       'TRUE'],
      ['liab_3', 'Monthly Payment', 'Bank VPBank',  150000000, 150000000, 6,  'amortizing',   5000000, 30, '2023-07-01', '5tr/month, 30 months left',   'TRUE'],
    ]);
  }

  // ── Loans Given ───────────────────────────────────────────────────
  // Columns: id | borrower | principal | current_balance | annual_rate_pct | start_date | notes | active
  const lgSheet = SS.getSheetByName('Loans Given');
  if (lgSheet) {
    const lgLast = lgSheet.getLastRow();
    if (lgLast > 1) lgSheet.getRange(2, 1, lgLast - 1, 8).clearContent();

    lgSheet.getRange(2, 1, 2, 8).setValues([
      ['loan_1', 'Em Tuan',  30000000, 30000000, 6, '2024-03-01', 'Lend for motorbike', 'TRUE'],
      ['loan_2', 'Chi Lan',  15000000, 15000000, 8, '2024-09-01', 'Personal loan',      'TRUE'],
    ]);
  }

  Logger.log('Dummy data seeded successfully.');
}
