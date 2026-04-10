// ============================================================
// finance-app.js — Monk Mode Financial Dashboard
// ============================================================

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwaTLyNay_VIp1uKUtc7q5GmOHuSrVxzJmnqdVUgTCX4Rq1a4DZCFAduoE-EKnlHSHsmw/exec';
const DAILY_BUDGET    = 350_000;
const DARK_KEY        = 'monk_dark_mode';

// ── State ─────────────────────────────────────────────────────────────
const _charts = {};
let _lastOverview = null;
let _lastTrend    = null;
let _currentMonth = (() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
})();

// ── Utility ───────────────────────────────────────────────────────────
function fmt(n) {
  n = Math.round(n || 0);
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'tỷ';
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'tr';
  if (n >= 1_000)         return Math.round(n / 1_000) + 'k';
  return n.toLocaleString() + 'đ';
}

function fmtFull(n) {
  return Math.round(n || 0).toLocaleString('vi-VN') + 'đ';
}

// Handles: 150k, 1.5tr, 20tr, 20000000, 20.000.000 (vi-VN dots), 20,000,000
function parseUserAmount(raw) {
  if (!raw) return null;
  let s = raw.toString().trim().toLowerCase().replace(/\s/g, '');

  let mult = 1;
  if      (s.endsWith('tỷ') || s.endsWith('ty'))    { mult = 1e9; s = s.replace(/(tỷ|ty)$/, ''); }
  else if (s.endsWith('triệu') || s.endsWith('tr'))  { mult = 1e6; s = s.replace(/(triệu|tr)$/, ''); }
  else if (s.endsWith('k'))                           { mult = 1000; s = s.slice(0, -1); }

  // Strip thousand separators: vi-VN uses dots, EN uses commas
  // If multiple dots and no comma → dots are thousands sep (e.g. 20.000.000)
  // If single dot → could be decimal (e.g. 1.5)
  const dotCount   = (s.match(/\./g) || []).length;
  const commaCount = (s.match(/,/g)  || []).length;

  if (commaCount > 0 && dotCount === 0) {
    s = s.replace(/,/g, ''); // 20,000,000 → 20000000
  } else if (dotCount > 1) {
    s = s.replace(/\./g, ''); // 20.000.000 → 20000000
  } else if (dotCount === 1 && commaCount === 0) {
    // Could be decimal (1.5) or single thousands dot (20.000)
    const parts = s.split('.');
    if (parts[1].length === 3) s = s.replace('.', ''); // thousands: 20.000 → 20000
    // else keep as decimal: 1.5
  } else if (commaCount > 0 && dotCount > 0) {
    s = s.replace(/,/g, ''); // 1,500,000.00 → remove commas
  }

  const n = parseFloat(s);
  return isNaN(n) ? null : Math.round(n * mult);
}

function isDark() {
  return document.documentElement.classList.contains('dark');
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function daysLeftInMonth() {
  const d = new Date();
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return last.getDate() - d.getDate();
}

// ── API (JSONP) ───────────────────────────────────────────────────────
function api(action, params = {}) {
  return new Promise((resolve, reject) => {
    const cbName = '_gascb_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    const script = document.createElement('script');
    const timer  = setTimeout(() => { cleanup(); reject(new Error('Request timed out')); }, 20_000);

    function cleanup() { clearTimeout(timer); delete window[cbName]; script.remove(); }

    window[cbName] = (data) => { cleanup(); resolve(data); };
    script.onerror = () => { cleanup(); reject(new Error('Script load failed')); };

    const url = new URL(APPS_SCRIPT_URL);
    url.searchParams.set('action', action);
    url.searchParams.set('callback', cbName);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));

    script.src = url.toString();
    document.head.appendChild(script);
  });
}

