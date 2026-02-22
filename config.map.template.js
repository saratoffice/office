// config.map.template.js
// Template file - actual values injected during build
// DO NOT EDIT - this is a template, actual values come from GitHub Secrets

window.MAP_CONFIG = {
  // {{GOOGLE_MAPS_API_KEY}} will be replaced during build
  GOOGLE_MAPS_API_KEY: '{{GOOGLE_MAPS_API_KEY}}',
  
  // Map coordinates
  OFFICE_MAIN: {
    lat: 20.691424,
    lng: 83.474194,
    title: "Sarat Office (Main)"
  },
  OFFICE_ANNEX: {
    lat: 21.235850,
    lng: 86.632800,
    title: "Sarat Office (Annex)"
  },
  
  // Map settings
  MAP_OPTIONS: {
    zoom: 8,
    mapTypeId: 'roadmap',
    gestureHandling: 'greedy'
  }
};
