const PARSE_APP_ID = 'Iiuq4iKqkxslYLXRMYGDsFkeUkzq2vf0j8UmmF9t';
const PARSE_JS_KEY = 'uJTJZ1prO0Do2CHXmHLis9Z0nJxpZi97eHcEWSUg';
const PARSE_SERVER_URL = 'https://parseapi.back4app.com';
const ADMIN_ROLE_NAME = 'Admin';

const locationHierarchy = {
  Africa: {
    Algeria: {
      'Algiers Province': [
        'Bab El Oued',
        'Casbah',
        'Belouizdad',
        'El Madania',
        'Hydra',
        'Ben Aknoun',
        'Birkhadem',
        'Cheraga',
        'Draria',
        'El Harrach',
        'El Magharia',
        'Hussein Dey',
        'Kouba',
        'Oued Koriche',
        'Rouiba',
        'Reghaia',
        'Zeralda'
      ],
      'Blida Province': ['Blida', 'Boufarik', 'Meftah', 'Ouled Yaich', 'Larbaa', 'Soumaa'],
      'Tipaza Province': ['Bou Ismail', 'Cherchell', 'Hadjout', 'Kolea', 'Sidi Amar'],
      'Boumerdes Province': ['Boumerdes', 'Boudouaou', 'Bordj Menaiel', 'Si Mustapha'],
      'Tizi Ouzou Province': ['Tizi Ouzou', 'Azazga', 'Draa Ben Khedda', 'Larbaa Nath Irathen'],
      'Setif Province': ['Setif', 'El Eulma', 'Ain Oulmene', 'Bir El Arch']
    },
    Morocco: {
      'Rabat-Salé-Kénitra': ['Rabat', 'Salé', 'Kenitra', 'Temara'],
      'Casablanca-Settat': ['Casablanca', 'Settat', 'Mohammedia', 'El Jadida'],
      'Marrakesh-Safi': ['Marrakesh', 'Safi', 'Essaouira']
    },
    Tunisia: {
      'Tunis Governorate': ['Tunis', 'La Marsa', 'Carthage', 'Sidi Bou Said'],
      'Sfax Governorate': ['Sfax', 'Mahres', 'Sakiet Ezzit'],
      'Annaba Governorate': ['Annaba', 'El Bouni', 'Seraidi']
    },
    Nigeria: {
      'Lagos State': ['Lagos Mainland', 'Ikeja', 'Lekki', 'Epe'],
      'Abuja FCT': ['Abuja Municipal', 'Gwagwalada', 'Karu'],
      'Kano State': ['Kano Municipal', 'Bichi', 'Wudil']
    },
    'South Africa': {
      'Gauteng Province': ['Johannesburg', 'Pretoria', 'Soweto'],
      'Western Cape': ['Cape Town', 'Stellenbosch', 'Paarl'],
      'KwaZulu-Natal': ['Durban', 'Pietermaritzburg', 'Empangeni']
    }
  },
  Europe: {
    France: {
      'Île-de-France': ['Paris', 'Boulogne-Billancourt', 'Saint-Denis'],
      'Provence-Alpes-Côte d’Azur': ['Marseille', 'Nice', 'Toulon']
    },
    Spain: {
      'Community of Madrid': ['Madrid', 'Alcala de Henares', 'Getafe'],
      'Catalonia': ['Barcelona', 'Girona', 'Tarragona']
    },
    'United Kingdom': {
      England: ['London', 'Manchester', 'Birmingham', 'Leeds'],
      Scotland: ['Edinburgh', 'Glasgow', 'Aberdeen']
    }
  },
  Asia: {
    'United Arab Emirates': {
      'Abu Dhabi Emirate': ['Abu Dhabi City', 'Al Ain', 'Madinat Zayed'],
      'Dubai Emirate': ['Dubai', 'Hatta'],
      'Sharjah Emirate': ['Sharjah', 'Khor Fakkan']
    },
    'Saudi Arabia': {
      'Riyadh Province': ['Riyadh', 'Al Kharj', 'Al Majmaah'],
      'Makkah Province': ['Jeddah', 'Mecca', 'Taif'],
      'Eastern Province': ['Dammam', 'Al Khobar', 'Qatif']
    },
    Turkey: {
      Marmara: ['Istanbul', 'Bursa', 'Edirne'],
      Anatolia: ['Ankara', 'Konya', 'Kayseri'],
      Aegean: ['Izmir', 'Eskisehir', 'Manisa']
    }
  },
  'North America': {
    Canada: {
      Ontario: ['Toronto', 'Ottawa', 'Mississauga'],
      Quebec: ['Montreal', 'Quebec City', 'Laval']
    },
    'United States': {
      California: ['Los Angeles', 'San Francisco', 'San Diego'],
      'New York': ['New York City', 'Buffalo', 'Rochester'],
      Texas: ['Houston', 'Austin', 'Dallas']
    }
  }
};

