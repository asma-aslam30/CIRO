'use client'

import { useEffect, useRef } from 'react'

const COORDS = {
  'F-6 Markaz': [33.7297, 73.0746],
  'Blue Area': [33.7103, 73.0652],
  'Saddar': [33.5950, 73.0543],
  'Expressway': [33.6844, 73.0479],
  'Citywide': [33.6844, 73.0479]
}

export default function NexusMap({ crisisLocation, onMapReady }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerRef = useRef(null)

  useEffect(() => {
    // Dynamically import Leaflet (client-side only)
    let L
    const initMap = async () => {
      L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')

      if (mapInstanceRef.current) return // Already initialized

      mapInstanceRef.current = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([33.6844, 73.0479], 13)

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(mapInstanceRef.current)

      if (onMapReady) onMapReady(mapInstanceRef.current)
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current || !crisisLocation) return

    const updateMarker = async () => {
      const L = (await import('leaflet')).default
      const pos = COORDS[crisisLocation] || [33.6844, 73.0479]

      if (markerRef.current) {
        markerRef.current.remove()
      }

      const pulseIcon = L.divIcon({
        className: 'custom-pulse-marker',
        html: `
          <div class="pulse-marker-container">
            <div class="pulse-marker-ring"></div>
            <div class="pulse-marker-core"></div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      })

      markerRef.current = L.marker(pos, { icon: pulseIcon }).addTo(mapInstanceRef.current)
      mapInstanceRef.current.flyTo(pos, 14, { duration: 2, easeLinearity: 0.25 })
    }

    updateMarker()
  }, [crisisLocation])

  // Reset marker when crisis clears
  useEffect(() => {
    if (!crisisLocation && markerRef.current && mapInstanceRef.current) {
      markerRef.current.remove()
      markerRef.current = null
      mapInstanceRef.current.setView([33.6844, 73.0479], 13)
    }
  }, [crisisLocation])

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '100%', background: '#05050f' }}
    />
  )
}
