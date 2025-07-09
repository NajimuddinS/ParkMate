import React from 'react';
import { Wifi, WifiOff, Signal } from 'lucide-react';

const NetworkStatus = ({ isOnline, networkInfo }) => {
  const getConnectionQuality = () => {
    if (!isOnline) return 'offline';
    
    const { effectiveType, downlink } = networkInfo;
    
    if (effectiveType === '4g' && downlink > 5) return 'excellent';
    if (effectiveType === '4g' || downlink > 2) return 'good';
    if (effectiveType === '3g' || downlink > 1) return 'fair';
    return 'poor';
  };

  const quality = getConnectionQuality();
  
  const getStatusColor = () => {
    switch (quality) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-orange-600';
      case 'offline': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = () => {
    switch (quality) {
      case 'excellent': return 'Excellent connection';
      case 'good': return 'Good connection';
      case 'fair': return 'Fair connection';
      case 'poor': return 'Poor connection';
      case 'offline': return 'Offline mode';
      default: return 'Unknown';
    }
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor()}`}>
      {isOnline ? (
        quality === 'excellent' ? <Signal className="w-4 h-4" /> : <Wifi className="w-4 h-4" />
      ) : (
        <WifiOff className="w-4 h-4" />
      )}
      <span className="font-medium">{getStatusText()}</span>
      {isOnline && (
        <span className="text-xs opacity-75">
          {networkInfo.effectiveType?.toUpperCase()}
        </span>
      )}
    </div>
  );
};

export default NetworkStatus;