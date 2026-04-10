/**
 * backup.js — Data Export / Import
 *
 * Protects all user data that lives only in localStorage:
 *   monk_goal_progress   — portfolio & books milestone values
 *   monk_activity_notes  — per-day activity notes
 *   lumi_calendar        — weekly tasks + habits completion
 *   progress_*           — per-day schedule step completion
 *   lumi_runs            — running log
 *
 * Public API:
 *   exportAllData()  — triggers JSON download
 *   importAllData()  — reads a file input, restores with confirm
 *   initBackup()     — wires up export + import buttons
 */

const BACKUP_KEYS = [
    'monk_goal_progress',
    'monk_activity_notes',
    'lumi_calendar',
    'lumi_runs',
];

const VALID_DAYS = new Set(['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']);

function collectAllData() {
    const data = { _version: 1, _exported: new Date().toISOString() };

    // Named keys
    BACKUP_KEYS.forEach(k => {
        const raw = localStorage.getItem(k);
        if (raw !== null) {
            try { data[k] = JSON.parse(raw); }
            catch { data[k] = raw; }
        }
    });

    // All progress_* keys (one per day of the week)
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    data._progress = {};
    days.forEach(d => {
        const raw = localStorage.getItem(`progress_${d}`);
        if (raw !== null) {
            try { data._progress[d] = JSON.parse(raw); }
            catch { data._progress[d] = raw; }
        }
    });

    return data;
}

export function exportAllData() {
    const data = collectAllData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const date = new Date().toISOString().slice(0, 10);
    const a    = Object.assign(document.createElement('a'), {
        href: url,
        download: `monk-backup-${date}.json`,
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function importAllData(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
        try {
            const data = JSON.parse(ev.target.result);
            if (typeof data !== 'object' || data._version !== 1) {
                alert('Invalid backup file.');
                return;
            }
            const keys = Object.keys(data).filter(k => !k.startsWith('_'));
            if (!confirm(`This will restore ${keys.length} data keys. Current data will be overwritten. Continue?`)) return;

            BACKUP_KEYS.forEach(k => {
                if (k in data) localStorage.setItem(k, JSON.stringify(data[k]));
            });
            if (data._progress && typeof data._progress === 'object') {
                Object.entries(data._progress).forEach(([day, val]) => {
                    if (!VALID_DAYS.has(day)) return; // reject unknown day keys
                    localStorage.setItem(`progress_${day}`, JSON.stringify(val));
                });
            }
            alert('Backup restored. Reloading…');
            location.reload();
        } catch {
            alert('Failed to parse backup file. Make sure it is a valid monk-backup JSON.');
        }
    };
    reader.readAsText(file);
}

export function initBackup() {
    document.getElementById('backup-export-btn')?.addEventListener('click', exportAllData);

    const importInput = document.getElementById('backup-import-input');
    importInput?.addEventListener('change', e => {
        importAllData(e.target.files?.[0]);
        importInput.value = ''; // reset so same file can be re-selected
    });
}
