// ── Effort calculation ────────────────────────────────────────────
// Parses "7:00 AM" / "12:30 PM" → total minutes since midnight
function parseMinutes(timeStr) {
    const [timePart, period] = timeStr.trim().split(' ');
    let [h, m] = timePart.split(':').map(Number);
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return h * 60 + (m || 0);
}

const EFFORT_PATTERNS = [
    { key: 'deepWork', label: 'Deep Work',  re: /Deep Work/i },
    { key: 'learning', label: 'Learning',   re: /Learning\s+Block/i },
    { key: 'training', label: 'Training',   re: /^(Strength:|Running:)/i },
];

// Returns { deepWork, learning, training } in hours, summed across all 7 days
function calcEffortHours(scheduleData) {
    const totals = { deepWork: 0, learning: 0, training: 0 };
    for (const dayData of Object.values(scheduleData)) {
        const entries = dayData.schedule ?? [];
        for (let i = 0; i < entries.length; i++) {
            const cat = EFFORT_PATTERNS.find(p => p.re.test(entries[i].activity));
            if (!cat) continue;
            const start = parseMinutes(entries[i].time);
            // Duration = gap to next entry; cap unknown last-entry at 60 min
            const end = i < entries.length - 1 ? parseMinutes(entries[i + 1].time) : start + 60;
            totals[cat.key] += Math.max(0, end - start) / 60;
        }
    }
    return totals;
}

const COLORS = {
    blue:   '#00A6ED',
    purple: '#7542A8',
    pink:   '#F73B74',
    orange: '#F7941D',
    yellow: '#FFD42E'
};

// Store instances so we can update them on theme change
const chartInstances = {};

function fontColor(isDark) { return isDark ? '#d1d5db' : '#374151'; }
function gridColor(isDark)  { return isDark ? '#374151' : '#E5E7EB'; }

function tooltipDefaults() {
    return {
        backgroundColor: 'rgba(0,0,0,0.85)',
        titleFont: { size: 13, weight: 'bold' },
        bodyFont:  { size: 12 },
        padding: 10,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
            title(items) {
                const lbl = items[0].chart.data.labels[items[0].dataIndex];
                return Array.isArray(lbl) ? lbl.join(' ') : lbl;
            }
        }
    };
}

function createEffortDonutChart(isDark, scheduleData) {
    const ctx = document.getElementById('effortDonutChart');
    if (!ctx) return;

    const { deepWork, learning, training } = calcEffortHours(scheduleData);
    const total = deepWork + learning + training;
    const pct   = v => total > 0 ? ` (${Math.round(v / total * 100)}%)` : '';

    // Update the card subtitle with the real total
    const card = ctx.closest('.planner-card');
    if (card) {
        const sub = card.querySelector('p.text-center');
        if (sub) sub.textContent = `How your ${total.toFixed(1)} active hours are allocated.`;
    }

    // Also update the hardcoded stat cards in the Planner tab
    const statDeepWork = document.querySelector('[data-stat="deep-work"]');
    const statLearning = document.querySelector('[data-stat="learning"]');
    const statTraining = document.querySelector('[data-stat="training"]');
    if (statDeepWork) statDeepWork.textContent = deepWork.toFixed(1);
    if (statLearning) statLearning.textContent = learning.toFixed(1);
    if (statTraining) statTraining.textContent = training.toFixed(1);

    chartInstances.donut = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [
                `Deep Work${pct(deepWork)}`,
                `Learning${pct(learning)}`,
                `Training${pct(training)}`,
            ],
            datasets: [{
                data: [deepWork, learning, training],
                backgroundColor: [COLORS.blue, COLORS.pink, COLORS.orange],
                borderColor: isDark ? '#1f2937' : '#ffffff',
                borderWidth: 4,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: fontColor(isDark), font: { size: 12 } } },
                tooltip: {
                    ...tooltipDefaults(),
                    callbacks: {
                        ...tooltipDefaults().callbacks,
                        label(item) {
                            const hrs = item.raw.toFixed(1);
                            return ` ${hrs} h`;
                        }
                    }
                }
            },
            cutout: '62%'
        }
    });
}

// Maps workout activity name keywords → intensity score (0–10)
const RUN_INTENSITY_MAP = [
    { re: /speed|interval/i, score: 9  },
    { re: /tempo/i,          score: 7  },
    { re: /long\s*run/i,     score: 6  },
    { re: /easy\s*run/i,     score: 4  },
];
const STRENGTH_INTENSITY_MAP = [
    { re: /pull\s*day/i,  score: 9 },
    { re: /push\s*day/i,  score: 8 },
];

function calcTrainingIntensity(scheduleData) {
    return WORKOUT_DAYS.map(day => {
        const entry = (scheduleData[day]?.schedule ?? [])
            .find(e => /^(Strength:|Running:)/i.test(e.activity));
        if (!entry) return { run: 4, strength: 4 };

        if (/^Running:/i.test(entry.activity)) {
            const match = RUN_INTENSITY_MAP.find(r => r.re.test(entry.activity));
            return { run: match?.score ?? 5, strength: 4 };
        } else {
            const match = STRENGTH_INTENSITY_MAP.find(r => r.re.test(entry.activity));
            return { run: 4, strength: match?.score ?? 8 };
        }
    });
}

