import { initializeCharts } from './charts.js';
import { initUI, initDarkMode, initAppTabs, isDarkMode } from './ui.js';
import { initHabits } from './habits.js';

document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();          // Apply saved theme first (no flash)
    initAppTabs();           // Set up tab switching
    initUI();                // WeekPlanner calendar + modals
    initializeCharts(isDarkMode()); // Charts with correct initial theme
    initHabits();            // Habits dashboard, running, calendar
});
