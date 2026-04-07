import { getRandomQuote }    from './quotes.js';
import { scheduleData }       from './data.js';
import { workoutDetails }     from './exercises.js';
import { updateChartsTheme }  from './charts.js';

// ── Dark mode ──────────────────────────────────────────────────────
export function initDarkMode() {
    const saved = localStorage.getItem('monk_dark_mode');
    const isDark = saved === 'true';
    applyDark(isDark);

    document.getElementById('dark-mode-toggle')?.addEventListener('click', () => {
        const next = !document.documentElement.classList.contains('dark');
        applyDark(next);
        localStorage.setItem('monk_dark_mode', next);
        updateChartsTheme(next);
    });
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
    const btns = document.querySelectorAll('.app-tab-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => switchAppTab(btn.dataset.appTab));
    });
    switchAppTab('planner'); // default
}

function switchAppTab(name) {
    document.querySelectorAll('.app-tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.app-tab-btn').forEach(b => b.classList.remove('active'));

    const target = document.getElementById(`app-tab-${name}`);
    if (target) target.classList.remove('hidden');

    const activeBtn = document.querySelector(`[data-app-tab="${name}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    const data = scheduleData[day];
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

function updateProgress(day) {
    const checkboxes = scheduleModalBody?.querySelectorAll('.activity-checkbox') ?? [];
    const total = checkboxes.length;
    if (!total) return;
    const checked = [...checkboxes].filter(cb => cb.checked);
    if (scheduleProgressBar) scheduleProgressBar.style.width = `${(checked.length / total) * 100}%`;
    saveProgress(day, checked.map(cb => parseInt(cb.dataset.index)));
}

function openScheduleModal(day) {
    const data = scheduleData[day];
    if (!data || !scheduleModal) return;
    scheduleModal.dataset.day = day;
    if (scheduleModalTitle) scheduleModalTitle.textContent = data.title;
    if (quoteDisplay) quoteDisplay.style.opacity = 0;
    const saved = getProgress(day);

    let html = '<ul class="space-y-4">';
    data.schedule.forEach((item, idx) => {
        const checked = saved.includes(idx);
        html += `<li class="flex items-start pb-4 border-b last:border-b-0 border-gray-200 dark:border-gray-700">
            <div class="w-24 text-right pr-4 flex-shrink-0">
                <p class="font-bold text-sm modal-item-time">${item.time}</p>
            </div>
            <div class="flex-grow flex items-center">
                <input type="checkbox" data-index="${idx}" class="activity-checkbox h-5 w-5 rounded mr-4 accent-purple-600" ${checked ? 'checked' : ''}>
                <div>`;
        html += item.workoutKey
            ? `<p class="font-semibold"><a href="#" class="text-blue-500 hover:underline workout-link" data-workout-key="${item.workoutKey}">${item.activity}</a></p>`
            : `<p class="font-semibold">${item.activity}</p>`;
        html += `<p class="text-gray-500 dark:text-gray-400 text-sm">${item.details}</p></div></div></li>`;
    });
    html += '</ul>';
    if (scheduleModalBody) scheduleModalBody.innerHTML = html;
    updateProgress(day);
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

export function initUI() {
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

    // Event listeners
    scheduleModalClose?.addEventListener('click', closeScheduleModal);
    scheduleModal?.addEventListener('click', e => { if (e.target === scheduleModal) closeScheduleModal(); });
    scheduleModalBody?.addEventListener('change', e => {
        if (e.target.classList.contains('activity-checkbox')) {
            if (e.target.checked) showQuote();
            updateProgress(scheduleModal.dataset.day);
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
}
