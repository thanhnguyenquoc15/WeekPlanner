import { FULL_TRAINING_PLAN } from './plan_data.js';
import { Storage }            from './storage.js';
import { YEARLY_GOAL_KM, RACE_DATE, STORAGE_KEYS } from './config.js';

// ── Storage instances ──────────────────────────────────────────────
const runStorage = new Storage(STORAGE_KEYS.runs);
const calStorage = new Storage(STORAGE_KEYS.calendar);

// ── Injected week data (set by initHabits) ─────────────────────────
let _detailedPlan    = {};
let _defaultCalendar = [];
let _defaultHabits   = [];

// ── Pace calculator ────────────────────────────────────────────────
function calculatePace(dist, dur) {
    if (!dist || dist <= 0 || !dur || dur <= 0) return '0:00';
    const dec  = dur / dist;
    const mins = Math.floor(dec);
    let   secs = Math.round((dec - mins) * 60);
    if (secs === 60) return `${mins + 1}:00`;
    return `${mins}:${String(secs).padStart(2, '0')}`;
}

// ── Race countdown ─────────────────────────────────────────────────
function updateRaceCountdown() {
    const el = document.getElementById('race-countdown');
    if (!el) return;
    const days = Math.ceil((RACE_DATE - new Date()) / 86_400_000);
    el.textContent = days > 0 ? `${days} days` : days === 0 ? 'TODAY! 🏁' : 'Done 🎉';
}

// ── Dashboard ──────────────────────────────────────────────────────
function renderDashboard() {
    const dayNames  = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const todayName = dayNames[new Date().getDay()];
    const plan      = _detailedPlan[todayName];

    const set = (id, val) => {
        const el = document.getElementById(id);
        if (el && val != null) el.innerText = val;
    };
    set('today-name',      todayName);
    set('today-fitness',   plan?.fitness);
    set('today-sre',       plan?.sre);
    set('today-nutrition', plan?.nutrition);

    const runs      = runStorage.load() ?? [];
    const totalDist = runs.reduce((acc, r) => acc + (parseFloat(r.dist) || 0), 0);
    set('dash-total-dist', `${totalDist.toFixed(1)} km`);

    updateRaceCountdown();
    updateDashboardCheckboxes();
}

function updateDashboardCheckboxes() {
    const cal = calStorage.load();
    if (!cal?.habits) return;

    const activeClass   = 'py-3 rounded-xl border border-indigo-500 bg-indigo-900/30 text-xs font-bold text-indigo-300 transition-all';
    const inactiveClass = 'py-3 rounded-xl border border-gray-600 bg-white/5 text-xs font-bold text-gray-300 hover:bg-white/10 transition-all';

    const h101 = cal.habits.find(h => h.id === 101);
    const h103 = cal.habits.find(h => h.id === 103);
    const mBtn = document.getElementById('dash-check-morning');
    const sBtn = document.getElementById('dash-check-study');
    if (mBtn && h101) mBtn.className = h101.completed ? activeClass : inactiveClass;
    if (sBtn && h103) sBtn.className = h103.completed ? activeClass : inactiveClass;
}

// ── Running UI ─────────────────────────────────────────────────────
function renderRunningUI() {
    const runs       = runStorage.load() ?? [];
    const list       = document.getElementById('activities-list');
    const totalDistEl = document.getElementById('total-dist');
    const avgPaceEl  = document.getElementById('avg-pace');
    const progressEl = document.getElementById('progress-bar');
    const percentEl  = document.getElementById('goal-percent');
    if (!list || !totalDistEl || !avgPaceEl || !progressEl || !percentEl) return;

    if (runs.length === 0) {
        list.innerHTML = `<div class="text-center py-10 text-gray-400">
            <i class="fas fa-running text-4xl mb-3 opacity-30"></i>
            <p class="text-sm font-medium">No activities yet. Log your first run! 🏃</p>
        </div>`;
        totalDistEl.innerHTML  = `0.0 <span class="text-lg font-normal text-gray-400">km</span>`;
        avgPaceEl.innerHTML    = `—`;
        progressEl.style.width = '0%';
        percentEl.innerText    = '0%';
        return;
    }

    let totalDist = 0, totalDur = 0;
    list.innerHTML = '';
    runs.forEach(run => {
        totalDist += parseFloat(run.dist) || 0;
        totalDur  += parseFloat(run.dur)  || 0;
        const card = document.createElement('div');
        card.className = 'run-card';
        card.innerHTML = `
            <div>
                <p class="text-xs text-purple-400 font-bold uppercase">${run.date}</p>
                <p class="text-xl font-bold text-white">${parseFloat(run.dist).toFixed(2)} km</p>
            </div>
            <div class="flex items-center gap-4">
                <div class="text-right">
                    <p class="text-xs text-gray-500">Pace</p>
                    <p class="font-semibold text-gray-300">${run.pace} /km</p>
                </div>
                <button onclick="window.deleteRun(${run.id})"
                    class="text-gray-600 hover:text-red-400 transition-colors p-1">
                    <i class="fas fa-trash-alt text-sm"></i>
                </button>
            </div>`;
        list.appendChild(card);
    });

    totalDistEl.innerHTML = `${totalDist.toFixed(1)} <span class="text-lg font-normal text-gray-400">km</span>`;
    avgPaceEl.innerHTML   = `${calculatePace(totalDist, totalDur)} <span class="text-sm font-normal text-gray-400">/km</span>`;
    const pct = Math.min((totalDist / YEARLY_GOAL_KM) * 100, 100);
    progressEl.style.width = `${pct}%`;
    percentEl.innerText    = `${Math.round(pct)}%`;
}

