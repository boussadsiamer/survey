// App Logic

// 1. Initialize Back4App
Parse.initialize(
    "lEwth1fmj3DSPzjrQHqmeBN3Txo8an53MPJTOpZl", // App ID
    "RdZkykypa3UYyIHlMlYGEaJPyg0IVfhBZ2w8x9qn"  // JS Key
);
Parse.serverURL = 'https://parseapi.back4app.com/';

// 2. State Management
const state = {
    currentQuestionIndex: 0,
    answers: {},
    questions: []
};

// 3. DOM Elements
const views = {
    intro: document.getElementById('intro-view'),
    survey: document.getElementById('survey-view'),
    results: document.getElementById('results-view')
};

const els = {
    startBtn: document.getElementById('start-btn'),
    nextBtn: document.getElementById('next-btn'),
    prevBtn: document.getElementById('prev-btn'),
    questionText: document.getElementById('question-text'),
    questionContext: document.getElementById('question-context'),
    optionsContainer: document.getElementById('options-container'),
    progressBar: document.getElementById('progress-bar'),
    appContainer: document.querySelector('.app-container'),
    maximizeBtn: document.getElementById('maximize-btn')
};

// 4. Question Data
const questionsData = [
    // Section 1: Algerian Habits & Culture
    {
        id: "ramadan_waste",
        text: "Do you find that you waste more food during Ramadan compared to the rest of the year?",
        type: "yes_no",
        context: "Food waste often spikes during this month."
    },
    {
        id: "bread_habit",
        text: "What do you usually do with leftover bread?",
        type: "multiple_choice",
        options: ["Trash (One Bag)", "Give to animals/Shepherd", "Reuse (Cooking)"],
        context: "Bread is rarely thrown in the main trash; it's often separated."
    },
    {
        id: "grocery_carrier",
        text: "How do you carry your groceries?",
        type: "multiple_choice",
        options: ["Plastic Bags (from seller)", "Reusable (Couffa)", "Mix of both"],
        context: "The 'Couffa' is a traditional eco-friendly habit making a comeback."
    },
    {
        id: "water_tank_have",
        text: "Do you have a water tank (citerne) at home?",
        type: "yes_no",
        context: "Many Algerian households use citernes due to inconsistent water supply."
    },
    {
        id: "water_tank_care",
        text: "Does the water tank make you more conscious of your water usage?",
        type: "yes_no",
        context: "Some people with water tanks become more aware of consumption, others don't."
    },
    {
        id: "returnable_bottles",
        text: "Do you prefer buying returnable glass bottles (hamoud) over plastic ones?",
        type: "yes_no",
        context: "None"
    },

    // Section 2: Food Waste
    {
        id: "food_expire",
        text: "How often do you let food expire in your fridge?",
        type: "frequency",
        context: "None"
    },
    {
        id: "meal_planning",
        text: "How often do you plan meals before shopping?",
        type: "frequency",
        context: "None"
    },
    {
        id: "leftover_storage",
        text: "Do you store leftovers properly (airtight containers, freezing, etc.)?",
        type: "frequency",
        context: "None"
    },
    {
        id: "impulse_buying",
        text: "Do you buy items because of promotions even if you don’t need them?",
        type: "frequency",
        context: "None"
    },

    // Section 3: Water Waste
    {
        id: "greywater_reuse",
        text: "Do you reuse greywater (washing vegetables, AC water) for plants?",
        type: "frequency",
        context: "None"
    },
    {
        id: "washing_machine_load",
        text: "How often do you run your washing machine with a half-empty load?",
        type: "frequency",
        context: "None"
    },
    {
        id: "cleaning_method",
        text: "How is the floor or car usually washed?",
        type: "multiple_choice",
        options: ["Hose (Tiyo - Running water)", "Bucket"],
        context: "None"
    },
    {
        id: "leak_reporting",
        text: "Do you report leaks in your building/neighborhood?",
        type: "yes_no",
        context: "None"
    },

    // Section 4: Energy Use
    {
        id: "standby_hours",
        text: "How many hours per day do you leave your TV/computer on standby?",
        type: "number",
        max: 24,
        context: "None"
    },
    {
        id: "lighting_preference",
        text: "Do you use natural light during the day or rely on lamps?",
        type: "multiple_choice",
        options: ["Mostly Natural Light", "Mostly Lamps", "Both Equally"],
        context: "None"
    },
    {
        id: "ac_heating_usage",
        text: "Do you overuse AC/heating even when it's not needed?",
        type: "frequency",
        context: "None"
    },
    {
        id: "appliance_age",
        text: "How old are your household appliances (fridge, AC, heater)?",
        type: "multiple_choice",
        options: ["Less than 1 year", "1-5 years", "5-10 years", "More than 10 years"],
        context: "Older appliances are often less energy efficient."
    },
    {
        id: "energy_labels",
        text: "Do you check energy labels before buying electronics?",
        type: "frequency",
        context: "None"
    },

    // Section 5: Waste & Recycling
    {
        id: "separation_willingness",
        text: "Would you separate your waste if distinct bins were available in your neighborhood?",
        type: "yes_no",
        context: "None"
    },
    {
        id: "container_reuse",
        text: "How often do you reuse jars, bottles, or containers?",
        type: "frequency",
        context: "None"
    },
    {
        id: "reusable_bags",
        text: "Do you bring reusable bags when shopping?",
        type: "frequency",
        context: "None"
    },
    {
        id: "low_packaging",
        text: "Do you buy products with less packaging?",
        type: "frequency",
        context: "None"
    },
    {
        id: "donations",
        text: "Have you ever donated clothes or books instead of throwing them?",
        type: "yes_no",
        context: "None"
    },
    {
        id: "plastic_bottle_count",
        text: "How many plastic bottles do you throw away per week?",
        type: "number",
        context: "None"
    },

    // Section 6: Awareness & Attitudes
    {
        id: "community_issue_belief",
        text: "Do you believe waste is a serious issue in your community?",
        type: "scale_1_5",
        context: "None"
    },
    {
        id: "household_comparison",
        text: "Do you think your household wastes more, less, or the same as others?",
        type: "multiple_choice",
        options: ["More", "Less", "About the same"],
        context: "None"
    },
    {
        id: "education_received",
        text: "Have you received any education on waste reduction (school, social media, workshops)?",
        type: "yes_no",
        context: "None"
    },
    {
        id: "cleanup_participation",
        text: "Would you participate in community clean-up events?",
        type: "yes_no",
        context: "None"
    },
    {
        id: "government_satisfaction",
        text: "Do you think the government provides enough solutions for waste management?",
        type: "scale_1_5",
        context: "None"
    },
    {
        id: "money_motivation",
        text: "Are you willing to change habits if it saves money?",
        type: "yes_no",
        context: "None"
    },
    {
        id: "biggest_problem",
        text: "Which type of waste do you believe is the biggest problem in Algeria?",
        type: "multiple_choice",
        options: ["Plastic", "Food Waste", "Water Waste", "Industrial Waste", "Electronic Waste"],
        multiSelect: true,
        maxSelections: 2,
        context: "Choose 2 from these options"
    },

    // Section 7: Government & Community
    {
        id: "initiative_participation",
        text: "If the government added new recycling points or initiatives, would you actively participate?",
        type: "yes_no",
        context: "None"
    }
];

