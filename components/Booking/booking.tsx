"use client";

import { useContext } from "react";
import AutocompleteAddress from "./autocomplete-address";
import Cars from "./cars";
import PaymentCards from "./payment-cards";
import { useRouter } from "next/navigation";
import { SelectedCarAmountContext } from "@/context/selected-car-amount-context";

export default function Booking() {
  const router = useRouter();

  const { carAmount } = useContext(SelectedCarAmountContext) ?? {};

  const handleBookClick = () => {
    if (carAmount) {
      router.push(`/payment?amount=${carAmount}`);
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-[25px] font-semibold mb-3">Booking</h2>

      <div
        className="border-[1px] p-5
        rounded-md shadow-all-md"
      >
        <AutocompleteAddress />
        <Cars />
        <PaymentCards />
        <button
          type="submit"
          className={`w-full p-3 rounded-md mt-4 text-xl font-semibold ${
            carAmount ? "bg-yellow-400" : "bg-gray-200 cursor-not-allowed"
          }`}
          disabled={!carAmount}
          onClick={handleBookClick}
        >
          Book
        </button>
      </div>
    </div>
  );
}