// ── Derive weekly calendar items from scheduleData ─────────────────
const DAY_EN_ORDER = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const DAY_EN_TO_VI = {
    Monday: 'Thứ 2', Tuesday: 'Thứ 3', Wednesday: 'Thứ 4',
    Thursday: 'Thứ 5', Friday: 'Thứ 6', Saturday: 'Thứ 7', Sunday: 'Chủ Nhật',
};

function deriveCalendarItems(scheduleData) {
    return DAY_EN_ORDER.map((day, i) => {
        const title = scheduleData[day]?.title ?? '';
        // Strip the "DayName: " prefix, keep the focus description
        const focus = title.includes(':') ? title.split(':').slice(1).join(':').trim() : title;
        return { id: i + 1, day: DAY_EN_TO_VI[day], task: focus || day, completed: false };
    });
}

// ── Calendar / Habits ──────────────────────────────────────────────
const DAY_STYLES = {
    'Thứ 2':    { abbr: 'T2' },
    'Thứ 3':    { abbr: 'T3' },
    'Thứ 4':    { abbr: 'T4' },
    'Thứ 5':    { abbr: 'T5' },
    'Thứ 6':    { abbr: 'T6' },
    'Thứ 7':    { abbr: 'T7' },
    'Chủ Nhật': { abbr: 'CN' },
};

const HABIT_META = {
    101: { icon: 'fa-sun',           color: '#f59e0b' },
    102: { icon: 'fa-drumstick-bite', color: '#ef4444' },
    103: { icon: 'fa-laptop-code',   color: '#3b82f6' },
};

function loadCalendar() {
    let cal = calStorage.load();

    if (!cal || typeof cal !== 'object' || Array.isArray(cal)) {
        cal = { schedule: _defaultCalendar, habits: _defaultHabits };
        calStorage.save(cal);
        return cal;
    }
    let dirty = false;
    if (!Array.isArray(cal.schedule)) {
        cal.schedule = _defaultCalendar;
        dirty = true;
    } else {
        // Always sync task text from the derived source — preserve only `completed` state
        const merged = _defaultCalendar.map(def => {
            const saved = cal.schedule.find(s => s.id === def.id);
            return { ...def, completed: saved?.completed ?? false };
        });
        if (JSON.stringify(merged) !== JSON.stringify(cal.schedule)) {
            cal.schedule = merged;
            dirty = true;
        }
    }
    if (!Array.isArray(cal.habits)) { cal.habits = _defaultHabits; dirty = true; }
    if (dirty) calStorage.save(cal);
    return cal;
}

function renderCalendar() {
    const cal      = loadCalendar();
    const dayNames = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const todayVi  = dayNames[new Date().getDay()];

    const list      = document.getElementById('weekly-calendar-list');
    const habitList = document.getElementById('habits-list');

    if (list) {
        list.innerHTML = '';
        cal.schedule.forEach(item => {
            const s       = DAY_STYLES[item.day] ?? { abbr: item.day };
            const isToday = item.day === todayVi;
            const row = document.createElement('label');
            row.className = `cal-row${item.completed ? ' cal-done' : ''}${isToday ? ' cal-today' : ''}`;
            row.innerHTML = `
                <input type="checkbox" class="sr-only" ${item.completed ? 'checked' : ''} onchange="window.toggleCal(${item.id})">
                <div class="cal-day-pill" data-day="${s.abbr}">${s.abbr}</div>
                <div class="flex-1 min-w-0">
                    ${isToday ? '<span class="cal-today-badge">Today</span>' : ''}
                    <span class="cal-task${item.completed ? ' cal-task-done' : ''}">${item.task}</span>
                </div>
                <div class="cal-check${item.completed ? ' cal-check-done' : ''}">
                    ${item.completed ? '<i class="fas fa-check" style="font-size:.6rem"></i>' : ''}
                </div>`;
            list.appendChild(row);
        });
    }

    if (habitList) {
        habitList.innerHTML = '';
        cal.habits.forEach(h => {
            const meta = HABIT_META[h.id] ?? { icon: 'fa-check', color: '#6b7280' };
            const row  = document.createElement('label');
            row.className = `cal-row${h.completed ? ' cal-done' : ''}`;
            row.innerHTML = `
                <input type="checkbox" class="sr-only" ${h.completed ? 'checked' : ''} onchange="window.toggleHabit(${h.id})">
                <div class="cal-habit-icon${h.completed ? ' cal-habit-done' : ''}">
                    <i class="fas ${meta.icon}" style="color:${h.completed ? '#22c55e' : meta.color};font-size:.8rem"></i>
                </div>
                <span class="flex-1 text-sm font-medium${h.completed ? ' cal-task-done' : ''}">${h.name}</span>
                <div class="cal-check${h.completed ? ' cal-check-done' : ''}">
                    ${h.completed ? '<i class="fas fa-check" style="font-size:.6rem"></i>' : ''}
                </div>`;
            habitList.appendChild(row);
        });
    }
}

