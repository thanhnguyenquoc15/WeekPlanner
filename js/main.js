import { initializeCharts } from './charts.js';
import { initUI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    initUI();
    initializeCharts();
});