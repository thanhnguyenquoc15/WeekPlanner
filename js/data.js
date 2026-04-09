// ── Hardcoded fallback (used when week.yml cannot be fetched) ──────
// Mirror of data/week.yml — update both together if you change the fallback.
const FALLBACK_RAW = {
    week_label: '',
    daily_schedule: {
        Monday:    { title: "Monday: Strength Focus (Pull Day)", entries: [
            { time: "7:00 AM",  activity: "Wake & Hydrate",       details: "No snooze. Drink 350ml of water to start. Make bed." },
            { time: "7:15 AM",  activity: "Morning Routine",      details: "Mobility & Coffee. No phone." },
            { time: "8:30 AM",  activity: "Deep Work Block 1",    details: "3x Pomodoro cycles (50/10)." },
            { time: "12:00 PM", activity: "Lunch (Break Fast)",   details: "Mindful eating. Short walk." },
            { time: "1:00 PM",  activity: "Deep Work Block 2",    details: "2x Pomodoro cycles (50/10)." },
            { time: "3:00 PM",  activity: "Admin & Shallow Work", details: "Emails and planning. Drink another 1L of water." },
            { time: "4:10 PM",  activity: "Learning Block",       details: "1.5 hours of focused study." },
            { time: "5:40 PM",  activity: "Pre-Workout Prep",     details: "Prepare Whey Protein & Creatine shake." },
            { time: "5:50 PM",  activity: "Strength: Workout A",  details: "Pull Day. Max effort.", workout_key: "pullDay" },
            { time: "6:50 PM",  activity: "Post-Workout",         details: "Stretching and relax. Drink pre-made shake immediately." },
            { time: "7:10 PM",  activity: "Dinner",               details: "Balanced meal. Last meal of the day." },
            { time: "10:00 PM", activity: "Wind-Down",            details: "Prepare Casein. Light stretching." },
            { time: "10:30 PM", activity: "Reading",              details: "Physical book. No screens." },
            { time: "11:00 PM", activity: "Sleep",                details: "Phone off or in another room." },
        ]},
        Tuesday:   { title: "Tuesday: Speed Focus", entries: [
            { time: "7:00 AM",  activity: "Wake & Hydrate",       details: "No snooze. Drink 350ml of water to start. Make bed." },
            { time: "7:15 AM",  activity: "Morning Routine",      details: "Mobility & Coffee. No phone." },
            { time: "8:30 AM",  activity: "Deep Work Block 1",    details: "3x Pomodoro cycles (50/10)." },
            { time: "12:00 PM", activity: "Lunch (Break Fast)",   details: "Mindful eating. Short walk." },
            { time: "1:00 PM",  activity: "Deep Work Block 2",    details: "2x Pomodoro cycles (50/10)." },
            { time: "3:00 PM",  activity: "Admin & Shallow Work", details: "Emails and planning. Drink another 1L of water." },
            { time: "4:10 PM",  activity: "Learning Block",       details: "1.5 hours of focused study." },
            { time: "5:40 PM",  activity: "Pre-Workout Prep",     details: "Prepare Whey Protein & Creatine shake." },
            { time: "5:50 PM",  activity: "Commute to Track",     details: "20 minutes travel time." },
            { time: "6:10 PM",  activity: "Running: Speed Work",  details: "High intensity intervals.", workout_key: "speedWork" },
            { time: "7:10 PM",  activity: "Post-Workout",         details: "Stretching and relax. Drink pre-made shake immediately." },
            { time: "7:15 PM",  activity: "Commute Home",         details: "Mental cool-down." },
            { time: "7:30 PM",  activity: "Dinner",               details: "Focus on carbs. Last meal of the day." },
            { time: "9:40 PM",  activity: "Decompress & Prep",    details: "Prepare bag, clothes, and meals for Wednesday." },
            { time: "10:00 PM", activity: "Wind-Down",            details: "Prepare Casein. Light stretching." },
            { time: "10:30 PM", activity: "Reading",              details: "Physical book. No screens." },
            { time: "11:00 PM", activity: "Sleep",                details: "Crucial for recovery." },
        ]},
        Wednesday: { title: "Wednesday: Office, Social & Strength", entries: [
            { time: "7:00 AM",  activity: "Wake & Hydrate",           details: "No snooze. Drink 350ml of water. Your routine starts now." },
            { time: "7:15 AM",  activity: "Efficient Morning Routine", details: "Coffee, essential mobility, and pack for the office." },
            { time: "8:00 AM",  activity: "Commute to Office",         details: "1-hour commute. Use for a podcast or audiobook." },
            { time: "9:00 AM",  activity: "Deep Work Block 1",         details: "Focus on your most important tasks for the morning." },
            { time: "12:00 PM", activity: "Lunch (Break Fast)",        details: "Step away from your desk. Eat mindfully." },
            { time: "1:00 PM",  activity: "Deep Work Block 2",         details: "2 hours of focused work." },
            { time: "3:00 PM",  activity: "Admin & Shallow Work",      details: "Emails and planning. Drink another 1L of water." },
            { time: "4:10 PM",  activity: "Pre-Social Wind Down",      details: "Decompress before dinner party." },
            { time: "5:00 PM",  activity: "Dinner Party",              details: "Engage socially, eat mindfully, and enjoy the event." },
            { time: "7:30 PM",  activity: "Commute Home",              details: "1-hour commute. Use this time to decompress." },
            { time: "8:30 PM",  activity: "Pre-Workout Prep",          details: "Prepare Whey Protein & Creatine shake." },
            { time: "8:40 PM",  activity: "Strength: Workout B",       details: "Push Day. Focus on form.", workout_key: "pushDay" },
            { time: "9:25 PM",  activity: "Post-Workout",              details: "Stretching and relax. Drink pre-made shake immediately." },
            { time: "10:00 PM", activity: "Wind-Down & Reading",       details: "Prepare and drink Casein. Read your physical book." },
            { time: "11:00 PM", activity: "Sleep",                     details: "Maintaining your sleep schedule is the top priority." },
        ]},
        Thursday:  { title: "Thursday: Tempo Focus", entries: [
            { time: "7:00 AM",  activity: "Wake & Hydrate",       details: "No snooze. Drink 350ml of water to start. Make bed." },
            { time: "7:15 AM",  activity: "Morning Routine",      details: "Mobility & Coffee. No phone." },
            { time: "8:30 AM",  activity: "Deep Work Block 1",    details: "3x Pomodoro cycles (50/10)." },
            { time: "12:00 PM", activity: "Lunch (Break Fast)",   details: "Mindful eating. Short walk." },
            { time: "1:00 PM",  activity: "Deep Work Block 2",    details: "2x Pomodoro cycles (50/10)." },
            { time: "3:00 PM",  activity: "Admin & Shallow Work", details: "Emails and planning. Drink another 1L of water." },
            { time: "4:10 PM",  activity: "Learning Block",       details: "1.5 hours of focused study." },
            { time: "5:40 PM",  activity: "Pre-Workout Prep",     details: "Prepare Whey Protein & Creatine shake." },
            { time: "5:50 PM",  activity: "Commute to Track",     details: "20 minutes travel time." },
            { time: "6:10 PM",  activity: "Running: Tempo Run",   details: "'Comfortably hard' pace.", workout_key: "tempoRun" },
            { time: "7:10 PM",  activity: "Post-Workout",         details: "Stretching and relax. Drink pre-made shake immediately." },
            { time: "7:15 PM",  activity: "Commute Home",         details: "Mental cool-down." },
            { time: "7:50 PM",  activity: "Dinner",               details: "Quality meal. Last meal of the day." },
            { time: "10:00 PM", activity: "Wind-Down",            details: "Prepare Casein. Light stretching." },
            { time: "10:30 PM", activity: "Reading",              details: "Physical book. No screens." },
            { time: "11:00 PM", activity: "Sleep",                details: "Crucial for adaptation." },
        ]},
        Friday:    { title: "Friday: Strength Focus (Pull Day)", entries: [
            { time: "7:00 AM",  activity: "Wake & Hydrate",       details: "No snooze. Drink 350ml of water to start. Make bed." },
            { time: "7:15 AM",  activity: "Morning Routine",      details: "Mobility & Coffee. No phone." },
            { time: "8:30 AM",  activity: "Deep Work Block 1",    details: "3x Pomodoro cycles (50/10)." },
            { time: "12:00 PM", activity: "Lunch (Break Fast)",   details: "Mindful eating. Short walk." },
            { time: "1:00 PM",  activity: "Deep Work Block 2",    details: "2x Pomodoro cycles (50/10)." },
            { time: "3:00 PM",  activity: "Admin & Shallow Work", details: "Emails and planning. Drink another 1L of water." },
            { time: "4:10 PM",  activity: "Learning Block",       details: "1.5 hours of focused study." },
            { time: "5:40 PM",  activity: "Pre-Workout Prep",     details: "Prepare Whey Protein & Creatine shake." },
            { time: "5:50 PM",  activity: "Strength: Workout A",  details: "Pull Day: Beat Monday's numbers.", workout_key: "pullDay" },
            { time: "6:50 PM",  activity: "Post-Workout",         details: "Stretching and relax. Drink pre-made shake immediately." },
            { time: "7:10 PM",  activity: "Dinner",               details: "Celebrate the week. Last meal." },
            { time: "8:00 PM",  activity: "Wind-Down",            details: "Prepare Casein. Light stretching." },
            { time: "8:30 PM",  activity: "Reading",              details: "Physical book. No screens." },
            { time: "9:00 PM",  activity: "Sleep",                details: "Rest well for recovery day." },
        ]},
        Saturday:  { title: "Saturday: Early Endurance & Recovery", entries: [
            { time: "4:30 AM",  activity: "Wake & Hydrate",         details: "Wake up, drink 350ml of water." },
            { time: "4:50 AM",  activity: "Pre-Workout Prep",       details: "Prepare Whey Protein & Creatine shake." },
            { time: "5:00 AM",  activity: "Commute to Run",         details: "1 hour travel time." },
            { time: "6:00 AM",  activity: "Running: Long Run",      details: "10km at a very easy pace.", workout_key: "longRun" },
            { time: "7:40 AM",  activity: "Post-Run Recovery",      details: "Stretching. Drink pre-made shake." },
            { time: "8:00 AM",  activity: "Brunch / Large Meal",    details: "First main meal of the day." },
            { time: "10:40 AM", activity: "Commute Home",           details: "1 hour travel time, cool down." },
            { time: "1:00 PM",  activity: "Relax & Recharge",       details: "Long nap and low-energy activities." },
            { time: "4:00 PM",  activity: "Life Admin / Meal Prep", details: "Groceries, cooking for Sunday." },
            { time: "7:00 PM",  activity: "Dinner",                 details: "Last meal of the day." },
            { time: "10:00 PM", activity: "Wind-Down",              details: "Prepare Casein. Read book." },
            { time: "11:00 PM", activity: "Sleep",                  details: "Full night's sleep is key." },
        ]},
        Sunday:    { title: "Sunday: Recovery Focus (Easy Run)", entries: [
            { time: "7:00 AM",  activity: "Wake & Hydrate",                details: "Maintain wake-up time. Drink 350ml of water." },
            { time: "7:30 AM",  activity: "Coffee & Slow Morning",         details: "No rush. Enjoy." },
            { time: "10:30 AM", activity: "Brunch / Meal",                 details: "First meal of the day." },
            { time: "12:00 PM", activity: "Active Recovery",               details: "Long nap and low-energy activities." },
            { time: "3:50 PM",  activity: "Pre-Workout Prep",              details: "Prepare Whey Protein & Creatine shake." },
            { time: "4:00 PM",  activity: "Running: Easy Run",             details: "40 minutes, relaxed pace.", workout_key: "easyRun" },
            { time: "4:40 PM",  activity: "Post-Run Recovery and commute", details: "Drink pre-made shake. Commute home and shower." },
            { time: "5:15 PM",  activity: "Weekly Review & Plan",          details: "Review past week, plan next." },
            { time: "7:00 PM",  activity: "Dinner",                        details: "Last meal of the day." },
            { time: "8:00 PM",  activity: "Unwind",                        details: "Watch a movie, listen to music." },
            { time: "10:00 PM", activity: "Wind-Down",                     details: "Prepare Casein. Read book." },
            { time: "11:00 PM", activity: "Sleep",                         details: "Ready for the new week." },
        ]},
    },
    today_plan: {
        "Thứ 2":    { fitness: "Rest & SRE Recovery (Read 1 Ch. SRE Book)", sre: "Học SRE Book (Google)",          nutrition: "Nạp 130g Protein dù không tập." },
        "Thứ 3":    { fitness: "Run 6km Zone 2 (Nhịp tim < 145)",           sre: "Terraform Practice (AWS VPC/EC2)", nutrition: "Bữa tối: Thịt bò luộc + Rau." },
        "Thứ 4":    { fitness: "Run 5km Easy + K8s Basics (1h)",            sre: "Setup Minikube + Deploy Nginx",    nutrition: "Sữa hạt Vinamilk + 2 Trứng luộc." },
        "Thứ 5":    { fitness: "Interval Run (4x800m Pace 6:30)",           sre: "AWS CloudWatch Dashboards",        nutrition: "Ăn tinh bột cao trước chạy." },
        "Thứ 6":    { fitness: "Rest & Strength Training (Core/Legs)",      sre: "Review Weekly Progress",           nutrition: "Thịt kho tôm tiêu + Cơm." },
        "Thứ 7":    { fitness: "Long Run 10km (Zone 2)",                    sre: "Tổng kết & Update Tracker",        nutrition: "Nạp Gel km thứ 5. Cheat meal tối." },
        "Chủ Nhật": { fitness: "Rest & Reset",                              sre: "Meal Prep & Planning",             nutrition: "Thư giãn, ăn uống đầy đủ." },
    },
    weekly_tasks: [
        { id: 1, day: "Thứ 2",    task: "SRE Recovery: Read 1 Ch. SRE Book" },
        { id: 2, day: "Thứ 3",    task: "Run 6km Zone 2 + Terraform" },
        { id: 3, day: "Thứ 4",    task: "Run 5km Easy + K8s Basics" },
        { id: 4, day: "Thứ 5",    task: "Interval Run (4x800m)" },
        { id: 5, day: "Thứ 6",    task: "Rest & Strength Training" },
        { id: 6, day: "Thứ 7",    task: "Long Run 10km (Zone 2)" },
        { id: 7, day: "Chủ Nhật", task: "Rest & Meal Prep" },
    ],
    daily_habits: [
        { id: 101, name: "Dậy lúc 7:00 AM" },
        { id: 102, name: "Nạp đủ 130g Protein" },
        { id: 103, name: "Học SRE ít nhất 1h" },
    ],
};