// ── Training Plan ──────────────────────────────────────────────────
function renderFullPlanUI() {
    const container = document.getElementById('plan-weeks-container');
    if (!container) return;
    container.innerHTML = '';

    const typeColor = {
        rest:     'text-gray-400',
        easy:     'text-green-400',
        speed:    'text-yellow-400',
        long:     'text-purple-400',
        strength: 'text-blue-400',
        race:     'text-red-400 font-bold animate-pulse',
    };

    FULL_TRAINING_PLAN.forEach(week => {
        let daysHtml = '';
        week.days.forEach(d => {
            daysHtml += `<div class="flex items-center justify-between px-4 py-2 border-t border-gray-700/30 text-xs">
                <span class="font-bold text-gray-400 w-10 flex-shrink-0">${d.day}</span>
                <span class="flex-1 pl-3 ${typeColor[d.type] ?? 'text-gray-300'}">${d.task}</span>
            </div>`;
        });
        const card = document.createElement('div');
        card.className = 'plan-week-card';
        card.innerHTML = `
            <div class="plan-week-header">
                <span class="text-sm font-bold text-white uppercase">Tuần ${week.week}</span>
                <span class="text-xs text-gray-400 italic">${week.focus}</span>
            </div>
            ${daysHtml}`;
        container.appendChild(card);
    });
}

// ── Toggles ────────────────────────────────────────────────────────
function toggleCal(id) {
    const cal = loadCalendar();
    const item = cal.schedule.find(i => i.id === id);
    if (item) item.completed = !item.completed;
    calStorage.save(cal);
    renderAll();
}

function toggleHabit(id) {
    const cal   = loadCalendar();
    const habit = cal.habits.find(h => h.id === id);
    if (habit) habit.completed = !habit.completed;
    calStorage.save(cal);
    renderAll();
}

function deleteRun(id) {
    if (!confirm('Delete this run?')) return;
    runStorage.remove(id);
    renderAll();
}

// ── Run export / import ────────────────────────────────────────────
function exportRuns() {
    const runs = runStorage.load() ?? [];
    const blob = new Blob([JSON.stringify(runs, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), { href: url, download: 'runs.json' });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function setupRunImport(inputEl) {
    inputEl?.addEventListener('change', e => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            try {
                const data = JSON.parse(ev.target.result);
                if (!Array.isArray(data)) throw new Error('Expected a JSON array');
                runStorage.save(data);
                renderAll();
                inputEl.value = '';
            } catch {
                alert('Invalid file — expected a runs.json array.');
            }
        };
        reader.readAsText(file);
    });
}

// ── Run form ───────────────────────────────────────────────────────
function setupRunForm() {
    const form  = document.getElementById('run-form');
    const errEl = document.getElementById('run-form-error');
    if (!form) return;

    const dateInput = document.getElementById('run-date');
    if (dateInput) dateInput.valueAsDate = new Date();

    form.onsubmit = e => {
        e.preventDefault();
        const dist = parseFloat(document.getElementById('run-dist').value);
        const dur  = parseFloat(document.getElementById('run-dur').value);
        const date = document.getElementById('run-date').value;
        if (isNaN(dist) || isNaN(dur) || dist <= 0 || dur <= 0) {
            errEl?.classList.remove('hidden');
            return;
        }
        errEl?.classList.add('hidden');
        runStorage.add({ id: Date.now(), date, dist, dur, pace: calculatePace(dist, dur) });
        renderAll();
        form.reset();
        document.getElementById('run-date').valueAsDate = new Date();
    };

    document.getElementById('export-runs-btn')?.addEventListener('click', exportRuns);
    setupRunImport(document.getElementById('import-runs-input'));
}

// ── Render all ─────────────────────────────────────────────────────
function renderAll() {
    renderCalendar();
    renderRunningUI();
    renderDashboard();
    renderFullPlanUI();
}

// ── Init ───────────────────────────────────────────────────────────
export function initHabits({ detailedPlan, defaultCalendar, defaultHabits, scheduleData }) {
    _detailedPlan    = detailedPlan;
    _defaultCalendar = scheduleData && Object.keys(scheduleData).length
        ? deriveCalendarItems(scheduleData)
        : defaultCalendar;
    _defaultHabits   = defaultHabits;

    setupRunForm();
    renderAll();

    window.toggleCal   = toggleCal;
    window.toggleHabit = toggleHabit;
    window.deleteRun   = deleteRun;
}
