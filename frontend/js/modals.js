/**
 * AquaTrace — Modal Manager
 * Controls all modal dialogs: incident dossier and any future modals.
 * Replaces scattered inline onclick="openModal()" / onclick="closeModal()" attributes.
 */

const _modalEl = () => document.getElementById('modal');

/**
 * Open the incident dossier modal.
 * Uses style.display instead of class toggling — Tailwind `hidden` sets
 * display:none which would override the required flex layout (known bug fix).
 */
function openModal() {
  const el = _modalEl();
  if (el) el.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

/**
 * Close the active modal.
 */
function closeModal() {
  const el = _modalEl();
  if (el) el.style.display = 'none';
  document.body.style.overflow = '';
}

/**
 * Initialize global modal event listeners:
 * - Escape key closes the active modal
 * - Click on overlay backdrop closes modal
 */
function initModals() {
  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Click on overlay background (not the inner content box)
  const overlay = _modalEl();
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }
}

/**
 * Dynamically updates the modal dossier with currentActiveData
 */
window.updateModalDossier = function() {
  const active = window.currentActiveData || window.REAL_DATA.data1;
  if (!active || !active.incident) return;

  const inc = active.incident;
  const tc = active.topCandidate;

  const titleEl = document.getElementById('modal-incident-title');
  if (titleEl) titleEl.innerText = `Incident Analysis Report ${inc.id}`;

  const metaEl = document.getElementById('modal-incident-meta');
  if (metaEl) metaEl.innerText = `Location: ${inc.region} | Date: ${inc.date}`;

  const areaEl = document.getElementById('modal-sar-area');
  if (areaEl) areaEl.innerText = tc.estimatedSpillExtentKm2 ? `${tc.estimatedSpillExtentKm2} sq. km Slick Plume` : 'Slick Plume Extent Unknown';

  const timeEl = document.getElementById('modal-sar-time');
  if (timeEl) timeEl.innerText = `Pass Acquisition Time: ${tc.slickOriginTimeUTC} UTC`;

  const vNameEl = document.getElementById('modal-vessel-name');
  if (vNameEl) vNameEl.innerText = `${tc.vesselName} (${tc.attributionConfidence}% Confidence)`;

  const vMetaEl = document.getElementById('modal-vessel-meta');
  if (vMetaEl) vMetaEl.innerText = `IMO: ${tc.imo || 'N/A'} | Flag: ${tc.flag || 'N/A'}`;

  const logEl = document.getElementById('modal-ais-log');
  if (logEl) {
    logEl.innerText = `Spatio-temporal back-projection places ${tc.vesselName} near the apex origin of the radar slick outline at ${tc.slickOriginTimeUTC} UTC. ${tc.extentNote || ''}`;
  }
};
