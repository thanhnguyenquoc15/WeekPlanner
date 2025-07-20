export const workoutDetails = {
    pullDay: {
      title: "Workout A: Pull Day",
      exercises: [
        { name: "Chin-Ups (4 sets to failure)", steps: ["Grip the bar underhand, shoulder-width apart.", "Pull your chest to the bar, focusing on squeezing your biceps and back.", "Lower yourself slowly and with full control.", "Rest 90-120 seconds between sets."] },
        { name: "Standard Pull-Ups (4 sets to failure)", steps: ["Grip the bar overhand, slightly wider than shoulder-width.", "Engage your lats to pull your chin over the bar.", "Avoid swinging or using momentum.", "Rest 90-120 seconds between sets."] },
        { name: "Commando Pull-Ups (3 sets per side)", steps: ["Grip the bar with a mixed grip (one hand over, one under).", "Pull yourself up, aiming your head to one side of the bar.", "Alternate which side you pull towards on each rep or set.", "Rest 60-90 seconds between sets."] },
        { name: "Bar Hang (3 sets to failure)", steps: ["Simply hang from the bar with an overhand grip.", "Keep your shoulders engaged (don't just hang passively).", "This builds grip strength and decompresses the spine.", "Rest 60 seconds between sets."] }
      ],
      details: "Focus on maximum repetitions and perfect form. This is a high-effort day."
    },
    pushDay: {
      title: "Workout B: Push Day",
      exercises: [
        { name: "Pike Push-Ups (4 sets of 8-12 reps)", steps: ["Get into a downward dog yoga pose.", "Bend your elbows to lower the top of your head towards the floor.", "Press back up, focusing on your shoulders.", "Keep your legs straight and core tight."] },
        { name: "Diamond Push-Ups (4 sets to failure)", steps: ["Place your hands close together, forming a diamond shape with your thumbs and index fingers.", "Lower your chest to your hands, keeping your elbows tucked in.", "This variation places more emphasis on the triceps.", "If too difficult, perform on your knees."] },
        { name: "Standard Push-Ups (5 sets to failure)", steps: ["Place hands slightly wider than your shoulders.", "Maintain a straight line from your head to your heels.", "Lower your chest to the floor and press back up explosively.", "Focus on volume and endurance here."] }
      ],
      details: "Focus on controlled movements and full range of motion."
    },
    speedWork: {
      title: "Speed Workout",
      exercises: [
        { name: "Warm-Up", steps: ["10-15 minutes of very easy jogging.", "Include dynamic stretches like leg swings and butt kicks."] },
        { name: "Main Set: 6x400m Intervals", steps: ["Run 400m (one lap of a standard track) at a very fast, challenging pace (9/10 effort).", "Focus on maintaining good form even when fatigued."] },
        { name: "Recovery", steps: ["After each 400m interval, recover with 400m of slow walking or jogging.", "Your heart rate should come down before starting the next interval."] },
        { name: "Cool-Down", steps: ["10-15 minutes of very easy jogging.", "Finish with static stretching for your legs and hips."] }
      ],
      details: "The goal is to improve your top-end speed and running economy."
    },
    tempoRun: {
      title: "Tempo Workout",
      exercises: [
        { name: "Warm-Up", steps: ["10 minutes of easy jogging to get your muscles warm."] },
        { name: "Main Set: 20-minute Tempo", steps: ["Run for 20 minutes at a 'comfortably hard' pace (7/10 effort).", "You should be able to say a few words, but not hold a full conversation.", "Focus on maintaining a consistent pace throughout."] },
        { name: "Cool-Down", steps: ["10 minutes of easy jogging or walking to bring your heart rate down.", "Follow with light stretching."] }
      ],
      details: "This workout improves your lactate threshold, allowing you to run faster for longer."
    },
    longRun: {
      title: "Long Run",
       exercises: [
        { name: "Pace: 10km at a very easy pace", steps: ["The pace should be conversational (3-4/10 effort).", "The primary goal is time on your feet, not speed.", "Walk breaks are acceptable if needed."] },
        { name: "Focus", steps: ["Concentrate on maintaining a relaxed form.", "Use this run to practice your hydration and nutrition strategy for longer distances."] },
        { name: "Post-Run", steps: ["Refuel with a mix of protein and carbs within 30-60 minutes.", "Lightly stretch your major leg muscles."] }
      ],
      details: "The goal is to complete the distance and build aerobic endurance."
    },
    easyRun: {
      title: "Easy Run",
      exercises: [
         { name: "Duration: 40 minutes", steps: ["Keep the effort light and conversational (2-3/10 effort).", "Your heart rate should remain low.", "This is purely for active recovery."] },
         { name: "Purpose", steps: ["This run helps deliver blood to your muscles to aid recovery.", "It should feel refreshing, not tiring."] }
      ],
      details: "This is a recovery run. Keep the effort light."
    }
  };
  
  export const scheduleData = {
    Monday: {
      title: "Monday: Strength Focus (Pull Day)",
      schedule: [
        { time: "7:00 AM", activity: "Wake & Hydrate", details: "No snooze. Drink water. Make bed." },
        { time: "7:15 AM", activity: "Morning Routine", details: "Mobility & Coffee. No phone." },
        { time: "8:30 AM", activity: "Deep Work Block 1", details: "3x Pomodoro cycles (50/10)." },
        { time: "12:00 PM", activity: "Lunch (Break Fast)", details: "Mindful eating. Short walk." },
        { time: "1:00 PM", activity: "Deep Work Block 2", details: "2x Pomodoro cycles (50/10)." },
        { time: "3:00 PM", activity: "Admin & Shallow Work", details: "1 hour for emails, planning, and other less intensive tasks." },
        { time: "4:00 PM", activity: "Learning Block", details: "1.5 hours of focused study." },
        { time: "5:30 PM", activity: "Strength: Workout A", details: "Pull Day. Max effort.", workoutKey: "pullDay" },
        { time: "6:30 PM", activity: "Post-Workout", details: "Whey Protein & Creatine." },
        { time: "7:00 PM", activity: "Dinner", details: "Balanced meal. Last meal of the day." },
        { time: "10:00 PM", activity: "Wind-Down", details: "Prepare Casein. Light stretching." },
        { time: "10:30 PM", activity: "Reading", details: "Physical book. No screens." },
        { time: "11:00 PM", activity: "Sleep", details: "Phone off or in another room." },
      ]
    },
    Tuesday: {
      title: "Tuesday: Speed Focus",
      schedule: [
        { time: "7:00 AM", activity: "Wake & Hydrate", details: "No snooze. Drink water. Make bed." },
        { time: "7:15 AM", activity: "Morning Routine", details: "Mobility & Coffee. No phone." },
        { time: "8:30 AM", activity: "Deep Work Block 1", details: "3x Pomodoro cycles (50/10)." },
        { time: "12:00 PM", activity: "Lunch (Break Fast)", details: "Mindful eating. Short walk." },
        { time: "1:00 PM", activity: "Deep Work Block 2", details: "2x Pomodoro cycles (50/10)." },
        { time: "3:00 PM", activity: "Admin & Shallow Work", details: "1 hour for emails, planning, and other less intensive tasks." },
        { time: "4:00 PM", activity: "Learning Block", details: "1.5 hours of focused study." },
        { time: "5:30 PM", activity: "Commute to Track", details: "20 minutes travel time." },
        { time: "5:50 PM", activity: "Running: Speed Work", details: "High intensity intervals.", workoutKey: "speedWork" },
        { time: "6:50 PM", activity: "Commute Home", details: "Mental cool-down." },
        { time: "7:10 PM", activity: "Post-Workout", details: "Whey Protein & Creatine." },
        { time: "7:45 PM", activity: "Dinner", details: "Focus on carbs. Last meal of the day." },
        { time: "10:00 PM", activity: "Wind-Down", details: "Prepare Casein. Light stretching." },
        { time: "10:30 PM", activity: "Reading", details: "Physical book. No screens." },
        { time: "11:00 PM", activity: "Sleep", details: "Crucial for recovery." },
      ]
    },
    Wednesday: {
      title: "Wednesday: Office, Social & Strength",
      schedule: [
        { time: "7:00 AM", activity: "Wake & Hydrate", details: "No snooze. Drink water. Your routine starts now." },
        { time: "7:15 AM", activity: "Efficient Morning Routine", details: "Coffee, essential mobility, and pack for the office." },
        { time: "8:00 AM", activity: "Commute to Office", details: "1-hour commute. Use for a podcast or audiobook." },
        { time: "9:00 AM", activity: "Deep Work Block 1", details: "Focus on your most important tasks for the morning." },
        { time: "12:00 PM", activity: "Lunch (Break Fast)", details: "Step away from your desk. Eat mindfully." },
        { time: "1:00 PM", activity: "Deep Work Block 2", details: "Complete your main work for the day." },
        { time: "3:30 PM", activity: "Admin & Shallow Work", details: "1 hour for emails, planning, and other less intensive tasks." },
        { time: "5:00 PM", activity: "Dinner Party", details: "Engage socially, eat mindfully, and enjoy the event." },
        { time: "7:30 PM", activity: "Commute Home", details: "1-hour commute. Use this time to decompress." },
        { time: "8:30 PM", activity: "Strength: Workout B", details: "Push Day. Focus on form.", workoutKey: "pushDay" },
        { time: "9:15 PM", activity: "Post-Workout", details: "Whey Protein & Creatine." },
        { time: "9:30 PM", activity: "Decompress & Prep", details: "Prepare bag, clothes, and meals for Thursday." },
        { time: "10:00 PM", activity: "Wind-Down & Reading", details: "Prepare and drink Casein. Read your physical book." },
        { time: "11:00 PM", activity: "Sleep", details: "Maintaining your sleep schedule is the top priority." },
      ]
    },
    Thursday: {
      title: "Thursday: Tempo Focus",
      schedule: [
        { time: "7:00 AM", activity: "Wake & Hydrate", details: "No snooze. Drink water. Make bed." },
        { time: "7:15 AM", activity: "Morning Routine", details: "Mobility & Coffee. No phone." },
        { time: "8:30 AM", activity: "Deep Work Block 1", details: "3x Pomodoro cycles (50/10)." },
        { time: "12:00 PM", activity: "Lunch (Break Fast)", details: "Mindful eating. Short walk." },
        { time: "1:00 PM", activity: "Deep Work Block 2", details: "2x Pomodoro cycles (50/10)." },
        { time: "3:00 PM", activity: "Admin & Shallow Work", details: "1 hour for emails, planning, and other less intensive tasks." },
        { time: "4:00 PM", activity: "Learning Block", details: "1.5 hours of focused study." },
        { time: "5:30 PM", activity: "Commute to Track", details: "20 minutes travel time." },
        { time: "5:50 PM", activity: "Running: Tempo Run", details: "'Comfortably hard' pace.", workoutKey: "tempoRun" },
        { time: "6:50 PM", activity: "Commute Home", details: "Reflect on the quality session." },
        { time: "7:10 PM", activity: "Post-Workout", details: "Whey Protein & Creatine." },
        { time: "7:45 PM", activity: "Dinner", details: "Quality meal. Last meal of the day." },
        { time: "10:00 PM", activity: "Wind-Down", details: "Prepare Casein. Light stretching." },
        { time: "10:30 PM", activity: "Reading", details: "Physical book. No screens." },
        { time: "11:00 PM", activity: "Sleep", details: "Crucial for adaptation." },
      ]
    },
    Friday: {
      title: "Friday: Strength Focus (Pull Day)",
      schedule: [
        { time: "7:00 AM", activity: "Wake & Hydrate", details: "No snooze. Drink water. Make bed." },
        { time: "7:15 AM", activity: "Morning Routine", details: "Mobility & Coffee. No phone." },
        { time: "8:30 AM", activity: "Deep Work Block 1", details: "3x Pomodoro cycles (50/10)." },
        { time: "12:00 PM", activity: "Lunch (Break Fast)", details: "Mindful eating. Short walk." },
        { time: "1:00 PM", activity: "Deep Work Block 2", details: "2x Pomodoro cycles (50/10)." },
        { time: "3:00 PM", activity: "Admin & Shallow Work", details: "1 hour for emails, planning, and other less intensive tasks." },
        { time: "4:00 PM", activity: "Learning Block", details: "1.5 hours of focused study." },
        { time: "5:30 PM", activity: "Strength: Workout A", details: "Pull Day: Beat Monday's numbers.", workoutKey: "pullDay" },
        { time: "6:30 PM", activity: "Post-Workout", details: "Whey Protein & Creatine." },
        { time: "7:00 PM", activity: "Dinner", details: "Celebrate the week. Last meal." },
        { time: "10:00 PM", activity: "Wind-Down", details: "Prepare Casein. Light stretching." },
        { time: "10:30 PM", activity: "Reading", details: "Physical book. No screens." },
        { time: "11:00 PM", activity: "Sleep", details: "Rest well for recovery day." },
      ]
    },
    Saturday: {
      title: "Saturday: Endurance Focus (Long Run)",
      schedule: [
        { time: "7:00 AM", activity: "Wake & Hydrate", details: "Wake up, drink water." },
        { time: "7:30 AM", activity: "Coffee / Light Fuel", details: "Optional banana if needed for run." },
        { time: "8:00 AM", activity: "Commute to Run", details: "20 minutes travel time." },
        { time: "8:20 AM", activity: "Running: Long Run", details: "10km at a very easy pace.", workoutKey: "longRun" },
        { time: "10:00 AM", activity: "Commute Home", details: "Cool down." },
        { time: "10:20 AM", activity: "Post-Run Recovery", details: "Whey Protein & Creatine." },
        { time: "11:00 AM", activity: "Brunch / Large Meal", details: "First main meal of the day." },
        { time: "12:00 PM", activity: "Relax & Recharge", details: "Low-energy activities. Nap." },
        { time: "4:00 PM", activity: "Life Admin / Meal Prep", details: "Groceries, cooking for Sunday." },
        { time: "7:00 PM", activity: "Dinner", details: "Last meal of the day." },
        { time: "10:00 PM", activity: "Wind-Down", details: "Prepare Casein. Read book." },
        { time: "11:00 PM", activity: "Sleep", details: "Full night's sleep is key." },
      ]
    },
    Sunday: {
      title: "Sunday: Recovery Focus (Easy Run)",
      schedule: [
        { time: "7:00 AM", activity: "Wake & Hydrate", details: "Maintain wake-up time." },
        { time: "7:30 AM", activity: "Coffee & Slow Morning", details: "No rush. Enjoy." },
        { time: "9:00 AM", activity: "Running: Easy Run", details: "40 minutes, relaxed pace.", workoutKey: "easyRun" },
        { time: "9:40 AM", activity: "Post-Run Recovery", details: "Whey Protein & Creatine. Shower." },
        { time: "10:30 AM", activity: "Brunch / Meal", details: "First meal of the day." },
        { time: "12:00 PM", activity: "Active Recovery", details: "Long, slow walk. Light movement." },
        { time: "5:00 PM", activity: "Weekly Review & Plan", details: "Review past week, plan next." },
        { time: "7:00 PM", activity: "Dinner", details: "Last meal of the day." },
        { time: "8:00 PM", activity: "Unwind", details: "Watch a movie, listen to music." },
        { time: "10:00 PM", activity: "Wind-Down", details: "Prepare Casein. Read book." },
        { time: "11:00 PM", activity: "Sleep", details: "Ready for the new week." },
      ]
    }
  };