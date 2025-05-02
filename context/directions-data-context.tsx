'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Route {
  distance: number;
  duration: number;
  geometry: {
    type: string;
    coordinates: number[][];
  };
  legs: Array<{
    start_address: string;
    end_address: string;
  }>;
}

export interface DirectionsData {
  distance: number;
  duration: number;
  routes: Route[];
}

interface DirectionsDataContextType {
  directionsData: DirectionsData | null;
  setDirectionsData: (data: DirectionsData | null) => void;
}

export const DirectionsDataContext = createContext<DirectionsDataContextType>({
  directionsData: null,
  setDirectionsData: () => {},
});

export const DirectionsDataProvider = ({ children }: { children: ReactNode }) => {
  const [directionsData, setDirectionsData] = useState<DirectionsData | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load directions data from localStorage on component mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('directionsData');
      if (savedData) {
        setDirectionsData(JSON.parse(savedData));
      }
      setIsInitialized(true);
    } catch (error) {
      console.error('Error loading directions data from localStorage:', error);
      setIsInitialized(true);
    }
  }, []);

  // Save directions data to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        if (directionsData) {
          localStorage.setItem('directionsData', JSON.stringify(directionsData));
        } else {
          localStorage.removeItem('directionsData');
        }
      } catch (error) {
        console.error('Error saving directions data to localStorage:', error);
      }
    }
  }, [directionsData, isInitialized]);

  return (
    <DirectionsDataContext.Provider value={{ directionsData, setDirectionsData }}>
      {children}
    </DirectionsDataContext.Provider>
  );
};

export const useDirectionsData = () => useContext(DirectionsDataContext); 