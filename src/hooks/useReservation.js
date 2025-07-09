// src/hooks/useReservation.js
import { useState, useEffect } from 'react';

const useReservation = () => {
  const [reservations, setReservations] = useState([]);

  // Load reservations from localStorage on initial render
  useEffect(() => {
    const savedReservations = localStorage.getItem('parkingReservations');
    if (savedReservations) {
      setReservations(JSON.parse(savedReservations));
    }
  }, []);

  // Save to localStorage whenever reservations change
  useEffect(() => {
    localStorage.setItem('parkingReservations', JSON.stringify(reservations));
  }, [reservations]);

  const addReservation = (reservationData) => {
    const newReservation = {
      ...reservationData,
      id: `res-${Date.now()}`,
      timestamp: Date.now()
    };
    setReservations(prev => [newReservation, ...prev]);
  };

  const cancelReservation = (reservationId) => {
    setReservations(prev => prev.filter(res => res.id !== reservationId));
  };

  return {
    reservations,
    addReservation,
    cancelReservation
  };
};

export default useReservation;