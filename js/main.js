import { initializeCharts }                            from './charts.js';
import { initUI, initDarkMode, initAppTabs, isDarkMode, renderWeekDashboard, initGrindingWindow } from './ui.js';
import { initHabits }                                  from './habits.js';
import { initNutrition }                               from './nutrition.js';
import { initGoalContext }                             from './goals.js';
import { initBlueprint }                               from './blueprint.js';
import { loadWeekData, loadGoalsData, loadPerfectDay, seedRunsIfEmpty } from './data.js';
import { Storage }                                     from './storage.js';
import { STORAGE_KEYS }                                from './config.js';
import { initBackup }                                  from './backup.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Apply theme immediately to avoid flash
    initDarkMode();
    initAppTabs();

    const runStorage = new Storage(STORAGE_KEYS.runs);

    // Fetch all data sources in parallel — week.yml is critical, rest are non-critical
    const [weekData, goalsData, perfectDayData] = await Promise.all([
        loadWeekData(),
        loadGoalsData(),
        loadPerfectDay(),
    ]);
    seedRunsIfEmpty(runStorage).catch(e => console.warn('[main] seed runs failed:', e));

    initBackup();
    initUI(weekData.scheduleData);
    initializeCharts(isDarkMode(), weekData.scheduleData);
    initHabits(weekData);
    initNutrition();
    initGoalContext({ goalContext: weekData.goalContext, runStorage });
    initBlueprint({ goalsData, perfectDayData, currentPhase: weekData.goalContext?.phase ?? 1 });
    renderWeekDashboard();
    initGrindingWindow();
});
