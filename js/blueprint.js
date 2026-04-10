/**
 * blueprint.js — Blueprint Tab
 *
 * Renders four sections in the Blueprint tab:
 *   1. Identity Wall  — 8 life pillars
 *   2. 10-Year Vision — master plan stats
 *   3. Phase Timeline — 3-phase life roadmap
 *   4. Perfect Day    — the 1-8-15 ideal schedule
 *
 * Public API:
 *   initBlueprint({ goalsData, perfectDayData })
 */

import { IDENTITY_META }                       from './config.js';
import { identityPillHtml, activityPillarIconHtml } from './identity.js';

const _escEl = document.createElement('div');
function esc(str) {
    _escEl.textContent = String(str ?? '');
    return _escEl.innerHTML;
}

// ── Identity taglines (personal, not in config) ────────────────────
const IDENTITY_TAGLINES = {
    Runner:    'Log the miles. Earn the marathon.',
    Reader:    '2 books a month, every month.',
    Engineer:  'SRE mastery. Infrastructure as code.',
    Explorer:  'New cities, new perspectives.',
    Healthy:   '130g protein · 8h sleep · HR 48 bpm.',
    Wealthy:   'Invest first. Spend what remains.',
    Motivator: 'Lead by example. Inspire by results.',
    Player:    'Work hard. Play hard. Stay balanced.',
};

// ── Formatting helpers ─────────────────────────────────────────────
function fmtBillion(vnd) {
    return `${(vnd / 1e9).toFixed(0)}B ₫`;
}
function fmtMillion(vnd) {
    return `${(vnd / 1e6).toFixed(0)}M ₫`;
}

// ── Section 1: Identity Wall ───────────────────────────────────────
function renderIdentityWall(container, blueprint) {
    const principle = blueprint?.coreValuesAndIdentity?.drivingPrinciple ?? '';

    const cardsHtml = Object.entries(IDENTITY_META).map(([identity, m]) => {
        const tagline = IDENTITY_TAGLINES[identity] ?? '';
        return `
            <div class="blueprint-identity-card" style="--pill-color:${m.color};--pill-bg:${m.bg}">
                <div class="blueprint-identity-icon" style="background:${m.bg};color:${m.color}">
                    <i class="fas ${m.icon}"></i>
                </div>
                <p class="text-sm font-black text-gray-800 dark:text-gray-100 mt-3 mb-1">${identity}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">${tagline}</p>
            </div>`;
    }).join('');

    container.innerHTML = `
        <div class="planner-card">
            <div class="flex items-start justify-between mb-2">
                <div>
                    <h2 class="text-base font-black uppercase tracking-wider text-purple-brand">
                        <i class="fas fa-user-astronaut mr-2"></i>My Identity Wall
                    </h2>
                    <p class="text-xs text-gray-400 mt-0.5">Who I am becoming, one habit at a time</p>
                </div>
            </div>
            <p class="text-sm italic text-gray-500 dark:text-gray-400 border-l-2 border-purple-400 pl-3 mb-6">
                "${esc(principle)}"
            </p>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                ${cardsHtml}
            </div>
        </div>`;
}

// ── Section 2: 10-Year Vision Stats ───────────────────────────────
function renderVisionStats(container, blueprint) {
    const vision  = blueprint?.tenYearVision;
    const profile = blueprint?.userProfile;
    if (!vision) { container.innerHTML = ''; return; }

    const { incomeTargetMonthlyVND: income, assetGoals: assets } = vision;
    const stats = [
        { label: 'Monthly Income Target', value: `${fmtMillion(income.minimum)} – ${fmtMillion(income.maximum)}`, icon: 'fa-chart-line', color: 'text-green-500' },
        { label: 'Investment Portfolio',  value: fmtBillion(assets.investmentPortfolioVND),           icon: 'fa-coins',      color: 'text-yellow-500' },
        { label: 'Houses to Build',       value: `${assets.housesToBuild} houses`,                    icon: 'fa-home',       color: 'text-blue-500'   },
        { label: 'Car',                   value: fmtBillion(assets.carPurchaseCostVND),               icon: 'fa-car',        color: 'text-purple-500' },
    ];

    const statsHtml = stats.map(s => `
        <div class="blueprint-stat-card">
            <i class="fas ${s.icon} text-2xl ${s.color} mb-2"></i>
            <p class="text-lg font-black text-gray-800 dark:text-gray-100">${s.value}</p>
            <p class="text-xs text-gray-400 mt-0.5 uppercase tracking-wide">${s.label}</p>
        </div>`).join('');

    container.innerHTML = `
        <div class="planner-card">
            <h2 class="text-base font-black uppercase tracking-wider text-purple-brand mb-1">
                <i class="fas fa-trophy mr-2"></i>${esc(vision.title)}
            </h2>
            <p class="text-xs text-gray-400 mb-5">${esc(vision.impactGoal)}</p>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">${statsHtml}</div>
        </div>`;
}

