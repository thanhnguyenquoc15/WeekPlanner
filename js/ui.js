import { getRandomQuote }          from './quotes.js';
import { workoutDetails }           from './exercises.js';
import { updateChartsTheme }        from './charts.js';
import { STORAGE_KEYS }             from './config.js';
import { activityPillarIconHtml, IDENTITY_META, ACTIVITY_PILLARS } from './identity.js';
import { pushHabit }                from './sync.js';

// ── Security helper ────────────────────────────────────────────────
const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));

// ── Injected schedule data (set by initUI) ─────────────────────────
let _scheduleData      = {};
let _todayScheduleTimes = []; // kept for rope re-paint when tab becomes visible

// ── Theme system ───────────────────────────────────────────────────
// Themes cycle: dark → midnight → mocha → light → dark
const THEMES = [
    { name: 'dark',     icon: 'fa-moon',        dark: true  },
    { name: 'midnight', icon: 'fa-star',         dark: true  },
    { name: 'mocha',    icon: 'fa-mug-hot',      dark: true  },
    { name: 'light',    icon: 'fa-sun',          dark: false },
];

export function initDarkMode() {
    const saved = localStorage.getItem(STORAGE_KEYS.darkMode) ?? 'dark';
    applyTheme(saved);

    document.getElementById('dark-mode-toggle')?.addEventListener('click', () => {
        const current = document.documentElement.dataset.theme || 'dark';
        const idx     = THEMES.findIndex(t => t.name === current);
        const next    = THEMES[(idx + 1) % THEMES.length];
        applyTheme(next.name);
        localStorage.setItem(STORAGE_KEYS.darkMode, next.name);
        updateChartsTheme(next.dark);
    });
}

function applyTheme(name) {
    const theme = THEMES.find(t => t.name === name) || THEMES[0];
    const html  = document.documentElement;
    html.dataset.theme = theme.name;
    html.classList.toggle('dark', theme.dark);
    const icon = document.getElementById('dark-mode-icon');
    if (icon) icon.className = `fas ${theme.icon} text-lg w-5 text-center`;
}

function applyDark(isDark) {
    document.documentElement.classList.toggle('dark', isDark);
    const icon = document.getElementById('dark-mode-icon');
    if (icon) {
        icon.className = isDark
            ? 'fas fa-sun text-lg w-5 text-center'
            : 'fas fa-moon text-lg w-5 text-center';
    }
}

export function isDarkMode() {
    return document.documentElement.classList.contains('dark');
}

// ── App tab switching ──────────────────────────────────────────────
export function initAppTabs() {
    const btns = document.querySelectorAll('.app-tab-btn[data-app-tab]');
    btns.forEach(btn => {
        btn.addEventListener('click', () => switchAppTab(btn.dataset.appTab));
    });

    // Respect ?tab= query param when arriving from another page
    const requested = new URLSearchParams(location.search).get('tab');
    switchAppTab(requested ?? 'planner');
}

