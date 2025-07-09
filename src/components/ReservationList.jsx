// src/components/ReservationList.js
import React from 'react';
import { Clock, MapPin, DollarSign, CheckCircle, XCircle } from 'lucide-react';

const ReservationList = ({ reservations }) => {
  if (reservations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No reservations yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">My Reservations</h2>
      {reservations.map((reservation) => (
        <div key={reservation.reservationId} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-gray-800">{reservation.spot.name}</h3>
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
              {reservation.reservationId}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              {reservation.spot.distance}m
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {reservation.duration} hour{reservation.duration > 1 ? 's' : ''}
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              ${reservation.total.toFixed(2)}
            </div>
            <div className="flex items-center">
              {reservation.spot.available ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Active
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2 text-red-500" />
                  Expired
                </>
              )}
            </div>
          </div>
          
          <div className="text-xs text-gray-500">
            Reserved at: {new Date(reservation.timestamp || Date.now()).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReservationList;