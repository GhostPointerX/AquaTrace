/**
 * AquaTrace — Map Module
 * Handles all Leaflet map initialization, layer rendering,
 * vessel marker management, and the fullscreen overlay toggle.
 *
 * [LIVE_DATA_HOOK]: getVesselData() currently returns hardcoded demo values.
 * Once the Node.js backend is running, replace it with:
 *
 *   async function getVesselData() {
 *     return fetchVessels(); // from api.js
 *   }
 *
 * renderMapLayer() already consumes whatever shape getVesselData() returns.
 * No other code needs to change.
 */

// Module-level map instances
let _map = null;
let _mapFull = null;

// ---- Leaflet Icon Fix ----
// Paths break when Leaflet loads via CDN — must be set manually.
function _fixLeafletIcons() {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions(CONFIG.LEAFLET_ICONS);
}

// ---- Data Source ----

let _mapLayers = L.featureGroup();

async function getVesselData() {
  const active = window.currentActiveData || window.REAL_DATA.data1;
  const inc = active.incident.location;
  const tc = active.topCandidate;
  
  const d = 0.05;
  const coords = [
    [inc.lat + d, inc.lng - d],
    [inc.lat + d, inc.lng + d],
    [inc.lat - d, inc.lng + d],
    [inc.lat - d, inc.lng - d]
  ];

  const mappedVessels = (active.vessels || []).filter(v => v.vesselName && v.lastAisPos).map(v => {
    let lat = inc.lat;
    let lng = inc.lng;
    try {
      const parts = v.lastAisPos.split(',');
      if (parts.length === 2) {
        let pLat = parseFloat(parts[0].replace(/[^0-9.-]/g, ''));
        let pLng = parseFloat(parts[1].replace(/[^0-9.-]/g, ''));
        if (parts[0].includes('S')) pLat = -pLat;
        if (parts[1].includes('W')) pLng = -pLng;
        if (!isNaN(pLat) && !isNaN(pLng)) {
          lat = pLat;
          lng = pLng;
        }
      }
    } catch(e) {}
    
    return {
      name: v.vesselName,
      imo: v.imoMmsi || 'N/A',
      matchScore: v.confidence || 0,
      position: [lat, lng],
      track: [
        [lat - 0.05, lng - 0.05],
        [lat, lng]
      ]
    };
  });

  return {
    center: [inc.lat, inc.lng],
    oilSlick: {
      coords: coords,
      areaKm2: tc.estimatedSpillExtentKm2 || 300,
      sensor: 'Sentinel-1'
    },
    vessels: mappedVessels
  };
}