// ── Dark mode ─────────────────────────────────────────────────────────
function initDarkMode() {
  const saved = localStorage.getItem(DARK_KEY);
  if (saved === 'true' || saved === null) {
    document.documentElement.classList.add('dark');
  }
  const icon = document.getElementById('dark-mode-icon');
  if (icon) icon.className = isDark() ? 'fas fa-sun text-sm w-4 text-center' : 'fas fa-moon text-sm w-4 text-center';

  document.getElementById('dark-mode-toggle')?.addEventListener('click', () => {
    const on = document.documentElement.classList.toggle('dark');
    localStorage.setItem(DARK_KEY, String(on));
    if (icon) icon.className = on ? 'fas fa-sun text-sm w-4 text-center' : 'fas fa-moon text-sm w-4 text-center';
    if (_lastOverview) renderWeeklyChart(_lastOverview);
    if (_lastTrend)    renderTrendChart(_lastTrend);
    updateDCAChart();
  });
}

// ── Init ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  setupMonthNav();
  setupQuickLog();
  renderDCASection();

  if (APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_DEPLOYMENT_URL') {
    document.getElementById('setup-banner')?.classList.remove('hidden');
    setStatus('offline');
    return;
  }

  loadAll();
});

async function loadAll() {
  setStatus('loading');
  try {
    const [overview, trend, networth] = await Promise.all([
      api('overview', { month: _currentMonth, today: todayKey() }),
      api('trend'),
      api('networth'),
    ]);

    // Guard: Apps Script may return {error: '...'}
    if (overview.error) {
      showBanner(`Overview error: ${overview.error}`);
    } else {
      _lastOverview = overview;
      renderSummaryCards(overview);
      renderWeeklyChart(overview);
      renderBudgetBreakdown(overview);
      populateBucketDropdown(overview.buckets);
    }

    if (!trend.error) {
      _lastTrend = trend;
      renderTrendChart(trend);
    }

    if (!networth.error) {
      renderNetWorth(networth);
    }

    setStatus('online');
  } catch (e) {
    console.error('Finance load error:', e);
    setStatus('offline');
  }
}

// ── Month navigation ──────────────────────────────────────────────────
function setupMonthNav() {
  const display = document.getElementById('month-display');
  if (display) display.textContent = fmtMonth(_currentMonth);

  document.getElementById('prev-month')?.addEventListener('click', () => {
    const [y, m] = _currentMonth.split('-').map(Number);
    _currentMonth = m === 1 ? `${y-1}-12` : `${y}-${String(m-1).padStart(2,'0')}`;
    if (display) display.textContent = fmtMonth(_currentMonth);
    loadAll();
  });

  document.getElementById('next-month')?.addEventListener('click', () => {
    const [y, m] = _currentMonth.split('-').map(Number);
    _currentMonth = m === 12 ? `${y+1}-01` : `${y}-${String(m+1).padStart(2,'0')}`;
    if (display) display.textContent = fmtMonth(_currentMonth);
    loadAll();
  });
}

function fmtMonth(mk) {
  const [y, m] = mk.split('-');
  return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+m - 1] + ' ' + y;
}

// ── Quick Log ─────────────────────────────────────────────────────────
function setupQuickLog() {
  document.getElementById('quick-log-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const raw    = document.getElementById('log-amount').value.trim();
    const bucket = document.getElementById('log-bucket').value;
    const amount = parseUserAmount(raw);

    if (!amount || amount <= 0) {
      showToast('Invalid amount — try: 150k, 1.5tr, 250000', 'error');
      return;
    }

    const btn = e.target.querySelector('button[type=submit]');
    btn.disabled = true;
    btn.textContent = 'Logging...';

    try {
      const result = await api('logspend', { date: todayKey(), amount, bucket, desc: 'Manual entry (web)' });
      if (result.error) throw new Error(result.error);
      document.getElementById('log-amount').value = '';
      showToast(`Logged ${fmt(amount)} ✓`, 'success');
      await loadAll(); // refresh all counts
    } catch (err) {
      showToast('Failed: ' + err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Log It';
    }
  });
}