// 5. Functions
function init() {
    state.questions = questionsData;
    els.startBtn.addEventListener('click', startSurvey);
    els.nextBtn.addEventListener('click', nextQuestion);
    els.prevBtn.addEventListener('click', prevQuestion);
    els.maximizeBtn.addEventListener('click', toggleMaximize);
}

function toggleMaximize() {
    els.appContainer.classList.toggle('maximized');
}

function startSurvey() {
    views.intro.classList.add('hidden');
    views.survey.classList.remove('hidden');
    renderQuestion();
}

function renderQuestion() {
    const q = state.questions[state.currentQuestionIndex];

    // Update Text
    els.questionText.innerText = q.text;
    els.questionContext.innerText = (q.context && q.context !== "None") ? q.context : "";

    // Update Progress
    const progress = ((state.currentQuestionIndex) / state.questions.length) * 100;
    els.progressBar.style.width = `${progress}%`;

    // Render Options
    els.optionsContainer.innerHTML = '';

    // Handle different types
    if (q.type === 'yes_no') {
        renderOption('Yes', 'radio');
        renderOption('No', 'radio');
    } else if (q.type === 'multiple_choice' && q.options) {
        const inputType = q.multiSelect ? 'checkbox' : 'radio';
        q.options.forEach(opt => renderOption(opt, inputType));
    } else if (q.type === 'frequency') {
        const freqOptions = ["Always", "Often", "Sometimes", "Rarely", "Never"];
        freqOptions.forEach(opt => renderOption(opt, 'radio'));
    } else if (q.type === 'scale_1_5') {
        renderScale();
    } else if (q.type === 'number') {
        renderNumberInput(q.max);
    }

    // Restore previous answer if exists
    const savedAnswer = state.answers[q.id];
    if (savedAnswer) {
        if (q.type === 'number') {
            const input = els.optionsContainer.querySelector('input[type="number"]');
            if (input) input.value = savedAnswer;
        } else if (Array.isArray(savedAnswer)) {
            // Handle multi-select restoration
            savedAnswer.forEach(val => {
                const checkbox = els.optionsContainer.querySelector(`input[value="${val}"]`);
                if (checkbox) checkbox.checked = true;
            });
        } else {
            const radio = els.optionsContainer.querySelector(`input[value="${savedAnswer}"]`);
            if (radio) radio.checked = true;
        }
    }

    // Update Buttons
    els.prevBtn.classList.toggle('hidden', state.currentQuestionIndex === 0);
    els.nextBtn.innerText = state.currentQuestionIndex === state.questions.length - 1 ? 'Finish' : 'Next';

    // Reset Next Button State (unless answer exists)
    if (!savedAnswer) {
        els.nextBtn.classList.add('disabled');
    } else {
        els.nextBtn.classList.remove('disabled');
    }
}

