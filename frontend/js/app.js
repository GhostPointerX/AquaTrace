/**
 * AquaTrace — Application Entry Point
 * Initializes all modules in order.
 * This is the only script that orchestrates the application startup.
 *
 * Load order in index.html must be:
 *   config.js → utils.js → api.js → map.js → modals.js →
 *   dashboard.js → news.js → attribution.js → app.js
 */

async function initApp() {
  try {
    initModals();
    initMap();
    initDashboard();
    initAttribution();
    initNews();
    if (typeof window.updateModalDossier === 'function') {
      window.updateModalDossier();
    }
  } catch (err) {
    console.error('[AquaTrace] App initialization error:', err);
  }

  // Setup dropdown listener to switch data internally
  const dataSelector = document.getElementById('data-selector');
  if (dataSelector) {
    dataSelector.addEventListener('change', (e) => {
      const selected = e.target.value;
      if (window.REAL_DATA[selected]) {
        window.currentActiveData = window.REAL_DATA[selected];
        console.log(`[AquaTrace] Switched internally to ${selected}`, window.currentActiveData);
        // Re-render UI components
        if (typeof renderMapLayer === 'function' && typeof _map !== 'undefined') {
          renderMapLayer(_map);
        }
        if (typeof window.reRenderAttributionTable === 'function') {
          window.reRenderAttributionTable();
        }
        if (typeof window.updateModalDossier === 'function') {
          window.updateModalDossier();
        }
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', initApp);
