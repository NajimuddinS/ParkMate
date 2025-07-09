import React from 'react';
import { MapPin, Menu, Search, Bell, Clock } from 'lucide-react';
import NetworkStatus from './NetworkStatus';

const Header = ({ 
  userLocation, 
  onMenuClick, 
  networkStatus, 
  reservations = [], 
  onViewChange,
  currentView 
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ParkSmart</h1>
                <p className="text-sm text-gray-600">Find parking instantly</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NetworkStatus {...networkStatus} />
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onViewChange('reservations')}
                className="p-2 relative text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Clock className="w-5 h-5" />
                {reservations.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {reservations.length}
                  </span>
                )}
              </button>
              <Search className="w-5 h-5 text-gray-600" />
              <Bell className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;