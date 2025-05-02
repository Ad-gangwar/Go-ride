"use client";

import { DirectionsDataContext } from "@/context/directions-data-context";
import { SelectedCarAmountContext } from "@/context/selected-car-amount-context";
import CarsList from "@/data/CarsList";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useContext, useState, useEffect, useCallback, useMemo } from "react";

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
  const [isLoading, setIsLoading] = useState(true);
  const { directionsData } = useContext(DirectionsDataContext) ?? {};
  const { setCarAmount } = useContext(SelectedCarAmountContext) ?? {};

  useEffect(() => {
    if (directionsData) {
      setIsLoading(false);
    }
  }, [directionsData]);

  const calculateCost = useCallback((charges: number) => {
    try {
      if (!directionsData?.routes || directionsData.routes.length === 0) {
        return { cost: "0.00", error: "Please select valid source and destination points" };
      }
      const distanceInKm = directionsData.routes[0].distance / 1000;
      const timeInMinutes = directionsData.routes[0].duration / 60;
      const trafficMultiplier = 1.2;
      const cost = charges * (distanceInKm + timeInMinutes * 0.1) * trafficMultiplier;
      return { cost: cost.toFixed(2), error: null };
    } catch (error) {
      console.error('Error calculating cost:', error);
      return { cost: "0.00", error: "Error calculating fare. Please try again." };
    }
  }, [directionsData]);

  const handleCarSelect = useCallback((car: Car) => {
    setSelectedCar(car.id);
    const { cost, error } = calculateCost(car.charges);
    setError(error);
    if (setCarAmount) {
      setCarAmount(cost);
    }
  }, [calculateCost, setCarAmount]);

  if (isLoading) {
    return (
      <div className="mt-3">
        <h2 className="font-medium text-[14px]">Select Car</h2>
        <div className="flex items-center justify-center p-4">
          <Loader2 className="w-6 h-6 animate-spin text-yellow-500" />
          <span className="ml-2 text-gray-600">Loading car options...</span>
        </div>
      </div>
    );
  }

  if (!directionsData) {
    return (
      <div className="mt-3">
        <h2 className="font-medium text-[14px]">Select Car</h2>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-700 text-sm">Please select source and destination points to view available cars.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <h2 className="font-medium text-[14px]">Select Car</h2>
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
