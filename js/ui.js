import { getRandomQuote } from './quotes.js';
import { scheduleData } from './data.js';
import { workoutDetails } from './exercises.js';

const COLORS = {
    purple: '#7542A8',
};

let quoteTimeout;

// DOM Elements
const blueprintTitle = document.getElementById('daily-blueprint-title');
const blueprintContainer = document.getElementById('daily-blueprint-content');
const calendarNav = document.getElementById('calendar-nav');
// Schedule Modal
const scheduleModal = document.getElementById('schedule-modal');
const scheduleModalTitle = document.getElementById('modal-title');
const scheduleModalBody = document.getElementById('modal-body');
const scheduleModalCloseBtn = document.getElementById('modal-close');
const scheduleProgressBar = document.getElementById('modal-progress-bar');
const quoteDisplay = document.getElementById('quote-display');
// Workout Modal
const workoutModal = document.getElementById('workout-modal');
const workoutModalTitle = document.getElementById('workout-modal-title');
const workoutModalBody = document.getElementById('workout-modal-body');
const workoutModalCloseBtn = document.getElementById('workout-modal-close');


function updateDailyBlueprint(day) {
    const data = scheduleData[day];
    if (!data) return;
    blueprintTitle.textContent = `${day}'s Blueprint`;
    const keyEventMatchers = [
      item => item.activity.includes('Wake'),
      item => item.activity.includes('Deep Work Block 1') || item.activity.includes('Running:') || item.activity.includes('Efficient Morning'),
      item => item.activity.includes('Lunch') || item.activity.includes('Brunch'),
      item => item.activity.includes('Deep Work Block 2') && ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(day),
      item => item.activity.includes('Strength:') || item.activity.includes('Running:') || item.activity.includes('Dinner Party'),
      item => item.activity.includes('Dinner') || item.activity.includes('Weekly Review') || item.activity.includes('Life Admin'),
      item => item.activity.includes('Sleep') && ['Saturday', 'Sunday'].includes(day)
    ];

    const milestones = [];
    const usedIndices = new Set();

    keyEventMatchers.forEach(matcher => {
        const foundEvent = data.schedule.find((item, index) => !usedIndices.has(index) && matcher(item));
        if (foundEvent) {
            milestones.push(foundEvent);
            usedIndices.add(data.schedule.indexOf(foundEvent));
        }
    });

    let html = '';
    milestones.forEach((event, index) => {
        html += `<div class="p-3 rounded-lg bg-gray-100 w-full md:w-auto"><span class="font-bold">${event.time}</span><br>${event.activity.split(':')[0]}</div>`;
        if (index < milestones.length - 1) {
            html += `<div class="text-2xl font-bold" style="color: #00A6ED;">→</div>`;
        }
    });

    blueprintContainer.innerHTML = html;
};

function getProgress(day) {
    const stored = localStorage.getItem(`progress_${day}`);
    return stored ? JSON.parse(stored) : [];
};

function saveProgress(day, progress) {
    localStorage.setItem(`progress_${day}`, JSON.stringify(progress));
};

function showQuote() {
    clearTimeout(quoteTimeout);
    quoteDisplay.textContent = getRandomQuote();
    quoteDisplay.style.opacity = 1;

    quoteTimeout = setTimeout(() => {
        quoteDisplay.style.opacity = 0;
    }, 60000);
};

function updateProgress(day) {
    const checkboxes = scheduleModalBody.querySelectorAll('.activity-checkbox');
    const total = checkboxes.length;
    if (total === 0) return;

    const checked = Array.from(checkboxes).filter(cb => cb.checked);
    const progressPercentage = (checked.length / total) * 100;
    scheduleProgressBar.style.width = `${progressPercentage}%`;

    const checkedIndices = checked.map(cb => parseInt(cb.dataset.index));
    saveProgress(day, checkedIndices);
};

