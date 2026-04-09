// ── Vietnamese meal pool (IF window: 12PM–8PM) ────────────────────
// Macros are per-serving estimates. kcal = P×4 + C×4 + F×9.
// Each dish has a stable `id` that maps to RECIPE_DB in recipes.js.

import { RECIPE_DB } from './recipes.js';

const mealPool = {

    // ── Lunch (12:00 PM) ── target 30–45g protein ──────────────────
    lunch: [
        { id: 'com-tam-suon-bi-cha',      name: 'Cơm tấm sườn bì chả',               p: 40, c: 58, f: 22 },
        { id: 'pho-bo-tai-nam',            name: 'Phở bò tái nạm',                    p: 32, c: 45, f: 8  },
        { id: 'bun-bo-hue',                name: 'Bún bò Huế',                        p: 30, c: 50, f: 12 },
        { id: 'com-suon-nuong-canh-cai',   name: 'Cơm sườn nướng + Canh cải',         p: 42, c: 60, f: 18 },
        { id: 'bun-thit-nuong',            name: 'Bún thịt nướng (+ chả giò)',         p: 32, c: 55, f: 15 },
        { id: 'mi-quang-ga',               name: 'Mì Quảng gà',                       p: 32, c: 52, f: 10 },
        { id: 'com-ga-hoi-an',             name: 'Cơm gà Hội An',                     p: 42, c: 62, f: 14 },
        { id: 'bun-cha-ha-noi',            name: 'Bún chả Hà Nội',                    p: 35, c: 55, f: 16 },
        { id: 'com-rang-thit-bo',          name: 'Cơm rang thịt bò',                  p: 30, c: 58, f: 15 },
        { id: 'chao-suon-heo',             name: 'Cháo sườn heo',                     p: 28, c: 42, f: 10 },
        { id: 'bun-hai-san',               name: 'Bún hải sản (tôm, mực, cá)',         p: 38, c: 52, f: 8  },
        { id: 'com-ca-basa-kho-to',        name: 'Cơm cá basa kho tộ',                p: 40, c: 56, f: 12 },
        { id: 'banh-mi-thit-heo-nuong',    name: 'Bánh mì thịt heo nướng',            p: 28, c: 48, f: 16 },
        { id: 'bun-rieu-cua-dong',         name: 'Bún riêu cua đồng',                 p: 30, c: 48, f: 10 },
        { id: 'hu-tieu-nam-vang',          name: 'Hủ tiếu Nam Vang (heo + tôm)',       p: 36, c: 52, f: 10 },
    ],

    // ── Snack (3:00 PM) ── target 20–32g protein ───────────────────
    snack: [
        { id: 'whey-shake-chuoi',          name: 'Whey shake + Chuối (post-workout)',  p: 32, c: 30, f: 4  },
        { id: 'trung-luoc-sua-chua',       name: '3 Trứng luộc + Sữa chua Hy Lạp',   p: 27, c: 12, f: 15 },
        { id: 'banh-mi-trung-op-la',       name: 'Bánh mì trứng ốp la',               p: 20, c: 42, f: 16 },
        { id: 'sua-dau-nanh-trung-luoc',   name: 'Sữa đậu nành nóng + 2 Trứng luộc', p: 22, c: 18, f: 12 },
        { id: 'sinh-to-bo-whey',           name: 'Sinh tố bơ + Whey protein',         p: 30, c: 25, f: 20 },
        { id: 'protein-bar-sua-chua',      name: 'Protein bar + Sữa chua không đường',p: 22, c: 28, f: 8  },
        { id: 'dau-phong-rang-trung',      name: 'Đậu phộng rang + 2 Trứng luộc',    p: 18, c: 12, f: 20 },
        { id: 'sua-hat-trung-cuon',        name: 'Sữa hạt Vinamilk + Trứng cuộn rau củ', p: 20, c: 20, f: 14 },
        { id: 'cha-lua-banh-mi',           name: 'Chả lụa + Bánh mì nhỏ',            p: 22, c: 38, f: 10 },
        { id: 'xoi-ga-xe',                 name: 'Xôi gà xé (nhỏ)',                   p: 24, c: 45, f: 8  },
    ],

    // ── Dinner (7:00 PM) ── target 38–52g protein ──────────────────
    dinner: [
        { id: 'thit-kho-trung-com',        name: 'Thịt kho trứng + Cơm trắng',        p: 42, c: 52, f: 28 },
        { id: 'canh-chua-ca-loc-com',      name: 'Canh chua cá lóc + Cơm',            p: 38, c: 52, f: 10 },
        { id: 'ga-hap-la-chanh-com-gao-lut', name: 'Gà hấp lá chanh + Cơm gạo lứt',  p: 48, c: 55, f: 10 },
        { id: 'bo-luc-lac-com',            name: 'Bò lúc lắc + Cơm trắng',            p: 42, c: 52, f: 20 },
        { id: 'tom-rang-muoi-com',         name: 'Tôm rang muối + Cơm gạo lứt',       p: 38, c: 52, f: 8  },
        { id: 'ca-kho-to-com',             name: 'Cá kho tộ + Cơm trắng',             p: 38, c: 52, f: 14 },
        { id: 'lau-thap-cam',              name: 'Lẩu thập cẩm (1 phần)',              p: 45, c: 35, f: 15 },
        { id: 'suon-ham-hat-sen-com',      name: 'Sườn hầm hạt sen + Cơm',            p: 38, c: 45, f: 20 },
        { id: 'dau-phu-nhoi-thit-sot-ca-chua', name: 'Đậu phụ nhồi thịt sốt cà chua + Cơm', p: 28, c: 52, f: 14 },
        { id: 'ga-rang-gung-com',          name: 'Gà rang gừng + Cơm trắng',          p: 44, c: 55, f: 12 },
        { id: 'uc-ga-hap-bong-cai-trung',  name: 'Ức gà hấp + Bông cải xanh + Trứng luộc', p: 52, c: 15, f: 14 },
        { id: 'ca-hoi-ap-chao-rau-cu',     name: 'Cá hồi áp chảo + Rau củ hấp',      p: 42, c: 15, f: 18 },
        { id: 'muc-xao-can-tay-com',       name: 'Mực xào cần tây + Cơm gạo lứt',    p: 36, c: 50, f: 8  },
        { id: 'thit-bo-xao-nam-com',       name: 'Thịt bò xào nấm + Cơm trắng',      p: 40, c: 52, f: 16 },
    ],

    // ── Pre-sleep (9:30 PM) ── slow-digesting protein ──────────────
    presleep: [
        { id: 'casein-shake-sua-tuoi',              name: 'Casein shake + Sữa tươi không đường',        p: 30, c: 15, f: 5  },
        { id: 'pho-mai-cottage-hanh-nhan-dau-tay',  name: 'Phô mai Cottage + Hạnh nhân + Dâu tây',     p: 20, c: 12, f: 12 },
        { id: 'sua-chua-hy-lap-hat-chia',           name: 'Sữa chua Hy Lạp không đường + Hạt chia',    p: 20, c: 10, f: 5  },
        { id: 'sua-hat-casein-shake',               name: 'Sữa hạt Vinamilk + Casein shake',            p: 28, c: 18, f: 8  },
        { id: 'pho-mai-tuoi-banh-gao-lut',          name: 'Phô mai tươi + Bánh gạo lứt',               p: 18, c: 20, f: 10 },
    ],
};

