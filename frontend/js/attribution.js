/**
 * AquaTrace — Attribution Module
 * Handles AIS upload, Python backend attribution requests,
 * vessel ranking display, and candidate visualization.
 *
 * [INTEGRATION POINT]: When the Python AIS attribution backend is exposed
 * via a REST API, replace the stub functions below with real fetch() calls
 * to that service.
 */

/**
 * (Future) Submit an AIS CSV file for attribution processing.
 * @param {File}   file         AIS CSV file
 * @param {object} spillParams  { lat, lon, radiusKm, dischargeTime }
 * @returns {Promise<object[]>} Ranked candidate list
 */
async function submitAttributionJob(file, spillParams) {
  // TODO: implement when Python backend exposes a REST endpoint
  throw new Error('[Attribution] Backend API not yet connected.');
}

/**
 * Render the attribution result table with ranked candidates.
 * Currently the table is static HTML in index.html.
 * Call this function with live data to dynamically populate it.
 *
 * @param {object[]} candidates  Ranked candidate objects from Python backend
 */
function renderAttributionTable(candidates) {
  const tbody = document.querySelector('.aq-vessel-table tbody');
  if (!tbody) return;

  tbody.innerHTML = candidates.map((c, i) => {
    const rankNum    = c.rank || i + 1;
    const rank       = `#${String(rankNum).padStart(2, '0')}`;
    const score      = c.score ?? c.confidence ?? 0;
    const confLabel  = c.level || (score >= 70 ? 'HIGH' : score >= 45 ? 'MED' : 'LOW');
    const confBg     = score >= 70 ? '#ef4444' : score >= 45 ? '#fbbf24' : '#e5e7eb';
    const confText   = score >= 70 ? '#ffffff'  : '#111111';
    
    let lastPos = 'N/A';
    if (c.lastAisPos) {
      lastPos = c.lastAisPos;
    } else if (c.ais_track?.length) {
      lastPos = `${c.ais_track[c.ais_track.length - 1].lat.toFixed(1)}° N, ${c.ais_track[c.ais_track.length - 1].lon.toFixed(1)}° E`;
    }

    const vesselName = c.vessel_name || c.vesselName || '';
    const imoMmsi = c.mmsi || c.imoMmsi || '';
    const flag = c.flag || '—';
    const speed = c.speedKts !== null && c.speedKts !== undefined ? c.speedKts : '—';

    return `
      <tr class="hover:bg-cream transition-colors">
        <td class="p-3 font-bold" data-label="Rank">${escapeHTML(rank)}</td>
        <td class="p-3 font-bold text-darknavy" data-label="Vessel">${escapeHTML(vesselName)}</td>
        <td class="p-3" data-label="IMO/MMSI">${escapeHTML(imoMmsi)}</td>
        <td class="p-3" data-label="Flag">${escapeHTML(flag)}</td>
        <td class="p-3" data-label="Last AIS Pos">${escapeHTML(lastPos)}</td>
        <td class="p-3" data-label="Speed (kts)">${escapeHTML(speed)}</td>
        <td class="p-3" data-label="Confidence">
          <span style="background:${confBg};color:${confText};" class="font-bold px-2 py-0.5 border border-stark font-mono text-xs">
            ${score}% ${confLabel}
          </span>
        </td>
        <td class="p-3" data-label="Action">
          <button onclick="openModal()" class="bg-skyblue text-stark px-2.5 py-1 border border-stark font-bold hover:bg-sky-300 font-mono text-xs">DETAILS</button>
        </td>
      </tr>
    `;
  }).join('');
}

/**
 * Initialize the attribution section.
 * Automatically fetches candidates from backend API if available,
 * falling back gracefully to static demo markup.
 */
window.reRenderAttributionTable = function() {
  const active = window.currentActiveData || window.REAL_DATA.data1;
  if (active && active.vessels) {
    renderAttributionTable(active.vessels);
  }
};

async function initAttribution() {
  // Initially render the table with the default data
  window.reRenderAttributionTable();
}
