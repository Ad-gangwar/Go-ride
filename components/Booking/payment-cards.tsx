import CardsList from "@/data/CardsList";
import Image from "next/image";
import { useState } from "react";

// Define the Card type, ensuring consistency with CardsList
interface Card {
  id: number;
  name: string;
  image: string;
}

export default function PaymentCards() {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  return (
    <div className="mb-4">
      <h2 className="text-[15px] font-medium mt-4">Payment Methods</h2>
      <div className="grid grid-cols-5 md:grid-cols-4 lg:grid-cols-5 mt-2 pl-2">
        {CardsList.map((card: Card) => {
          return (
            <button
              type="button"
              key={card.id}
              className={`w-[50px] mb-1 border-[1px] flex items-center justify-center rounded-md cursor-pointer hover:border-yellow-400 hover:scale-110 transition-all ${
                activeIndex == card.id ? "border-yellow-400 border-[2px]" : ""
              }`}
              onClick={() => setActiveIndex(card.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setActiveIndex(card.id);
                }
              }}
              aria-label={`Select ${card.name} card`}
            >
              <Image src={card.image} alt={card.name} width={30} height={50} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
