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

function doGet(e) {
  const p      = e.parameter || {};
  const action = (p.action || 'overview').toLowerCase();
  const cb     = p.callback; // JSONP callback name
  let result;

  try {
    switch (action) {
      case 'overview':  result = getOverview(p.month);  break;
      case 'trend':     result = getMonthlyTrend();      break;
      case 'networth':  result = getNetWorth();          break;
      case 'logspend':  result = logSpend(p);            break;
      default:          result = { error: 'Unknown action: ' + action };
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
function getOverview(monthKey) {
  if (!monthKey) {
    const now = new Date();
    monthKey = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
  }

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
    if (String(r[14]) !== monthKey) continue;               // O: month_key
    const amount   = parseAmt(r[7]);                        // H: amount
    const bucketId = String(r[10]);                         // K: parent category
    const dateKey  = extractDate(String(r[1]));             // B: date

    if (buckets[bucketId]) buckets[bucketId].spent += amount;
    if (dateKey) dailyTotals[dateKey] = (dailyTotals[dateKey] || 0) + amount;
  }

  // Build last-7-days array
  const today = new Date();
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
    const mk = String(r[14]);
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

// ── Helpers ───────────────────────────────────────────────────────────
function parseAmt(val) {
  return parseFloat(String(val).trim().replace(/,/g, '')) || 0;
}

function fmtDate(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function extractDate(s) {
  const iso = s.match(/(\d{4}-\d{2}-\d{2})/);
  if (iso) return iso[1];
  const vn = s.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (vn) return vn[3] + '-' + vn[2] + '-' + vn[1];
  return null;
}

function daysLeftInMonth() {
  const t = new Date();
  return new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate() - t.getDate();
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
