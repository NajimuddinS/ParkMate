import React, { useEffect, useRef, useState } from 'react';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Car, 
  Zap, 
  Shield, 
  Eye,
  Navigation,
  Star
} from 'lucide-react';

const ParkingSpotCard = ({ spot, onSelect, isSelected, userLocation }) => {
  const amenityIcons = {
    covered: <Eye className="w-4 h-4" />,
    'ev-charging': <Zap className="w-4 h-4" />,
    security: <Shield className="w-4 h-4" />,
    accessible: <Car className="w-4 h-4" />,
    '24h': <Clock className="w-4 h-4" />,
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'garage': return 'bg-purple-100 text-purple-800';
      case 'lot': return 'bg-blue-100 text-blue-800';
      case 'street': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className={`p-5 m-5 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 cursor-pointer hover:shadow-md ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' : 'bg-white'
      }`}
      onClick={() => onSelect(spot)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1.5 truncate">{spot.name}</h3>
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor(spot.type)}`}>
              {spot.type}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
              spot.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {spot.available ? 'Available' : 'Occupied'}
            </span>
          </div>
        </div>
        <div className="text-right ml-2">
          <div className="flex items-center justify-end text-green-700 font-semibold text-sm">
            <DollarSign className="w-4 h-4 mr-1" />
            {spot.price}/hr
          </div>
          <div className="flex items-center justify-end text-gray-500 text-xs mt-1.5">
            <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
            {4.5.toFixed(1)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4">
        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">{spot.distance}m away</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm">
          <Navigation className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">{spot.walkingTime} min walk</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm">
          <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">Max {spot.maxTime}min</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm">
          <Car className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">{Math.floor(Math.random() * 10) + 1} spots</span>
        </div>
      </div>

      {spot.amenities.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {spot.amenities.map((amenity) => (
            <div
              key={amenity}
              className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
            >
              {amenityIcons[amenity]}
              <span className="capitalize whitespace-nowrap">{amenity.replace('-', ' ')}</span>
            </div>
          ))}
        </div>
      )}

      {spot.available && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <button 
            className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
            onClick={(e) => {
              e.stopPropagation();
              // Handle reservation logic here
            }}
          >
            Reserve Now
          </button>
        </div>
      )}
    </div>
  );
};

const ParkingList = ({ parkingSpots, onSpotSelect, selectedSpot, userLocation, isLoading }) => {
  const [visibleSpots, setVisibleSpots] = useState([]);
  const [page, setPage] = useState(1);
  const observerRef = useRef();
  const loadingRef = useRef();

  const SPOTS_PER_PAGE = 5;

  useEffect(() => {
    setVisibleSpots(parkingSpots.slice(0, SPOTS_PER_PAGE));
    setPage(1);
  }, [parkingSpots]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMoreSpots();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [visibleSpots, isLoading]);

  const loadMoreSpots = () => {
    const nextPage = page + 1;
    const nextSpots = parkingSpots.slice(0, nextPage * SPOTS_PER_PAGE);
    
    if (nextSpots.length > visibleSpots.length) {
      setVisibleSpots(nextSpots);
      setPage(nextPage);
    }
  };

  const sortedSpots = [...visibleSpots].sort((a, b) => {
    if (a.available !== b.available) {
      return a.available ? -1 : 1;
    }
    return a.distance - b.distance;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2 m-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Nearby Parking <span className="text-gray-500">({parkingSpots.length})</span>
        </h2>
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
            <span>Occupied</span>
          </div>
        </div>
      </div>

      {isLoading && visibleSpots.length === 0 ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-100 h-36 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {sortedSpots.map((spot) => (
              <ParkingSpotCard
                key={spot.id}
                spot={spot}
                onSelect={onSpotSelect}
                isSelected={selectedSpot?.id === spot.id}
                userLocation={userLocation}
              />
            ))}
          </div>
          
          {visibleSpots.length < parkingSpots.length && (
            <div ref={loadingRef} className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ParkingList;