function switchAppTab(name) {
    document.querySelectorAll('.app-tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.app-tab-btn').forEach(b => b.classList.remove('active'));

    const target = document.getElementById(`app-tab-${name}`);
    if (target) target.classList.remove('hidden');

    const activeBtn = document.querySelector(`[data-app-tab="${name}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    // Update URL without reloading
    history.replaceState({}, '', location.pathname + '?tab=' + name);

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Re-paint rope after tab becomes visible (getBoundingClientRect needs a rendered layout)
    if (name === 'today' && _todayScheduleTimes.length) {
        const c = document.getElementById('today-schedule-inline');
        if (c) requestAnimationFrame(() => updateTimelineRope(c, _todayScheduleTimes));
    }
}

// ── Time helpers for rope timeline ────────────────────────────────
function parseTimeToMins(timeStr) {
    const m = String(timeStr).trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?/i);
    if (!m) return null;
    let h = parseInt(m[1], 10);
    const mins = parseInt(m[2], 10);
    const period = (m[3] || '').toUpperCase();
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return h * 60 + mins;
}

function currentMins() {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
}

function updateTimelineRope(container, scheduleTimes) {
    const now = currentMins();

    // 1. Update lock / unlock state on every checkbox
    container.querySelectorAll('.today-sched-check').forEach(cb => {
        const actTime = scheduleTimes[parseInt(cb.dataset.idx, 10)];
        if (actTime === null) return;
        const locked = now < actTime && !cb.checked;
        cb.disabled = locked;
        cb.closest('.today-sched-row')?.classList.toggle('today-sched-locked', locked);
    });

    // 2. Position flame at the visual midpoint of the first locked row (DOM-based)
    const track = container.querySelector('.today-rope-track');
    const burned = container.querySelector('.today-rope-burned');
    const flame  = container.querySelector('.today-rope-flame');
    if (!track || !burned || !flame) return;

    const trackRect = track.getBoundingClientRect();
    if (trackRect.height === 0) return; // tab is hidden — will retry on tab switch

    const firstLockedRow = container.querySelector('.today-sched-row.today-sched-locked');

    if (firstLockedRow) {
        const rowRect = firstLockedRow.getBoundingClientRect();
        const rowMidY = rowRect.top + rowRect.height / 2;
        const pct = Math.max(0, Math.min(100,
            ((rowMidY - trackRect.top) / trackRect.height) * 100
        ));
        burned.style.height  = `${pct}%`;
        flame.style.top      = `${pct}%`;
        flame.style.display  = 'block';
    } else {
        // All activities are past or checked — full burn, no flame
        burned.style.height = '100%';
        flame.style.display = 'none';
    }
}

// ── Today tab: note persistence ───────────────────────────────────
function todayDateKey() {
    return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}
function loadNotes() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.activityNotes) || '{}'); }
    catch { return {}; }
}
function saveNote(idx, text) {
    const all     = loadNotes();
    const dateKey = todayDateKey();
    if (!all[dateKey]) all[dateKey] = {};
    all[dateKey][idx] = text;

    // Prune entries older than 90 days to prevent unbounded localStorage growth
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    Object.keys(all).forEach(k => { if (k < cutoffStr) delete all[k]; });

    localStorage.setItem(STORAGE_KEYS.activityNotes, JSON.stringify(all));
}
function getNote(idx) {
    return loadNotes()[todayDateKey()]?.[String(idx)] ?? '';
}

// ── Today tab: inline schedule ─────────────────────────────────────
export function renderTodayScheduleInline() {
    const container = document.getElementById('today-schedule-inline');
    if (!container) return;

    const days    = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const todayEn = days[new Date().getDay()];
    const data    = _scheduleData[todayEn];
    if (!data?.schedule?.length) { container.innerHTML = ''; return; }

    const saved             = getProgress(todayEn);
    const now               = currentMins();
    const scheduleTimes     = data.schedule.map(item => parseTimeToMins(item.time));
    _todayScheduleTimes     = scheduleTimes; // expose for tab-switch re-paint

    const itemsHtml = data.schedule.map((item, idx) => {
        const checked  = saved.includes(idx);
        const pillar   = activityPillarIconHtml(item.activity);
        const note     = getNote(idx);
        const actTime  = scheduleTimes[idx];
        const isLocked = actTime !== null && now < actTime && !checked;
        const nameHtml = item.workoutKey
            ? `<a href="#" class="today-workout-link text-blue-400 hover:underline" data-workout-key="${item.workoutKey}">${item.activity}</a>`
            : item.activity;

        return `<div class="today-sched-row bg-black/25 rounded-xl border border-white/10${checked ? ' sched-collapsed' : ''}${isLocked ? ' today-sched-locked' : ''}">
            <label class="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" class="today-sched-check h-4 w-4 mt-0.5 rounded accent-purple-500 flex-shrink-0"
                       data-idx="${idx}" data-day="${todayEn}"
                       data-activity="${item.activity.replace(/"/g, '&quot;')}"
                       ${checked ? 'checked' : ''} ${isLocked ? 'disabled' : ''}>
                <div class="flex-1 min-w-0">
                    <div class="today-sched-meta flex items-center gap-2 mb-0.5 flex-wrap">
                        <span class="text-xs font-bold text-purple-300 tabular-nums">${item.time}</span>
                        ${pillar}
                        <i class="today-sched-lock-icon fas fa-lock"></i>
                    </div>
                    <p class="today-sched-name text-sm font-semibold text-gray-100${checked ? ' line-through' : ''}">${nameHtml}</p>
                    <p class="today-sched-details text-xs text-gray-500 mt-0.5 leading-relaxed">${item.details}</p>
                </div>
            </label>
            <textarea class="today-note-input" rows="1" placeholder="✏️  Add note..."
                      data-idx="${idx}">${note}</textarea>
        </div>`;
    }).join('');

    container.innerHTML = `
        <p class="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-3 px-0.5 ml-4">${data.title}</p>
        <div class="flex items-stretch">
            <div class="today-rope-col">
                <div class="today-rope-track">
                    <div class="today-rope-burned"></div>
                    <div class="today-rope-flame"></div>
                </div>
            </div>
            <div class="flex-1 min-w-0 space-y-2">${itemsHtml}</div>
        </div>`;

    // Auto-resize existing notes
    container.querySelectorAll('.today-note-input').forEach(ta => {
        if (ta.value) { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px'; }
    });

    // Checkboxes — sync both views, persist, reward on check
    container.querySelectorAll('.today-sched-check').forEach(cb => {
        cb.addEventListener('change', e => {
            const done = e.target.checked;
            // Immediate visual feedback for this row
            const row  = e.target.closest('.today-sched-row');
            const name = row?.querySelector('.today-sched-name');
            row?.classList.toggle('sched-collapsed', done);
            name?.classList.toggle('line-through', done);
            // Compute new state and sync everywhere
            const day        = e.target.dataset.day;
            const allChecked = [...container.querySelectorAll('.today-sched-check')]
                .filter(c => c.checked).map(c => parseInt(c.dataset.idx, 10));
            const total = container.querySelectorAll('.today-sched-check').length;
            applyProgress(day, allChecked);
            if (done) {
                const activity = e.target.dataset.activity ?? '';
                showReward(activity, detectIdentity(activity), allChecked.length === total);
            }
        });
    });

    // Notes — auto-resize + save on blur
    container.querySelectorAll('.today-note-input').forEach(ta => {
        ta.addEventListener('input', e => {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
        });
        ta.addEventListener('blur', e => saveNote(parseInt(e.target.dataset.idx, 10), e.target.value));
    });

    // Workout links
    container.addEventListener('click', e => {
        const link = e.target.closest('.today-workout-link');
        if (link) { e.preventDefault(); openWorkoutModal(link.dataset.workoutKey); }
    });

    // Rope: initial paint — re-evaluated each time Today tab is opened (see switchAppTab)
    updateTimelineRope(container, scheduleTimes);
}

// ── WeekPlanner: daily blueprint & modals ─────────────────────────
let quoteTimeout;

const blueprintTitle     = document.getElementById('daily-blueprint-title');
const blueprintContainer = document.getElementById('daily-blueprint-content');
const calendarNav        = document.getElementById('calendar-nav');
const scheduleModal      = document.getElementById('schedule-modal');
const scheduleModalTitle = document.getElementById('modal-title');
const scheduleModalBody  = document.getElementById('modal-body');
const scheduleModalClose = document.getElementById('modal-close');
const scheduleProgressBar= document.getElementById('modal-progress-bar');
const quoteDisplay       = document.getElementById('quote-display');
const workoutModal       = document.getElementById('workout-modal');
const workoutModalTitle  = document.getElementById('workout-modal-title');
const workoutModalBody   = document.getElementById('workout-modal-body');
const workoutModalClose  = document.getElementById('workout-modal-close');

function updateDailyBlueprint(day) {
    const data = _scheduleData[day];
    if (!data || !blueprintTitle || !blueprintContainer) return;
    blueprintTitle.textContent = `${day}'s Blueprint`;

    const matchers = [
        item => item.activity.includes('Wake'),
        item => item.activity.includes('Deep Work Block 1') || item.activity.includes('Running:') || item.activity.includes('Efficient Morning'),
        item => item.activity.includes('Lunch') || item.activity.includes('Brunch'),
        item => item.activity.includes('Deep Work Block 2') && ['Monday','Tuesday','Wednesday','Thursday','Friday'].includes(day),
        item => item.activity.includes('Strength:') || item.activity.includes('Running:') || item.activity.includes('Dinner Party'),
        item => item.activity.includes('Dinner') || item.activity.includes('Weekly Review') || item.activity.includes('Life Admin'),
        item => item.activity.includes('Sleep') && ['Saturday','Sunday'].includes(day)
    ];

    const milestones = [];
    const used = new Set();
    matchers.forEach(matcher => {
        let foundIdx = -1;
        const found = data.schedule.find((item, i) => {
            if (!used.has(i) && matcher(item)) { foundIdx = i; return true; }
            return false;
        });
        if (found && foundIdx !== -1) { milestones.push(found); used.add(foundIdx); }
    });

    // Sort by actual time so days like Sunday (Run at 4 PM, Brunch at 10:30 AM)
    // don't render out of chronological order.
    milestones.sort((a, b) => (parseTimeToMins(a.time) ?? 0) - (parseTimeToMins(b.time) ?? 0));

    blueprintContainer.innerHTML = milestones.map((ev, i) => `
        <div class="blueprint-step w-full md:w-auto">
            <span class="font-bold">${ev.time}</span><br>
            <span>${ev.activity.split(':')[0]}</span>
        </div>
        ${i < milestones.length - 1 ? '<div class="text-2xl font-bold text-blue-400">→</div>' : ''}
    `).join('');
}