function populateBucketDropdown(buckets) {
  const sel = document.getElementById('log-bucket');
  if (!sel || !buckets?.length) return;
  // Preserve current selection if possible
  const current = sel.value;
  sel.innerHTML = buckets.map(b =>
    `<option value="${b.id}"${b.id === (current || 'daily_spending') ? ' selected' : ''}>${b.name}</option>`
  ).join('');
}

// ── Summary Cards ─────────────────────────────────────────────────────
function renderSummaryCards(data) {
  const tk         = todayKey();
  const days       = data.days || [];
  const todayDay   = days.find(d => d.date === tk);
  const todaySpent = todayDay?.spent || 0;
  const weekSpent  = days.reduce((s, d) => s + (d.spent || 0), 0);
  const monthSpent = data.total_spent     || 0;
  const monthAlloc = data.total_allocated || 1;

  // Use client-side days_left as fallback (Apps Script may return 0 at end of month)
  const dLeft = data.days_left != null ? data.days_left : daysLeftInMonth();

  setCard('card-today', todaySpent, DAILY_BUDGET,    'Today',               `${dLeft}d left this month`);
  setCard('card-week',  weekSpent,  DAILY_BUDGET * 7,'This Week (7-day)',   `${fmt(DAILY_BUDGET)}/day limit`);
  setCard('card-month', monthSpent, monthAlloc,       fmtMonth(_currentMonth), `${dLeft} days left`);
}

function setCard(id, spent, total, title, sub) {
  const el = document.getElementById(id);
  if (!el) return;
  const pct   = total > 0 ? Math.min(100, Math.round(spent / total * 100)) : 0;
  const color = pct >= 100 ? '#ef4444' : pct >= 80 ? '#f59e0b' : '#a78bfa';
  el.querySelector('.card-title').textContent = title;
  el.querySelector('.card-spent').textContent = fmt(spent);
  el.querySelector('.card-total').textContent = '/ ' + fmt(total);
  el.querySelector('.card-pct').textContent   = pct + '%';
  el.querySelector('.card-sub').textContent   = sub;
  el.querySelector('.card-bar').style.cssText = `width:${pct}%; background:${color}`;
}

// ── Weekly Chart ──────────────────────────────────────────────────────
function renderWeeklyChart(data) {
  if (!data) return;
  const ctx = document.getElementById('weekly-chart');
  if (!ctx) return;
  if (_charts.weekly) { _charts.weekly.destroy(); _charts.weekly = null; }

  const days   = data.days || [];
  const dark   = isDark();
  const colors = days.map(d => {
    if (d.is_today)             return dark ? '#a78bfa' : '#7542A8';
    if (d.spent > DAILY_BUDGET) return '#ef4444';
    return dark ? '#4c1d95' : '#ede9fe';
  });

  const config = {
    type: 'bar',
    data: {
      labels: days.map(d => d.label),
      datasets: [{ data: days.map(d => d.spent), backgroundColor: colors, borderRadius: 8, borderSkipped: false }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: c => fmtFull(c.parsed.y) } },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: dark ? '#9ca3af' : '#6b7280', callback: v => fmt(v) },
          grid: { color: dark ? '#374151' : '#f3f4f6' },
        },
        x: { ticks: { color: dark ? '#9ca3af' : '#6b7280' }, grid: { display: false } },
      },
    },
  };

  // Add annotation (daily limit line) only if plugin is available
  if (window.Chart && Chart.registry && Chart.registry.plugins.get('annotation')) {
    config.options.plugins.annotation = {
      annotations: {
        limit: {
          type: 'line', yMin: DAILY_BUDGET, yMax: DAILY_BUDGET,
          borderColor: '#f59e0b', borderWidth: 2, borderDash: [6, 4],
          label: { content: fmt(DAILY_BUDGET) + ' limit', display: true, position: 'end', color: '#f59e0b', font: { size: 11 } },
        }
      }
    };
  }

  _charts.weekly = new Chart(ctx, config);
}

