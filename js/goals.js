/**
 * goals.js — Goal Context Strip
 *
 * Renders the Phase + weekly focus + milestone progress bars in the Today tab.
 * Owns all goal-context state and localStorage for editable milestones.
 *
 * Public API:
 *   initGoalContext({ goalContext, runStorage }) — call once on DOMContentLoaded
 *   renderGoalContext()                          — re-render (call after run is logged)
 */

import { STORAGE_KEYS } from './config.js';

// ── Module state ───────────────────────────────────────────────────
let _goalContext = null;
let _runStorage  = null;

// ── Persisted progress (editable milestones) ───────────────────────
function loadProgress() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.goalProgress) || '{}'); }
    catch { return {}; }
}

function saveProgress(key, rawValue) {
    const current = loadProgress();
    localStorage.setItem(STORAGE_KEYS.goalProgress, JSON.stringify({ ...current, [key]: rawValue }));
}

// ── Milestone data resolution ──────────────────────────────────────
function getMilestoneCurrentValue(milestone) {
    if (milestone.key === 'half_marathon') {
        const runs = _runStorage?.load() ?? [];
        return runs.reduce((sum, r) => sum + (parseFloat(r.dist) || 0), 0);
    }
    return parseFloat(loadProgress()[milestone.key] ?? 0);
}

// ── Formatting helpers ─────────────────────────────────────────────
function fmtDisplay(value, unit) {
    if (unit === 'km')    return `${value.toFixed(1)} km`;
    if (unit === 'vnd')   return `${(value / 1e6).toFixed(0)}M ₫`;
    if (unit === 'books') return `${value} book${value !== 1 ? 's' : ''}`;
    return String(value);
}

function fmtTarget(value, unit) {
    if (unit === 'vnd')   return `${(value / 1e6).toFixed(0)}M ₫`;
    return fmtDisplay(value, unit);
}

// ── Prompt handler for editable milestones ─────────────────────────
function promptEdit(milestone, currentValue) {
    const hint   = milestone.unit === 'vnd' ? ' (enter in millions ₫)' : '';
    const shown  = milestone.unit === 'vnd' ? currentValue / 1e6 : currentValue;
    const answer = prompt(`Update "${milestone.label}"${hint}:`, shown);
    if (answer === null) return; // cancelled

    const parsed = parseFloat(answer);
    if (isNaN(parsed) || parsed < 0) return;
    const stored = milestone.unit === 'vnd' ? parsed * 1e6 : parsed;
    saveProgress(milestone.key, stored);
    renderGoalContext();
}

// ── Render ─────────────────────────────────────────────────────────
export function renderGoalContext() {
    const el = document.getElementById('goal-context-strip');
    if (!el || !_goalContext) return;

    const { phase, phase_name, weekly_focus, milestones = [] } = _goalContext;

    const milestonesHtml = milestones.map((m, i) => {
        const current  = getMilestoneCurrentValue(m);
        const pct      = Math.min((current / m.target) * 100, 100).toFixed(1);
        const isAuto   = m.key === 'half_marathon';
        const barColor = pct >= 100 ? 'from-green-500 to-emerald-400'
                       : pct >= 60  ? 'from-purple-600 to-indigo-400'
                       :              'from-purple-800 to-purple-500';

        const currentLabel = isAuto
            ? `<span class="font-bold text-purple-300">${fmtDisplay(current, m.unit)}</span>`
            : `<button class="font-bold text-purple-300 hover:text-purple-200 underline decoration-dashed underline-offset-2 cursor-pointer transition-colors"
                       data-milestone-idx="${i}">${fmtDisplay(current, m.unit)}</button>`;

        return `<div>
            <div class="flex justify-between items-baseline mb-1.5">
                <span class="text-xs font-bold text-gray-300 uppercase tracking-wide">${m.label}</span>
                <span class="text-xs text-gray-400 flex items-center gap-1">
                    <span class="text-gray-500 text-xs">current</span>
                    ${currentLabel}
                    <span class="text-gray-600">/</span>
                    <span class="text-gray-400">${fmtTarget(m.target, m.unit)}</span>
                    <span class="text-gray-500 text-xs">goal</span>
                </span>
            </div>
            <div class="h-1.5 bg-gray-700/60 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-700"
                     style="width:${pct}%"></div>
            </div>
        </div>`;
    }).join('');

    el.innerHTML = `
        <div class="rounded-2xl p-4 bg-gradient-to-br from-purple-950/60 to-gray-900 border border-purple-500/20 shadow-lg">
            <div class="flex items-start justify-between mb-4">
                <div>
                    <span class="text-xs font-black uppercase tracking-widest text-purple-400">
                        Phase ${phase} · Your Progress
                    </span>
                    <h3 class="text-sm font-bold text-white mt-0.5">${phase_name}</h3>
                </div>
                <p class="text-xs text-gray-500 italic text-right max-w-[55%] leading-relaxed">"${weekly_focus}"</p>
            </div>
            <div class="space-y-3">${milestonesHtml}</div>
            <p class="text-xs text-gray-600 mt-3 text-right">
                <i class="fas fa-pencil-alt mr-1"></i>Tap value to update · Auto-tracked: running
            </p>
        </div>`;

    // Wire up editable milestone buttons
    el.querySelectorAll('[data-milestone-idx]').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.milestoneIdx);
            promptEdit(milestones[idx], getMilestoneCurrentValue(milestones[idx]));
        });
    });
}

// ── Init ───────────────────────────────────────────────────────────
export function initGoalContext({ goalContext, runStorage }) {
    _goalContext = goalContext;
    _runStorage  = runStorage;
    renderGoalContext();
}
