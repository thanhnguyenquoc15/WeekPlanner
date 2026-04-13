import { FULL_TRAINING_PLAN } from './plan_data.js';
import { Storage }            from './storage.js';
import { YEARLY_GOAL_KM, RACE_DATE, STORAGE_KEYS } from './config.js';
import { identityPillHtml }  from './identity.js';
import { pullRuns, pushRun, removeRun as cloudRemoveRun, pullHabits, pushHabit } from './sync.js';

// ── Security helpers ───────────────────────────────────────────────
// Escape HTML special chars before injecting into innerHTML
const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));
// Only allow http/https URLs — blocks javascript: and data: URIs
const safeUrl = url => (typeof url === 'string' && /^https?:\/\//i.test(url)) ? url : null;

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

    const nameEl = document.getElementById('today-name');
    if (nameEl) nameEl.innerText = todayName;

    const runs      = runStorage.load() ?? [];
    const totalDist = runs.reduce((acc, r) => acc + (parseFloat(r.dist) || 0), 0);
    const distEl = document.getElementById('dash-total-dist');
    if (distEl) distEl.innerText = `${totalDist.toFixed(1)} km`;

    updateRaceCountdown();
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
    runs.forEach(r => { totalDist += parseFloat(r.dist) || 0; totalDur += parseFloat(r.dur) || 0; });
    const maxDist = Math.max(...runs.map(r => parseFloat(r.dist) || 0));
    const byDate  = Object.fromEntries(runs.map(r => [r.date, r]));
    const months  = [...new Set(runs.map(r => r.date.slice(0, 7)))].sort().reverse();
    const DAY_HDR = ['M','T','W','T','F','S','S'];

    list.innerHTML = `
        <div class="run-layout">
            <div class="run-cal-side" id="run-cal-side"></div>
            <div class="run-detail-side" id="run-detail-side">
                <div class="run-detail-empty">
                    <i class="fas fa-shoe-prints text-2xl opacity-20"></i>
                    <p class="text-xs text-gray-600 mt-2">tap a run</p>
                </div>
            </div>
        </div>`;

    const calSide    = list.querySelector('#run-cal-side');
    const detailSide = list.querySelector('#run-detail-side');

    // ── Build compact monthly calendars ───────────────────────────────
    months.forEach(ym => {
        const [yr, mo] = ym.split('-').map(Number);
        const daysInMonth = new Date(yr, mo, 0).getDate();
        const startOffset = (new Date(yr, mo - 1, 1).getDay() + 6) % 7;
        const label = new Date(yr, mo - 1, 1).toLocaleString('default', { month: 'short', year: 'numeric' });

        const section = document.createElement('div');
        section.className = 'run-mini-month';
        section.innerHTML = `<p class="run-mini-label">${label}</p>
            <div class="run-mini-dow">${DAY_HDR.map(d => `<span>${d}</span>`).join('')}</div>
            <div class="run-mini-grid"></div>`;
        calSide.appendChild(section);

        const grid = section.querySelector('.run-mini-grid');
        for (let i = 0; i < startOffset; i++) {
            const e = document.createElement('div'); e.className = 'run-mini-cell'; grid.appendChild(e);
        }
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${yr}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            const run  = byDate[dateStr];
            const cell = document.createElement('div');
            if (run) {
                const dist = parseFloat(run.dist);
                const cls  = dist >= maxDist * 0.75 ? 'run-mini-high'
                           : dist >= maxDist * 0.4  ? 'run-mini-mid' : 'run-mini-low';
                cell.className = `run-mini-cell run-mini-run ${cls}`;
                cell.addEventListener('click', () => selectRun(run, cell));
            } else {
                cell.className = 'run-mini-cell run-mini-rest';
                cell.textContent = d;
            }
            grid.appendChild(cell);
        }
    });

    // ── Detail panel ──────────────────────────────────────────────────
    function selectRun(run, activeCell) {
        document.querySelectorAll('.run-mini-run.active').forEach(el => el.classList.remove('active'));
        activeCell.classList.add('active');

        const dist    = parseFloat(run.dist) || 0;
        const src     = safeUrl(run.src);   // blocks javascript:/data: URIs
        const cal     = parseInt(run.cal)  || 0;
        const pace    = esc(run.pace ?? '');
        const date    = esc(run.date ?? '');

        detailSide.innerHTML = `
            <p class="text-xs text-purple-400 font-bold uppercase tracking-widest mb-1">${date}</p>
            <p class="text-3xl font-black text-white leading-tight">${dist.toFixed(2)} <span class="text-base font-normal text-gray-400">km</span></p>
            <div class="flex gap-3 mt-2 justify-center text-sm">
                <span class="text-gray-300">${pace} <span class="text-xs text-gray-500">/km</span></span>
                ${cal ? `<span class="text-gray-600">·</span><span class="text-orange-400">${cal} <span class="text-xs text-gray-500">cal</span></span>` : ''}
            </div>
            <p class="text-xs text-gray-600 italic mt-3 px-2">"Execution separates dreamers from achievers."</p>
            ${src ? `<a href="${esc(src)}" target="_blank" rel="noopener noreferrer" class="text-xs text-gray-500 hover:text-orange-400 transition-colors block mt-2">View on Garmin ↗</a>` : ''}
            <button id="run-detail-delete" class="text-xs text-gray-600 hover:text-red-400 transition-colors mt-3">
                <i class="fas fa-trash-alt"></i> delete
            </button>`;

        // Event listener instead of inline onclick — avoids id injection
        detailSide.querySelector('#run-detail-delete')
            .addEventListener('click', () => { if (confirm('Delete?')) window.deleteRun(run.id); });
    }

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
                    ${identityPillHtml(item.identity)}
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
                <div class="flex-1 min-w-0">
                    <span class="block text-sm font-medium${h.completed ? ' cal-task-done' : ''}">${h.name}</span>
                    ${identityPillHtml(h.identity)}
                </div>
                <div class="cal-check${h.completed ? ' cal-check-done' : ''}">
                    ${h.completed ? '<i class="fas fa-check" style="font-size:.6rem"></i>' : ''}
                </div>`;
            habitList.appendChild(row);
        });
    }
}

// ── Training Plan ──────────────────────────────────────────────────
const TYPE_TO_IDENTITY = {
    rest:     'Healthy',
    easy:     'Runner',
    speed:    'Runner',
    long:     'Runner',
    strength: 'Healthy',
    race:     'Runner',
};

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
            daysHtml += `<div class="flex items-center gap-3 px-4 py-2 border-t border-gray-700/30 text-xs">
                <span class="font-bold text-gray-400 w-10 flex-shrink-0">${d.day}</span>
                <span class="flex-1 ${typeColor[d.type] ?? 'text-gray-300'}">${d.task}</span>
                ${identityPillHtml(TYPE_TO_IDENTITY[d.type])}
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
    cloudRemoveRun(id);
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