async function renderMapLayer(mapInstance) {
  const activeData = window.currentActiveData || window.REAL_DATA.data1;
  const isData1 = activeData.incident.id === 'OSP-SANCHI-2018';
  
  const data = await getVesselData();
  
  _mapLayers.clearLayers();
  
  const CL = data.center[0];
  const CC = data.center[1];

  mapInstance.setView(data.center, 9); // Adjust zoom to fit the incident

  if (!isData1) {
    // OLD STYLING FOR DATA 2
    const slickPolygon = L.polygon(data.oilSlick.coords, CONFIG.SLICK_STYLE).addTo(_mapLayers);
    slickPolygon.bindPopup(
      `<b>OIL SLICK DETECTED</b><br>Area: ${data.oilSlick.areaKm2} sq. km<br>SAR Sensor: ${data.oilSlick.sensor}`
    );

    data.vessels.forEach((v) => {
      const marker = L.marker(v.position).addTo(_mapLayers);
      marker.bindPopup(
        `<b>${v.name}</b><br>IMO/MMSI: ${v.imo}<br>Match Score: <span style='color:red;font-weight:bold;'>${v.matchScore}%</span>`
      );
      // Data 2 original track (optional, if you want it exactly like before)
      L.polyline(v.track, CONFIG.TRACK_STYLE).addTo(_mapLayers);
    });
    
    _mapLayers.addTo(mapInstance);
    return;
  }

  // NEW STYLING FOR DATA 1
  // Search radius circle
  L.circle([CL, CC], {
    radius: 38000, // 38 km radius
    color: '#00A8E8', fillColor: '#00A8E8', fillOpacity: 0.06, weight: 2, dashArray: '6 4'
  }).addTo(_mapLayers).bindPopup(
    `<b>Search Radius</b><br>Estimated boundary for incident investigation<br>`
  );

  // Discharge origin marker
  const originIcon = L.divIcon({
    className: '',
    html: `<div style="width:20px;height:20px;background:#ef4444;border:3px solid #111;border-radius:50%;box-shadow:0 0 0 6px rgba(239,68,68,0.25);"></div>`,
    iconSize: [20, 20], iconAnchor: [10, 10]
  });
  L.marker([CL, CC], { icon: originIcon }).addTo(_mapLayers)
    .bindPopup(`<b style="color:#ef4444;">⚠ DISCHARGE ORIGIN</b>`);

  const COLORS = ['#ef4444','#f97316','#eab308','#84cc16','#22c55e','#14b8a6','#3b82f6','#a855f7'];

  data.vessels.forEach((v, idx) => {
    // Top candidate gets the red diamond/chevron, others get colored ones
    const isTop = (idx === 0);
    const color = isTop ? '#ef4444' : (COLORS[idx % COLORS.length] || '#94a3b8');

    // To make it look more realistic than a straight line, we vary the track angles
    const angle = (idx * (Math.PI * 2) / data.vessels.length);
    const dist1 = 0.08 + (Math.random() * 0.04);
    const dist2 = 0.04 + (Math.random() * 0.02);
    
    // Create a curved track ending at the vessel position
    const trackCoords = [
      [v.position[0] - Math.sin(angle)*dist1, v.position[1] - Math.cos(angle)*dist1],
      [v.position[0] - Math.sin(angle)*dist2, v.position[1] - Math.cos(angle)*dist2],
      v.position
    ];

    // Calculate heading for the ship icon (SVG points UP at 0 deg)
    const headingDeg = Math.atan2(Math.cos(angle), Math.sin(angle)) * (180 / Math.PI);

    // Track polyline
    L.polyline(trackCoords, {
      color, weight: isTop ? 3 : 1.5,
      dashArray: isTop ? '8 4' : '3 6',
      opacity: isTop ? 1 : 0.65
    }).addTo(_mapLayers);

    // Vessel marker (Arrow/Chevron shape)
    const size = isTop ? 24 : 16;
    const shadow = isTop ? 'drop-shadow(0px 0px 6px rgba(239,68,68,0.9)) drop-shadow(0px 2px 2px rgba(0,0,0,0.8))' : 'drop-shadow(0px 2px 2px rgba(0,0,0,0.6))';
    
    const vesselIcon = L.divIcon({
      className: '',
      html: `<div style="width:${size}px; height:${size}px; display:flex; align-items:center; justify-content:center; filter: ${shadow};">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" style="transform: rotate(${headingDeg}deg); transform-origin: center;">
          <path d="M12 2L22 22L12 17L2 22Z" fill="${color}" stroke="#111" stroke-width="1.5" stroke-linejoin="round"/>
        </svg>
      </div>`,
      iconSize: [size, size], iconAnchor: [size/2, size/2]
    });
    
    const marker = L.marker(v.position, { icon: vesselIcon }).addTo(_mapLayers);
    marker.bindPopup(
      `<b>${v.name}</b><br>IMO/MMSI: ${v.imo}<br>Match Score: <span style='color:${isTop ? '#ef4444' : '#16a34a'};font-weight:bold;'>${v.matchScore}%</span>`
    );
  });
  
  _mapLayers.addTo(mapInstance);
}

// ---- Map Factory ----

/**
 * Create and return a new Leaflet map instance on the given element ID.
 * @param {string} elementId
 * @returns {L.Map}
 */
function createMap(elementId) {
  const m = L.map(elementId).setView(CONFIG.MAP.DEFAULT_CENTER, CONFIG.MAP.DEFAULT_ZOOM);
  L.tileLayer(CONFIG.MAP.TILE_URL, {
    attribution: CONFIG.MAP.TILE_ATTRIBUTION,
    maxZoom: CONFIG.MAP.MAX_ZOOM,
  }).addTo(m);
  renderMapLayer(m);
  return m;
}

// ---- Fullscreen Overlay ----

/**
 * Toggle the fullscreen map overlay open/closed.
 * Lazily initializes the fullscreen map on first open.
 */
function toggleFullscreenMap() {
  const overlay = document.getElementById('fullscreen-map-overlay');
  overlay.classList.toggle('is-open');

  if (overlay.classList.contains('is-open')) {
    if (!_mapFull) {
      _mapFull = createMap('map-full');
    }
    // Allow DOM to paint before invalidating size
    setTimeout(() => _mapFull.invalidateSize(), 100);
  }
}

// ---- Init ----

/**
 * Initialize the primary dashboard map.
 * Called once from app.js on DOMContentLoaded.
 */
function initMap() {
  _fixLeafletIcons();
  _map = createMap('map');

  // Wire fullscreen button — avoids inline onclick in HTML
  document.getElementById('btn-fullscreen-map')?.addEventListener('click', toggleFullscreenMap);
  document.getElementById('btn-close-fullscreen')?.addEventListener('click', toggleFullscreenMap);
  document.getElementById('btn-live-ais-radar')?.addEventListener('click', toggleFullscreenMap);
}
