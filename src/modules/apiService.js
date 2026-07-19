// apiService.js
// Single Responsibility: ONLY knows how to talk to the Open-Meteo APIs.
// Never touches the DOM. For now these functions just return raw data —
// task 3 will add a separate module to process/shape that data for the app.

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
 * Convenience function that chains both calls: name -> coordinates -> weather.
 * For now, just console.log()s the result, as required by this step.
 * Task 4 will hook this up to the actual search form instead of calling
 * it manually.
 */
async function fetchWeatherByLocation(locationName) {
  const place = await fetchCoordinates(locationName);

  if (!place) {
    console.log(`No location found for "${locationName}"`);
    return;
  }

  const weatherData = await fetchWeatherData(place.latitude, place.longitude);

  console.log('Place:', place);
  console.log('Raw weather data:', weatherData);
}

export { fetchCoordinates, fetchWeatherData, fetchWeatherByLocation };