// index.js
// Orchestrator: the only file that knows about BOTH apiService and
// domController. Neither of those two knows about the other.

import './styles/style.css';
import { fetchWeatherByLocation } from './modules/apiService.js';
import { render } from './modules/domController.js';

const callbacks = {
  onSearch(location) {
    // Still just console.log() for this step — task 5 will display it
    // on the page instead.
    fetchWeatherByLocation(location);
  },
};

function init() {
  render(callbacks);
}

init();