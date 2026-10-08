/**
 * AquaTrace / ShipTrack — REST API Routes (/api/v1)
 * Routes are thin — all business logic lives in controllers/vesselController.js.
 */

const express          = require('express');
const router           = express.Router();
const vesselController = require('../controllers/vessel-controller');

const path = require('path');
const fs = require('fs');

router.get('/health',                vesselController.getHealth);
router.get('/stats',                 vesselController.getStats);
router.get('/vessels',               vesselController.getVessels);
router.get('/vessels/search',        vesselController.searchVessels);
router.get('/vessels/:mmsi',         vesselController.getVesselByMmsi);
router.get('/vessels/:mmsi/track',   vesselController.getVesselTrack);

// Attribution results from Python scoring engine
router.get('/attribution', (req, res) => {
  const candidatesFile = path.resolve(__dirname, '../../../outputs/attribution/candidates.json');
  if (fs.existsSync(candidatesFile)) {
    return res.sendFile(candidatesFile);
  }
  return res.status(404).json({ error: 'Attribution candidates not found' });
});

// Proxy for Google News RSS to bypass CORS
router.get('/news', async (req, res) => {
  try {
    const response = await fetch('https://news.google.com/rss/search?q=%22oil+spill%22+(ship+OR+vessel+OR+tanker+OR+marine+OR+ocean)&hl=en&gl=US&ceid=US:en');
    const text = await response.text();
    res.set('Content-Type', 'application/xml');
    res.send(text);
  } catch (error) {
    console.error('Failed to fetch news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

module.exports = router;