// ── Budget Breakdown ──────────────────────────────────────────────────
function renderBudgetBreakdown(data) {
  const el = document.getElementById('budget-breakdown');
  if (!el) return;

  const buckets = (data.buckets || []).sort((a, b) => b.allocated - a.allocated);
  if (!buckets.length) {
    el.innerHTML = '<p class="text-sm text-gray-400 text-center py-4">No budget data for this month</p>';
    return;
  }

  el.innerHTML = buckets.map(b => {
    const pct  = b.allocated > 0 ? Math.min(100, Math.round(b.spent / b.allocated * 100)) : 0;
    const rem  = b.allocated - b.spent;
    const barC = pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-purple-500';
    return `
      <div class="mb-4 last:mb-0">
        <div class="flex justify-between items-baseline mb-1">
          <span class="text-sm font-semibold">${b.name}</span>
          <span class="text-xs text-gray-500 dark:text-gray-400">${fmt(b.spent)} / ${fmt(b.allocated)}</span>
        </div>
        <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div class="${barC} h-full rounded-full transition-all duration-500" style="width:${pct}%"></div>
        </div>
        <div class="flex justify-between mt-0.5">
          <span class="text-xs text-gray-400">${pct}%</span>
          <span class="text-xs ${rem < 0 ? 'text-red-400' : 'text-gray-400'}">
            ${rem < 0 ? '⚠ over ' + fmt(-rem) : fmt(rem) + ' left'}
          </span>
        </div>
      </div>`;
  }).join('');
}

// ── Trend Chart ───────────────────────────────────────────────────────
function renderTrendChart(data) {
  if (!data) return;
  const ctx = document.getElementById('trend-chart');
  if (!ctx) return;
  if (_charts.trend) { _charts.trend.destroy(); _charts.trend = null; }

  const dark   = isDark();
  const months = data.months || [];
  const purple = dark ? '#a78bfa' : '#7542A8';

  _charts.trend = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months.map(m => m.label),
      datasets: [
        {
          label: 'Spent',
          data: months.map(m => m.spent),
          borderColor: purple,
          backgroundColor: dark ? 'rgba(167,139,250,0.12)' : 'rgba(117,66,168,0.08)',
          fill: true, tension: 0.4, pointRadius: 5,
        },
        {
          label: 'Budget',
          data: months.map(m => m.allocated),
          borderColor: '#f59e0b', borderDash: [6, 4],
          pointRadius: 3, tension: 0.4, fill: false,
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: dark ? '#d1d5db' : '#374151' } },
        tooltip: { callbacks: { label: c => c.dataset.label + ': ' + fmtFull(c.parsed.y) } },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: dark ? '#9ca3af' : '#6b7280', callback: v => fmt(v) },
          grid: { color: dark ? '#374151' : '#f3f4f6' },
        },
        x: { ticks: { color: dark ? '#9ca3af' : '#6b7280' }, grid: { display: false } },
      },
    },
  });
}