if (!window.Parse) {
  console.warn('Parse SDK failed to load. Form submissions will not work until the SDK is available.');
} else {
  Parse.initialize(PARSE_APP_ID, PARSE_JS_KEY);
  Parse.serverURL = PARSE_SERVER_URL;
}

document.addEventListener('DOMContentLoaded', () => {
  const consentCheckbox = document.getElementById('consent');
  const fieldset = document.getElementById('survey-fieldset');
  const form = document.getElementById('survey-form');
  const messageEl = document.getElementById('form-message');
  const modal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const steps = Array.from(document.querySelectorAll('.step'));
  let currentStepIndex = 0;
  const continentSelect = document.getElementById('continent-select');
  const countrySelect = document.getElementById('country-select');
  const regionSelect = document.getElementById('region-select');
  const locationSummaryInput = document.getElementById('location-summary');

  const resetSelect = (select, placeholder) => {
    select.innerHTML = `<option value="">${placeholder}</option>`;
    select.disabled = true;
  };

  const populateContinents = () => {
    Object.keys(locationHierarchy).forEach((continent) => {
      const option = document.createElement('option');
      option.value = continent;
      option.textContent = continent;
      continentSelect.appendChild(option);
    });
  };

  const populateCountries = (continent) => {
    resetSelect(countrySelect, 'Select country');
    resetSelect(regionSelect, 'Select province or commune');
    locationSummaryInput.value = '';
    if (!continent || !locationHierarchy[continent]) {
      return;
    }
    countrySelect.disabled = false;
    Object.keys(locationHierarchy[continent]).forEach((country) => {
      const option = document.createElement('option');
      option.value = country;
      option.textContent = country;
      countrySelect.appendChild(option);
    });
  };

  const populateRegions = (continent, country) => {
    resetSelect(regionSelect, 'Select province or commune');
    if (!continent || !country) {
      return;
    }
    const provinceMap = locationHierarchy[continent]?.[country];
    if (!provinceMap) {
      return;
    }
    regionSelect.disabled = false;

    Object.entries(provinceMap).forEach(([province, communes]) => {
      const group = document.createElement('optgroup');
      group.label = province;
      communes.forEach((commune) => {
        const option = document.createElement('option');
        option.value = commune;
        option.textContent = commune;
        option.dataset.province = province;
        group.appendChild(option);
      });
      regionSelect.appendChild(group);
    });
  };

  const updateLocationSummary = () => {
    const continent = continentSelect.value;
    const country = countrySelect.value;
    const selectedOption = regionSelect.selectedOptions[0];
    if (continent && country && selectedOption?.value) {
      const province = selectedOption.dataset.province || 'Region';
      const commune = selectedOption.value;
      locationSummaryInput.value = `${continent} > ${country} > ${province} > ${commune}`;
      return;
    }
    if (continent && country) {
      locationSummaryInput.value = `${continent} > ${country}`;
      return;
    }
    locationSummaryInput.value = '';
  };

  const updateStepVisibility = () => {
    steps.forEach((step, idx) => {
      step.classList.toggle('active', idx === currentStepIndex);
    });
  };

  const resetSteps = () => {
    currentStepIndex = 0;
    updateStepVisibility();
  };

  const validateCurrentStep = () => {
    const currentStep = steps[currentStepIndex];
    if (!currentStep) return true;
    const inputs = Array.from(currentStep.querySelectorAll('input, select, textarea'));
    for (const input of inputs) {
      if (!input.checkValidity()) {
        input.reportValidity();
        return false;
      }
    }
    return true;
  };

  const goToStep = (index) => {
    if (index < 0 || index >= steps.length) return;
    currentStepIndex = index;
    updateStepVisibility();
  };

  const toggleFieldset = () => {
    fieldset.disabled = !consentCheckbox.checked;
    if (!consentCheckbox.checked) {
      form.reset();
      messageEl.textContent = '';
      messageEl.className = '';
      resetSteps();
    }
  };

  consentCheckbox.addEventListener('change', toggleFieldset);
  updateStepVisibility();
  populateContinents();
  continentSelect.addEventListener('change', () => {
    populateCountries(continentSelect.value);
    updateLocationSummary();
  });
  countrySelect.addEventListener('change', () => {
    populateRegions(continentSelect.value, countrySelect.value);
    updateLocationSummary();
  });
  regionSelect.addEventListener('change', updateLocationSummary);

  const openModal = () => {
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    modal.setAttribute('aria-hidden', 'true');
  };

  closeModalBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  form.addEventListener('click', (event) => {
    const nextTrigger = event.target.closest('.next-step');
    const prevTrigger = event.target.closest('.prev-step');

    if (nextTrigger) {
      if (!validateCurrentStep()) {
        return;
      }
      goToStep(currentStepIndex + 1);
    }

    if (prevTrigger) {
      goToStep(currentStepIndex - 1);
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    messageEl.textContent = '';
    messageEl.className = '';

    if (!consentCheckbox.checked) {
      messageEl.textContent = 'Please agree to participate before starting the survey.';
      messageEl.classList.add('error');
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);

    const getNumber = (name) => {
      const value = formData.get(name);
      return value ? Number(value) : null;
    };

    const getArray = (name) => formData.getAll(name);

    const payload = {
      consentGiven: true,
      A1: formData.get('A1')?.trim(),
      A2: formData.get('A2') || null,
      A3: getNumber('A3'),
      A4: formData.get('A4') === 'true',
      B1: formData.get('B1') || null,
      B2: getArray('B2'),
      B3: formData.get('B3') || null,
      B4: formData.get('B4') || null,
      C1: getNumber('C1'),
      C2: getNumber('C2'),
      C3: getNumber('C3'),
      C4: getNumber('C4'),
      C5: getNumber('C5'),
      C6: getNumber('C6'),
      D1A: getNumber('D1A'),
      D1B: getNumber('D1B'),
      D2A: getNumber('D2A'),
      D2B: getNumber('D2B'),
      D3A: getNumber('D3A'),
      D3B: getNumber('D3B'),
      D4A: getNumber('D4A'),
      D4B: getNumber('D4B'),
      D5A: getNumber('D5A'),
      D5B: getNumber('D5B'),
      D6A: getNumber('D6A'),
      D6B: getNumber('D6B'),
      E1: formData.get('E1') || null,
      E2: getArray('E2'),
      E3: formData.get('E3')?.trim() || '',
    };

    const requiredKeys = [
      'A1',
      'A2',
      'A3',
      'B1',
      'B3',
      'B4',
      'C1',
      'C2',
      'C3',
      'C4',
      'C5',
      'C6',
      'D1A',
      'D1B',
      'D2A',
      'D2B',
      'D3A',
      'D3B',
      'D4A',
      'D4B',
      'D5A',
      'D5B',
      'D6A',
      'D6B',
      'E1',
    ];

    const missing = requiredKeys.filter((key) => payload[key] === null || payload[key] === undefined || payload[key] === '');

    if (missing.length) {
      messageEl.textContent = 'Please complete all required questions before submitting.';
      messageEl.classList.add('error');
      return;
    }

    if (!window.Parse) {
      messageEl.textContent = 'Unable to submit right now. Please try again later.';
      messageEl.classList.add('error');
      return;
    }

    messageEl.textContent = 'Submitting...';
    messageEl.classList.remove('error');

    try {
      await saveSurveyResponse(payload);
      form.reset();
      consentCheckbox.checked = false;
      toggleFieldset();
      messageEl.textContent = '';
      resetSteps();
      openModal();
    } catch (error) {
      console.error(error);
      messageEl.textContent = 'Submission failed. Please check your internet connection and try again.';
      messageEl.classList.add('error');
    }
  });
});

async function saveSurveyResponse(payload) {
  const SurveyResponse = Parse.Object.extend('SurveyResponses');
  const response = new SurveyResponse();

  Object.entries(payload).forEach(([key, value]) => {
    response.set(key, value);
  });

  const acl = new Parse.ACL();
  acl.setPublicReadAccess(false);
  acl.setPublicWriteAccess(true);
  if (ADMIN_ROLE_NAME) {
    acl.setRoleReadAccess(ADMIN_ROLE_NAME, true);
  }
  response.setACL(acl);

  return response.save();
}

