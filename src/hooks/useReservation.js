// src/hooks/useReservations.js
import { useState, useEffect } from 'react';

const useReservations = () => {
  const [reservations, setReservations] = useState([]);

  // Load reservations from local storage on initial render
  useEffect(() => {
    const savedReservations = localStorage.getItem('parkingReservations');
    if (savedReservations) {
      setReservations(JSON.parse(savedReservations));
    }
  }, []);

  // Save to local storage whenever reservations change
  useEffect(() => {
    localStorage.setItem('parkingReservations', JSON.stringify(reservations));
  }, [reservations]);

  const addReservation = (newReservation) => {
    setReservations(prev => [newReservation, ...prev]);
  };

  return { reservations, addReservation };
};

export default useReservations;