function createIntensityRadarChart(isDark, scheduleData) {
    const ctx = document.getElementById('intensityRadarChart');
    if (!ctx) return;

    const intensity = calcTrainingIntensity(scheduleData);
    const runData      = intensity.map(d => d.run);
    const strengthData = intensity.map(d => d.strength);

    chartInstances.radar = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'Running Intensity',
                    data: runData,
                    fill: true,
                    backgroundColor: 'rgba(247,59,116,0.18)',
                    borderColor: COLORS.pink,
                    pointBackgroundColor: COLORS.pink,
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: COLORS.pink
                },
                {
                    label: 'Strength Focus',
                    data: strengthData,
                    fill: true,
                    backgroundColor: 'rgba(0,166,237,0.18)',
                    borderColor: COLORS.blue,
                    pointBackgroundColor: COLORS.blue,
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: COLORS.blue
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: fontColor(isDark), font: { size: 12 } } },
                tooltip: {
                    ...tooltipDefaults(),
                    callbacks: {
                        label(item) {
                            return ` ${item.dataset.label}: ${item.raw}/10`;
                        }
                    }
                }
            },
            scales: {
                r: {
                    angleLines: { color: gridColor(isDark) },
                    grid:        { color: gridColor(isDark) },
                    pointLabels: { font: { size: 13, weight: 'bold' }, color: fontColor(isDark) },
                    ticks:       { color: fontColor(isDark), backdropColor: 'transparent', stepSize: 2 },
                    min: 0, max: 10
                }
            }
        }
    });
}

const WORKOUT_DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const WORKOUT_ABBR = ['MON','TUE','WED','THU','FRI','SAT','SUN'];

const WORKOUT_STYLE = {
    strength: {
        card:  'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700/40',
        badge: 'bg-blue-100 dark:bg-blue-800/40 text-blue-700 dark:text-blue-300',
        icon:  '💪',
        label: 'Strength',
    },
    running: {
        card:  'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-700/40',
        badge: 'bg-pink-100 dark:bg-pink-800/40 text-pink-700 dark:text-pink-300',
        icon:  '🏃',
        label: 'Running',
    },
    rest: {
        card:  'bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700',
        badge: 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500',
        icon:  '😴',
        label: 'Rest',
    },
};

function getWorkoutForDay(dayData) {
    const entry = (dayData?.schedule ?? []).find(e => /^(Strength:|Running:)/i.test(e.activity));
    if (!entry) return { type: 'rest', name: 'Rest', time: null };
    const type = /^Strength:/i.test(entry.activity) ? 'strength' : 'running';
    const name = entry.activity.split(':')[1]?.trim() ?? '';
    return { type, name, time: entry.time };
}

function renderWorkoutSchedule(scheduleData) {
    const grid = document.getElementById('workout-schedule-grid');
    if (!grid) return;

    const today    = new Date();
    const dow      = today.getDay();                        // 0 = Sun
    const todayIdx = dow === 0 ? 6 : dow - 1;              // 0 = Mon

    grid.innerHTML = WORKOUT_DAYS.map((day, i) => {
        const { type, name, time } = getWorkoutForDay(scheduleData[day]);
        const s        = WORKOUT_STYLE[type];
        const isToday  = i === todayIdx;
        const todayRing = isToday
            ? 'ring-2 ring-purple-500 dark:ring-purple-400'
            : '';

        return `
        <div class="relative flex flex-col items-center gap-2 p-3 rounded-xl border ${s.card} ${todayRing} transition-all">
            ${isToday ? `<span class="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[0.55rem] font-bold uppercase tracking-widest bg-purple-600 text-white px-1.5 py-0.5 rounded-full whitespace-nowrap">Today</span>` : ''}
            <p class="text-[0.6rem] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mt-1">${WORKOUT_ABBR[i]}</p>
            <span class="text-2xl">${s.icon}</span>
            <span class="text-[0.6rem] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${s.badge}">${s.label}</span>
            <p class="text-[0.65rem] font-semibold text-gray-600 dark:text-gray-300 text-center leading-tight min-h-[2rem] flex items-center justify-center">${name || '—'}</p>
            ${time ? `<p class="text-[0.6rem] text-gray-400 dark:text-gray-500">${time}</p>` : ''}
        </div>`;
    }).join('');
}

export function initializeCharts(isDark = false, scheduleData = {}) {
    createEffortDonutChart(isDark, scheduleData);
    createIntensityRadarChart(isDark, scheduleData);
    renderWorkoutSchedule(scheduleData);
}

export function updateChartsTheme(isDark) {
    // Update radar
    const radar = chartInstances.radar;
    if (radar) {
        radar.options.scales.r.angleLines.color = gridColor(isDark);
        radar.options.scales.r.grid.color       = gridColor(isDark);
        radar.options.scales.r.pointLabels.color = fontColor(isDark);
        radar.options.scales.r.ticks.color      = fontColor(isDark);
        radar.options.plugins.legend.labels.color = fontColor(isDark);
        radar.update();
    }
    // Update donut
    const donut = chartInstances.donut;
    if (donut) {
        donut.data.datasets[0].borderColor = isDark ? '#1f2937' : '#ffffff';
        donut.options.plugins.legend.labels.color = fontColor(isDark);
        donut.update();
    }
    // Workout schedule grid is pure HTML — dark mode handled by Tailwind dark: classes, no update needed
}
