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