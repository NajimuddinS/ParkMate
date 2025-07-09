import React, { useState, useEffect } from "react";
import { useGeolocation } from "./hooks/useGeolocation";
import { useNetworkStatus } from "./hooks/useNetworkStatus";
import parkingService from "./services/parkingService";
import Header from "./components/Header";
import ParkingMap from "./components/ParkingMap";
import ParkingList from "./components/ParkingList";
import LocationDisplay from "./components/LocationDisplay";
import ParkingCanvas from "./components/ParkingCanvas";
import PaymentModal from "./components/PaymentModal";
import { MapPin, List, BarChart3, Clock } from "lucide-react";
import useReservation from "./hooks/useReservation";
import ReservationList from "./components/ReservationList";

function App() {
  const {
    location: userLocation,
    loading: locationLoading,
    error: locationError,
  } = useGeolocation();
  const networkStatus = useNetworkStatus();
  const { reservations, addReservation } = useReservation();
  const [parkingSpots, setParkingSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState("map");
  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    spot: null,
  });

  useEffect(() => {
    if (userLocation) {
      loadParkingSpots();

      const stopUpdates = parkingService.startBackgroundUpdates(
        userLocation,
        (spots) => setParkingSpots(spots)
      );

      return stopUpdates;
    }
  }, [userLocation]);

  const loadParkingSpots = async () => {
    if (!userLocation) return;

    setIsLoading(true);
    try {
      const spots = await parkingService.findParkingSpots(userLocation);
      setParkingSpots(spots);
    } catch (error) {
      console.error("Error loading parking spots:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpotSelect = (spot) => {
    setSelectedSpot(spot);
    if (spot.available) {
      setPaymentModal({ isOpen: true, spot });
    }
  };

  const handlePaymentConfirm = (paymentData) => {
    const reservationData = {
      ...paymentData,
      timestamp: Date.now()
    };
    addReservation(reservationData);
    setPaymentModal({ isOpen: false, spot: null });
    setSelectedSpot(paymentData.spot);
    setView("reservations"); // Redirect to reservations view after booking
  };

  const renderContent = () => {
    switch (view) {
      case "map":
        return (
          <div className="flex-1 relative z-0">
            <ParkingMap
              userLocation={userLocation}
              parkingSpots={parkingSpots}
              onSpotSelect={handleSpotSelect}
              selectedSpot={selectedSpot}
            />
            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 z-10">
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setView("list")}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  title="List View"
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setView("overview")}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  title="Overview"
                >
                  <BarChart3 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        );
      case "list":
        return (
          <div className="flex-1 overflow-y-auto">
            <ParkingList
              parkingSpots={parkingSpots}
              onSpotSelect={handleSpotSelect}
              selectedSpot={selectedSpot}
              userLocation={userLocation}
              isLoading={isLoading}
            />
          </div>
        );
      case "reservations":
        return (
          <div className="flex-1 p-4 overflow-y-auto">
            <ReservationList reservations={reservations} />
          </div>
        );
      case "overview":
        return (
          <div className="flex-1 p-4 space-y-4">
            <ParkingCanvas
              parkingSpots={parkingSpots}
              userLocation={userLocation}
              selectedSpot={selectedSpot}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Available Spots
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {parkingSpots.filter((spot) => spot.available).length}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Average Price
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  $
                  {parkingSpots.length > 0
                    ? (
                        parkingSpots.reduce(
                          (sum, spot) => sum + spot.price,
                          0
                        ) / parkingSpots.length
                      ).toFixed(2)
                    : "0.00"}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Closest Spot
                </h3>
                <p className="text-2xl font-bold text-purple-600">
                  {parkingSpots.length > 0
                    ? Math.min(...parkingSpots.map((spot) => spot.distance)) +
                      "m"
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header 
        userLocation={userLocation} 
        networkStatus={networkStatus}
        reservations={reservations}
        onViewChange={setView}
        currentView={view}
      />

      <main className="flex-1 flex flex-col relative">
        <div className="bg-white border-b border-gray-200 p-4">
          <LocationDisplay
            location={userLocation}
            loading={locationLoading}
            error={locationError}
            onRefresh={loadParkingSpots}
          />
        </div>

        <div className="flex-1 flex flex-col md:flex-row">
          <div className="flex-1 flex flex-col">{renderContent()}</div>

          <div className="md:w-96 bg-white border-l border-gray-200 p-4 overflow-y-auto">
            <div className="mb-4">
              <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setView("map")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-colors ${
                    view === "map"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  Map
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-colors ${
                    view === "list"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <List className="w-4 h-4" />
                  List
                </button>
                <button
                  onClick={() => setView("overview")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-colors ${
                    view === "overview"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Stats
                </button>
                <button
                  onClick={() => setView("reservations")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-colors ${
                    view === "reservations"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <div className="relative">
                    <Clock className="w-4 h-4" />
                    {reservations.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-3 w-3 flex items-center justify-center">
                        {reservations.length}
                      </span>
                    )}
                  </div>
                  Bookings
                </button>
              </div>
            </div>

            {view !== "list" && view !== "reservations" && (
              <ParkingList
                parkingSpots={parkingSpots.slice(0, 5)}
                onSpotSelect={handleSpotSelect}
                selectedSpot={selectedSpot}
                userLocation={userLocation}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </main>

      <PaymentModal
        spot={paymentModal.spot}
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ isOpen: false, spot: null })}
        onConfirm={handlePaymentConfirm}
      />
    </div>
  );
}

export default App;