// ── Section 3: Phase Timeline ──────────────────────────────────────
function renderTimeline(container, blueprint, currentPhase = 1) {
    const phases = blueprint?.timeline;
    if (!phases?.length) { container.innerHTML = ''; return; }

    const phasesHtml = phases.map((p, i) => {
        const isCurrent = p.phase === currentPhase;
        const isPast    = p.phase < currentPhase;
        const stateClass = isCurrent ? 'blueprint-phase-current'
                         : isPast    ? 'blueprint-phase-past'
                         :             'blueprint-phase-future';
        const milestones = Object.entries(p.milestones ?? {}).map(([k, v]) =>
            `<li class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span class="font-bold capitalize text-gray-600 dark:text-gray-300">${esc(k)}:</span> ${esc(v)}
             </li>`
        ).join('');
        const focusHtml = (p.focus ?? []).map(f =>
            `<li class="text-xs text-gray-500 dark:text-gray-400">${esc(f)}</li>`
        ).join('');

        return `
            <div class="blueprint-phase-card ${stateClass}">
                <div class="flex items-center gap-2 mb-2">
                    <div class="blueprint-phase-dot ${stateClass}"></div>
                    <span class="text-xs font-black uppercase tracking-widest ${isCurrent ? 'text-purple-brand' : 'text-gray-400'}">
                        Phase ${p.phase} · Yr ${p.years}
                    </span>
                    ${isCurrent ? '<span class="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full font-bold">NOW</span>' : ''}
                </div>
                <h3 class="text-sm font-bold text-gray-800 dark:text-gray-100 mb-3">${esc(p.phaseName)}</h3>
                <ul class="space-y-1 list-disc list-inside mb-3">${focusHtml}</ul>
                <div class="border-t border-gray-100 dark:border-gray-700 pt-3">
                    <p class="text-xs font-bold uppercase text-gray-400 mb-1">Milestones</p>
                    <ul class="space-y-1">${milestones}</ul>
                </div>
            </div>`;
    }).join('');

    container.innerHTML = `
        <div class="planner-card">
            <h2 class="text-base font-black uppercase tracking-wider text-purple-brand mb-5">
                <i class="fas fa-map-signs mr-2"></i>Life Roadmap
            </h2>
            <div class="grid md:grid-cols-3 gap-4">${phasesHtml}</div>
        </div>`;
}

// ── Section 4: Perfect Day ─────────────────────────────────────────
function renderPerfectDay(container, perfectDayJson) {
    const data = perfectDayJson?.perfectDay;
    if (!data) { container.innerHTML = ''; return; }

    const itemsHtml = (data.schedule ?? []).map(item => {
        const pillar = activityPillarIconHtml(item.activity);
        return `
            <li class="blueprint-perfect-day-item">
                <div class="blueprint-perfect-day-time">${item.time}</div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        ${esc(item.activity)}${pillar}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">${esc(item.details)}</p>
                </div>
            </li>`;
    }).join('');

    container.innerHTML = `
        <div class="planner-card">
            <h2 class="text-base font-black uppercase tracking-wider text-purple-brand mb-1">
                <i class="fas fa-clock mr-2"></i>${data.title}
            </h2>
            <p class="text-xs text-gray-400 mb-5">The ideal day, built for compounding results</p>
            <ul class="space-y-4">${itemsHtml}</ul>
        </div>`;
}

// ── Init ───────────────────────────────────────────────────────────
export function initBlueprint({ goalsData, perfectDayData, currentPhase = 1 }) {
    const blueprint = goalsData?.lifeBlueprint;

    renderIdentityWall(document.getElementById('blueprint-identity-wall'), blueprint);
    renderVisionStats(document.getElementById('blueprint-vision'),         blueprint);
    renderTimeline(document.getElementById('blueprint-timeline'),           blueprint, currentPhase);
    renderPerfectDay(document.getElementById('blueprint-perfect-day'),     perfectDayData);
}