// ── Net Worth ─────────────────────────────────────────────────────────
function renderNetWorth(data) {
  const el = document.getElementById('networth-section');
  if (!el || !data) return;

  const ta  = data.total_assets      || 0;
  const tl  = data.total_liabilities || 0;
  const tlo = data.total_loans_given || 0;
  const nw  = data.net_worth         || 0;

  const assetRows = (data.assets || []).map(a =>
    `<tr class="border-b border-gray-100 dark:border-gray-800">
      <td class="py-2 text-sm">${a.name}</td>
      <td class="py-2 text-xs text-gray-400">${a.type}</td>
      <td class="py-2 text-sm font-semibold text-right text-green-500">${fmt(a.value)}</td>
    </tr>`).join('');

  const liabRows = (data.liabilities || []).map(l => {
    const extra = l.payment_type === 'amortizing'
      ? `${fmt(l.fixed_monthly)}/mo · ${l.months_remaining}mo left`
      : `${fmt(l.monthly_interest)}/mo interest`;
    return `<tr class="border-b border-gray-100 dark:border-gray-800">
      <td class="py-2 text-sm">${l.name}</td>
      <td class="py-2 text-xs text-gray-400">${l.annual_rate}%/yr · ${extra}</td>
      <td class="py-2 text-sm font-semibold text-right text-red-500">${fmt(l.balance)}</td>
    </tr>`;
  }).join('');

  const loanRows = (data.loans_given || []).map(l =>
    `<tr class="border-b border-gray-100 dark:border-gray-800">
      <td class="py-2 text-sm">${l.borrower}</td>
      <td class="py-2 text-xs text-gray-400">${l.annual_rate}%/yr · ${fmt(l.monthly_interest)}/mo due</td>
      <td class="py-2 text-sm font-semibold text-right text-blue-500">${fmt(l.balance)}</td>
    </tr>`).join('');

  el.innerHTML = `
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <div class="rounded-xl bg-gray-50 dark:bg-gray-900/50 p-4 text-center">
        <div class="text-xs text-gray-500 mb-1">Assets</div>
        <div class="text-lg font-bold text-green-500">${fmt(ta)}</div>
      </div>
      <div class="rounded-xl bg-gray-50 dark:bg-gray-900/50 p-4 text-center">
        <div class="text-xs text-gray-500 mb-1">Debts</div>
        <div class="text-lg font-bold text-red-500">-${fmt(tl)}</div>
      </div>
      <div class="rounded-xl bg-gray-50 dark:bg-gray-900/50 p-4 text-center">
        <div class="text-xs text-gray-500 mb-1">Loans Given</div>
        <div class="text-lg font-bold text-blue-500">+${fmt(tlo)}</div>
      </div>
      <div class="rounded-xl bg-gray-50 dark:bg-gray-900/50 p-4 text-center">
        <div class="text-xs text-gray-500 mb-1">Net Worth</div>
        <div class="text-xl font-black ${nw >= 0 ? 'text-purple-brand' : 'text-red-500'}">${fmt(nw)}</div>
      </div>
    </div>
    ${assetRows ? `<div class="mb-5"><p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Assets</p><table class="w-full"><tbody>${assetRows}</tbody></table></div>` : ''}
    ${liabRows  ? `<div class="mb-5"><p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Liabilities</p><table class="w-full"><tbody>${liabRows}</tbody></table></div>` : ''}
    ${loanRows  ? `<div><p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Loans Given</p><table class="w-full"><tbody>${loanRows}</tbody></table></div>` : ''}
  `;
}

// ── DCA Calculator ────────────────────────────────────────────────────
function renderDCASection() {
  const slider = document.getElementById('dca-monthly');
  const input  = document.getElementById('dca-monthly-input');

  // Slider → text input
  slider?.addEventListener('input', () => {
    const vnd = parseInt(slider.value) * 1_000;
    if (input) input.value = fmt(vnd).replace('đ', '');
    updateDCAChart();
  });

  // Text input → slider on blur or Enter
  function syncInputToSlider() {
    const amt = parseUserAmount(input.value);
    if (amt && amt > 0) {
      const clamped = Math.min(90_000_000, Math.max(10_000_000, amt));
      if (slider) slider.value = Math.round(clamped / 1_000);
      input.value = clamped.toLocaleString('vi-VN');
    }
    updateDCAChart();
  }
  input?.addEventListener('blur', syncInputToSlider);
  input?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); syncInputToSlider(); } });

  ['dca-rate', 'dca-years'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => updateDCAChart());
  });

  updateDCAChart();
}

function calcDCA(monthlyVND, annualRatePct, years) {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  const totalInvested = monthlyVND * n;
  const finalValue    = r > 0 ? monthlyVND * ((Math.pow(1 + r, n) - 1) / r) : totalInvested;
  return { totalInvested: Math.round(totalInvested), finalValue: Math.round(finalValue) };
}