function getProgress(day) {
    try {
        const d = localStorage.getItem(`progress_${day}`);
        return d ? JSON.parse(d) : [];
    } catch(e) { return []; }
}
function saveProgress(day, progress) {
    localStorage.setItem(`progress_${day}`, JSON.stringify(progress));
}

function showQuote() {
    clearTimeout(quoteTimeout);
    if (!quoteDisplay) return;
    quoteDisplay.textContent = getRandomQuote();
    quoteDisplay.style.opacity = 1;
    quoteTimeout = setTimeout(() => { quoteDisplay.style.opacity = 0; }, 60000);
}

// ── Identity detection helper ──────────────────────────────────────
function detectIdentity(activityText) {
    for (const [re, identity] of ACTIVITY_PILLARS) {
        if (re.test(activityText)) return identity;
    }
    return null;
}

// ── Reward popup ───────────────────────────────────────────────────
const REWARD_MESSAGES = [
    'Identity locked in. Keep going.',
    'Your future self thanks you.',
    'Small wins compound into great victories.',
    'Discipline is the bridge between goals and achievement.',
    'This is who you are becoming.',
    'Consistency over intensity. Always.',
    "The monk mode is strong with you.",
    'Building the habit — one check at a time.',
    'You don\'t stop when tired. You stop when done.',
    'Momentum is everything. Do not break the chain.',
];

