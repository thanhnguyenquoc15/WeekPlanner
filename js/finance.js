/**
 * finance.js — Weekly spending chart + category breakdown.
 * Fetches from the spend-less-bot API, caches to localStorage when offline.
 */
import { BOT_URL, WEEKLY_BUDGET_VND, DAILY_BUDGET_VND, STORAGE_KEYS } from './config.js';

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;  // 5 minutes
let _chart = null;
let _refreshTimer = null;

// ── Public init ───────────────────────────────────────────────────────

export function initFinance() {
    document.getElementById('finance-refresh-btn')
        ?.addEventListener('click', () => fetchAndRender());

    // Fetch when tab becomes visible
    document.querySelectorAll('[data-app-tab="financial"]').forEach(btn => {
        btn.addEventListener('click', () => fetchAndRender());
    });

    // Auto-refresh every 5 min
    _refreshTimer = setInterval(fetchAndRender, REFRESH_INTERVAL_MS);
}

// ── Fetch ─────────────────────────────────────────────────────────────

async function fetchAndRender() {
    setStatus('loading');
    try {
        const res  = await fetch(`${BOT_URL}/api/weekly-spend`, { signal: AbortSignal.timeout(8000) });
        const data = await res.json();
        localStorage.setItem(STORAGE_KEYS.financeCache, JSON.stringify({
            data,
            savedAt: new Date().toISOString(),
        }));
        render(data, false);
        setStatus('online');
    } catch {
        // Bot offline — try cache
        const raw = localStorage.getItem(STORAGE_KEYS.financeCache);
        if (raw) {
            const { data, savedAt } = JSON.parse(raw);
            render(data, true);
            const t = new Date(savedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
            document.getElementById('finance-sync-time').textContent = `cached ${t}`;
        } else {
            setStatus('offline');
        }
    }
}

// ── Render ────────────────────────────────────────────────────────────

function render(data, isOffline) {
    renderSummary(data);
    renderChart(data);
    renderCategories(data);

    document.getElementById('finance-offline-banner').classList.toggle('hidden', !isOffline);
    if (!isOffline) {
        const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        document.getElementById('finance-sync-time').textContent = `synced ${now}`;
    }
}

function renderSummary(data) {
    const fmt = n => n.toLocaleString('vi-VN') + 'đ';
    const pct  = Math.round(data.total_spent / WEEKLY_BUDGET_VND * 100);
    const el   = document.getElementById('finance-total-spent');
    const pelp = document.getElementById('finance-total-pct');
    if (!el) return;
    el.textContent   = fmt(data.total_spent);
    el.className     = `text-xl font-bold ${pct >= 100 ? 'text-red-500' : pct >= 80 ? 'text-amber-500' : 'text-green-500'}`;
    pelp.textContent = `${pct}% of weekly budget`;
}

function renderChart(data) {
    const isDark = document.documentElement.classList.contains('dark');
    const labels = data.days.map(d => d.label);
    const spent  = data.days.map(d => d.spent);
    const colors = data.days.map(d =>
        d.spent === 0        ? (isDark ? '#4b5563' : '#e5e7eb') :
        d.spent > DAILY_BUDGET_VND ? '#ef4444' :
        d.spent > DAILY_BUDGET_VND * 0.8 ? '#f59e0b' : '#8b5cf6'
    );

    const ctx = document.getElementById('weekly-spend-chart');
    if (!ctx) return;

    if (_chart) _chart.destroy();

    _chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label:           'Spent',
                    data:            spent,
                    backgroundColor: colors,
                    borderRadius:    6,
                    borderSkipped:   false,
                },
                {
                    label:       'Daily budget',
                    data:        Array(7).fill(DAILY_BUDGET_VND),
                    type:        'line',
                    borderColor: isDark ? '#6b7280' : '#9ca3af',
                    borderDash:  [4, 4],
                    borderWidth: 1.5,
                    pointRadius: 0,
                    fill:        false,
                },
            ],
        },
        options: {
            responsive:          true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => `  ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString('vi-VN')}đ`,
                    },
                },
            },
            scales: {
                x: {
                    grid:  { display: false },
                    ticks: { color: isDark ? '#9ca3af' : '#6b7280', font: { size: 11 } },
                },
                y: {
                    grid:     { color: isDark ? '#1f2937' : '#f3f4f6' },
                    ticks: {
                        color:    isDark ? '#9ca3af' : '#6b7280',
                        font:     { size: 10 },
                        callback: v => (v / 1000) + 'k',
                    },
                    beginAtZero: true,
                },
            },
        },
    });
}

function renderCategories(data) {
    const el = document.getElementById('finance-categories');
    if (!el) return;
    if (!data.categories.length) {
        el.innerHTML = '<p class="text-sm text-gray-400 text-center py-4">No spending this week yet.</p>';
        return;
    }

    const fmt = n => n.toLocaleString('vi-VN') + 'đ';
    el.innerHTML = data.categories.map(c => {
        const pct = c.allocated > 0 ? Math.min(Math.round(c.spent / c.allocated * 100), 100) : 0;
        const barColor = pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-purple-500';
        const allocLine = c.allocated > 0
            ? `<span class="text-xs text-gray-400">${fmt(c.spent)} / ${fmt(c.allocated)}</span>`
            : `<span class="text-xs text-gray-400">${fmt(c.spent)}</span>`;
        return `
        <div>
            <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-200">${c.name}</span>
                ${allocLine}
            </div>
            ${c.allocated > 0 ? `
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div class="${barColor} h-1.5 rounded-full transition-all" style="width:${pct}%"></div>
            </div>` : ''}
        </div>`;
    }).join('');
}

// ── Status indicator ──────────────────────────────────────────────────

function setStatus(state) {
    const dot  = document.getElementById('finance-status-dot');
    const text = document.getElementById('finance-status-text');
    if (!dot || !text) return;
    const map = {
        loading: ['bg-amber-400 animate-pulse', 'Syncing...'],
        online:  ['bg-green-400',               'Live'],
        offline: ['bg-red-400',                 'Bot offline'],
    };
    const [cls, label] = map[state] || map.offline;
    dot.className  = `w-2 h-2 rounded-full ${cls}`;
    text.textContent = label;
}
