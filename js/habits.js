import { FULL_TRAINING_PLAN } from './plan_data.js';

// ── Storage ────────────────────────────────────────────────────────
class Storage {
    constructor(key) { this.key = key; }
    load() {
        try {
            const d = localStorage.getItem(this.key);
            return d ? JSON.parse(d) : [];
        } catch(e) {
            console.error(`Storage: failed to parse "${this.key}"`, e);
            return [];
        }
    }
    save(data) { localStorage.setItem(this.key, JSON.stringify(data)); }
    add(item)  { const d = this.load(); d.unshift(item); this.save(d); return d; }
    delete(id) { const d = this.load().filter(i => i.id !== id); this.save(d); return d; }
}

const runStorage = new Storage('lumi_runs');
const calStorage = new Storage('lumi_calendar');
const YEARLY_GOAL = 500;
const RACE_DATE   = new Date('2026-05-10');

// ── Daily plan data ────────────────────────────────────────────────
const detailedPlan = {
    "Thứ 2":     { fitness: "Rest & SRE Recovery (Read 1 Ch. SRE Book)", sre: "Học SRE Book (Google)", nutrition: "Nạp 130g Protein dù không tập." },
    "Thứ 3":     { fitness: "Run 6km Zone 2 (Nhịp tim < 145)", sre: "Terraform Practice (AWS VPC/EC2)", nutrition: "Bữa tối: Thịt bò luộc + Rau." },
    "Thứ 4":     { fitness: "Run 5km Easy + K8s Basics (1h)", sre: "Setup Minikube + Deploy Nginx", nutrition: "Sữa hạt Vinamilk + 2 Trứng luộc." },
    "Thứ 5":     { fitness: "Interval Run (4x800m Pace 6:30)", sre: "AWS CloudWatch Dashboards", nutrition: "Ăn tinh bột cao trước chạy." },
    "Thứ 6":     { fitness: "Rest & Strength Training (Core/Legs)", sre: "Review Weekly Progress", nutrition: "Thịt kho tôm tiêu + Cơm." },
    "Thứ 7":     { fitness: "Long Run 10km (Zone 2)", sre: "Tổng kết & Update Tracker", nutrition: "Nạp Gel km thứ 5. Cheat meal tối." },
    "Chủ Nhật": { fitness: "Rest & Reset", sre: "Meal Prep & Planning", nutrition: "Thư giãn, ăn uống đầy đủ." }
};

const defaultCalendar = [
    { id: 1, day: "Thứ 2", task: "SRE Recovery: Read 1 Ch. SRE Book", completed: false },
    { id: 2, day: "Thứ 3", task: "Run 6km Zone 2 + Terraform",         completed: false },
    { id: 4, day: "Thứ 4", task: "Run 5km Easy + K8s Basics",          completed: false },
    { id: 5, day: "Thứ 5", task: "Interval Run (4x800m)",               completed: false },
    { id: 6, day: "Thứ 6", task: "Rest & Strength Training",            completed: false },
    { id: 7, day: "Thứ 7", task: "Long Run 10km (Zone 2)",              completed: false },
    { id: 8, day: "Chủ Nhật", task: "Rest & Meal Prep",                 completed: false }
];

const defaultHabits = [
    { id: 101, name: "Dậy lúc 5:30",        completed: false },
    { id: 102, name: "Nạp đủ 130g Protein", completed: false },
    { id: 103, name: "Học SRE ít nhất 1h",  completed: false }
];

// ── Pace calculator ────────────────────────────────────────────────
function calculatePace(dist, dur) {
    if (!dist || dist <= 0 || !dur || dur <= 0) return "0:00";
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
    const days = Math.ceil((RACE_DATE - new Date()) / 86400000);
    el.textContent = days > 0 ? `${days} days` : days === 0 ? 'TODAY! 🏁' : 'Done 🎉';
}

// ── Dashboard ──────────────────────────────────────────────────────
function renderDashboard() {
    const dayNames = ["Chủ Nhật","Thứ 2","Thứ 3","Thứ 4","Thứ 5","Thứ 6","Thứ 7"];
    const todayName = dayNames[new Date().getDay()];
    const plan = detailedPlan[todayName];

    const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.innerText = val; };
    set('today-name',      todayName);
    set('today-fitness',   plan?.fitness);
    set('today-sre',       plan?.sre);
    set('today-nutrition', plan?.nutrition);

    const runs      = runStorage.load();
    const totalDist = runs.reduce((acc, r) => acc + (parseFloat(r.dist) || 0), 0);
    set('dash-total-dist', `${totalDist.toFixed(1)} km`);

    updateRaceCountdown();
    updateDashboardCheckboxes();
}

function updateDashboardCheckboxes() {
    const cal  = calStorage.load();
    if (!cal || !cal.habits) return;
    const h101 = cal.habits.find(h => h.id === 101);
    const h103 = cal.habits.find(h => h.id === 103);
    const activeClass   = "py-3 rounded-xl border border-indigo-500 bg-indigo-900/30 text-xs font-bold text-indigo-300 transition-all";
    const inactiveClass = "py-3 rounded-xl border border-gray-600 bg-white/5 text-xs font-bold text-gray-300 hover:bg-white/10 transition-all";
    const mBtn = document.getElementById('dash-check-morning');
    const sBtn = document.getElementById('dash-check-study');
    if (mBtn && h101) mBtn.className = h101.completed ? activeClass : inactiveClass;
    if (sBtn && h103) sBtn.className = h103.completed ? activeClass : inactiveClass;
}