// ── Module state ───────────────────────────────────────────────────
let _lastGeneratedMeals = [];

// ── Helpers ────────────────────────────────────────────────────────
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function kcal(item) { return item.p * 4 + item.c * 4 + item.f * 9; }

function macroBar(value, max, colorClass) {
    const pct = Math.min((value / max) * 100, 100);
    return `<div class="macro-bar-track"><div class="macro-bar-fill ${colorClass}" style="width:${pct}%"></div></div>`;
}

// ── Recipe modal ───────────────────────────────────────────────────
function openRecipeModal(recipeId) {
    const recipe = RECIPE_DB[recipeId];
    const modal  = document.getElementById('recipe-modal');
    if (!recipe || !modal) return;

    document.getElementById('recipe-modal-title').textContent = recipe.name;

    const metaHtml = `
        <div class="flex gap-3 mb-5">
            <span class="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                <i class="fas fa-clock text-purple-400"></i> Prep: ${recipe.prepTime}
            </span>
            <span class="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                <i class="fas fa-fire text-orange-400"></i> Cook: ${recipe.cookTime}
            </span>
        </div>
        ${recipe.tip ? `
        <div class="mb-5 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40">
            <p class="text-xs text-amber-700 dark:text-amber-300"><span class="font-bold">💡 Tip:</span> ${recipe.tip}</p>
        </div>` : ''}`;

    const GROUP_ICONS = { Protein: '🥩', Carbs: '🍚', Vegetables: '🥦', 'Broth': '🍲', 'Broth Base': '🍲', 'Broth & Aromatics': '🍲', 'Broth Aromatics': '🍲', 'Braising Sauce': '🫙', 'Braising Liquid': '🫙', 'Marinade & Sauce': '🧂', 'Marinade & Seasoning': '🧂', 'Marinade & Condiments': '🧂', Seasoning: '🧂', 'Sauce': '🫙', 'Aromatics': '🌿', 'Dipping Sauce': '🍋', 'Dipping Broth': '🍲', 'Toppings': '✨', 'Toppings & Sauce': '✨', Garnish: '🌿', Fat: '🥑', 'Fat & Carbs': '🥑', Liquid: '💧', Optional: '➕', 'Vegetables (Canh)': '🥦', 'Vegetables (Filling)': '🥦', Filling: '🥦', Condiments: '🫙' };

    const ingredientsHtml = `
        <h3 class="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider mb-3">
            <i class="fas fa-shopping-basket text-purple-400 mr-1.5"></i>Ingredients
        </h3>
        <div class="space-y-4 mb-6">
        ${recipe.ingredients.map(group => `
            <div>
                <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                    ${GROUP_ICONS[group.group] ?? '•'} ${group.group}
                </p>
                <ul class="space-y-1.5">
                ${group.items.map(ing => `
                    <li>
                        <label class="flex items-center gap-2.5 cursor-pointer w-full">
                            <input type="checkbox" class="recipe-check w-4 h-4 rounded accent-purple-600 cursor-pointer flex-shrink-0">
                            <span class="flex-1 text-sm text-gray-700 dark:text-gray-200">${ing.item}</span>
                            <span class="text-xs font-semibold text-purple-600 dark:text-purple-400 whitespace-nowrap">${ing.amount}</span>
                        </label>
                    </li>`).join('')}
                </ul>
            </div>`).join('')}
        </div>`;

    const stepsHtml = `
        <h3 class="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider mb-3">
            <i class="fas fa-list-ol text-purple-400 mr-1.5"></i>Preparation
        </h3>
        <ol class="space-y-3">
        ${recipe.steps.map((step, i) => `
            <li class="flex gap-3">
                <span class="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center justify-center">${i + 1}</span>
                <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pt-0.5">${step}</p>
            </li>`).join('')}
        </ol>`;

    document.getElementById('recipe-modal-body').innerHTML = metaHtml + ingredientsHtml + stepsHtml;
    document.body.classList.add('body-no-scroll');
    modal.classList.add('is-open');
}