function renderOption(label, type) {
    const div = document.createElement('div');
    div.className = 'option-item';
    div.innerHTML = `
        <label class="option-label">
            <input type="${type}" name="answer" value="${label}" onchange="handleInput()">
            ${label}
        </label>
    `;
    els.optionsContainer.appendChild(div);
}

function renderScale() {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.justifyContent = 'space-between';
    container.style.gap = '10px';

    for (let i = 1; i <= 5; i++) {
        const div = document.createElement('div');
        div.className = 'option-item';
        div.style.flex = '1';
        div.innerHTML = `
            <label class="option-label" style="justify-content: center; flex-direction: column;">
                <span style="font-size: 1.2rem; font-weight: bold;">${i}</span>
                <input type="radio" name="answer" value="${i}" onchange="handleInput()">
            </label>
        `;
        container.appendChild(div);
    }
    els.optionsContainer.appendChild(container);
}

function renderNumberInput(max) {
    const div = document.createElement('div');
    div.className = 'option-item';
    const maxAttr = max ? `max="${max}"` : '';
    div.innerHTML = `
        <input type="number" id="number-input" placeholder="0" min="0" ${maxAttr} oninput="handleInput()">
    `;
    els.optionsContainer.appendChild(div);
}

function handleInput() {
    const q = state.questions[state.currentQuestionIndex];
    let val = null;

    if (q.type === 'number') {
        const input = document.getElementById('number-input');
        if (input.value !== '') {
            let num = parseFloat(input.value);
            if (q.max && num > q.max) {
                num = q.max;
                input.value = num; // Enforce max visually
            }
            val = input.value;
        }
    } else if (q.multiSelect) {
        // Handle multi-select
        const checkedBoxes = Array.from(document.querySelectorAll('input[name="answer"]:checked'));

        if (q.maxSelections && checkedBoxes.length > q.maxSelections) {
            // Uncheck the last one if limit exceeded (or prevent checking - here we just uncheck the one that triggered it if possible, but easier to just slice)
            // Actually, better UX is to prevent checking the 3rd one.
            // Since this runs onchange, the change already happened. We need to revert it.
            // The last one clicked is hard to track without event arg. 
            // Simple approach: keep first N.
            checkedBoxes.forEach((box, index) => {
                if (index >= q.maxSelections) box.checked = false;
            });
            // Re-query valid ones
            val = Array.from(document.querySelectorAll('input[name="answer"]:checked')).map(cb => cb.value);
        } else {
            val = checkedBoxes.map(cb => cb.value);
        }
        if (val.length === 0) val = null; // Require at least one? Or allow empty? Usually require one.
    } else {
        const checked = document.querySelector('input[name="answer"]:checked');
        if (checked) val = checked.value;
    }

    if (val) {
        state.answers[q.id] = val;
        els.nextBtn.classList.remove('disabled');
    } else {
        // Only disable if it's required. Assuming all are required for now.
        els.nextBtn.classList.add('disabled');
    }
}

function nextQuestion() {
    const q = state.questions[state.currentQuestionIndex];

    // Save current answer
    const val = state.answers[q.id];
    if (!val) return; // shouldn't happen because Next is disabled

    // CONDITIONAL SKIP
    if (q.id === "water_tank_have") {
        if (val === "No") {
            // Skip "water_tank_care"
            // Find the index of that question in the array
            const skipIndex = state.questions.findIndex(
                x => x.id === "water_tank_care"
            );

            // If next question *is* that question, skip it
            if (skipIndex === state.currentQuestionIndex + 1) {
                state.currentQuestionIndex += 2;
                if (state.currentQuestionIndex < state.questions.length) {
                    renderQuestion();
                    return;
                } else {
                    finishSurvey();
                    return;
                }
            }
        }
    }

    // Normal case
    state.currentQuestionIndex++;

    if (state.currentQuestionIndex < state.questions.length) {
        renderQuestion();
    } else {
        finishSurvey();
    }
}

function prevQuestion() {
    if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex--;
        renderQuestion();
    }
}

async function finishSurvey() {
    // Show loading state
    els.nextBtn.innerText = "Saving...";
    els.nextBtn.classList.add('disabled');

    // Save to Back4App
    const SurveySubmission = Parse.Object.extend("SurveySubmission");
    const submission = new SurveySubmission();

    for (const [key, value] of Object.entries(state.answers)) {
        // Convert numbers if needed
        const numVal = Number(value);
        if (Array.isArray(value)) {
            submission.set(key, value.join(', '));
        } else if (!isNaN(numVal) && state.questions.find(q => q.id === key && (q.type === 'number' || q.type === 'scale_1_5'))) {
            submission.set(key, numVal);
        } else {
            submission.set(key, value);
        }
    }

    try {
        await submission.save();
        console.log("Saved successfully!");

        views.survey.classList.add('hidden');
        views.results.classList.remove('hidden');

    } catch (error) {
        console.error("Error saving: ", error);
        alert("Error saving data. Please try again.");
        els.nextBtn.innerText = "Finish";
        els.nextBtn.classList.remove('disabled');
    }
}

// Analysis removed for now
// async function renderResults() { ... }

// Start
init();
