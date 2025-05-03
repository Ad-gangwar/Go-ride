"use client";

import { DirectionsDataContext } from "@/context/directions-data-context";
import { SelectedCarAmountContext } from "@/context/selected-car-amount-context";
import CarsList from "@/data/CarsList";
import Image from "next/image";
import { useContext, useState, useCallback } from "react";

// Define the Car type, ensuring consistency with CarsList
interface Car {
  id: number;
  name: string;
  image: string;
  charges: number;
}

export default function Cars() {
  const [selectedCar, setSelectedCar] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { directionsData } = useContext(DirectionsDataContext) ?? {};
  const { setCarAmount } = useContext(SelectedCarAmountContext) ?? {};

  const calculateCost = useCallback((charges: number) => {
    try {
      if (!directionsData?.routes || directionsData.routes.length === 0) {
        return { cost: "0.00", error: "Please select valid source and destination points" };
      }
      
      // Get the first route's first leg
      const route = directionsData.routes[0];
      if (!route.legs || route.legs.length === 0) {
        return { cost: "0.00", error: "Route information is incomplete" };
      }

      // Use the distance and duration directly from the route
      const distanceInKm = route.distance;
      const timeInMinutes = route.duration;
      
      // Base fare calculation
      const baseFare = 2.5; // Minimum fare
      const distanceFare = distanceInKm * charges; // Distance-based fare
      const timeFare = (timeInMinutes / 60) * charges * 0.5; // Time-based fare (half the rate of distance)
      const trafficMultiplier = 1.1; // 10% extra for traffic
      
      // Calculate total cost
      const totalCost = (baseFare + distanceFare + timeFare) * trafficMultiplier;
      
      return { 
        cost: totalCost.toFixed(2), 
        error: null 
      };
    } catch (error) {
      console.error('Error calculating cost:', error);
      return { cost: "0.00", error: "Error calculating fare. Please try again." };
    }
  }, [directionsData]);

  const handleCarSelect = useCallback((car: Car) => {
    setSelectedCar(car.id);
    const { cost, error } = calculateCost(car.charges);
    setError(error);
    if (setCarAmount && !error) {
      setCarAmount(cost);
    }
  }, [calculateCost, setCarAmount]);

  if (!directionsData) {
    return (
      <div className="my-3">
        <h2 className="font-medium text-[20px]">Select Car</h2>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-700 text-sm">Please select source and destination points to view available cars.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-medium text-[20px]">Select Car</h2>
        {selectedCar && (
          <div className="text-sm font-medium text-gray-600">
            Total Amount: <span className="text-green-600">${calculateCost(CarsList.find(c => c.id === selectedCar)?.charges || 0).cost}</span>
          </div>
        )}
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
        {CarsList.map((car: Car) => {
          return (
            <button
              type="button"
              key={car.id}
              className={`m-2 p-2 border-[1px] rounded-md hover:border-yellow-400 cursor-pointer transition-all duration-200 ${
                car.id === selectedCar ? "border-yellow-400 border-[2px] bg-yellow-50" : ""
              }`}
              onClick={() => handleCarSelect(car)}
            >
              <Image
                src={car.image}
                alt={car.name}
                width={75}
                height={75}
                className="mx-auto"
              />
              <div className="text-center mt-2">
                <p className="text-sm font-medium">{car.name}</p>
                <p className="text-xs text-gray-500">${car.charges}/km</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
