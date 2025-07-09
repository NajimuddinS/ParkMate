import axios from 'axios';

const TOMTOM_API_KEY = import.meta.env.VITE_TOMTOM_API_KEY;

class ParkingService {
  constructor() {
    this.apiBaseUrl = 'https://api.tomtom.com/search/2/';
    this.cachedData = new Map();
    this.offlineData = this.loadOfflineData();
  }

  // Generate mock parking data for demonstration
  generateMockParkingData(center, radius = 1000) {
    const spots = [];
    const numSpots = 20;
    
    for (let i = 0; i < numSpots; i++) {
      const angle = (i / numSpots) * 2 * Math.PI;
      const distance = Math.random() * radius;
      const lat = center.lat + (distance * Math.cos(angle)) / 111320;
      const lng = center.lng + (distance * Math.sin(angle)) / (111320 * Math.cos(center.lat));
      
      spots.push({
        id: `spot-${i}`,
        lat,
        lng,
        name: `Parking Spot ${i + 1}`,
        available: Math.random() > 0.3,
        price: Math.floor(Math.random() * 5) + 1,
        distance: Math.floor(distance),
        walkingTime: Math.floor(distance / 80), // ~5 km/h walking speed
        type: ['street', 'garage', 'lot'][Math.floor(Math.random() * 3)],
        maxTime: [60, 120, 240, 480][Math.floor(Math.random() * 4)],
        amenities: this.generateAmenities(),
      });
    }
    
    return spots;
  }

  generateAmenities() {
    const allAmenities = ['covered', 'ev-charging', 'security', 'accessible', '24h'];
    const numAmenities = Math.floor(Math.random() * 3);
    const amenities = [];
    
    for (let i = 0; i < numAmenities; i++) {
      const randomAmenity = allAmenities[Math.floor(Math.random() * allAmenities.length)];
      if (!amenities.includes(randomAmenity)) {
        amenities.push(randomAmenity);
      }
    }
    
    return amenities;
  }

  async findParkingSpots(location, radius = 1000) {
    const cacheKey = `${location.lat},${location.lng},${radius}`;
    
    if (this.cachedData.has(cacheKey)) {
      return this.cachedData.get(cacheKey);
    }

    try {
      // For demonstration, we'll use mock data
      const spots = this.generateMockParkingData(location, radius);
      this.cachedData.set(cacheKey, spots);
      this.saveOfflineData(spots);
      return spots;
    } catch (error) {
      console.error('Error fetching parking spots:', error);
      return this.offlineData || [];
    }
  }

  async getTrafficInfo(location) {
    try {
      const response = await axios.get(
        `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json`,
        {
          params: {
            point: `${location.lat},${location.lng}`,
            key: TOMTOM_API_KEY,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching traffic info:', error);
      return null;
    }
  }

  calculateWalkingDistance(from, to) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = from.lat * Math.PI / 180;
    const φ2 = to.lat * Math.PI / 180;
    const Δφ = (to.lat - from.lat) * Math.PI / 180;
    const Δλ = (to.lng - from.lng) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }

  saveOfflineData(data) {
    try {
      localStorage.setItem('parkingOfflineData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  }

  loadOfflineData() {
    try {
      const data = localStorage.getItem('parkingOfflineData');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading offline data:', error);
      return [];
    }
  }

  // Background task to update parking data
  startBackgroundUpdates(location, callback) {
    const updateInterval = setInterval(async () => {
      try {
        const spots = await this.findParkingSpots(location);
        callback(spots);
      } catch (error) {
        console.error('Background update error:', error);
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(updateInterval);
  }
}

export default new ParkingService();