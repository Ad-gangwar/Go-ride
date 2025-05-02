'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SelectedCarAmountContextType {
  carAmount: string | null;
  setCarAmount: (amount: string | null) => void;
}

export const SelectedCarAmountContext = createContext<SelectedCarAmountContextType>({
  carAmount: null,
  setCarAmount: () => {},
});

export const SelectedCarAmountProvider = ({ children }: { children: ReactNode }) => {
  const [carAmount, setCarAmount] = useState<string | null>(null);

  return (
    <SelectedCarAmountContext.Provider value={{ carAmount, setCarAmount }}>
      {children}
    </SelectedCarAmountContext.Provider>
  );
};

export const useSelectedCarAmount = () => useContext(SelectedCarAmountContext); 