import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaLocationArrow } from 'react-icons/fa';

// Custom parking spot icons
const createParkingIcon = (available, type) => {
  const color = available ? '#10B981' : '#EF4444';
  const symbol = type === 'garage' ? '🏢' : type === 'lot' ? '🅿️' : '🚗';
  
  return new Icon({
    iconUrl: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="${color}" stroke="#fff" stroke-width="2"/>
        <text x="16" y="20" text-anchor="middle" fill="white" font-size="12">${symbol}</text>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

// Balloon-style user location icon
const createUserLocationIcon = () => {
  return divIcon({
    html: `
      <div style="position: relative;">
        <svg width="20" height="30" viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 0C8.954 0 0 8.954 0 20C0 36 20 60 20 60C20 60 40 36 40 20C40 8.954 31.046 0 20 0Z" fill="#3B82F6"/>
          <circle cx="20" cy="15" r="8" fill="white"/>
        </svg>
        <div style="position: absolute; z-index:10, top: 10px; left: 50%; transform: translateX(-50%); color: #3B82F6; font-weight: bold; font-size: 12px;">YOU</div>
      </div>
    `,
    className: '',
    iconSize: [40, 60],
    iconAnchor: [20, 60],
    popupAnchor: [0, -60],
  });
};

const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  
  return null;
};

const LocateControl = ({ onLocate }) => {
  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <button 
        onClick={onLocate}
        className="p-3 bg-white hover:bg-gray-100 text-gray-800 rounded-full shadow-lg flex items-center justify-center"
        title="Locate me"
        aria-label="Locate me"
        style={{
          boxShadow: '0 1px 5px rgba(0,0,0,0.2)',
          transition: 'all 0.2s ease',
        }}
      >
        <FaLocationArrow className="text-blue-600 text-lg" />
      </button>
    </div>
  );
};

const ParkingMap = ({ userLocation, parkingSpots, onSpotSelect, selectedSpot }) => {
  const mapRef = useRef();
  const [mapCenter, setMapCenter] = useState([37.7749, -122.4194]); // Default to San Francisco
  const [mapZoom, setMapZoom] = useState(15);
  const [showUserLocation, setShowUserLocation] = useState(false);

  useEffect(() => {
    if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng]);
      setMapZoom(16);
      setShowUserLocation(true);
    }
  }, [userLocation]);

  const handleSpotClick = (spot) => {
    onSpotSelect(spot);
    setMapCenter([spot.lat, spot.lng]);
    setMapZoom(18);
  };

  const handleLocateMe = () => {
    if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng]);
      setMapZoom(16);
      setShowUserLocation(true);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          setMapCenter([newLocation.lat, newLocation.lng]);
          setMapZoom(16);
          setShowUserLocation(true);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your location. Please ensure location services are enabled.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  return (
    <div className="relative w-full h-screen">
      <MapContainer
        ref={mapRef}
        center={mapCenter}
        zoom={mapZoom}
        className="w-full h-screen rounded-lg shadow-lg"
        zoomControl={false}
      >
        <MapUpdater center={mapCenter} zoom={mapZoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {showUserLocation && userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createUserLocationIcon()}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold text-blue-600">Your Current Location</h3>
                <p className="text-sm text-gray-600">
                  Accuracy: {Math.round(userLocation.accuracy)} meters
                </p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {parkingSpots.map((spot) => (
          <Marker
            key={spot.id}
            position={[spot.lat, spot.lng]}
            icon={createParkingIcon(spot.available, spot.type)}
            eventHandlers={{
              click: () => handleSpotClick(spot),
            }}
          >
            <Popup>
              <div className="min-w-48">
                <h3 className="font-semibold text-gray-800 mb-2">{spot.name}</h3>
                <div className="space-y-1 text-sm">
                  <p className={`font-medium ${spot.available ? 'text-green-600' : 'text-red-600'}`}>
                    {spot.available ? 'Available' : 'Occupied'}
                  </p>
                  <p className="text-gray-600">${spot.price}/hour</p>
                  <p className="text-gray-600">{spot.distance}m away</p>
                  <p className="text-gray-600">{spot.walkingTime} min walk</p>
                  <p className="text-gray-600 capitalize">{spot.type} parking</p>
                  {spot.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {spot.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
        
      <LocateControl onLocate={handleLocateMe} />
    </div>
  );
};

export default ParkingMap;