function updateDCAChart() {
  const monthly = (parseInt(document.getElementById('dca-monthly')?.value) || 20000) * 1_000;
  const rate    = parseFloat(document.getElementById('dca-rate')?.value)    || 10;
  const years   = parseInt(document.getElementById('dca-years')?.value)     || 20;

  // Seed text input on first render
  const input = document.getElementById('dca-monthly-input');
  if (input && !input.value) input.value = fmt(monthly).replace('đ', '');

  if (document.getElementById('dca-rate-val'))  document.getElementById('dca-rate-val').textContent  = rate + '%/yr';
  if (document.getElementById('dca-years-val')) document.getElementById('dca-years-val').textContent = years + ' yrs';

  const { totalInvested, finalValue } = calcDCA(monthly, rate, years);
  const profit = finalValue - totalInvested;

  if (document.getElementById('dca-invested')) document.getElementById('dca-invested').textContent = fmt(totalInvested);
  if (document.getElementById('dca-final'))    document.getElementById('dca-final').textContent    = fmt(finalValue);
  if (document.getElementById('dca-profit'))   document.getElementById('dca-profit').textContent   = fmt(profit);
  if (document.getElementById('dca-mult'))     document.getElementById('dca-mult').textContent     = (finalValue / totalInvested).toFixed(1) + 'x';

  const labels = []; const invested = []; const portfolio = [];
  const r = rate / 100 / 12;
  for (let mo = 12; mo <= years * 12; mo += 12) {
    labels.push('Y' + (mo / 12));
    invested.push(monthly * mo);
    portfolio.push(Math.round(r > 0 ? monthly * ((Math.pow(1 + r, mo) - 1) / r) : monthly * mo));
  }

  const ctx = document.getElementById('dca-chart');
  if (!ctx) return;
  if (_charts.dca) { _charts.dca.destroy(); _charts.dca = null; }

  const dark   = isDark();
  const purple = dark ? '#a78bfa' : '#7542A8';

  _charts.dca = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Total Invested',
          data: invested,
          borderColor: dark ? '#6b7280' : '#9ca3af',
          borderDash: [5, 5], pointRadius: 0, fill: false, tension: 0,
        },
        {
          label: 'Portfolio Value',
          data: portfolio,
          borderColor: purple,
          backgroundColor: dark ? 'rgba(167,139,250,0.15)' : 'rgba(117,66,168,0.1)',
          fill: true, pointRadius: 0, tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: { color: dark ? '#d1d5db' : '#374151' } },
        tooltip: { callbacks: { label: c => c.dataset.label + ': ' + fmt(c.parsed.y) } },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: dark ? '#9ca3af' : '#6b7280', callback: v => fmt(v) },
          grid: { color: dark ? '#374151' : '#f3f4f6' },
        },
        x: { ticks: { color: dark ? '#9ca3af' : '#6b7280' }, grid: { display: false } },
      },
    },
  });
}

// ── Status + Toast + Banner ───────────────────────────────────────────
function setStatus(state) {
  const dot  = document.getElementById('status-dot');
  const text = document.getElementById('status-text');
  if (!dot || !text) return;
  const map = {
    loading: ['bg-yellow-400 animate-pulse', 'Loading...'],
    online:  ['bg-green-400', 'Live'],
    offline: ['bg-gray-400', 'Offline'],
  };
  const [cls, label] = map[state] || map.offline;
  dot.className = `inline-block w-2 h-2 rounded-full mr-1.5 ${cls}`;
  text.textContent = label;
}

function showToast(msg, type = 'success') {
  const t  = document.createElement('div');
  const bg = type === 'error' ? 'bg-red-500' : 'bg-green-500';
  t.className = `fixed bottom-6 right-6 ${bg} text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg z-50 transition-opacity duration-300`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 2500);
}

function showBanner(msg) {
  const b = document.getElementById('setup-banner');
  if (!b) return;
  b.querySelector('p:last-child').textContent = msg;
  b.classList.remove('hidden');
}