function closeRecipeModal() {
    document.getElementById('recipe-modal')?.classList.remove('is-open');
    document.body.classList.remove('body-no-scroll');
}

// ── Shopping list modal ────────────────────────────────────────────
function openShoppingModal() {
    const modal = document.getElementById('shopping-modal');
    if (!modal) return;

    // Collect all ingredients from the current menu
    // Map: itemName (lowercase) → { item, amounts: Set, groups: Set }
    const seen = new Map();

    for (const meal of _lastGeneratedMeals) {
        const recipe = RECIPE_DB[meal.item.id];
        if (!recipe) continue;
        for (const group of recipe.ingredients) {
            for (const ing of group.items) {
                const key = ing.item.toLowerCase().trim();
                if (!seen.has(key)) {
                    seen.set(key, { item: ing.item, amounts: new Set(), groups: new Set() });
                }
                const entry = seen.get(key);
                if (ing.amount) entry.amounts.add(ing.amount);
                entry.groups.add(group.group);
            }
        }
    }

    // Group aggregated items by their primary category
    const GROUP_ORDER = ['Protein', 'Carbs', 'Vegetables', 'Broth', 'Broth Base', 'Broth & Aromatics', 'Broth Aromatics', 'Braising Sauce', 'Braising Liquid', 'Marinade & Sauce', 'Marinade & Seasoning', 'Marinade & Condiments', 'Aromatics', 'Seasoning', 'Sauce', 'Dipping Sauce', 'Dipping Broth', 'Condiments', 'Fat', 'Fat & Carbs', 'Toppings', 'Toppings & Sauce', 'Garnish', 'Liquid', 'Filling', 'Vegetables (Canh)', 'Vegetables (Filling)', 'Optional'];
    const GROUP_ICONS = { Protein: '🥩', Carbs: '🍚', Vegetables: '🥦', 'Broth': '🍲', 'Broth Base': '🍲', 'Broth & Aromatics': '🍲', 'Broth Aromatics': '🍲', 'Braising Sauce': '🫙', 'Braising Liquid': '🫙', 'Marinade & Sauce': '🧂', 'Marinade & Seasoning': '🧂', 'Marinade & Condiments': '🧂', Seasoning: '🧂', 'Sauce': '🫙', 'Aromatics': '🌿', 'Dipping Sauce': '🍋', 'Dipping Broth': '🍲', 'Toppings': '✨', 'Toppings & Sauce': '✨', Garnish: '🌿', Fat: '🥑', 'Fat & Carbs': '🥑', Liquid: '💧', Optional: '➕', 'Vegetables (Canh)': '🥦', 'Vegetables (Filling)': '🥦', Filling: '🥦', Condiments: '🫙' };

    // Sort by group order, items within each group alphabetically
    const grouped = new Map();
    for (const [, entry] of seen) {
        const primaryGroup = [...entry.groups].sort((a, b) => {
            const ia = GROUP_ORDER.indexOf(a), ib = GROUP_ORDER.indexOf(b);
            return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
        })[0] || 'Other';
        if (!grouped.has(primaryGroup)) grouped.set(primaryGroup, []);
        grouped.get(primaryGroup).push(entry);
    }

    // Sort groups by GROUP_ORDER, items within each group alphabetically
    const sortedGroups = [...grouped.entries()].sort(([a], [b]) => {
        const ia = GROUP_ORDER.indexOf(a), ib = GROUP_ORDER.indexOf(b);
        return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    });

    const totalItems = seen.size;
    const mealNames  = _lastGeneratedMeals.map(m => m.item.name).join(', ');

    document.getElementById('shopping-modal-subtitle').textContent =
        `${totalItems} items · ${_lastGeneratedMeals.length} meals`;

    const bodyHtml = sortedGroups.map(([group, items]) => `
        <div class="mb-5">
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                ${GROUP_ICONS[group] ?? '•'} ${group}
            </p>
            <ul class="space-y-1.5">
            ${items.sort((a, b) => a.item.localeCompare(b.item)).map(entry => `
                <li>
                    <label class="flex items-center gap-2.5 cursor-pointer w-full">
                        <input type="checkbox" class="recipe-check w-4 h-4 rounded accent-green-600 cursor-pointer flex-shrink-0">
                        <span class="flex-1 text-sm text-gray-700 dark:text-gray-200">${entry.item}</span>
                        ${entry.amounts.size > 0
                            ? `<span class="text-xs font-semibold text-green-600 dark:text-green-400 whitespace-nowrap">${[...entry.amounts].join(' + ')}</span>`
                            : ''}
                    </label>
                </li>`).join('')}
            </ul>
        </div>`).join('');

    document.getElementById('shopping-modal-body').innerHTML = bodyHtml ||
        '<p class="text-sm text-gray-400 text-center py-8">No ingredients found. Generate a menu first.</p>';

    document.body.classList.add('body-no-scroll');
    modal.classList.add('is-open');
}

