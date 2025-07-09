import React, { useState } from "react";
import { X, CreditCard, Clock, MapPin, DollarSign } from "lucide-react";

const PaymentModal = ({ spot, isOpen, onClose, onConfirm }) => {
  const [duration, setDuration] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);

  if (!isOpen || !spot) return null;

  const handlePayment = async () => {
    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setProcessing(false);
    // In the handlePayment function in PaymentModal:
    onConfirm({
      spot,
      duration,
      total: spot.price * duration,
      paymentMethod,
      reservationId: `RES-${Date.now()}`,
      timestamp: Date.now(), // Add this line
    });
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-transparent backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              Reserve Parking
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800">{spot.name}</h3>
                  <p className="text-sm text-gray-600">
                    {spot.distance}m away • {spot.walkingTime} min walk
                  </p>
                  <p className="text-sm text-gray-600 capitalize">
                    {spot.type} parking
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Parking Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {[1, 2, 3, 4, 8, 24].map((hours) => (
                  <option key={hours} value={hours}>
                    {hours} hour{hours > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CreditCard className="w-4 h-4 inline mr-1" />
                Payment Method
              </label>
              <div className="space-y-2">
                <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <CreditCard className="w-5 h-5 text-gray-600 mr-2" />
                  <span>Credit/Debit Card</span>
                </label>
                <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="wallet"
                    checked={paymentMethod === "wallet"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <DollarSign className="w-5 h-5 text-gray-600 mr-2" />
                  <span>Digital Wallet</span>
                </label>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">Rate per hour:</span>
                <span className="font-medium">${spot.price}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">Duration:</span>
                <span className="font-medium">
                  {duration} hour{duration > 1 ? "s" : ""}
                </span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">
                    Total:
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    ${(spot.price * duration).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  `Pay $${(spot.price * duration).toFixed(2)}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentModal;
