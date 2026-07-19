// domController.js
// Single Responsibility: ONLY knows how to build/update DOM elements.
// It never imports apiService — it receives a callback function from
// the orchestrator (index.js), same Dependency Inversion pattern used
// in the other projects.

const appRoot = document.getElementById('app');

function render(callbacks) {
  appRoot.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'app-container';

  const heading = document.createElement('h1');
  heading.textContent = 'Weather App';
  container.appendChild(heading);

  container.appendChild(renderSearchForm(callbacks));

  // Empty for now — task 5 will add the actual weather display here.
  const resultArea = document.createElement('div');
  resultArea.id = 'result-area';
  container.appendChild(resultArea);

  appRoot.appendChild(container);
}

function renderSearchForm(callbacks) {
  const form = document.createElement('form');
  form.className = 'search-form';

  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'location';
  input.placeholder = 'Enter a city (e.g. Lima)';
  input.className = 'search-form__input';
  input.required = true;

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Get Weather';
  submitBtn.className = 'btn btn--primary';

  form.appendChild(input);
  form.appendChild(submitBtn);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const location = input.value.trim();
    if (!location) return;
    callbacks.onSearch(location);
  });

  return form;
}

function showWeatherResult(weatherData, unit, callbacks) {
  const resultArea = document.getElementById('result-area');
  resultArea.innerHTML = '';

  const isCelsius = unit === 'C';

  const card = document.createElement('div');
  card.className = 'weather-card';

  const locationEl = document.createElement('h2');
  locationEl.textContent = `${weatherData.location.name}, ${weatherData.location.country}`;
  card.appendChild(locationEl);

  const tempEl = document.createElement('p');
  tempEl.className = 'weather-card__temp';
  tempEl.textContent = isCelsius
    ? `${weatherData.current.temperatureC}°C`
    : `${weatherData.current.temperatureF}°F`;
  card.appendChild(tempEl);

  const descriptionEl = document.createElement('p');
  descriptionEl.textContent = weatherData.current.description;
  card.appendChild(descriptionEl);

  const feelsLikeEl = document.createElement('p');
  feelsLikeEl.className = 'weather-card__detail';
  feelsLikeEl.textContent = isCelsius
    ? `Feels like ${weatherData.current.feelsLikeC}°C`
    : `Feels like ${weatherData.current.feelsLikeF}°F`;
  card.appendChild(feelsLikeEl);

  const windEl = document.createElement('p');
  windEl.className = 'weather-card__detail';
  windEl.textContent = `Wind: ${weatherData.current.windSpeedKmh} km/h`;
  card.appendChild(windEl);

  const todayEl = document.createElement('p');
  todayEl.className = 'weather-card__detail';
  todayEl.textContent = isCelsius
    ? `Today: ${weatherData.today.minC}°C — ${weatherData.today.maxC}°C`
    : `Today: ${weatherData.today.minF}°F — ${weatherData.today.maxF}°F`;
  card.appendChild(todayEl);

  const toggleBtn = document.createElement('button');
  toggleBtn.type = 'button';
  toggleBtn.className = 'btn btn--secondary';
  toggleBtn.textContent = isCelsius ? 'Switch to °F' : 'Switch to °C';
  toggleBtn.addEventListener('click', () => callbacks.onToggleUnit());
  card.appendChild(toggleBtn);

  resultArea.appendChild(card);
}

function showLoading() {
  const resultArea = document.getElementById('result-area');
  resultArea.innerHTML = '<p class="status-text">Loading...</p>';
}

function showError(message) {
  const resultArea = document.getElementById('result-area');
  resultArea.innerHTML = `<p class="status-text status-text--error">${message}</p>`;
}

export { render, showWeatherResult, showLoading, showError };