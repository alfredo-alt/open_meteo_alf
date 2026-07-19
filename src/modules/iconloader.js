// iconLoader.js
// Single Responsibility: ONLY knows how to map a WMO weather code to the
// right icon category, and load that icon file using a dynamic import().
//
// Why dynamic import() instead of importing all 7 SVGs up front:
// as the assignment notes, an icon set can grow a lot. With a normal
// static `import clearIcon from '../assets/icons/clear.svg'` at the top
// of the file, Webpack bundles ALL of them into the initial bundle even
// if the user only ever sees one. A dynamic import() only fetches the
// specific icon file that's actually needed, right when it's needed —
// Webpack still detects it at build time and includes it in the final
// output (via a separate chunk), it just doesn't load it eagerly.

const ICON_CATEGORY_BY_CODE = {
  0: 'clear',
  1: 'clear',
  2: 'cloudy',
  3: 'overcast',
  45: 'fog',
  48: 'fog',
  51: 'rain',
  53: 'rain',
  55: 'rain',
  61: 'rain',
  63: 'rain',
  65: 'rain',
  71: 'snow',
  73: 'snow',
  75: 'snow',
  80: 'rain',
  81: 'rain',
  82: 'rain',
  95: 'thunderstorm',
  96: 'thunderstorm',
  99: 'thunderstorm',
};

function getIconCategory(weatherCode) {
  return ICON_CATEGORY_BY_CODE[weatherCode] || 'cloudy';
}

/**
 * Dynamically imports the right SVG for a given weather code and returns
 * its URL (Webpack turns the SVG file into a URL string at build time,
 * via the asset/resource module rule -- see webpack.config.js note).
 */
async function loadWeatherIcon(weatherCode) {
  const category = getIconCategory(weatherCode);

  // The path here MUST be understandable by Webpack at build time (it
  // can't be a fully dynamic runtime string built from unrelated data),
  // which is why we go through getIconCategory() first to land on one
  // of a known, fixed set of filenames.
  const module = await import(`../assets/icons/${category}.svg`);
  return module.default;
}

export { loadWeatherIcon };