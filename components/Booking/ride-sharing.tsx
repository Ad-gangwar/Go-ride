"use client";

import { useState, useEffect } from 'react';
import { User, Share2, Users, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

interface SharedRide {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  driver: string;
  totalFare: number;
  capacity: number;
  riders: {
    name: string;
    id: string;
  }[];
}

export default function RideSharing({ from, to, onFareChange }: { 
  from: string; 
  to: string;
  onFareChange: (discount: number) => void;
}) {
  const [isSharing, setIsSharing] = useState(false);
  const [availableSharedRides, setAvailableSharedRides] = useState<SharedRide[]>([]);
  const [selectedRide, setSelectedRide] = useState<string | null>(null);
  
  // Dummy data for shared rides
  useEffect(() => {
    // In a real app, this would be an API call to find rides that match the route
    if (from && to) {
      const dummySharedRides: SharedRide[] = [
        {
          id: '1',
          from: from,
          to: to,
          date: new Date().toLocaleDateString(),
          time: '14:30',
          driver: 'Alex Johnson',
          totalFare: 25.50,
          capacity: 4,
          riders: [
            { name: 'Sarah M.', id: 'u1' }
          ]
        },
        {
          id: '2',
          from: from,
          to: to,
          date: new Date().toLocaleDateString(),
          time: '15:15',
          driver: 'Maria Garcia',
          totalFare: 28.75,
          capacity: 3,
          riders: [
            { name: 'John D.', id: 'u2' },
            { name: 'Emma L.', id: 'u3' }
          ]
        }
      ];
      
      setAvailableSharedRides(dummySharedRides);
    }
  }, [from, to]);

  const handleSharingToggle = () => {
    setIsSharing(!isSharing);
    
    // Reset fare discount when toggling off
    if (isSharing) {
      onFareChange(0);
      setSelectedRide(null);
    }
    
    toast.success(isSharing 
      ? 'Ride sharing disabled' 
      : 'Ride sharing enabled - find people to share your ride and save money!');
  };

  const joinSharedRide = (rideId: string) => {
    // Update the selected ride
    setSelectedRide(rideId);
    
    // Find the selected ride to calculate fare
    const ride = availableSharedRides.find(r => r.id === rideId);
    if (ride) {
      // Calculate individual fare (total fare divided by number of riders + 1)
      const numberOfRiders = ride.riders.length + 1;
      const discount = ((numberOfRiders - 1) / numberOfRiders) * 100;
      
      // Pass the discount percentage to parent component
      onFareChange(discount);
      
      toast.success(`You joined a shared ride! Fare split ${numberOfRiders} ways (${Math.round(discount)}% discount).`);
    }
  };

  const createNewSharedRide = () => {
    toast.success('New shared ride created! Others can now join your ride.');
    // In a real app, this would create a new shared ride in the database
    
    // For now, we'll just simulate it with a 0% discount since you're the first rider
    onFareChange(0);
  };

  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Ride Sharing</h3>
        <button 
          onClick={handleSharingToggle}
          className={`flex items-center gap-2 px-3 py-2 rounded-md ${
            isSharing ? 'bg-yellow-400 text-black' : 'bg-gray-200'
          }`}
        >
          <Share2 size={18} />
          {isSharing ? 'Sharing On' : 'Share Ride'}
        </button>
      </div>
      
      {isSharing && (
        <div className="space-y-4">
          <p className="text-sm">
            <DollarSign className="inline-block mr-1" size={16} />
            Split the fare with others going the same way and save up to 50%!
          </p>
          
          <div>
            <h4 className="font-medium mb-2 mt-4">Available Shared Rides</h4>
            {availableSharedRides.length > 0 ? (
              <div className="space-y-3">
                {availableSharedRides.map((ride) => (
                  <div 
                    key={ride.id} 
                    className={`border p-3 rounded-md text-lg mb-5 cursor-pointer hover:border-yellow-400 ${
                      selectedRide === ride.id ? 'border-2 border-yellow-400' : ''
                    }`}
                    onClick={() => joinSharedRide(ride.id)}
                  >
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{ride.time}</span>
                      <span className="text-green-600 font-medium">
                        Save {Math.round(((ride.riders.length) / (ride.riders.length + 1)) * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-md mb-1">
                      <Users size={16} />
                      <span>{ride.riders.length}/{ride.capacity} riders</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {ride.riders.map((rider, idx) => (
                        <span key={idx} className="bg-gray-100 px-2 py-1 rounded-full text-xs flex items-center">
                          <User size={12} className="mr-1" />
                          {rider.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-md text-gray-500">No shared rides available for this route.</p>
            )}
            
            <button
              onClick={createNewSharedRide}
              className="w-full mt-4 p-2.5 border border-dashed border-yellow-400 rounded-md hover:bg-yellow-50 flex items-center justify-center gap-2"
            >
              <Share2 size={16} />
              Create new shared ride
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 