let rewardTimeout;
function showReward(activityName, identity, isAllDone = false) {
    const popup = document.getElementById('reward-popup');
    if (!popup) return;

    const m    = identity ? IDENTITY_META[identity] : null;
    const pill = m
        ? `<span class="identity-pill" style="color:${m.color};background:${m.bg}"><i class="fas ${m.icon}"></i>${identity}</span>`
        : '';
    const msg  = isAllDone
        ? '🏆 Day complete! You crushed it.'
        : REWARD_MESSAGES[Math.floor(Math.random() * REWARD_MESSAGES.length)];
    const icon = isAllDone ? 'fa-trophy text-yellow-400' : 'fa-check text-green-400';

    popup.innerHTML = `
        <div class="flex items-start gap-3">
            <div class="reward-icon-wrap flex-shrink-0">
                <i class="fas ${icon} text-sm"></i>
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-white flex items-center gap-2 flex-wrap">
                    ${esc(activityName)} ${pill}
                </p>
                <p class="text-xs text-gray-400 mt-0.5">${msg}</p>
            </div>
            <button class="text-gray-600 hover:text-gray-300 flex-shrink-0 ml-1 transition-colors"
                    onclick="document.getElementById('reward-popup').classList.remove('reward-show')">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>`;

    popup.classList.add('reward-show');
    clearTimeout(rewardTimeout);
    rewardTimeout = setTimeout(() => popup.classList.remove('reward-show'), 3500);
}

