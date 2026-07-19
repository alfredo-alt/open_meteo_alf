// domController.js
// Single Responsibility: ONLY knows how to build/update DOM elements.
// It never imports apiService — it receives a callback function from
// the orchestrator (index.js), same Dependency Inversion pattern used
// in the other projects.

import { loadWeatherIcon } from './iconLoader.js';

const appRoot = document.getElementById('app');

function render(callbacks) {
  appRoot.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'app-container';

  const heading = document.createElement('h1');
  heading.textContent = 'Weather Station';
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
  submitBtn.id = 'search-submit-btn';
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

async function showWeatherResult(weatherData, unit, callbacks) {
  const resultArea = document.getElementById('result-area');
  resultArea.innerHTML = '';

  const isCelsius = unit === 'C';
  const unitLabel = isCelsius ? '°C' : '°F';
  const temp = isCelsius ? weatherData.current.temperatureC : weatherData.current.temperatureF;
  const feelsLike = isCelsius ? weatherData.current.feelsLikeC : weatherData.current.feelsLikeF;
  const todayMin = isCelsius ? weatherData.today.minC : weatherData.today.minF;
  const todayMax = isCelsius ? weatherData.today.maxC : weatherData.today.maxF;

  const card = document.createElement('div');
  card.className = 'weather-card';

  const locationEl = document.createElement('h2');
  locationEl.textContent = `${weatherData.location.name}, ${weatherData.location.country}`;
  card.appendChild(locationEl);

  const head = document.createElement('div');
  head.className = 'weather-card__head';

  const iconUrl = await loadWeatherIcon(weatherData.current.weatherCode);
  const iconEl = document.createElement('img');
  iconEl.src = iconUrl;
  iconEl.alt = weatherData.current.description;
  iconEl.className = 'weather-card__icon';
  head.appendChild(iconEl);

  const headText = document.createElement('div');

  const tempEl = document.createElement('p');
  tempEl.className = 'weather-card__temp';
  tempEl.textContent = `${temp}${unitLabel}`;
  headText.appendChild(tempEl);

  const descriptionEl = document.createElement('p');
  descriptionEl.className = 'weather-card__description';
  descriptionEl.textContent = weatherData.current.description;
  headText.appendChild(descriptionEl);

  head.appendChild(headText);
  card.appendChild(head);

  const rows = document.createElement('div');
  rows.className = 'weather-card__rows';
  rows.appendChild(buildRow('Feels like', `${feelsLike}${unitLabel}`));
  rows.appendChild(buildRow('Wind', `${weatherData.current.windSpeedKmh} km/h`));
  card.appendChild(rows);

  card.appendChild(buildRangeGauge(todayMin, todayMax, temp, unitLabel));

  const toggleBtn = document.createElement('button');
  toggleBtn.type = 'button';
  toggleBtn.className = 'btn btn--secondary';
  toggleBtn.textContent = isCelsius ? 'Switch to °F' : 'Switch to °C';
  toggleBtn.addEventListener('click', () => callbacks.onToggleUnit());
  card.appendChild(toggleBtn);

  resultArea.appendChild(card);
  reenableSubmitButton();
}

function buildRow(label, value) {
  const row = document.createElement('div');
  row.className = 'weather-card__row';

  const labelEl = document.createElement('span');
  labelEl.className = 'weather-card__row-label';
  labelEl.textContent = label;
  row.appendChild(labelEl);

  const valueEl = document.createElement('span');
  valueEl.className = 'weather-card__row-value';
  valueEl.textContent = value;
  row.appendChild(valueEl);

  return row;
}

// Signature element: a horizontal instrument-style scale showing where
// the CURRENT temperature sits between today's low and high. This is
// real information (relative position within today's range), not just
// a decorative bar.
function buildRangeGauge(min, max, current, unitLabel) {
  const wrapper = document.createElement('div');
  wrapper.className = 'range-gauge';

  const labels = document.createElement('div');
  labels.className = 'range-gauge__labels';
  labels.innerHTML = `<span>TODAY ${min}${unitLabel}</span><span>${max}${unitLabel}</span>`;
  wrapper.appendChild(labels);

  const track = document.createElement('div');
  track.className = 'range-gauge__track';

  // Guard against min === max (rare, but avoids a divide-by-zero).
  const range = max - min || 1;
  const percent = Math.min(100, Math.max(0, ((current - min) / range) * 100));

  const marker = document.createElement('div');
  marker.className = 'range-gauge__marker';
  marker.style.left = `${percent}%`;
  track.appendChild(marker);

  wrapper.appendChild(track);
  return wrapper;
}

function showLoading() {
  const resultArea = document.getElementById('result-area');
  resultArea.innerHTML = `
    <div class="loading">
      <div class="loading__spinner"></div>
      <p class="loading__text">Fetching weather...</p>
    </div>
  `;

  const submitBtn = document.getElementById('search-submit-btn');
  if (submitBtn) submitBtn.disabled = true;
}

function reenableSubmitButton() {
  const submitBtn = document.getElementById('search-submit-btn');
  if (submitBtn) submitBtn.disabled = false;
}

function showError(message) {
  const resultArea = document.getElementById('result-area');
  resultArea.innerHTML = `<p class="status-text status-text--error">${message}</p>`;
  reenableSubmitButton();
}

export { render, showWeatherResult, showLoading, showError };