function closeShoppingModal() {
    document.getElementById('shopping-modal')?.classList.remove('is-open');
    document.body.classList.remove('body-no-scroll');
}

// ── Render ─────────────────────────────────────────────────────────
function generateMenu() {
    const meals = [
        { time: '12:00 PM', label: 'Lunch',          icon: '🍚', item: pick(mealPool.lunch)    },
        { time: '03:00 PM', label: 'Snack',           icon: '🥛', item: pick(mealPool.snack)    },
        { time: '06:30 PM', label: 'Dinner',          icon: '🍖', item: pick(mealPool.dinner)   },
        { time: '07:30 PM', label: 'Pre-sleep snack', icon: '🌙', item: pick(mealPool.presleep) },
    ];
    _lastGeneratedMeals = meals;

    const tot = meals.reduce(
        (a, m) => ({ p: a.p + m.item.p, c: a.c + m.item.c, f: a.f + m.item.f }),
        { p: 0, c: 0, f: 0 }
    );
    const totalKcal  = kcal(tot);
    const proteinMet = tot.p >= 130;

    const output = document.getElementById('menu-output');
    if (!output) return;

    const hasRecipe = id => !!RECIPE_DB[id];

    // ── Meal rows ──
    const mealRows = meals.map((m, idx) => {
        const k = kcal(m.item);
        const recipeBtn = hasRecipe(m.item.id)
            ? `<button class="recipe-btn flex-shrink-0 flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800/40 transition-colors"
                data-recipe-id="${m.item.id}">
                <i class="fas fa-book-open text-xs"></i> Recipe
               </button>`
            : '';
        return `
        <div class="menu-meal-row">
            <span class="menu-time">${m.time}</span>
            <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2">
                    <span class="text-sm text-gray-700 dark:text-gray-200 leading-snug font-medium truncate">${m.icon} ${m.item.name}</span>
                    <span class="menu-kcal flex-shrink-0">~${k} kcal</span>
                </div>
                <div class="flex items-center gap-1 mt-1.5 flex-wrap">
                    <span class="macro-badge macro-p">P ${m.item.p}g</span>
                    <span class="macro-badge macro-c">C ${m.item.c}g</span>
                    <span class="macro-badge macro-f">F ${m.item.f}g</span>
                    ${recipeBtn}
                </div>
            </div>
        </div>`;
    }).join('');

    // ── Totals row ──
    const totalRow = `
        <div class="menu-total-row">
            <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Daily Total</span>
            </div>
            <div class="flex items-center gap-1.5">
                <span class="menu-kcal-total">${totalKcal} kcal</span>
                <span class="macro-badge macro-p ${proteinMet ? 'macro-p-met' : 'macro-p-miss'}">P ${tot.p}g${proteinMet ? ' ✓' : ' ✗'}</span>
                <span class="macro-badge macro-c">C ${tot.c}g</span>
                <span class="macro-badge macro-f">F ${tot.f}g</span>
            </div>
        </div>
        <div class="macro-summary-bars">
            <div class="macro-bar-row">
                <span class="macro-bar-label">Protein</span>
                ${macroBar(tot.p, 160, 'bar-protein')}
                <span class="macro-bar-val ${tot.p >= 130 ? 'text-green-500' : 'text-red-400'}">${tot.p}g</span>
            </div>
            <div class="macro-bar-row">
                <span class="macro-bar-label">Carbs</span>
                ${macroBar(tot.c, 200, 'bar-carb')}
                <span class="macro-bar-val">${tot.c}g</span>
            </div>
            <div class="macro-bar-row">
                <span class="macro-bar-label">Fat</span>
                ${macroBar(tot.f, 80, 'bar-fat')}
                <span class="macro-bar-val">${tot.f}g</span>
            </div>
            <div class="macro-bar-row">
                <span class="macro-bar-label">Calories</span>
                ${macroBar(totalKcal, 2200, 'bar-kcal')}
                <span class="macro-bar-val">${totalKcal}</span>
            </div>
        </div>`;

    output.innerHTML = mealRows + totalRow;
    output.classList.remove('hidden');

    const btn = document.getElementById('generate-menu-btn');
    if (btn) btn.innerHTML = '<i class="fas fa-sync-alt"></i> Regenerate';
}