// ── Garmin GPX import ─────────────────────────────────────────────
function haversineKm(lat1, lon1, lat2, lon2) {
    const R     = 6371;
    const toRad = x => x * Math.PI / 180;
    const dLat  = toRad(lat2 - lat1);
    const dLon  = toRad(lon2 - lon1);
    const a     = Math.sin(dLat / 2) ** 2
                + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function parseGPX(text) {
    const doc = new DOMParser().parseFromString(text, 'application/xml');
    if (doc.querySelector('parsererror')) throw new Error('Invalid GPX file');

    const trkpts = [...doc.querySelectorAll('trkpt')];
    if (trkpts.length < 2) throw new Error('Not enough GPS trackpoints');

    const getTime = pt => new Date(pt.querySelector('time')?.textContent?.trim() ?? '');
    const t0 = getTime(trkpts[0]);
    const tN = getTime(trkpts[trkpts.length - 1]);
    if (isNaN(t0.getTime()) || isNaN(tN.getTime())) throw new Error('Missing or unreadable timestamps');

    // Sum Haversine distances between consecutive points
    let dist = 0;
    for (let i = 1; i < trkpts.length; i++) {
        dist += haversineKm(
            parseFloat(trkpts[i - 1].getAttribute('lat')),
            parseFloat(trkpts[i - 1].getAttribute('lon')),
            parseFloat(trkpts[i].getAttribute('lat')),
            parseFloat(trkpts[i].getAttribute('lon')),
        );
    }

    const dur  = (tN - t0) / 60_000; // total minutes
    const date = t0.toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
    return {
        id:   Date.now(),
        date,
        dist: parseFloat(dist.toFixed(2)),
        dur:  parseFloat(dur.toFixed(1)),
        pace: calculatePace(dist, dur),
    };
}

function importGPXFile(file, onSuccess) {
    if (!file || !file.name.endsWith('.gpx')) return;
    const reader = new FileReader();
    reader.onload = ev => {
        try {
            const run = parseGPX(ev.target.result);
            runStorage.add(run);
            pushRun(run);
            renderAll();
            onSuccess?.(run);
        } catch (err) {
            alert(`GPX import failed: ${err.message}\n\nExport from Garmin Connect: activity page → ··· → Export to GPX.`);
        }
    };
    reader.readAsText(file);
}

function setupGPXImport(inputEl) {
    const label = document.getElementById('import-gpx-label');

    // File input (button click)
    inputEl?.addEventListener('change', e => {
        const file = e.target.files?.[0];
        importGPXFile(file, () => {
            inputEl.value = '';
            if (label) {
                const orig = label.innerHTML;
                label.innerHTML = '<i class="fas fa-check"></i> Added!';
                setTimeout(() => { label.innerHTML = orig; }, 2000);
            }
        });
    });

    // Drag-and-drop onto the entire Running tab
    const zone = document.getElementById('app-tab-running');
    if (!zone) return;

    zone.addEventListener('dragover', e => {
        e.preventDefault();
        zone.classList.add('gpx-drop-active');
    });
    zone.addEventListener('dragleave', e => {
        if (!zone.contains(e.relatedTarget)) zone.classList.remove('gpx-drop-active');
    });
    zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.classList.remove('gpx-drop-active');
        const file = [...(e.dataTransfer.files ?? [])].find(f => f.name.endsWith('.gpx'));
        if (!file) return;
        importGPXFile(file, run => {
            // Brief flash on the tab itself
            const banner = document.getElementById('gpx-drop-banner');
            if (banner) {
                banner.textContent = `✓ ${run.dist} km added — ${run.date}`;
                banner.classList.remove('hidden');
                setTimeout(() => banner.classList.add('hidden'), 3000);
            }
        });
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
        const run = { id: Date.now(), date, dist, dur, pace: calculatePace(dist, dur) };
        runStorage.add(run);
        pushRun(run);
        renderAll();
        form.reset();
        document.getElementById('run-date').valueAsDate = new Date();
    };

    document.getElementById('export-runs-btn')?.addEventListener('click', exportRuns);
    setupRunImport(document.getElementById('import-runs-input'));
    setupGPXImport(document.getElementById('import-gpx-input'));
}