function openScheduleModal(day) {
    const data = scheduleData[day];
    if (!data) return;

    scheduleModal.dataset.day = day;
    scheduleModalTitle.textContent = data.title;
    quoteDisplay.style.opacity = 0;
    const savedProgress = getProgress(day);

    let bodyContent = '<ul class="space-y-4">';
    data.schedule.forEach((item, index) => {
        const isChecked = savedProgress.includes(index);
        bodyContent += `
        <li class="flex items-start pb-4 border-b last:border-b-0 border-gray-200">
            <div class="w-24 text-right pr-4 flex-shrink-0">
                <p class="font-bold text-md" style="color: ${COLORS.purple};">${item.time}</p>
            </div>
            <div class="flex-grow flex items-center">
                <input type="checkbox" data-index="${index}" class="activity-checkbox h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-4" ${isChecked ? 'checked' : ''}>
                <div>`;

        if (item.workoutKey) {
        bodyContent += `<p class="font-semibold text-lg"><a href="#" class="text-blue-600 hover:underline workout-link" data-workout-key="${item.workoutKey}">${item.activity}</a></p>`;
        } else {
        bodyContent += `<p class="font-semibold text-lg">${item.activity}</p>`;
        }

        bodyContent += `<p class="text-gray-600">${item.details}</p>
                </div>
            </div>
        </li>`;
    });
    bodyContent += '</ul>';
    scheduleModalBody.innerHTML = bodyContent;

    updateProgress(day);
    document.body.classList.add('body-no-scroll'); 
    scheduleModal.classList.add('is-open');
};

function closeScheduleModal() {
    scheduleModal.classList.remove('is-open');
    document.body.classList.remove('body-no-scroll');
};

function openWorkoutModal(key) {
    const data = workoutDetails[key];
    if (!data) return;

    workoutModalTitle.textContent = data.title;

    // Start building the HTML content with a container for better spacing
    let bodyContent = '<div class="space-y-6">';

    // Iterate over each exercise object in the new data structure
    data.exercises.forEach(exercise => {
        bodyContent += `
        <div>
            <h3 class="text-lg font-semibold text-gray-800">${exercise.name}</h3>`;

        // Check if there are sub-steps and add them as a nested list
        if (exercise.steps && exercise.steps.length > 0) {
            bodyContent += '<ul class="mt-2 space-y-1 list-disc list-inside text-gray-600 pl-2">';
            exercise.steps.forEach(step => {
                bodyContent += `<li class="text-base">${step}</li>`;
            });
            bodyContent += '</ul>';
        }
        bodyContent += `</div>`;
    });

    bodyContent += '</div>'; // Close the main container

    // Add the overall workout details at the bottom with a separator
    if (data.details) {
        bodyContent += `<p class="mt-6 pt-4 border-t border-gray-200 text-gray-500 italic">${data.details}</p>`;
    }

    workoutModalBody.innerHTML = bodyContent;
    document.body.classList.add('body-no-scroll');
    workoutModal.classList.add('is-open');
};

function closeWorkoutModal() {
    workoutModal.classList.remove('is-open');
    document.body.classList.remove('body-no-scroll');
};

function setupEventListeners() {
    scheduleModalCloseBtn.addEventListener('click', closeScheduleModal);
    scheduleModal.addEventListener('click', (e) => {
        if (e.target === scheduleModal) closeScheduleModal();
    });

    scheduleModalBody.addEventListener('change', (e) => {
        if (e.target.classList.contains('activity-checkbox')) {
            const day = scheduleModal.dataset.day;
            if (e.target.checked) showQuote();
            updateProgress(day);
        }
    });

    workoutModalCloseBtn.addEventListener('click', closeWorkoutModal);
    workoutModal.addEventListener('click', (e) => {
        if (e.target === workoutModal) closeWorkoutModal();
    });

    scheduleModalBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('workout-link')) {
            e.preventDefault();
            const key = e.target.getAttribute('data-workout-key');
            openWorkoutModal(key);
        }
    });
}

export function initUI() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayAbbr = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const today = new Date();
    const dayOfWeek = today.getDay();
    const adjustedIndex = (dayOfWeek === 0) ? 6 : dayOfWeek - 1;
    const todayName = days[adjustedIndex];

    days.forEach((day, index) => {
        const button = document.createElement('button');
        button.textContent = dayAbbr[index];
        button.setAttribute('data-day', day);
        let buttonClasses = 'day-btn flex-1 text-center font-bold py-2 px-1 md:px-4 rounded-lg transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400 ';

        if (day === todayName) {
            buttonClasses += 'bg-purple-600 text-white';
        } else {
            buttonClasses += 'text-gray-700 hover:bg-purple-100';
        }
        button.className = buttonClasses;

        calendarNav.appendChild(button);
        button.addEventListener('click', () => {
            updateDailyBlueprint(day);
            openScheduleModal(day);
        });
    });

    // Set initial state
    updateDailyBlueprint(todayName);
    setupEventListeners();
}