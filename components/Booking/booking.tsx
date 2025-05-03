"use client";

import { useContext, useState } from "react";
import AutocompleteAddress from "./autocomplete-address";
import Cars from "./cars";
import PaymentCards from "./payment-cards";
import RideSharing from "./ride-sharing";
import { useRouter } from "next/navigation";
import { SelectedCarAmountContext } from "@/context/selected-car-amount-context";
import toast from "react-hot-toast";

export default function Booking() {
  const router = useRouter();
  const { carAmount } = useContext(SelectedCarAmountContext) ?? {};
  const [fareDiscount, setFareDiscount] = useState(0);
  const [sourceAddress, setSourceAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");

  // Calculate discounted fare with safe type checking - carAmount is a string in context
  const numericCarAmount = carAmount ? parseFloat(carAmount) : 0;
  
  // Apply discount by calculating what the user pays (numericCarAmount * percentage to pay)
  const discountedAmount = numericCarAmount * ((100 - fareDiscount) / 100);
  const formattedDiscountedAmount = discountedAmount.toFixed(2);

  // Calculate actual savings amount
  const savingsAmount = numericCarAmount - discountedAmount;

  const handleBookClick = () => {
    if (numericCarAmount > 0) {
      // Make sure we're passing the discounted amount as the main amount parameter
      // and the original amount as originalAmount
      router.push(`/payment?amount=${formattedDiscountedAmount}&originalAmount=${numericCarAmount.toFixed(2)}&carType=${encodeURIComponent('Standard')}`);
    } else {
      toast.error("Please select a ride first");
    }
  };

  // Handle address changes from AutocompleteAddress component
  const handleAddressChange = (source: string, destination: string) => {
    setSourceAddress(source);
    setDestinationAddress(destination);
  };

  // Handle fare discount changes from RideSharing
  const handleFareDiscountChange = (discount: number) => {
    setFareDiscount(discount);
    if (discount > 0) {
      toast.success(`Ride sharing applied: ${Math.round(discount)}% discount`);
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-[25px] font-semibold mb-3">Booking</h2>

      <div
        className="border-[1px] p-6
        rounded-md shadow-all-md"
      >
        <AutocompleteAddress onAddressChange={handleAddressChange} />
        <Cars />
        
        {sourceAddress && destinationAddress && (
          <RideSharing 
            from={sourceAddress} 
            to={destinationAddress} 
            onFareChange={handleFareDiscountChange} 
          />
        )}
        
        <PaymentCards />
        
        {fareDiscount > 0 && numericCarAmount > 0 && (
          <div className="mt-4 bg-green-50 p-3 rounded-md">
            <p className="text-sm font-medium text-green-800">Ride sharing discount applied!</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 line-through">${numericCarAmount.toFixed(2)}</span>
              <span className="text-lg font-bold text-green-700">${formattedDiscountedAmount}</span>
            </div>
            <p className="text-xs text-green-600">You save ${savingsAmount.toFixed(2)} ({Math.round(fareDiscount)}% off)</p>
          </div>
        )}
        
        <button
          type="submit"
          className={`w-full p-3 rounded-md mt-4 text-xl font-semibold ${
            numericCarAmount > 0 ? "bg-yellow-400 hover:bg-yellow-500" : "bg-gray-200 cursor-not-allowed"
          }`}
          disabled={numericCarAmount <= 0}
          onClick={handleBookClick}
        >
          {numericCarAmount > 0 ? `Book for $${formattedDiscountedAmount}` : 'Select a car first'}
        </button>
      </div>
    </div>
  );
}
