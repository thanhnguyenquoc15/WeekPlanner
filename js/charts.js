const FONT_COLOR = '#374151';
const GRID_COLOR = '#E5E7EB';

const COLORS = {
  blue: '#00A6ED',
  purple: '#7542A8',
  pink: '#F73B74',
  orange: '#F7941D',
  yellow: '#FFD42E'
};

const tooltipPlugin = {
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    titleFont: { size: 14, weight: 'bold' },
    bodyFont: { size: 12 },
    padding: 10,
    cornerRadius: 4,
    displayColors: true,
    callbacks: {
      title: function (tooltipItems) {
        const item = tooltipItems[0];
        let label = item.chart.data.labels[item.dataIndex];
        return Array.isArray(label) ? label.join(' ') : label;
      }
    }
  }
};

function createEffortDonutChart() {
  const effortDonutCtx = document.getElementById('effortDonutChart').getContext('2d');
  new Chart(effortDonutCtx, {
    type: 'doughnut',
    data: {
      labels: ['Deep Work (74.8%)', 'Learning (14.0%)', 'Training (11.2%)'],
      datasets: [{
        label: 'Effort Distribution',
        data: [40, 7.5, 6],
        backgroundColor: [COLORS.blue, COLORS.pink, COLORS.orange],
        borderColor: '#F8FAFC',
        borderWidth: 4,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { color: FONT_COLOR, font: { size: 12 } } },
        ...tooltipPlugin
      },
      cutout: '60%'
    }
  });
}

function createIntensityRadarChart() {
  const intensityRadarCtx = document.getElementById('intensityRadarChart').getContext('2d');
  new Chart(intensityRadarCtx, {
    type: 'radar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Running Intensity',
          data: [2, 8, 2, 7, 2, 10, 5],
          fill: true,
          backgroundColor: 'rgba(247, 59, 116, 0.2)',
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
          backgroundColor: 'rgba(0, 166, 237, 0.2)',
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
        legend: { position: 'bottom', labels: { color: FONT_COLOR, font: { size: 12 } } },
        ...tooltipPlugin
      },
      scales: {
        r: {
          angleLines: { color: GRID_COLOR },
          grid: { color: GRID_COLOR },
          pointLabels: { font: { size: 14, weight: 'bold' }, color: FONT_COLOR },
          ticks: { color: FONT_COLOR, backdropColor: 'rgba(255, 255, 255, 0.75)', stepSize: 2 },
          min: 0,
          max: 10
        }
      }
    }
  });
}

function createWorkoutBarChart() {
    const workoutBarCtx = document.getElementById('workoutBarChart').getContext('2d');
    new Chart(workoutBarCtx, {
      type: 'bar',
      data: {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [{
          label: 'Strength',
          data: [1, 0, 1, 0, 1, 0, 0],
          backgroundColor: COLORS.blue,
          borderColor: '#FFFFFF',
          borderWidth: 2,
          stack: 'Stack 0',
        }, {
          label: 'Running',
          data: [0, 1, 0, 1, 0, 1, 1],
          backgroundColor: COLORS.pink,
          borderColor: '#FFFFFF',
          borderWidth: 2,
          stack: 'Stack 0',
        }, {
          label: 'Rest',
          data: [1, 1, 1, 1, 1, 1, 1],
          backgroundColor: '#E5E7EB',
          borderColor: '#FFFFFF',
          borderWidth: 2,
          stack: 'Stack 0',
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { color: FONT_COLOR, font: { size: 12 } } },
          tooltip: {
            ...tooltipPlugin.tooltip,
            callbacks: {
              title: function (tooltipItems) { return tooltipItems[0].label; },
              label: function (context) {
                let label = context.dataset.label || '';
                if (label) { label += ': '; }
                if (context.dataset.label !== 'Rest') {
                  const day = context.label;
                  let focus = '';
                  if (context.dataset.label === 'Strength') {
                    if (day === 'Monday' || day === 'Friday') focus = 'Pull Day';
                    if (day === 'Wednesday') focus = 'Push Day';
                  } else if (context.dataset.label === 'Running') {
                    if (day === 'Tuesday') focus = 'Speed Work';
                    if (day === 'Thursday') focus = 'Tempo Run';
                    if (day === 'Saturday') focus = 'Long Run';
                    if (day === 'Sunday') focus = 'Easy Run';
                  }
                  label += focus;
                } else { label = 'Full Rest'; }
                return label;
              }
            }
          }
        },
        scales: {
          x: { display: false, stacked: true, },
          y: { stacked: true, ticks: { color: FONT_COLOR, font: { size: 14 } }, grid: { display: false } }
        },
        layout: { padding: { left: 10, right: 10, top: 0, bottom: 0 } }
      }
    });
  }


export function initializeCharts() {
    createEffortDonutChart();
    createIntensityRadarChart();
    createWorkoutBarChart();
}