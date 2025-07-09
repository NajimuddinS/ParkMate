import React from 'react';
import { MapPin, Navigation, Target } from 'lucide-react';

const LocationDisplay = ({ location, loading, error, onRefresh }) => {
  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span className="text-blue-800">Finding your location...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-between px-4 py-2 bg-red-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-red-600" />
          <span className="text-red-800">Location unavailable</span>
        </div>
        <button
          onClick={onRefresh}
          className="text-red-600 hover:text-red-800 font-medium text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!location) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
      <MapPin className="w-4 h-4 text-green-600" />
      <span className="text-green-800">
        Located within {Math.round(location.accuracy)}m accuracy
      </span>
      <button
        onClick={onRefresh}
        className="ml-auto text-green-600 hover:text-green-800"
      >
        <Navigation className="w-4 h-4" />
      </button>
    </div>
  );
};

export default LocationDisplay;