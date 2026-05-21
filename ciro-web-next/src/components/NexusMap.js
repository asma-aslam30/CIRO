'use client'

import { useEffect, useRef } from 'react'

// Coordinate lookup — expanded to match mock_data locations
const COORDS = {
  'F-6 Markaz':          [33.7297, 73.0746],
  'F-6 Blue Area':       [33.7297, 73.0746],
  'Blue Area':           [33.7103, 73.0652],
  'Blue Area Jinnah Avenue': [33.7103, 73.0652],
  'Saddar':              [33.5950, 73.0543],
  'Saddar Rawalpindi':   [33.5950, 73.0543],
  'Expressway':          [33.6844, 73.0479],
  'Expressway Junction': [33.6844, 73.0479],
  'G-10 Markaz':         [33.6757, 73.0074],
  'G-9 Markaz':          [33.6900, 73.0200],
  'G-11 Markaz':         [33.6800, 73.0050],
  'E-7 Hill View':       [33.7232, 73.0941],
  'I-8 Sector':          [33.6634, 73.0862],
  'I-10 Markaz':         [33.6500, 73.1000],
  'Bahria Phase 7':      [33.5256, 72.9769],
  'DHA Phase 2':         [33.5431, 73.1225],
  'Gulberg Green':       [33.6139, 72.9882],
  'Murree Road':         [33.6100, 73.1200],
  'Centaurus Mall Area': [33.7183, 73.0603],
  'Shakarparian':        [33.6878, 73.0572],
  'Saidpur Village':     [33.7531, 73.0879],
  'Taramri Chowk':       [33.7089, 73.0322],
  'Bara Kahu':           [33.7500, 73.1400],
  'F-7 Markaz':          [33.7200, 73.0600],
  'F-11 Markaz':         [33.7100, 73.0200],
  'H-8 Industrial Area': [33.6500, 73.0700],
  'Kashmir Highway':     [33.7000, 73.0300],
  'Faizabad Interchange':[33.7050, 73.0440],
  'Zero Point':          [33.6995, 73.0601],
  'Golra Mor':           [33.7200, 72.9880],
  'Pir Sohawa':          [33.7700, 73.1300],
  'Diplomatic Enclave':  [33.7360, 73.0990],
  'Pakistan Monument':   [33.6937, 73.0688],
  'Convention Center':   [33.7290, 73.0940],
  'Serena Hotel Zone':   [33.7280, 73.0970],
  'PIMS Hospital Area':  [33.7100, 73.0500],
  'Aabpara Market':      [33.7166, 73.0770],
  'Melody Market':       [33.7200, 73.0620],
  'Super Market F-6':    [33.7280, 73.0720],
  'Karachi Company G-9': [33.6900, 73.0250],
  'Stock Exchange Blue Area': [33.7103, 73.0600],
  'Citywide':            [33.6844, 73.0479],
}

// Color per crisis type
const CRISIS_COLORS = {
  'Urban Flooding':       '#00f0ff',
  'Structural Fire':      '#ff003c',
  'Major Traffic Incident': '#ffe066',
  'Extreme Heatwave':     '#ff7700',
  'Power Outage':         '#b026ff',
  'Medical Emergency':    '#ff4499',
  'Security Incident':    '#ff6600',
  'General Emergency':    '#888888',
  'default':              '#ff003c',
}

function getCrisisColor(crisisType) {
  for (const [key, color] of Object.entries(CRISIS_COLORS)) {
    if (crisisType && crisisType.toLowerCase().includes(key.toLowerCase())) return color
  }
  return CRISIS_COLORS['default']
}

function makeMarkerHtml(color, label, id) {
  return `
    <div style="position:relative;width:28px;height:28px;cursor:pointer;" title="${label}">
      <div style="
        position:absolute;top:50%;left:50%;
        width:28px;height:28px;
        border:2px solid ${color};
        border-radius:50%;
        transform:translate(-50%,-50%);
        animation:nexusPulse${id} 2s ease-out infinite;
        opacity:0.8;
      "></div>
      <div style="
        position:absolute;top:50%;left:50%;
        width:10px;height:10px;
        background:${color};
        border-radius:50%;
        transform:translate(-50%,-50%);
        box-shadow:0 0 12px ${color}, 0 0 24px ${color}55;
      "></div>
      <style>
        @keyframes nexusPulse${id} {
          0%   { transform: translate(-50%,-50%) scale(1); opacity:0.8; }
          100% { transform: translate(-50%,-50%) scale(2.8); opacity:0; }
        }
      </style>
    </div>
  `
}

export default function NexusMap({ allCrises = [], latestCrisisLocation }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef({})   // key: crisis.id → marker

  // Initialize map once
  useEffect(() => {
    let L
    const initMap = async () => {
      L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')
      if (mapInstanceRef.current) return

      mapInstanceRef.current = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([33.6844, 73.0479], 12)

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(mapInstanceRef.current)
    }
    initMap()
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Sync markers whenever allCrises changes
  useEffect(() => {
    if (!mapInstanceRef.current || !allCrises.length) return

    const syncMarkers = async () => {
      const L = (await import('leaflet')).default
      const existingIds = new Set(Object.keys(markersRef.current).map(Number))
      const incomingIds = new Set(allCrises.map(c => c.id))

      // Remove markers that are no longer in history (should not happen, but safety check)
      for (const id of existingIds) {
        if (!incomingIds.has(id)) {
          markersRef.current[id]?.remove()
          delete markersRef.current[id]
        }
      }

      // Add new markers
      for (const crisis of allCrises) {
        if (markersRef.current[crisis.id]) continue  // already on map

        const pos = COORDS[crisis.location] || [33.6844, 73.0479]
        const color = getCrisisColor(crisis.crisis_type)

        const icon = L.divIcon({
          className: '',
          html: makeMarkerHtml(color, `${crisis.crisis_type} — ${crisis.location}`, crisis.id),
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        })

        const marker = L.marker(pos, { icon })
          .addTo(mapInstanceRef.current)
          .bindPopup(`
            <div style="font-family:monospace;background:#0a0f1e;color:#e0e0e0;padding:8px;border:1px solid ${color}33;border-radius:4px;min-width:180px;">
              <div style="color:${color};font-weight:700;font-size:13px;">${crisis.crisis_type}</div>
              <div style="color:#888;font-size:11px;margin-top:4px;">LOC: ${crisis.location}</div>
              <div style="color:#888;font-size:11px;">SEV: ${crisis.severity}</div>
              <div style="color:#888;font-size:11px;">TIME: ${crisis.detected_at}</div>
              <div style="color:${color}99;font-size:10px;margin-top:6px;">${crisis.reasoning?.slice(0, 80) || ''}...</div>
            </div>
          `, { 
            className: 'nexus-popup',
            maxWidth: 240
          })

        markersRef.current[crisis.id] = marker
      }

      // Pan to the latest entry
      if (allCrises.length > 0) {
        const latest = allCrises[allCrises.length - 1]
        const pos = COORDS[latest.location] || [33.6844, 73.0479]
        mapInstanceRef.current.flyTo(pos, 14, { duration: 1.5, easeLinearity: 0.3 })
      }
    }

    syncMarkers()
  }, [allCrises])

  return (
    <>
      <div ref={mapRef} style={{ width: '100%', height: '100%', background: '#05050f' }} />
      <style>{`
        .nexus-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .nexus-popup .leaflet-popup-tip { display: none; }
      `}</style>
    </>
  )
}