// ── Running UI ─────────────────────────────────────────────────────
function renderRunningUI() {
    const runs        = runStorage.load();
    const list        = document.getElementById('activities-list');
    const totalDistEl = document.getElementById('total-dist');
    const avgPaceEl   = document.getElementById('avg-pace');
    const progressEl  = document.getElementById('progress-bar');
    const percentEl   = document.getElementById('goal-percent');
    if (!list || !totalDistEl || !avgPaceEl || !progressEl || !percentEl) return;

    if (!runs || runs.length === 0) {
        list.innerHTML = `<div class="text-center py-10 text-gray-400">
            <i class="fas fa-running text-4xl mb-3 opacity-30"></i>
            <p class="text-sm font-medium">No activities yet. Log your first run! 🏃</p>
        </div>`;
        totalDistEl.innerHTML = `0.0 <span class="text-lg font-normal text-gray-400">km</span>`;
        avgPaceEl.innerHTML   = `—`;
        progressEl.style.width = '0%';
        percentEl.innerText   = '0%';
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
    const pct = Math.min((totalDist / YEARLY_GOAL) * 100, 100);
    progressEl.style.width = `${pct}%`;
    percentEl.innerText    = `${Math.round(pct)}%`;
}

// ── Calendar / Habits ──────────────────────────────────────────────
function renderCalendar() {
    let cal = calStorage.load();
    if (!cal || !cal.schedule) {
        cal = { schedule: defaultCalendar, habits: defaultHabits };
        calStorage.save(cal);
    }

    const list      = document.getElementById('weekly-calendar-list');
    const habitList = document.getElementById('habits-list');

    if (list) {
        list.innerHTML = '';
        cal.schedule.forEach(item => {
            const row = document.createElement('label');
            row.className = `habit-row ${item.completed ? 'completed' : ''}`;
            row.innerHTML = `
                <input type="checkbox" ${item.completed ? 'checked' : ''} onchange="window.toggleCal(${item.id})"
                    class="h-4 w-4 rounded accent-indigo-500 flex-shrink-0">
                <div class="flex-1 min-w-0">
                    <span class="text-[10px] text-indigo-400 font-bold uppercase block">${item.day}</span>
                    <span class="text-sm font-medium block truncate ${item.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-200'}">${item.task}</span>
                </div>`;
            list.appendChild(row);
        });
    }

    if (habitList) {
        habitList.innerHTML = '';
        cal.habits.forEach(h => {
            const row = document.createElement('label');
            row.className = `habit-row ${h.completed ? 'completed' : ''}`;
            row.innerHTML = `
                <input type="checkbox" ${h.completed ? 'checked' : ''} onchange="window.toggleHabit(${h.id})"
                    class="h-4 w-4 rounded accent-green-500 flex-shrink-0">
                <span class="text-sm font-medium ${h.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-200'}">${h.name}</span>`;
            habitList.appendChild(row);
        });
    }
}

// ── Training Plan ──────────────────────────────────────────────────
function renderFullPlanUI() {
    const container = document.getElementById('plan-weeks-container');
    if (!container) return;
    container.innerHTML = '';

    FULL_TRAINING_PLAN.forEach(week => {
        const typeColor = { rest: 'text-gray-400', easy: 'text-green-400', speed: 'text-yellow-400', long: 'text-purple-400', strength: 'text-blue-400', race: 'text-red-400 font-bold animate-pulse' };
        let daysHtml = '';
        week.days.forEach(d => {
            daysHtml += `<div class="flex items-center justify-between px-4 py-2 border-t border-gray-700/30 text-xs">
                <span class="font-bold text-gray-400 w-10 flex-shrink-0">${d.day}</span>
                <span class="flex-1 pl-3 ${typeColor[d.type] || 'text-gray-300'}">${d.task}</span>
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
    const cal = calStorage.load();
    if (!cal || !cal.schedule) return;
    const item = cal.schedule.find(i => i.id === id);
    if (item) item.completed = !item.completed;
    calStorage.save(cal);
    renderAll();
}

function toggleHabit(id) {
    const cal = calStorage.load();
    if (!cal || !cal.habits) return;
    const habit = cal.habits.find(h => h.id === id);
    if (habit) habit.completed = !habit.completed;
    calStorage.save(cal);
    renderAll();
}

function deleteRun(id) {
    if (confirm('Delete this run?')) {
        runStorage.delete(id);
        renderAll();
    }
}

// ── Run form ───────────────────────────────────────────────────────
function setupRunForm() {
    const form = document.getElementById('run-form');
    const errEl = document.getElementById('run-form-error');
    if (!form) return;
    const dateInput = document.getElementById('run-date');
    if (dateInput) dateInput.valueAsDate = new Date();

    form.onsubmit = (e) => {
        e.preventDefault();
        const dist = parseFloat(document.getElementById('run-dist').value);
        const dur  = parseFloat(document.getElementById('run-dur').value);
        const date = document.getElementById('run-date').value;
        if (isNaN(dist) || isNaN(dur) || dist <= 0 || dur <= 0) {
            if (errEl) errEl.classList.remove('hidden');
            return;
        }
        if (errEl) errEl.classList.add('hidden');
        runStorage.add({ id: Date.now(), date, dist, dur, pace: calculatePace(dist, dur) });
        renderAll();
        form.reset();
        document.getElementById('run-date').valueAsDate = new Date();
    };
}

// ── Render all ─────────────────────────────────────────────────────
function renderAll() {
    renderCalendar();
    renderRunningUI();
    renderDashboard();
    renderFullPlanUI();
}

// ── Init ───────────────────────────────────────────────────────────
export function initHabits() {
    setupRunForm();
    renderAll();

    window.toggleCal    = toggleCal;
    window.toggleHabit  = toggleHabit;
    window.deleteRun    = deleteRun;
}