// ── YAML → app-shape transformer ──────────────────────────────────
function parseRaw(raw) {
    // Convert daily_schedule entries: snake_case workout_key → camelCase workoutKey
    const scheduleData = {};
    for (const [day, val] of Object.entries(raw.daily_schedule ?? {})) {
        scheduleData[day] = {
            title: val.title,
            schedule: (val.entries ?? []).map(e => {
                const entry = { time: e.time, activity: e.activity, details: e.details };
                if (e.workout_key) entry.workoutKey = e.workout_key;
                return entry;
            }),
        };
    }
    return {
        weekLabel:       raw.week_label ?? '',
        scheduleData,
        detailedPlan:    raw.today_plan ?? {},
        defaultCalendar: (raw.weekly_tasks  ?? []).map(t => ({ ...t, completed: false })),
        defaultHabits:   (raw.daily_habits  ?? []).map(h => ({ ...h, completed: false })),
    };
}

const FALLBACK_WEEK_DATA = parseRaw(FALLBACK_RAW);

// ── Public API ─────────────────────────────────────────────────────

/**
 * Loads week.yml and returns parsed week data.
 * Falls back to FALLBACK_WEEK_DATA if the file cannot be fetched or parsed.
 * Requires js-yaml (jsyaml global) to be loaded first.
 */
export async function loadWeekData() {
    try {
        const res = await fetch('./data/week.yml');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        const raw  = jsyaml.load(text);  // eslint-disable-line no-undef
        return parseRaw(raw);
    } catch (e) {
        console.warn('[data] Could not load week.yml — using built-in defaults.', e.message);
        return FALLBACK_WEEK_DATA;
    }
}

/**
 * Seeds runs localStorage from data/runs.json only if the key is absent.
 * Safe to call on every startup — it is a no-op after the first load.
 */
export async function seedRunsIfEmpty(storage) {
    if (localStorage.getItem(storage.key) !== null) return;
    try {
        const res  = await fetch('./data/runs.json');
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) storage.seedIfEmpty(data);
    } catch {
        // File absent or parse error — not a problem, just skip
    }
}
