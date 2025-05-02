'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface SelectedCarAmountContextType {
  carAmount: string | null;
  setCarAmount: (amount: string | null) => void;
}

export const SelectedCarAmountContext = createContext<SelectedCarAmountContextType>({
  carAmount: null,
  setCarAmount: () => {},
});

export const SelectedCarAmountProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state from localStorage if available
  const [carAmount, setCarAmount] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedCarAmount');
    }
    return null;
  });

  // Update localStorage when carAmount changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (carAmount) {
        localStorage.setItem('selectedCarAmount', carAmount);
      } else {
        localStorage.removeItem('selectedCarAmount');
      }
    }
  }, [carAmount]);


  return (
    <SelectedCarAmountContext.Provider value={{ carAmount, setCarAmount }}>
      {children}
    </SelectedCarAmountContext.Provider>
  );
};

export const useSelectedCarAmount = () => useContext(SelectedCarAmountContext); 