// ── Week completion dashboard ──────────────────────────────────────
export function renderWeekDashboard() {
    const container = document.getElementById('week-dashboard');
    if (!container) return;

    const EN_DAYS  = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    const VI_ABBR  = ['T2','T3','T4','T5','T6','T7','CN'];
    const todayEn  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()];

    const rows = EN_DAYS.map((day, i) => {
        const total   = _scheduleData[day]?.schedule?.length ?? 0;
        const done    = getProgress(day).length;
        const pct     = total ? Math.round((done / total) * 100) : 0;
        const isToday = day === todayEn;
        const allDone = total > 0 && done >= total;
        const barCls  = allDone ? 'bg-green-500' : isToday ? 'bg-purple-500' : 'bg-indigo-400/60';

        return `
            <div class="flex items-center gap-2.5 px-2 py-1.5 rounded-lg ${isToday ? 'bg-purple-600/10 ring-1 ring-purple-500/30' : ''}">
                <div class="w-6 h-6 rounded-md flex items-center justify-center text-xs font-black flex-shrink-0
                    ${isToday ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}">
                    ${VI_ABBR[i]}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full ${barCls} rounded-full transition-all duration-500" style="width:${pct}%"></div>
                    </div>
                </div>
                <span class="text-xs font-bold tabular-nums w-9 text-right ${isToday ? 'text-purple-400' : 'text-gray-400'}">
                    ${total ? `${done}/${total}` : '—'}
                </span>
                <span class="w-3 flex-shrink-0 text-center">
                    ${allDone ? '<i class="fas fa-check text-green-500" style="font-size:.55rem"></i>' : ''}
                </span>
            </div>`;
    }).join('');

    container.innerHTML = `
        <h3 class="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
            <i class="fas fa-calendar-check mr-1.5 text-purple-brand"></i>Week Completion
        </h3>
        <div class="space-y-0.5">${rows}</div>`;
}

// ── Grinding clip window ───────────────────────────────────────────
const GRINDING_URL_KEY = 'monk_grinding_url';

/**
 * Convert a YouTube watch URL to an embed URL.
 * Returns null for non-YouTube or malformed input — iframe will not be set.
 */
