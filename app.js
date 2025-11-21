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
    language: 'en', // Default language
    answers: {},
    questions: []
};

// UI Dictionary for static elements
const UI_TEXT = {
    en: { start: "Start Survey", next: "Next", back: "Back", finish: "Finish", saving: "Saving...", yes: "Yes", no: "No", freq: ["Always", "Often", "Sometimes", "Rarely", "Never"] },
    fr: { start: "Commencer", next: "Suivant", back: "Retour", finish: "Terminer", saving: "Enregistrement...", yes: "Oui", no: "Non", freq: ["Toujours", "Souvent", "Parfois", "Rarement", "Jamais"] },
    ar: { start: "ابدأ الاستبيان", next: "التالي", back: "عودة", finish: "إنهاء", saving: "جاري الحفظ...", yes: "نعم", no: "لا", freq: ["دائماً", "غالباً", "أحياناً", "نادراً", "أبداً"] }
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

// 4. Question Data (Fully Translated)
const questionsData = [
    // Section 1: Algerian Habits & Culture
    {
        id: "ramadan_waste",
        text: {
            en: "Do you find that you waste more food during Ramadan compared to the rest of the year?",
            fr: "Trouvez-vous que vous gaspillez plus de nourriture pendant le Ramadan par rapport au reste de l'année ?",
            ar: "هل تجد أنك تبذر الطعام أكثر في رمضان مقارنة بباقي السنة؟"
        },
        type: "yes_no",
        context: {
            en: "Food waste often spikes during this month.",
            fr: "Le gaspillage alimentaire augmente souvent durant ce mois.",
            ar: "غالبًا ما يرتفع هدر الطعام خلال هذا الشهر."
        }
    },
    {
        id: "bread_habit",
        text: {
            en: "What do you usually do with leftover bread?",
            fr: "Que faites-vous habituellement avec le reste de pain ?",
            ar: "ماذا تفعل عادةً ببقايا الخبز؟"
        },
        type: "multiple_choice",
        options: {
            en: ["Trash (One Bag)", "Give to animals/Shepherd", "Reuse (Cooking)"],
            fr: ["Poubelle (Mélangé)", "Donner aux animaux/Bergers", "Réutiliser (Cuisine)"],
            ar: ["القمامة", "للحيوانات / الرعاة", "إعادة استخدام (طبخ)"]
        },
        context: {
            en: "Bread is rarely thrown in the main trash; it's often separated.",
            fr: "Le pain est rarement jeté avec les ordures ménagères ; il est souvent séparé.",
            ar: "نادرًا ما يرمى الخبز في القمامة الرئيسية؛ غالبًا ما يتم فصله."
        }
    },
    {
        id: "grocery_carrier",
        text: {
            en: "How do you carry your groceries?",
            fr: "Comment transportez-vous vos courses ?",
            ar: "كيف تحمل مشترياتك (قضيان)؟"
        },
        type: "multiple_choice",
        options: {
            en: ["Plastic Bags (from seller)", "Reusable (Couffa)", "Mix of both"],
            fr: ["Sacs en plastique (du vendeur)", "Réutilisable (Couffa)", "Mélange des deux"],
            ar: ["أكياس بلاستيكية", "قفة (Couffa)", "خليط بينهما"]
        },
        context: {
            en: "The 'Couffa' is a traditional eco-friendly habit making a comeback.",
            fr: "La 'Couffa' est une habitude écologique traditionnelle qui fait son retour.",
            ar: "القفة هي عادة بيئية تقليدية تعود للواجهة."
        }
    },
    {
        id: "water_tank_have",
        text: {
            en: "Do you have a water tank (citerne) at home?",
            fr: "Avez-vous un réservoir d'eau (citerne) à la maison ?",
            ar: "هل لديك خزان مياه (سيتيرنا) في المنزل؟"
        },
        type: "yes_no",
        context: {
            en: "Many Algerian households use citernes due to inconsistent water supply.",
            fr: "De nombreux foyers algériens utilisent des citernes en raison des coupures d'eau.",
            ar: "تستخدم العديد من الأسر الجزائرية الخزانات بسبب انقطاع المياه."
        }
    },
    {
        id: "water_tank_care",
        text: {
            en: "Does the water tank make you more conscious of your water usage?",
            fr: "La citerne vous rend-elle plus conscient de votre consommation d'eau ?",
            ar: "هل يجعلك خزان المياه أكثر وعياً باستهلاكك للمياه؟"
        },
        type: "yes_no",
        context: {
            en: "Some people become more aware of consumption, others don't.",
            fr: "Certaines personnes deviennent plus conscientes, d'autres non.",
            ar: "البعض يصبح أكثر وعياً بالاستهلاك، والبعض الآخر لا."
        }
    },
    {
        id: "returnable_bottles",
        text: {
            en: "Do you prefer buying returnable glass bottles (hamoud) over plastic ones?",
            fr: "Préférez-vous acheter des bouteilles en verre consignées (Hamoud) plutôt que du plastique ?",
            ar: "هل تفضل شراء القارورات الزجاجية المرجعة (حمود) بدلاً من البلاستيكية؟"
        },
        type: "yes_no",
        context: "None"
    },

    // Section 2: Food Waste
    {
        id: "food_expire",
        text: {
            en: "How often do you let food expire in your fridge?",
            fr: "À quelle fréquence laissez-vous la nourriture périmer dans votre frigo ?",
            ar: "كم مرة تترك الطعام يفسد في الثلاجة؟"
        },
        type: "frequency",
        context: "None"
    },
    {
        id: "meal_planning",
        text: {
            en: "How often do you plan meals before shopping?",
            fr: "À quelle fréquence planifiez-vous les repas avant de faire les courses ?",
            ar: "كم مرة تخطط للوجبات قبل التسوق؟"
        },
        type: "frequency",
        context: "None"
    },
    {
        id: "leftover_storage",
        text: {
            en: "Do you store leftovers properly (airtight containers, freezing, etc.)?",
            fr: "Conservez-vous correctement les restes (boîtes hermétiques, congélation) ?",
            ar: "هل تقوم بتخزين بقايا الطعام بشكل صحيح (علب محكمة، تجميد)؟"
        },
        type: "frequency",
        context: "None"
    },
    {
        id: "impulse_buying",
        text: {
            en: "Do you buy items because of promotions even if you don’t need them?",
            fr: "Achetez-vous des articles en promotion même si vous n'en avez pas besoin ?",
            ar: "هل تشتري سلعاً بسبب العروض الترويجية (Solde) حتى لو لم تكن بحاجة إليها؟"
        },
        type: "frequency",
        context: "None"
    },

    // Section 3: Water Waste
    {
        id: "greywater_reuse",
        text: {
            en: "Do you reuse greywater (washing vegetables, AC water) for plants?",
            fr: "Réutilisez-vous les eaux grises (lavage légumes, eau clim) pour les plantes ?",
            ar: "هل تعيد استخدام المياه الرمادية (غسل الخضر، مياه المكيف) للنباتات؟"
        },
        type: "frequency",
        context: "None"
    },
    {
        id: "washing_machine_load",
        text: {
            en: "How often do you run your washing machine with a half-empty load?",
            fr: "À quelle fréquence faites-vous tourner la machine à laver à moitié vide ?",
            ar: "كم مرة تشغل الغسالة وهي نصف فارغة؟"
        },
        type: "frequency",
        context: "None"
    },
    {
        id: "cleaning_method",
        text: {
            en: "How is the floor or car usually washed?",
            fr: "Comment lavez-vous généralement le sol ou la voiture ?",
            ar: "كيف تغسل الأرضية أو السيارة عادة؟"
        },
        type: "multiple_choice",
        options: {
            en: ["Hose (Tiyo - Running water)", "Bucket"],
            fr: ["Tuyau (Tiyo - Eau courante)", "Seau"],
            ar: ["خرطوم (تيو - مياه جارية)", "دلو (بسينه)"]
        },
        context: "None"
    },
    {
        id: "leak_reporting",
        text: {
            en: "Do you report leaks in your building/neighborhood?",
            fr: "Signalez-vous les fuites dans votre immeuble ou quartier ?",
            ar: "هل تبلغ عن تسربات المياه في عمارتك أو حيك؟"
        },
        type: "yes_no",
        context: "None"
    },

    // Section 4: Energy Use
    {
        id: "standby_hours",
        text: {
            en: "How many hours per day do you leave your TV/computer on standby?",
            fr: "Combien d'heures par jour laissez-vous votre TV/PC en veille ?",
            ar: "كم ساعة في اليوم تترك التلفاز/الكمبيوتر في وضع الاستعداد (Standby)؟"
        },
        type: "number",
        max: 24,
        context: "None"
    },
    {
        id: "lighting_preference",
        text: {
            en: "Do you use natural light during the day or rely on lamps?",
            fr: "Utilisez-vous la lumière naturelle le jour ou des lampes ?",
            ar: "هل تستخدم الضوء الطبيعي خلال النهار أم تعتمد على المصابيح؟"
        },
        type: "multiple_choice",
        options: {
            en: ["Mostly Natural Light", "Mostly Lamps", "Both Equally"],
            fr: ["Surtout lumière naturelle", "Surtout des lampes", "Les deux"],
            ar: ["ضوء طبيعي غالباً", "مصابيح غالباً", "كلاهما بالتساوي"]
        },
        context: "None"
    },
    {
        id: "ac_heating_usage",
        text: {
            en: "Do you overuse AC/heating even when it's not needed?",
            fr: "Abusez-vous de la clim/chauffage même quand ce n'est pas nécessaire ?",
            ar: "هل تفرط في استخدام المكيف/المدفأة حتى عند عدم الحاجة؟"
        },
        type: "frequency",
        context: "None"
    },
    {
        id: "appliance_age",
        text: {
            en: "How old are your household appliances (fridge, AC, heater)?",
            fr: "Quel âge ont vos appareils électroménagers (frigo, clim, chauffage) ?",
            ar: "ما هو عمر أجهزتك المنزلية (ثلاجة، مكيف، مدفأة)؟"
        },
        type: "multiple_choice",
        options: {
            en: ["Less than 1 year", "1-5 years", "5-10 years", "More than 10 years"],
            fr: ["Moins d'un an", "1-5 ans", "5-10 ans", "Plus de 10 ans"],
            ar: ["أقل من سنة", "1-5 سنوات", "5-10 سنوات", "أكثر من 10 سنوات"]
        },
        context: {
            en: "Older appliances are often less energy efficient.",
            fr: "Les vieux appareils consomment souvent plus d'énergie.",
            ar: "الأجهزة القديمة غالباً ما تكون أقل كفاءة في استهلاك الطاقة."
        }
    },
    {
        id: "energy_labels",
        text: {
            en: "Do you check energy labels before buying electronics?",
            fr: "Vérifiez-vous les étiquettes énergétiques avant d'acheter de l'électronique ?",
            ar: "هل تتحقق من ملصقات الطاقة قبل شراء الأجهزة الإلكترونية؟"
        },
        type: "frequency",
        context: "None"
    },

    // Section 5: Waste & Recycling
    {
        id: "separation_willingness",
        text: {
            en: "Would you separate your waste if distinct bins were available in your neighborhood?",
            fr: "Trieriez-vous vos déchets si des bacs distincts étaient disponibles ?",
            ar: "هل ستقوم بفصل نفاياتك إذا توفرت حاويات منفصلة في حيك؟"
        },
        type: "yes_no",
        context: "None"
    },
    {
        id: "container_reuse",
        text: {
            en: "How often do you reuse jars, bottles, or containers?",
            fr: "À quelle fréquence réutilisez-vous les bocaux, bouteilles ou récipients ?",
            ar: "كم مرة تعيد استخدام الجرار، القارورات أو العلب؟"
        },
        type: "frequency",
        context: "None"
    },
    {
        id: "reusable_bags",
        text: {
            en: "Do you bring reusable bags when shopping?",
            fr: "Apportez-vous des sacs réutilisables pour faire vos courses ?",
            ar: "هل تحضر أكياس قابلة لإعادة الاستخدام عند التسوق؟"
        },
        type: "frequency",
        context: "None"
    },
    {
        id: "low_packaging",
        text: {
            en: "Do you buy products with less packaging?",
            fr: "Achetez-vous des produits avec moins d'emballage ?",
            ar: "هل تشتري منتجات ذات تغليف أقل؟"
        },
        type: "frequency",
        context: "None"
    },
    {
        id: "donations",
        text: {
            en: "Have you ever donated clothes or books instead of throwing them?",
            fr: "Avez-vous déjà donné des vêtements ou livres au lieu de les jeter ?",
            ar: "هل سبق لك التبرع بالملابس أو الكتب بدلاً من رميها؟"
        },
        type: "yes_no",
        context: "None"
    },
    {
        id: "plastic_bottle_count",
        text: {
            en: "How many plastic bottles do you throw away per week?",
            fr: "Combien de bouteilles en plastique jetez-vous par semaine ?",
            ar: "كم عدد القارورات البلاستيكية التي ترميها أسبوعياً؟"
        },
        type: "number",
        context: "None"
    },

    // Section 6: Awareness & Attitudes
    {
        id: "community_issue_belief",
        text: {
            en: "Do you believe waste is a serious issue in your community?",
            fr: "Pensez-vous que les déchets sont un problème grave dans votre communauté ?",
            ar: "هل تعتقد أن النفايات مشكلة خطيرة في مجتمعك؟"
        },
        type: "yes_no",
        context: "None"
    },
    {
        id: "household_comparison",
        text: {
            en: "Do you think your household wastes more, less, or the same as others?",
            fr: "Pensez-vous que votre foyer gaspille plus, moins ou autant que les autres ?",
            ar: "هل تعتقد أن منزلك يبذر أكثر، أقل، أو مثل الآخرين؟"
        },
        type: "multiple_choice",
        options: {
            en: ["More", "Less", "About the same"],
            fr: ["Plus", "Moins", "À peu près pareil"],
            ar: ["أكثر", "أقل", "نفس الشيء تقريباً"]
        },
        context: "None"
    },
    {
        id: "education_received",
        text: {
            en: "Have you received any education on waste reduction (school, social media, workshops)?",
            fr: "Avez-vous reçu une éducation sur la réduction des déchets ?",
            ar: "هل تلقيت أي تعليم حول الحد من النفايات (مدرسة، تواصل اجتماعي)؟"
        },
        type: "yes_no",
        context: "None"
    },
    {
        id: "cleanup_participation",
        text: {
            en: "Would you participate in community clean-up events?",
            fr: "Participeriez-vous à des événements de nettoyage communautaire ?",
            ar: "هل ستشارك في حملات التنظيف التطوعية؟"
        },
        type: "yes_no",
        context: "None"
    },
    {
        id: "government_satisfaction",
        text: {
            en: "Do you think the government provides enough solutions for waste management?",
            fr: "Pensez-vous que le gouvernement fournit assez de solutions ?",
            ar: "هل تعتقد أن الحكومة توفر حلولاً كافية لإدارة النفايات؟"
        },
        type: "yes_no",
        context: "None"
    },
    {
        id: "money_motivation",
        text: {
            en: "Are you willing to change habits if it saves money?",
            fr: "Êtes-vous prêt à changer vos habitudes si cela économise de l'argent ?",
            ar: "هل أنت مستعد لتغيير عاداتك إذا كان ذلك يوفر المال؟"
        },
        type: "yes_no",
        context: "None"
    },
    {
        id: "biggest_problem",
        text: {
            en: "Which type of waste do you believe is the biggest problem in Algeria?",
            fr: "Quel type de déchet est le plus gros problème en Algérie ?",
            ar: "أي نوع من النفايات تعتقد أنه المشكلة الأكبر في الجزائر؟"
        },
        type: "multiple_choice",
        options: {
            en: ["Plastic", "Food Waste", "Water Waste", "Industrial Waste", "Electronic Waste"],
            fr: ["Plastique", "Gaspillage Alimentaire", "Gaspillage d'Eau", "Déchets Industriels", "Déchets Électroniques"],
            ar: ["البلاستيك", "هدر الطعام", "هدر المياه", "النفايات الصناعية", "النفايات الإلكترونية"]
        },
        multiSelect: true,
        maxSelections: 2,
        context: {
            en: "Choose 2 from these options",
            fr: "Choisissez 2 options",
            ar: "اختر 2 من هذه الخيارات"
        }
    },

    // Section 7: Government & Community
    {
        id: "initiative_participation",
        text: {
            en: "If the government added new recycling points or initiatives, would you actively participate?",
            fr: "Si le gouvernement ajoutait des points de recyclage, participeriez-vous ?",
            ar: "إذا أضافت الحكومة نقاط إعادة تدوير جديدة، هل ستشارك؟"
        },
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
    
    // Set default language
    setLanguage('en');
}

// Global scope so HTML buttons can call it
window.setLanguage = function(lang) {
    state.language = lang;
    const ui = UI_TEXT[lang];

    // 1. Update Buttons immediately (Intro View)
    els.startBtn.innerText = ui.start;
    els.prevBtn.innerText = ui.back;

    // 2. Handle RTL for Arabic
    if (lang === 'ar') {
        document.body.classList.add('rtl-mode');
        document.body.dir = "rtl";
    } else {
        document.body.classList.remove('rtl-mode');
        document.body.dir = "ltr";
    }

    // 3. Re-render if survey is active
    if (!views.survey.classList.contains('hidden')) {
        renderQuestion();
    }
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
    const lang = state.language;
    const ui = UI_TEXT[lang];

    // Update Text
    els.questionText.innerText = q.text[lang];
    
    // Update Context (handle both string and object formats if inconsistent)
    if (q.context && q.context !== "None") {
        const ctxText = (typeof q.context === 'object') ? q.context[lang] : q.context;
        els.questionContext.innerText = ctxText;
    } else {
        els.questionContext.innerText = "";
    }

    // Update Progress
    const progress = ((state.currentQuestionIndex) / state.questions.length) * 100;
    els.progressBar.style.width = `${progress}%`;

    // Render Options
    els.optionsContainer.innerHTML = '';

    // Handle different types
    if (q.type === 'yes_no') {
        renderOption(ui.yes, 'radio', 'Yes'); // Display translated, Save English
        renderOption(ui.no, 'radio', 'No');
    } else if (q.type === 'multiple_choice' && q.options) {
        const inputType = q.multiSelect ? 'checkbox' : 'radio';
        // Logic: Display current lang option, Save English option
        const displayOpts = q.options[lang];
        const saveOpts = q.options['en']; 
        
        displayOpts.forEach((optLabel, index) => {
            renderOption(optLabel, inputType, saveOpts[index]);
        });

    } else if (q.type === 'frequency') {
        const saveValues = ["Always", "Often", "Sometimes", "Rarely", "Never"];
        ui.freq.forEach((label, index) => {
            renderOption(label, 'radio', saveValues[index]);
        });
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
    els.prevBtn.innerText = ui.back;
    
    const isLast = state.currentQuestionIndex === state.questions.length - 1;
    els.nextBtn.innerText = isLast ? ui.finish : ui.next;

    // Reset Next Button State
    if (!savedAnswer) {
        els.nextBtn.classList.add('disabled');
    } else {
        els.nextBtn.classList.remove('disabled');
    }
}

function renderOption(label, type, value) {
    const div = document.createElement('div');
    div.className = 'option-item';
    div.innerHTML = `
        <label class="option-label">
            <input type="${type}" name="answer" value="${value}" onchange="handleInput()">
            <span>${label}</span>
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
                input.value = num;
            }
            val = input.value;
        }
    } else if (q.multiSelect) {
        const checkedBoxes = Array.from(document.querySelectorAll('input[name="answer"]:checked'));
        if (q.maxSelections && checkedBoxes.length > q.maxSelections) {
            checkedBoxes.forEach((box, index) => {
                if (index >= q.maxSelections) box.checked = false;
            });
            val = Array.from(document.querySelectorAll('input[name="answer"]:checked')).map(cb => cb.value);
        } else {
            val = checkedBoxes.map(cb => cb.value);
        }
        if (val.length === 0) val = null;
    } else {
        const checked = document.querySelector('input[name="answer"]:checked');
        if (checked) val = checked.value;
    }

    if (val) {
        state.answers[q.id] = val;
        els.nextBtn.classList.remove('disabled');
    } else {
        els.nextBtn.classList.add('disabled');
    }
}

function nextQuestion() {
    const q = state.questions[state.currentQuestionIndex];
    const val = state.answers[q.id];
    if (!val) return;

    if (q.id === "water_tank_have") {
        if (val === "No") {
            const skipIndex = state.questions.findIndex(x => x.id === "water_tank_care");
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
    const lang = state.language;
    const ui = UI_TEXT[lang];

    els.nextBtn.innerText = ui.saving;
    els.nextBtn.classList.add('disabled');

    const SurveySubmission = Parse.Object.extend("SurveySubmission");
    const submission = new SurveySubmission();

    for (const [key, value] of Object.entries(state.answers)) {
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
        els.nextBtn.innerText = ui.finish;
        els.nextBtn.classList.remove('disabled');
    }
}

// Start
init();