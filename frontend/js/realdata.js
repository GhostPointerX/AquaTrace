window.REAL_DATA = {
  data1: {
    "incident": {
      "id": "OSP-SANCHI-2018",
      "name": "MT Sanchi and CF Crystal collision, condensate spill",
      "region": "EAST CHINA SEA",
      "date": "2018-01-06",
      "timeUTC": "12:00",
      "timeNote": "Approximate; reports say late evening local time, about 160 nm off Shanghai",
      "location": { "lat": 31.5287, "lng": 124.9805 },
      "spillType": "Natural-gas condensate (ultra-light crude) plus ~1,000 t bunker fuel",
      "status": "Resolved (Sanchi sank 2018-01-14)"
    },
    "topCandidate": {
      "vesselName": "MT SANCHI",
      "imo": "9356608",
      "mmsi": "356137000",
      "flag": "Panama",
      "type": "Crude Oil Tanker (Suezmax, double hull)",
      "built": 2008,
      "dwt": 164154,
      "operator": "National Iranian Tanker Company",
      "voyage": "Asaluyeh (Iran) to Daesan (South Korea)",
      "cargoTonnes": 136000,
      "crew": 32,
      "attributionConfidence": 94.2,
      "slickOriginTimeUTC": "12:00",
      "aisProximityNm": 0.0,
      "estimatedSpillExtentKm2": 300,
      "extentNote": "Chinese authorities estimated sheen up to 300 sq. km"
    },
    "vessels": [
      {
        "rank": 1,
        "vesselName": "MT SANCHI",
        "imoMmsi": "9356608",
        "flag": "Panama",
        "lastAisPos": "31.53° N, 124.98° E",
        "speedKts": null,
        "confidence": 94.2,
        "level": "HIGH",
        "isDemo": false
      },
      {
        "rank": 2,
        "vesselName": "MV CF CRYSTAL",
        "imoMmsi": null,
        "flag": "Hong Kong",
        "type": "Bulk Carrier (75,725 dwt, built 2011), carrying grain from the US",
        "lastAisPos": "31.53° N, 124.98° E",
        "speedKts": null,
        "confidence": 61.5,
        "level": "MED",
        "isDemo": false,
        "note": "Real nearby ship; the collision partner. All 21 crew rescued."
      },
      {
        "rank": 3,
        "vesselName": "MV PACIFIC MERIDIAN",
        "imoMmsi": "9000001 / 477000111",
        "flag": "Hong Kong",
        "lastAisPos": "31.61° N, 125.10° E",
        "speedKts": 12.4,
        "confidence": 12.3,
        "level": "LOW",
        "isDemo": true
      },
      {
        "rank": 4,
        "vesselName": "MV EASTERN HARMONY",
        "imoMmsi": "9000002 / 563000222",
        "flag": "Singapore",
        "lastAisPos": "31.38° N, 124.82° E",
        "speedKts": 10.8,
        "confidence": 9.8,
        "level": "LOW",
        "isDemo": true
      },
      {
        "rank": 5,
        "vesselName": "MV YANGTZE STAR",
        "imoMmsi": "9000003 / 413000333",
        "flag": "China",
        "lastAisPos": "31.72° N, 125.25° E",
        "speedKts": 14.1,
        "confidence": 6.4,
        "level": "LOW",
        "isDemo": true
      }
    ],
    "alertStreamEntry": {
      "spillId": "#SAN-2018",
      "region": "EAST CHINA SEA",
      "time": "12:00 UTC",
      "message": "Tanker collision and fire. Condensate release confirmed. 5 vessels in proximity, 1 high and 1 medium attribution."
    },
    "sources": [
      "https://en.wikipedia.org/wiki/Sanchi_(tanker)",
      "https://cedre.fr/en/resources/incident-information-sheets/mt-sanchi",
      "https://incidentnews.noaa.gov/incident/9646",
      "https://iumi.com/news/iumi-eye-newsletter-march-2018/the-sanchi-tragedy"
    ]
  },
  data2: {
    "incident": {
      "id": "OSP-WAKASHIO-2020",
      "name": "MV Wakashio grounding and fuel oil spill",
      "region": "SOUTHERN MAURITIUS",
      "date": "2020-07-25",
      "timeUTC": "15:25",
      "location": { "lat": -20.4381, "lng": 57.7446 },
      "spillType": "VLSFO (very low sulphur fuel oil)",
      "status": "Resolved"
    },
    "topCandidate": {
      "vesselName": "MV WAKASHIO",
      "imo": null,
      "flag": "Panama",
      "type": "Capesize Bulk Carrier",
      "attributionConfidence": 100,
      "slickOriginTimeUTC": "15:25",
      "aisProximityNm": 0.0,
      "estimatedSpillExtentKm2": null
    },
    "vessels": [
      {
        "rank": 1,
        "vesselName": "MV WAKASHIO",
        "imoMmsi": null,
        "flag": "Panama",
        "lastAisPos": "20.44° S, 57.74° E",
        "speedKts": null,
        "confidence": 100,
        "level": "HIGH"
      },
      {
        "rank": 2,
        "vesselName": null,
        "imoMmsi": null,
        "flag": null,
        "lastAisPos": null,
        "speedKts": null,
        "confidence": 0,
        "level": null
      },
      {
        "rank": 3,
        "vesselName": null,
        "imoMmsi": null,
        "flag": null,
        "lastAisPos": null,
        "speedKts": null,
        "confidence": 0,
        "level": null
      }
    ],
    "alertStreamEntry": {
      "spillId": "#WAK-2020",
      "region": "MAURITIUS",
      "time": "15:25 UTC",
      "message": "Vessel grounded on reef. Fuel leak confirmed. Salvage and containment started."
    }
  }
};
window.currentActiveData = window.REAL_DATA.data1;
