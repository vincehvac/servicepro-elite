import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline, InfoWindow, TrafficLayer } from '@react-google-maps/api';

const MapView = ({ technicians, selectedTechnician, onTechnicianSelect, trafficData }) => {
  const mapRef = useRef(null);
  const [center, setCenter] = useState({ lat: 40.7128, lng: -74.0060 });
  const [zoom, setZoom] = useState(11);
  const [activeMarker, setActiveMarker] = useState(null);
  const [showTraffic, setShowTraffic] = useState(true);

  useEffect(() => {
    if (selectedTechnician && selectedTechnician.currentLocation) {
      setCenter({
        lat: selectedTechnician.currentLocation.latitude,
        lng: selectedTechnician.currentLocation.longitude
      });
      setZoom(13);
    }
  }, [selectedTechnician]);

  const mapContainerStyle = {
    width: '100%',
    height: '100%'
  };

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  };

  const getTechnicianIcon = (tech) => {
    const colors = {
      available: '#10B981',
      busy: '#F59E0B',
      offline: '#6B7280'
    };

    return {
      path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
      fillColor: colors[tech.status] || '#3B82F6',
      fillOpacity: 1,
      strokeColor: '#FFFFFF',
      strokeWeight: 2,
      scale: 1.5,
      anchor: { x: 12, y: 24 }
    };
  };

  const getJobIcon = (job) => {
    const colors = {
      high: '#EF4444',
      normal: '#667eea',
      low: '#10B981'
    };

    return {
      path: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
      fillColor: colors[job.priority] || '#667eea',
      fillOpacity: 0.8,
      strokeColor: '#FFFFFF',
      strokeWeight: 2,
      scale: 1,
      anchor: { x: 12, y: 12 }
    };
  };

  const calculateRoute = (tech) => {
    if (!tech.currentLocation || !tech.jobs || tech.jobs.length === 0) return [];

    const route = [
      {
        lat: tech.currentLocation.latitude,
        lng: tech.currentLocation.longitude
      }
    ];

    tech.jobs.forEach(job => {
      if (job.coordinates) {
        route.push({
          lat: job.coordinates.latitude,
          lng: job.coordinates.longitude
        });
      }
    });

    return route;
  };

  const getRouteColor = (tech) => {
    const colors = {
      available: '#10B981',
      busy: '#F59E0B',
      offline: '#6B7280'
    };
    return colors[tech.status] || '#667eea';
  };

  const handleMarkerClick = (item, type) => {
    setActiveMarker({ item, type });
    if (type === 'technician') {
      onTechnicianSelect(item);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  return (
    <div className="relative h-full">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-3 space-y-2">
        <button
          onClick={() => setShowTraffic(!showTraffic)}
          className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition ${
            showTraffic
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {showTraffic ? '🚦 Traffic: ON' : '🚦 Traffic: OFF'}
        </button>
        
        <button
          onClick={() => {
            setCenter({ lat: 40.7128, lng: -74.0060 });
            setZoom(11);
            onTechnicianSelect(null);
          }}
          className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
        >
          🔄 Reset View
        </button>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-3">
        <h4 className="font-semibold text-sm text-gray-900 mb-2">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Busy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span>Offline</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>High Priority</span>
          </div>
        </div>
      </div>

      {/* Stats Panel */}
      {selectedTechnician && (
        <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-gray-900">{selectedTechnician.name}</h3>
              <p className="text-sm text-gray-600">{selectedTechnician.specialty}</p>
            </div>
            <button
              onClick={() => {
                onTechnicianSelect(null);
                setActiveMarker(null);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`font-semibold ${
                selectedTechnician.status === 'available' ? 'text-green-600' :
                selectedTechnician.status === 'busy' ? 'text-yellow-600' :
                'text-gray-600'
              }`}>
                {selectedTechnician.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Jobs Today:</span>
              <span className="font-semibold">{selectedTechnician.jobs.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rating:</span>
              <span className="font-semibold">⭐ {selectedTechnician.rating}</span>
            </div>
            {selectedTechnician.jobs.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-2">Next Job:</p>
                <p className="text-sm font-medium">{selectedTechnician.jobs[0].customer}</p>
                <p className="text-xs text-gray-600">{selectedTechnician.jobs[0].scheduledTime}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoom}
          options={mapOptions}
          onLoad={map => (mapRef.current = map)}
        >
          {/* Traffic Layer */}
          {showTraffic && <TrafficLayer />}

          {/* Technician Markers */}
          {technicians.map(tech => {
            if (!tech.currentLocation) return null;

            return (
              <React.Fragment key={`tech-${tech.id}`}>
                <Marker
                  position={{
                    lat: tech.currentLocation.latitude,
                    lng: tech.currentLocation.longitude
                  }}
                  icon={getTechnicianIcon(tech)}
                  onClick={() => handleMarkerClick(tech, 'technician')}
                  title={tech.name}
                />

                {/* Route Polyline */}
                {selectedTechnician?.id === tech.id && (
                  <Polyline
                    path={calculateRoute(tech)}
                    options={{
                      strokeColor: getRouteColor(tech),
                      strokeOpacity: 0.8,
                      strokeWeight: 4,
                      geodesic: true
                    }}
                  />
                )}

                {/* Job Markers for selected technician */}
                {selectedTechnician?.id === tech.id &&
                  tech.jobs.map((job, index) => {
                    if (!job.coordinates) return null;

                    return (
                      <Marker
                        key={`job-${job.id}`}
                        position={{
                          lat: job.coordinates.latitude,
                          lng: job.coordinates.longitude
                        }}
                        icon={getJobIcon(job)}
                        label={{
                          text: `${index + 1}`,
                          color: '#FFFFFF',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                        onClick={() => handleMarkerClick(job, 'job')}
                        title={job.customer}
                      />
                    );
                  })}
              </React.Fragment>
            );
          })}

          {/* Info Window */}
          {activeMarker && (
            <InfoWindow
              position={
                activeMarker.type === 'technician'
                  ? {
                      lat: activeMarker.item.currentLocation.latitude,
                      lng: activeMarker.item.currentLocation.longitude
                    }
                  : {
                      lat: activeMarker.item.coordinates.latitude,
                      lng: activeMarker.item.coordinates.longitude
                    }
              }
              onCloseClick={() => setActiveMarker(null)}
            >
              <div className="p-2">
                {activeMarker.type === 'technician' ? (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      {activeMarker.item.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      {activeMarker.item.specialty}
                    </p>
                    <p className="text-xs text-gray-500">
                      Status: <span className="font-semibold">{activeMarker.item.status}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Jobs: <span className="font-semibold">{activeMarker.item.jobs.length}</span>
                    </p>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      {activeMarker.item.customer}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      {activeMarker.item.type}
                    </p>
                    <p className="text-xs text-gray-500 mb-1">
                      ⏰ {activeMarker.item.scheduledTime}
                    </p>
                    <p className="text-xs text-gray-500">
                      📍 {activeMarker.item.address}
                    </p>
                    {activeMarker.item.priority === 'high' && (
                      <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
                        HIGH PRIORITY
                      </span>
                    )}
                  </div>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapView;