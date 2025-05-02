'use client';

import { useState } from 'react';
import Image from 'next/image';
import { UserPlus, Users } from 'lucide-react';

interface RideType {
  id: string;
  name: string;
  description: string;
  image: string;
  multiplier: number;
  capacity: number;
  isShared: boolean;
}

interface RideTypeSelectorProps {
  basePrice: number;
  onSelectRideType: (rideType: RideType, isShared: boolean) => void;
  selectedRideTypeId: string | null;
}

export default function RideTypeSelector({
  basePrice,
  onSelectRideType,
  selectedRideTypeId
}: RideTypeSelectorProps) {
  const [isSharing, setIsSharing] = useState(false);
  
  const rideTypes: RideType[] = [
    {
      id: 'economy',
      name: 'Economy',
      description: 'Affordable rides for everyday use',
      image: '/car-economy.png',
      multiplier: 1.0,
      capacity: 4,
      isShared: false
    },
    {
      id: 'comfort',
      name: 'Comfort',
      description: 'More room, top-rated drivers',
      image: '/car-comfort.png',
      multiplier: 1.5,
      capacity: 4,
      isShared: false
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Luxury vehicles, professional drivers',
      image: '/car-premium.png',
      multiplier: 2.0,
      capacity: 4,
      isShared: false
    },
    {
      id: 'xl',
      name: 'XL',
      description: 'Spacious vehicles for large groups',
      image: '/car-xl.png',
      multiplier: 2.5,
      capacity:
      6,
      isShared: false
    }
  ];
  
  // Add shared versions of the ride types
  const sharedRideTypes = rideTypes.map(type => ({
    ...type,
    id: `${type.id}-shared`,
    name: `Shared ${type.name}`,
    description: 'Split the fare with others going your way',
    multiplier: type.multiplier * 0.65, // 35% discount for shared rides
    isShared: true
  }));
  
  // Combine regular and shared ride types based on user selection
  const displayedRideTypes = isSharing ? sharedRideTypes : rideTypes;
  
  const handleRideTypeSelect = (rideType: RideType) => {
    onSelectRideType(rideType, isSharing);
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="flex border rounded-lg overflow-hidden">
        <button
          className={`flex-1 py-2 px-4 text-center ${!isSharing ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700'}`}
          onClick={() => setIsSharing(false)}
        >
          <span className="flex items-center justify-center gap-1">
            <Users size={16} />
            Regular
          </span>
        </button>
        <button
          className={`flex-1 py-2 px-4 text-center ${isSharing ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700'}`}
          onClick={() => setIsSharing(true)}
        >
          <span className="flex items-center justify-center gap-1">
            <UserPlus size={16} />
            Shared
          </span>
        </button>
      </div>
      
      <p className="text-sm text-gray-500">
        {isSharing 
          ? 'Share your ride with others going the same way and save up to 35%' 
          : 'Choose a ride type that suits your needs'}
      </p>
      
      <div className="space-y-2">
        {displayedRideTypes.map((rideType) => (
          <div
            key={rideType.id}
            className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:border-yellow-500 transition-colors ${
              selectedRideTypeId === rideType.id ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'
            }`}
            onClick={() => handleRideTypeSelect(rideType)}
          >
            <div className="flex items-center">
              <div className="w-16 h-12 relative mr-3">
                <Image
                  src={rideType.image}
                  alt={rideType.name}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{rideType.name}</h3>
                <p className="text-xs text-gray-500">{rideType.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-yellow-500">
                ${(basePrice * rideType.multiplier).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">{rideType.capacity} seats</p>
              {rideType.isShared && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  <UserPlus size={12} className="mr-1" />
                  Shared
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 