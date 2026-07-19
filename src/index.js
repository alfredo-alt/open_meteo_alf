// index.js
// This import is the Webpack equivalent of a <link rel="stylesheet"> tag —
// style-loader/css-loader inject it into the page automatically.
import './styles/style.css';
import { fetchWeatherByLocation } from './modules/apiService.js';

console.log('Weather app starting...');
// Temporary manual test call for this step — task 4 will replace this
// with a real form submission.
fetchWeatherByLocation('Lima');