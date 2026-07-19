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

export { render };