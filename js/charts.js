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

function createEffortDonutChart(isDark) {
    const ctx = document.getElementById('effortDonutChart');
    if (!ctx) return;
    chartInstances.donut = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Deep Work (74.8%)', 'Learning (14.0%)', 'Training (11.2%)'],
            datasets: [{
                data: [40, 7.5, 6],
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
                tooltip: tooltipDefaults()
            },
            cutout: '62%'
        }
    });
}

function createIntensityRadarChart(isDark) {
    const ctx = document.getElementById('intensityRadarChart');
    if (!ctx) return;
    chartInstances.radar = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'Running Intensity',
                    data: [2, 8, 2, 7, 2, 10, 5],
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
                    data: [9, 2, 6, 2, 9, 2, 2],
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
                tooltip: tooltipDefaults()
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

function createWorkoutBarChart(isDark) {
    const ctx = document.getElementById('workoutBarChart');
    if (!ctx) return;
    chartInstances.bar = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
            datasets: [
                { label: 'Strength', data: [1,0,1,0,1,0,0], backgroundColor: COLORS.blue,  borderColor:'#fff', borderWidth:2, stack:'s0' },
                { label: 'Running',  data: [0,1,0,1,0,1,1], backgroundColor: COLORS.pink,  borderColor:'#fff', borderWidth:2, stack:'s0' },
                { label: 'Rest',     data: [1,1,1,1,1,1,1], backgroundColor: isDark ? '#374151' : '#E5E7EB', borderColor:'#fff', borderWidth:2, stack:'s0' }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { color: fontColor(isDark), font: { size: 12 } } },
                tooltip: {
                    ...tooltipDefaults(),
                    callbacks: {
                        title: (items) => items[0].label,
                        label(ctx) {
                            if (ctx.dataset.label === 'Rest') return 'Full Rest';
                            const day = ctx.label;
                            const map = {
                                Strength: { Monday:'Pull Day', Wednesday:'Push Day', Friday:'Pull Day' },
                                Running:  { Tuesday:'Speed Work', Thursday:'Tempo Run', Saturday:'Long Run', Sunday:'Easy Run' }
                            };
                            return `${ctx.dataset.label}: ${map[ctx.dataset.label]?.[day] ?? ''}`;
                        }
                    }
                }
            },
            scales: {
                x: { display: false, stacked: true },
                y: { stacked: true, ticks: { color: fontColor(isDark), font: { size: 13 } }, grid: { display: false } }
            }
        }
    });
}

export function initializeCharts(isDark = false) {
    createEffortDonutChart(isDark);
    createIntensityRadarChart(isDark);
    createWorkoutBarChart(isDark);
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
    // Update bar
    const bar = chartInstances.bar;
    if (bar) {
        bar.data.datasets[2].backgroundColor = isDark ? '#374151' : '#E5E7EB';
        bar.options.plugins.legend.labels.color = fontColor(isDark);
        bar.options.scales.y.ticks.color = fontColor(isDark);
        bar.update();
    }
}