// ── Init ───────────────────────────────────────────────────────────
export function initNutrition() {
    document.getElementById('generate-menu-btn')?.addEventListener('click', () => {
        generateMenu();
        const shoppingBtn = document.getElementById('shopping-list-btn');
        if (shoppingBtn) shoppingBtn.classList.remove('hidden');
    });

    // Event delegation for recipe buttons (output is present but rows are dynamic)
    document.getElementById('menu-output')?.addEventListener('click', e => {
        const btn = e.target.closest('.recipe-btn');
        if (!btn) return;
        openRecipeModal(btn.dataset.recipeId);
    });

    // Shopping list button
    document.getElementById('shopping-list-btn')?.addEventListener('click', openShoppingModal);

    // Recipe modal close
    document.getElementById('recipe-modal-close')?.addEventListener('click', closeRecipeModal);
    document.getElementById('recipe-modal')?.addEventListener('click', e => {
        if (e.target === document.getElementById('recipe-modal')) closeRecipeModal();
    });

    // Shopping modal close
    document.getElementById('shopping-modal-close')?.addEventListener('click', closeShoppingModal);
    document.getElementById('shopping-modal')?.addEventListener('click', e => {
        if (e.target === document.getElementById('shopping-modal')) closeShoppingModal();
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            if (document.getElementById('recipe-modal')?.classList.contains('is-open')) closeRecipeModal();
            if (document.getElementById('shopping-modal')?.classList.contains('is-open')) closeShoppingModal();
        }
    });
}
