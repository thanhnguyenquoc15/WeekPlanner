export const workoutDetails = {
    pullDay: {
      title: "Workout A: Pull Day",
      exercises: ["Chin-Ups", "Standard Pull-Ups", "Commando Pull-Ups", "Bar Hang"],
      details: "Focus on maximum repetitions and perfect form. This is a high-effort day."
    },
    pushDay: {
      title: "Workout B: Push Day",
      exercises: ["Pike Push-Ups", "Diamond Push-Ups", "Standard Push-Ups"],
      details: "Focus on controlled movements and full range of motion."
    },
    speedWork: {
      title: "Speed Workout",
      exercises: ["6x400m fast intervals"],
      details: "Run each interval at a high intensity, with adequate rest in between to recover."
    },
    tempoRun: {
      title: "Tempo Workout",
      exercises: ["20 minutes 'comfortably hard'"],
      details: "Maintain a consistent, challenging pace that you can hold for the full duration."
    },
    longRun: {
      title: "Long Run",
      exercises: ["10km at a very easy pace"],
      details: "The goal is to complete the distance, not speed. Focus on endurance."
    },
    easyRun: {
      title: "Easy Run",
      exercises: ["40 minutes at a relaxed pace"],
      details: "This is a recovery run. Keep the effort light and conversational."
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
        { time: "3:30 PM", activity: "Learning Block", details: "1.5 hours of focused study." },
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
        { time: "3:30 PM", activity: "Learning Block", details: "1.5 hours of focused study." },
        { time: "5:00 PM", activity: "Commute to Track", details: "20 minutes travel time." },
        { time: "5:20 PM", activity: "Running: Speed Work", details: "High intensity intervals.", workoutKey: "speedWork" },
        { time: "6:20 PM", activity: "Commute Home", details: "Mental cool-down." },
        { time: "6:40 PM", activity: "Post-Workout", details: "Whey Protein & Creatine." },
        { time: "7:15 PM", activity: "Dinner", details: "Focus on carbs. Last meal of the day." },
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
        { time: "1:00 PM", activity: "Deep Work Block 2", details: "Complete your work for the day." },
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
        { time: "3:30 PM", activity: "Learning Block", details: "1.5 hours of focused study." },
        { time: "5:00 PM", activity: "Commute to Track", details: "20 minutes travel time." },
        { time: "5:20 PM", activity: "Running: Tempo Run", details: "'Comfortably hard' pace.", workoutKey: "tempoRun" },
        { time: "6:20 PM", activity: "Commute Home", details: "Reflect on the quality session." },
        { time: "6:40 PM", activity: "Post-Workout", details: "Whey Protein & Creatine." },
        { time: "7:15 PM", activity: "Dinner", details: "Quality meal. Last meal of the day." },
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
        { time: "3:30 PM", activity: "Learning Block", details: "1.5 hours of focused study." },
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