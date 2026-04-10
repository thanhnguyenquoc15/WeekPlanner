/**
 * identity.js — Shared identity pillar utilities
 *
 * Single source of truth for rendering identity pills and activity-to-pillar
 * detection. Import from here in habits.js, ui.js, and blueprint.js.
 */

import { IDENTITY_META } from './config.js';
export { IDENTITY_META };

// ── Identity pill HTML ─────────────────────────────────────────────
export function identityPillHtml(identity) {
    const m = IDENTITY_META[identity];
    if (!m) return '';
    return `<span class="identity-pill" style="color:${m.color};background:${m.bg}">` +
           `<i class="fas ${m.icon}"></i>${identity}</span>`;
}

// ── Activity → pillar keyword map (priority-ordered) ──────────────
export const ACTIVITY_PILLARS = [
    [/running|run|tempo|interval|speed work|long run|easy run|commute to (track|run)/i, 'Runner'   ],
    [/reading|read.*book/i,                                                              'Reader'   ],
    [/deep work|learning block|study|sre|pomodoro|admin|shallow work|learning/i,        'Engineer' ],
    [/workout|strength|pull day|push day|plank|squat|pre.workout|post.workout|exercise/i,'Healthy' ],
    [/lunch|dinner|brunch|meal|protein|nutrition|casein|whey|hydrate|water|refuel/i,    'Healthy'  ],
    [/unwind|movie|music|game|play|leisure|chill|fun|entertainment/i,                   'Player'   ],
    [/wake|sleep|wind.down|recovery|stretch|relax|rest|nap|disconnect/i,               'Healthy'  ],
    [/morning routine|coffee|prime/i,                                                   'Healthy'  ],
    [/commute|travel/i,                                                                 'Explorer' ],
    [/social|party|weekly review|hanging around|flexible/i,                            'Motivator'],
];

// ── Inline icon badge (used in drawers and perfect day) ───────────
export function activityPillarIconHtml(activityText) {
    for (const [re, identity] of ACTIVITY_PILLARS) {
        if (re.test(activityText)) {
            const m = IDENTITY_META[identity];
            if (!m) break;
            return `<span class="activity-pillar-icon" title="${identity}" ` +
                   `style="color:${m.color};background:${m.bg}">` +
                   `<i class="fas ${m.icon}"></i></span>`;
        }
    }
    return '';
}
