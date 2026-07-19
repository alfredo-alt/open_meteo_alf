// index.js
// Orchestrator: the only file that knows about BOTH apiService and
// domController. Neither of those two knows about the other.
//
// UI-only state lives here (last fetched weather data + current unit).
// This is NOT business/API data, so it doesn't belong inside apiService.

import './styles/style.css';
import { fetchWeatherByLocation } from './modules/apiService.js';
import { render, showWeatherResult, showLoading, showError } from './modules/domController.js';

let lastWeatherData = null;
let currentUnit = 'C'; // 'C' or 'F'

const callbacks = {
  onSearch(location) {
    showLoading();
    fetchWeatherByLocation(location)
      .then((weatherData) => {
        if (!weatherData) {
          showError(`No results found for "${location}".`);
          return;
        }
        lastWeatherData = weatherData;
        showWeatherResult(lastWeatherData, currentUnit, callbacks);
      })
      .catch((error) => {
        console.error(error);
        showError('Could not load weather data. Please try again.');
      });
  },

  onToggleUnit() {
    currentUnit = currentUnit === 'C' ? 'F' : 'C';
    // No need to call the API again -- we already have both C and F
    // values precomputed in lastWeatherData from weatherDataProcessor.js.
    showWeatherResult(lastWeatherData, currentUnit, callbacks);
  },
};

function init() {
  render(callbacks);
}

init();