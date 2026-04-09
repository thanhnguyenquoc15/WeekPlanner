import { initializeCharts }               from './charts.js';
import { initUI, initDarkMode, initAppTabs, isDarkMode } from './ui.js';
import { initHabits }                     from './habits.js';
import { initNutrition }                  from './nutrition.js';
import { initFinance }                    from './finance.js';
import { loadWeekData, seedRunsIfEmpty }  from './data.js';
import { Storage }                        from './storage.js';
import { STORAGE_KEYS }                   from './config.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Apply theme immediately to avoid flash
    initDarkMode();
    initAppTabs();

    // Fetch external data in parallel
    const runStorage = new Storage(STORAGE_KEYS.runs);
    const [weekData] = await Promise.all([
        loadWeekData(),
        seedRunsIfEmpty(runStorage),
    ]);

    initUI(weekData.scheduleData);
    initializeCharts(isDarkMode(), weekData.scheduleData);
    initHabits(weekData);
    initNutrition();
    initFinance();
});
