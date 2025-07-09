import React, { useRef, useEffect, useState } from 'react';

const ParkingCanvas = ({ parkingSpots, userLocation, selectedSpot }) => {
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 200 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvasSize;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set up canvas
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, width, height);
    
    if (!userLocation || !parkingSpots.length) return;

    // Calculate bounds
    const allPoints = [
      userLocation,
      ...parkingSpots.map(spot => ({ lat: spot.lat, lng: spot.lng }))
    ];
    
    const minLat = Math.min(...allPoints.map(p => p.lat));
    const maxLat = Math.max(...allPoints.map(p => p.lat));
    const minLng = Math.min(...allPoints.map(p => p.lng));
    const maxLng = Math.max(...allPoints.map(p => p.lng));
    
    const padding = 20;
    const scaleX = (width - padding * 2) / (maxLng - minLng);
    const scaleY = (height - padding * 2) / (maxLat - minLat);
    
    const scale = Math.min(scaleX, scaleY);
    
    // Convert coordinates to canvas position
    const toCanvasPos = (lat, lng) => {
      return {
        x: padding + (lng - minLng) * scale,
        y: height - padding - (lat - minLat) * scale
      };
    };
    
    // Draw user location
    const userPos = toCanvasPos(userLocation.lat, userLocation.lng);
    ctx.beginPath();
    ctx.arc(userPos.x, userPos.y, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#3b82f6';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw parking spots
    parkingSpots.forEach(spot => {
      const pos = toCanvasPos(spot.lat, spot.lng);
      
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = spot.available ? '#10b981' : '#ef4444';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Highlight selected spot
      if (selectedSpot && selectedSpot.id === spot.id) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 12, 0, 2 * Math.PI);
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      
      // Draw connection line for selected spot
      if (selectedSpot && selectedSpot.id === spot.id) {
        ctx.beginPath();
        ctx.moveTo(userPos.x, userPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });
    
    // Draw legend
    const legendY = height - 15;
    
    // User location legend
    ctx.beginPath();
    ctx.arc(15, legendY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#3b82f6';
    ctx.fill();
    ctx.fillStyle = '#374151';
    ctx.font = '12px sans-serif';
    ctx.fillText('You', 25, legendY + 4);
    
    // Available spots legend
    ctx.beginPath();
    ctx.arc(60, legendY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#10b981';
    ctx.fill();
    ctx.fillText('Available', 70, legendY + 4);
    
    // Occupied spots legend
    ctx.beginPath();
    ctx.arc(130, legendY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    ctx.fillText('Occupied', 140, legendY + 4);
    
  }, [parkingSpots, userLocation, selectedSpot, canvasSize]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Area Overview</h3>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="border border-gray-200 rounded-md w-full"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
};

export default ParkingCanvas;