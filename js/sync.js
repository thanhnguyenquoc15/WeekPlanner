/**
 * sync.js — Cloud sync for runs and habits via Google Apps Script (JSONP)
 *
 * Cloud is source of truth. On load: pull cloud → overwrite localStorage.
 * On write: update localStorage immediately, fire cloud call in background.
 * Offline / no config: silently falls back to localStorage only.
 */

const _cfg      = window.APP_CONFIG || window.FINANCE_CONFIG || {};
const _BASE_URL = _cfg.appsScriptUrl || '';
const _TOKEN    = _cfg.token || '';

let _syncEnabled = !!(  _BASE_URL && _TOKEN
                     && !_BASE_URL.includes('YOUR_APPS_SCRIPT'));

// ── JSONP transport (same pattern as finance-app.js) ──────────────────
function cloudCall(params) {
    return new Promise((resolve, reject) => {
        if (!_syncEnabled) return reject(new Error('sync not configured'));
        const cbName = '_syncCb_' + Date.now() + '_' + Math.random().toString(36).slice(2);
        const script = document.createElement('script');
        const timer  = setTimeout(() => {
            cleanup();
            reject(new Error('timeout'));
        }, 10000);

        window[cbName] = data => { cleanup(); resolve(data); };

        function cleanup() {
            clearTimeout(timer);
            delete window[cbName];
            script.remove();
        }

        const qs = new URLSearchParams({ ...params, token: _TOKEN, callback: cbName });
        script.src = _BASE_URL + '?' + qs.toString();
        script.onerror = () => { cleanup(); reject(new Error('network error')); };
        document.head.appendChild(script);
    });
}

// ── Runs ──────────────────────────────────────────────────────────────

export async function pullRuns(runStorage) {
    try {
        const data = await cloudCall({ action: 'getRuns' });
        if (Array.isArray(data)) {
            runStorage.save(data);
            console.log('[sync] pulled', data.length, 'runs from cloud');
            return data;
        }
    } catch (e) {
        console.warn('[sync] pullRuns failed (offline?):', e.message);
    }
    return null;
}

export function pushRun(run) {
    if (!_syncEnabled) return;
    cloudCall({
        action: 'addRun',
        id:     run.id,
        date:   run.date,
        dist:   run.dist,
        dur:    run.dur,
        pace:   run.pace,
        cal:    run.cal || 0,
        src:    run.src || '',
    }).then(r => {
        if (r?.ok) console.log('[sync] run pushed:', run.id);
        else       console.warn('[sync] pushRun error:', r?.error);
    }).catch(e => console.warn('[sync] pushRun failed:', e.message));
}

export function removeRun(id) {
    if (!_syncEnabled) return;
    cloudCall({ action: 'deleteRun', id })
        .then(r => {
            if (r?.ok) console.log('[sync] run deleted:', id);
            else       console.warn('[sync] deleteRun error:', r?.error);
        })
        .catch(e => console.warn('[sync] deleteRun failed:', e.message));
}

// ── Habits ────────────────────────────────────────────────────────────

export async function pullHabits() {
    try {
        const data = await cloudCall({ action: 'getHabits' });
        if (data && typeof data === 'object' && !data.error) {
            // Write each date's progress into localStorage (progress_YYYY-MM-DD keys)
            for (const [date, indices] of Object.entries(data)) {
                localStorage.setItem('progress_' + date, JSON.stringify(indices));
            }
            console.log('[sync] pulled habits for', Object.keys(data).length, 'days');
            return data;
        }
    } catch (e) {
        console.warn('[sync] pullHabits failed (offline?):', e.message);
    }
    return null;
}

export function pushHabit(date, checkedIndices) {
    if (!_syncEnabled) return;
    cloudCall({
        action:   'setHabit',
        date,
        progress: JSON.stringify(checkedIndices),
    }).then(r => {
        if (r?.ok) console.log('[sync] habit pushed:', date);
        else       console.warn('[sync] setHabit error:', r?.error);
    }).catch(e => console.warn('[sync] pushHabit failed:', e.message));
}

export { _syncEnabled as syncEnabled };
