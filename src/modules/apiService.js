// apiService.js
// Single Responsibility: ONLY knows how to talk to the Open-Meteo APIs.
// Never touches the DOM. Raw API responses are handed off to
// weatherDataProcessor.js, which is a separate module responsible for
// shaping that data into what the app actually needs.

import { processWeatherData } from './weatherDataProcessor.js';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Turns a place name (e.g. "Lima") into coordinates.
 * Open-Meteo's geocoding endpoint returns a `results` array; we take the
 * first match, since that's normally the most relevant one.
 * Returns null if no place was found (caller decides how to handle that).
 */
async function fetchCoordinates(locationName) {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(locationName)}&count=1&language=en&format=json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Geocoding API responded with status ${response.status}`);
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    return null;
  }

  const place = data.results[0];
  return {
    latitude: place.latitude,
    longitude: place.longitude,
    name: place.name,
    country: place.country,
  };
}

/**
 * Fetches raw current + daily forecast data for a given pair of coordinates.
 * Both Celsius and Fahrenheit values are requested up front (rather than
 * converting manually), since Open-Meteo can return both directly —
 * this will make the Celsius/Fahrenheit toggle in task 5 trivial.
 */
async function fetchWeatherData(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: 'temperature_2m,apparent_temperature,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    temperature_unit: 'celsius',
    timezone: 'auto',
  });

  const response = await fetch(`${FORECAST_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Forecast API responded with status ${response.status}`);
  }

  return response.json();
}

/**
 * Convenience function that chains everything: name -> coordinates ->
 * raw weather -> processed weather. Returns the small, clean object from
 * weatherDataProcessor.js, ready for the UI (task 4/5) to use directly.
 */
async function fetchWeatherByLocation(locationName) {
  const place = await fetchCoordinates(locationName);

  if (!place) {
    return null;
  }

  const rawWeatherData = await fetchWeatherData(place.latitude, place.longitude);
  const weatherData = processWeatherData(rawWeatherData, place);

  return weatherData;
}

export { fetchCoordinates, fetchWeatherData, fetchWeatherByLocation };