// ── Garmin bookmarklet setup ───────────────────────────────────────
function buildBookmarkletCode(appUrl) {
    // DOM scrape via title attributes — finds stats by their label, not by text position.
    // Works regardless of language (Italian "Tempo", English "Time", etc.).
    return [
        '(function(){',
        'if(!location.hostname.includes("connect.garmin.com")){',
        '  alert("Navigate to a Garmin Connect activity page first.");return;',
        '}',

        // findStat: look up a stat value by its label's title attribute
        'function findStat(labels){',
        '  for(var i=0;i<labels.length;i++){',
        '    var el=document.querySelector(\'[title="\'+labels[i]+\'"]\');',
        '    if(!el)continue;',
        '    var p=el.parentElement;if(!p)continue;',
        '    for(var j=0;j<p.children.length;j++){',
        '      if(p.children[j]!==el){var t=p.children[j].textContent.trim();if(t)return t;}',
        '    }',
        '  }',
        '  return null;',
        '}',

        // parseTime: "36:36" → mins, "1:02:15" → mins
        'function parseTime(s){',
        '  if(!s)return null;',
        '  var p=s.trim().split(":");',
        '  if(p.length===3)return parseInt(p[0])*60+parseInt(p[1])+parseInt(p[2])/60;',
        '  if(p.length===2)return parseInt(p[0])+parseInt(p[1])/60;',
        '  return null;',
        '}',

        // ── Distance ─────────────────────────────────────────────────
        'var distText=findStat(["Distance","Distanza","Distância","Distancia","Afstand","Distanz","距離","距离"]);',
        'var dist=null;',
        'if(distText){',
        '  var dm=distText.match(/(\\d+\\.?\\d*)/);',
        '  if(dm)dist=parseFloat(dm[1]).toFixed(2);',
        '  if(/\\bmi\\b/i.test(distText)&&dist)dist=(parseFloat(dist)*1.60934).toFixed(2);',
        '}',
        // Fallback: scan for first "X.XX km" not followed by /h
        'if(!dist||parseFloat(dist)<=0){',
        '  var bm=document.body.innerText.match(/(\\d+\\.?\\d*)\\s*km(?![\\s\\/]*h)/i);',
        '  if(bm)dist=parseFloat(bm[1]).toFixed(2);',
        '}',

        // ── Calories ─────────────────────────────────────────────────
        'var calText=findStat(["Calories","Calorie","Calorías","Kalorien","Calories","칼로리","卡路里"]);',
        'var cal=calText?parseInt(calText.replace(/[^\\d]/g,""))||0:0;',

        // ── Duration ─────────────────────────────────────────────────
        // Labels tried in priority order — "Elapsed Time" before "Moving Time"
        'var timeText=findStat(["Time","Tempo","Elapsed Time","Duration","Duración","Temps","Zeit","Tid","Tijd","경과 시간","时间"]);',
        'var dur=parseTime(timeText);',
        'if(dur)dur=dur.toFixed(1);',

        // ── Date ─────────────────────────────────────────────────────
        // Parse components manually — avoids UTC timezone shift from new Date("Month D, YYYY")
        'var date=new Date().toISOString().slice(0,10);',
        'var MO={jan:"01",feb:"02",mar:"03",apr:"04",may:"05",jun:"06",jul:"07",aug:"08",sep:"09",oct:"10",nov:"11",dec:"12"};',
        'var body=document.body.innerText;',
        'var dateM=body.match(/\\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\\s+(\\d{1,2}),?\\s+(\\d{4})\\b/i);',
        'if(dateM){var mo=MO[dateM[1].slice(0,3).toLowerCase()];var dy=String(parseInt(dateM[2])).padStart(2,"0");var yr=dateM[3];if(mo)date=yr+"-"+mo+"-"+dy;}',

        // ── Validate & redirect ───────────────────────────────────────
        'var garminUrl=location.href;',
        'console.log("[Garmin] dist="+dist+" dur="+dur+" cal="+cal+" date="+date+" url="+garminUrl);',
        'if(!dist||parseFloat(dist)<=0){',
        '  alert("Could not find Distance stat.\\nMake sure the activity page is fully loaded.");return;',
        '}',
        'if(!dur||parseFloat(dur)<=0){',
        '  alert("Found "+dist+"km but could not read Time.\\nPage title attribute found: "+timeText);return;',
        '}',
        `location.href="${appUrl}?tab=running&import_run=1&dist="+dist+"&dur="+dur+"&date="+date+"&cal="+cal+"&src="+encodeURIComponent(garminUrl);`,
        '})()',
    ].join('');
}

