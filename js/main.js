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
import { pullRuns, pullHabits, pullBlueprint, pullPerfectDay, saveSyncConfig, syncEnabled, syncUrl } from './sync.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Capture URL params before initAppTabs() strips them via history.replaceState
    const initialParams = new URLSearchParams(location.search);

    // Apply theme immediately to avoid flash
    initDarkMode();
    initAppTabs();

    const runStorage = new Storage(STORAGE_KEYS.runs);

    // week.yml is critical; goals + perfectDay are optional (blueprint tab only)
    const [weekResult, goalsResult, perfectDayResult] = await Promise.allSettled([
        loadWeekData(),
        loadGoalsData(),
        loadPerfectDay(),
    ]);
    if (weekResult.status === 'rejected') {
        console.error('[main] failed to load week data:', weekResult.reason);
    }
    const weekData      = weekResult.value      ?? { scheduleData: [], goalContext: null };
    const goalsData     = goalsResult.value      ?? null;
    const perfectDayData = perfectDayResult.value ?? null;
    seedRunsIfEmpty(runStorage).catch(e => console.warn('[main] seed runs failed:', e));

    // Skip pullRuns during bookmarklet import — the new run hasn't reached the cloud
    // yet, so pulling now would overwrite localStorage and lose it.
    const isImporting = initialParams.has('import_run');
    if (!isImporting) {
        pullRuns(runStorage).then(runs => { if (runs !== null) initHabits(weekData); });
    }
    pullHabits();

    // Pull life roadmap from cloud — re-render blueprint tab when either resolves
    let _latestGoals      = goalsData;
    let _latestPerfectDay = perfectDayData;
    const phase = weekData.goalContext?.phase ?? 1;
    pullBlueprint().then(data => {
        if (data) {
            _latestGoals = data;
            initBlueprint({ goalsData: _latestGoals, perfectDayData: _latestPerfectDay, currentPhase: phase });
        }
    });
    pullPerfectDay().then(data => {
        if (data) {
            _latestPerfectDay = data;
            initBlueprint({ goalsData: _latestGoals, perfectDayData: _latestPerfectDay, currentPhase: phase });
        }
    });

    // ── Cloud sync setup UI ─────────────────────────────────────────
    const statusLabel = document.getElementById('sync-status-label');
    if (statusLabel) {
        statusLabel.textContent = syncEnabled ? 'Sync active ✓' : 'Not configured';
        statusLabel.style.color  = syncEnabled ? '#22c55e' : '';
    }
    // Pre-fill URL if already configured (so user can see/update it)
    const syncUrlInput = document.getElementById('sync-url-input');
    if (syncUrlInput && syncUrl) syncUrlInput.value = syncUrl;

    const syncSaveBtn = document.getElementById('sync-save-btn');
    if (syncSaveBtn) {
        syncSaveBtn.addEventListener('click', () => {
            const url   = document.getElementById('sync-url-input').value.trim();
            const token = document.getElementById('sync-token-input').value.trim();
            if (!url || !token) { alert('Please enter both URL and token.'); return; }
            saveSyncConfig(url, token);
        });
    }

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