function toEmbedUrl(raw) {
    const yt = raw.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=0&rel=0`;
    return null; // reject non-YouTube URLs
}

export function initGrindingWindow() {
    const urlInput    = document.getElementById('grinding-url');
    const frame       = document.getElementById('grinding-frame');
    const placeholder = document.getElementById('grinding-placeholder');
    const clearBtn    = document.getElementById('grinding-clear');
    if (!urlInput || !frame || !placeholder) return;

    function applyUrl(url) {
        if (!url) {
            frame.src = 'about:blank';
            frame.classList.add('hidden');
            placeholder.classList.remove('hidden');
            clearBtn?.classList.add('hidden');
            return;
        }
        const embed = toEmbedUrl(url);
        if (!embed) {
            // Non-YouTube URL — show error hint, don't touch iframe
            urlInput.classList.add('text-red-400');
            urlInput.title = 'Only YouTube URLs are supported';
            return;
        }
        urlInput.classList.remove('text-red-400');
        urlInput.title = '';
        frame.src = embed;
        frame.classList.remove('hidden');
        placeholder.classList.add('hidden');
        clearBtn?.classList.remove('hidden');
    }

    // Restore saved URL (validate before applying — defends against tampered localStorage)
    const saved = localStorage.getItem(GRINDING_URL_KEY) ?? '';
    if (saved) { urlInput.value = saved; applyUrl(saved); }

    urlInput.addEventListener('change', () => {
        const url = urlInput.value.trim();
        if (url) {
            const embed = toEmbedUrl(url);
            if (embed) localStorage.setItem(GRINDING_URL_KEY, url);
            // Don't persist invalid URLs
        } else {
            localStorage.removeItem(GRINDING_URL_KEY);
        }
        applyUrl(url);
    });

    clearBtn?.addEventListener('click', () => {
        urlInput.value = '';
        urlInput.classList.remove('text-red-400');
        urlInput.title = '';
        localStorage.removeItem(GRINDING_URL_KEY);
        applyUrl('');
    });
}

// ── Central progress sync — saves + updates both modal and inline ──
function applyProgress(day, checkedIndices) {
    saveProgress(day, checkedIndices);
    pushHabit(day, checkedIndices);

    // Sync modal (progress bar + checkbox states) if it's open for this day
    if (scheduleModal?.classList.contains('is-open') && scheduleModal?.dataset.day === day) {
        const all   = [...(scheduleModalBody?.querySelectorAll('.activity-checkbox') ?? [])];
        const total = all.length;
        if (total && scheduleProgressBar) {
            scheduleProgressBar.style.width = `${(checkedIndices.length / total) * 100}%`;
        }
        all.forEach(cb => { cb.checked = checkedIndices.includes(parseInt(cb.dataset.index, 10)); });
    }

    // Refresh week dashboard
    renderWeekDashboard();

    // Sync inline view (Today tab)
    document.getElementById('today-schedule-inline')
        ?.querySelectorAll('.today-sched-check').forEach(cb => {
            const idx  = parseInt(cb.dataset.idx, 10);
            const done = checkedIndices.includes(idx);
            if (cb.checked === done) return; // already correct, skip DOM write
            cb.checked = done;
            const row  = cb.closest('.today-sched-row');
            const name = row?.querySelector('.today-sched-name');
            row?.classList.toggle('sched-collapsed', done);
            name?.classList.toggle('line-through', done);
        });
}

function openScheduleModal(day) {
    const data = _scheduleData[day];
    if (!data || !scheduleModal) return;
    scheduleModal.dataset.day = day;
    if (scheduleModalTitle) scheduleModalTitle.textContent = data.title;
    if (quoteDisplay) quoteDisplay.style.opacity = 0;
    const saved = getProgress(day);

    let html = '<ul class="space-y-4">';
    data.schedule.forEach((item, idx) => {
        const checked = saved.includes(idx);
        const pillar  = activityPillarIconHtml(item.activity);
        html += `<li class="flex items-start pb-4 border-b last:border-b-0 border-gray-200 dark:border-gray-700">
            <div class="w-24 text-right pr-4 flex-shrink-0">
                <p class="font-bold text-sm modal-item-time">${item.time}</p>
            </div>
            <div class="flex-grow flex items-center gap-3">
                <input type="checkbox" data-index="${idx}" data-activity="${item.activity.replace(/"/g, '&quot;')}" class="activity-checkbox h-5 w-5 rounded accent-purple-600 flex-shrink-0" ${checked ? 'checked' : ''}>
                <div class="flex-1">`;
        html += item.workoutKey
            ? `<p class="font-semibold flex items-center gap-2"><a href="#" class="text-blue-500 hover:underline workout-link" data-workout-key="${item.workoutKey}">${item.activity}</a>${pillar}</p>`
            : `<p class="font-semibold flex items-center gap-2">${item.activity}${pillar}</p>`;
        html += `<p class="text-gray-500 dark:text-gray-400 text-sm">${item.details}</p></div></div></li>`;
    });
    html += '</ul>';
    if (scheduleModalBody) scheduleModalBody.innerHTML = html;
    // Set initial progress bar from saved state
    if (scheduleProgressBar && data.schedule.length) {
        scheduleProgressBar.style.width = `${(saved.length / data.schedule.length) * 100}%`;
    }
    document.body.classList.add('body-no-scroll');
    scheduleModal.classList.add('is-open');
}

function closeScheduleModal() {
    clearTimeout(quoteTimeout);
    scheduleModal?.classList.remove('is-open');
    document.body.classList.remove('body-no-scroll');
}

function openWorkoutModal(key) {
    const data = workoutDetails[key];
    if (!data || !workoutModal) return;
    if (workoutModalTitle) workoutModalTitle.textContent = data.title;
    let html = '<div class="space-y-5">';
    data.exercises.forEach(ex => {
        html += `<div><h3 class="text-base font-semibold">${ex.name}</h3>`;
        if (ex.steps?.length) {
            html += '<ul class="mt-2 space-y-1 list-disc list-inside text-gray-500 dark:text-gray-400 text-sm pl-2">';
            ex.steps.forEach(s => { html += `<li>${s}</li>`; });
            html += '</ul>';
        }
        html += '</div>';
    });
    html += '</div>';
    if (data.details) html += `<p class="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm italic">${data.details}</p>`;
    if (workoutModalBody) workoutModalBody.innerHTML = html;
    document.body.classList.add('body-no-scroll');
    workoutModal.classList.add('is-open');
}

function closeWorkoutModal() {
    workoutModal?.classList.remove('is-open');
    if (!scheduleModal?.classList.contains('is-open')) {
        document.body.classList.remove('body-no-scroll');
    }
}

export function initUI(scheduleData = {}) {
    _scheduleData = scheduleData;
    const days    = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    const abbr    = ['M','Tu','W','Th','F','Sa','Su'];
    const today   = new Date();
    const dow     = today.getDay();
    const adjIdx  = dow === 0 ? 6 : dow - 1;
    const todayName = days[adjIdx];

    // Dynamic week range label
    const monday = new Date(today);
    monday.setDate(today.getDate() - adjIdx);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const fmt = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const label = document.getElementById('week-range-label');
    if (label) label.textContent = `The Architecture of Discipline: ${fmt(monday)} – ${fmt(sunday)}`;

    // Build calendar nav buttons
    if (calendarNav) {
        days.forEach((day, i) => {
            const btn = document.createElement('button');
            btn.textContent = abbr[i];
            btn.setAttribute('data-day', day);
            btn.className = `day-btn ${day === todayName ? 'bg-purple-600 text-white' : ''}`;
            btn.addEventListener('click', () => {
                updateDailyBlueprint(day);
                openScheduleModal(day);
            });
            calendarNav.appendChild(btn);
        });
    }

    updateDailyBlueprint(todayName);

    // Habits drawer toggle
    const drawerToggle  = document.getElementById('habits-drawer-toggle');
    const drawerBody    = document.getElementById('habits-drawer-body');
    const drawerChevron = document.getElementById('habits-drawer-chevron');
    if (drawerToggle && drawerBody && drawerChevron) {
        drawerToggle.addEventListener('click', () => {
            const isOpen = drawerBody.classList.contains('open');
            drawerBody.classList.toggle('open', !isOpen);
            drawerChevron.classList.toggle('rotated', isOpen);
        });
    }

    // Event listeners
    scheduleModalClose?.addEventListener('click', closeScheduleModal);
    scheduleModal?.addEventListener('click', e => { if (e.target === scheduleModal) closeScheduleModal(); });
    scheduleModalBody?.addEventListener('change', e => {
        if (!e.target.classList.contains('activity-checkbox')) return;
        const day  = scheduleModal.dataset.day;
        const all  = [...(scheduleModalBody?.querySelectorAll('.activity-checkbox') ?? [])];
        const checkedIndices = all.filter(c => c.checked).map(c => parseInt(c.dataset.index, 10));
        applyProgress(day, checkedIndices);
        if (e.target.checked) {
            showQuote();
            const activity = e.target.dataset.activity ?? '';
            const allDone  = checkedIndices.length === all.length;
            showReward(activity, detectIdentity(activity), allDone);
        }
    });
    scheduleModalBody?.addEventListener('click', e => {
        if (e.target.classList.contains('workout-link')) {
            e.preventDefault();
            openWorkoutModal(e.target.getAttribute('data-workout-key'));
        }
    });
    workoutModalClose?.addEventListener('click', closeWorkoutModal);
    workoutModal?.addEventListener('click', e => { if (e.target === workoutModal) closeWorkoutModal(); });

    // Escape key closes whichever modal is open (workout first, then schedule)
    document.addEventListener('keydown', e => {
        if (e.key !== 'Escape') return;
        if (workoutModal?.classList.contains('is-open')) closeWorkoutModal();
        else if (scheduleModal?.classList.contains('is-open')) closeScheduleModal();
    });

    renderTodayScheduleInline();
}