function setupBookmarklet() {
    const urlInput  = document.getElementById('bookmarklet-app-url');
    const dragLink  = document.getElementById('garmin-bookmarklet-link');
    const copyBtn   = document.getElementById('bookmarklet-copy-btn');
    if (!urlInput) return;

    urlInput.value = location.origin + location.pathname;

    function rebuild() {
        let appUrl = urlInput.value.trim() || (location.origin + location.pathname);
        // Validate — only allow http/https so the generated bookmarklet can't redirect to evil URLs
        try { const u = new URL(appUrl); if (!/^https?:$/.test(u.protocol)) throw new Error(); }
        catch { appUrl = location.origin + location.pathname; }
        const href   = 'javascript:' + buildBookmarkletCode(appUrl);
        if (dragLink) dragLink.href = href;
        if (copyBtn)  copyBtn.dataset.href = href;
    }

    rebuild();
    urlInput.addEventListener('input', rebuild);

    copyBtn?.addEventListener('click', () => {
        const href = copyBtn.dataset.href || '';
        navigator.clipboard.writeText(href).then(() => {
            const orig = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => { copyBtn.innerHTML = orig; }, 2000);
        });
    });
}

// ── Auto-import run from ?import_run= query params ─────────────────
// Called when the bookmarklet redirects back to the app
function importRunFromQueryParams(params) {
    // Accept pre-captured params (passed from main.js before initAppTabs strips the URL)
    const p = params instanceof URLSearchParams ? params : new URLSearchParams(location.search);
    if (!p.get('import_run')) return;

    const dist = parseFloat(p.get('dist'));
    const dur  = parseFloat(p.get('dur'));
    const cal  = parseInt(p.get('cal')) || 0;
    const src  = p.get('src') || '';
    const date = p.get('date') || new Date().toISOString().slice(0, 10);

    console.log('[import] params received — dist:', p.get('dist'), '| dur:', p.get('dur'), '| cal:', cal, '| date:', date);
    console.log('[import] parsed — dist:', dist, '| dur:', dur, '| cal:', cal);

    // Remove query params from URL without reloading
    history.replaceState({}, '', location.pathname + '?tab=running');

    if (isNaN(dist) || isNaN(dur) || dist <= 0 || dur <= 0) {
        console.warn('[import] ABORTED — invalid values. dist:', dist, 'dur:', dur);
        return;
    }

    const run = {
        id:   Date.now(),
        date,
        dist: parseFloat(dist.toFixed(2)),
        dur:  parseFloat(dur.toFixed(1)),
        pace: calculatePace(dist, dur),
        ...(cal > 0 && { cal }),
        ...(src  && { src }),
    };
    console.log('[import] saving run:', run);
    runStorage.add(run);
    pushRun(run);
    console.log('[import] done. total runs in storage:', runStorage.load()?.length);

    const banner = document.getElementById('gpx-drop-banner');
    if (banner) {
        banner.textContent = `✓ ${dist} km imported from Garmin — ${date}`;
        banner.classList.remove('hidden');
        setTimeout(() => banner.classList.add('hidden'), 4000);
    }
}

// ── Render all ─────────────────────────────────────────────────────
function renderAll() {
    renderCalendar();
    renderRunningUI();
    renderDashboard();
    renderFullPlanUI();
}

// ── Init ───────────────────────────────────────────────────────────
export function initHabits({ detailedPlan, defaultCalendar, defaultHabits, scheduleData, importParams }) {
    _detailedPlan    = detailedPlan;
    // Prefer explicit weekly_tasks (which carry identity tags) over derived schedule titles
    _defaultCalendar = (defaultCalendar && defaultCalendar.length)
        ? defaultCalendar
        : deriveCalendarItems(scheduleData);
    _defaultHabits   = defaultHabits;

    setupRunForm();
    setupBookmarklet();
    importRunFromQueryParams(importParams);
    renderAll();

    window.toggleCal   = toggleCal;
    window.toggleHabit = toggleHabit;
    window.deleteRun   = deleteRun;
}
