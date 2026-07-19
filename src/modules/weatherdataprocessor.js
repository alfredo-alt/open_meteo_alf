// weatherDataProcessor.js
// Single Responsibility: ONLY knows how to take Open-Meteo's raw JSON
// (which has a lot of fields we don't care about) and shape it into a
// small, predictable object with just what the app displays.
// This module never calls fetch() and never touches the DOM.

// WMO weather codes -> human-readable description.
// Open-Meteo uses the WMO code standard; this covers the common groups.
const WEATHER_CODE_DESCRIPTIONS = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

function describeWeatherCode(code) {
  return WEATHER_CODE_DESCRIPTIONS[code] || 'Unknown conditions';
}

function celsiusToFahrenheit(celsius) {
  return celsius * (9 / 5) + 32;
}

// Rounds to whole degrees -- weather apps don't usually show decimals.
function roundTemp(value) {
  return Math.round(value);
}

/**
 * Takes the raw Open-Meteo forecast response + the place info (from
 * fetchCoordinates) and returns a small, flat object with only what the
 * app needs to display. Both Celsius and Fahrenheit are precomputed here
 * so the unit toggle (task 5) never needs to touch the API or redo math.
 */
function processWeatherData(rawData, place) {
  const currentTempC = rawData.current.temperature_2m;
  const feelsLikeC = rawData.current.apparent_temperature;

  const todayMaxC = rawData.daily.temperature_2m_max[0];
  const todayMinC = rawData.daily.temperature_2m_min[0];

  return {
    location: {
      name: place.name,
      country: place.country,
    },
    current: {
      temperatureC: roundTemp(currentTempC),
      temperatureF: roundTemp(celsiusToFahrenheit(currentTempC)),
      feelsLikeC: roundTemp(feelsLikeC),
      feelsLikeF: roundTemp(celsiusToFahrenheit(feelsLikeC)),
      windSpeedKmh: roundTemp(rawData.current.wind_speed_10m),
      weatherCode: rawData.current.weather_code,
      description: describeWeatherCode(rawData.current.weather_code),
    },
    today: {
      maxC: roundTemp(todayMaxC),
      maxF: roundTemp(celsiusToFahrenheit(todayMaxC)),
      minC: roundTemp(todayMinC),
      minF: roundTemp(celsiusToFahrenheit(todayMinC)),
      weatherCode: rawData.daily.weather_code[0],
      description: describeWeatherCode(rawData.daily.weather_code[0]),
    },
  };
}

export { processWeatherData };