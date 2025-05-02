'use client';

import { useAuth } from '@/context/auth-context';
import { useState, useEffect } from 'react';
import { Loader2, Edit2, User, MapPin, Star, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';

interface RideHistory {
  id: string;
  date: string;
  from: string;
  to: string;
  amount: string;
  driverName: string;
  rating?: number;
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [rideHistory, setRideHistory] = useState<RideHistory[]>([]);
  
  useEffect(() => {
    if (user) {
      setUserData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: localStorage.getItem('userPhone') || '',
        address: localStorage.getItem('userAddress') || ''
      });
      
      // Load ride history from localStorage
      const savedRides = localStorage.getItem('rideHistory');
      if (savedRides) {
        setRideHistory(JSON.parse(savedRides));
      } else {
        // Sample ride history data if none exists
        const sampleRides = [
          {
            id: '1',
            date: '2023-10-20',
            from: '123 Main St',
            to: 'Downtown Plaza',
            amount: '$12.50',
            driverName: 'John Driver',
            rating: 4
          },
          {
            id: '2',
            date: '2023-10-18',
            from: 'Office Complex',
            to: 'Shopping Mall',
            amount: '$18.25',
            driverName: 'Sarah Smith',
            rating: 5
          }
        ];
        setRideHistory(sampleRides);
        localStorage.setItem('rideHistory', JSON.stringify(sampleRides));
      }
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to localStorage for persistence
    localStorage.setItem('userPhone', userData.phone);
    localStorage.setItem('userAddress', userData.address);
    
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="mb-4">Please log in to view your profile</p>
        <Link href="/login" className="px-4 py-2 bg-yellow-500 text-white rounded-md">
          Go to Login
        </Link>
      </div>
    );
  }

  // Calculate ride statistics
  const totalRides = rideHistory.length;
  const totalSpent = rideHistory.reduce((sum, ride) => 
    sum + parseFloat(ride.amount.replace('$', '')), 0).toFixed(2);
  const averageRating = rideHistory
    .filter(ride => ride.rating)
    .reduce((sum, ride) => sum + (ride.rating || 0), 0) / 
    rideHistory.filter(ride => ride.rating).length || 0;

  return (
    <div className="min-h-screen py-8 px-4 md:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="col-span-1 bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 text-gray-500 hover:text-yellow-500"
              >
                <Edit2 size={18} />
              </button>
            </div>
            
            <div className="mb-6 flex justify-center">
              {user.image ? (
                <Image 
                  src={user.image} 
                  alt="Profile" 
                  width={100} 
                  height={100} 
                  className="rounded-full"
                />
              ) : (
                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center">
                  <User size={40} className="text-yellow-500" />
                </div>
              )}
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={userData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={userData.address}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="font-medium">{user.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{userData.firstName} {userData.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{userData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{userData.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{userData.address || 'Not provided'}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Statistics & Recent Rides */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            {/* Statistics */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Ride Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <MapPin className="text-yellow-500 mr-2" size={18} />
                    <h3 className="font-medium text-gray-700">Total Rides</h3>
                  </div>
                  <p className="text-2xl font-bold text-yellow-500">{totalRides}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Star className="text-yellow-500 mr-2" size={18} />
                    <h3 className="font-medium text-gray-700">Average Rating</h3>
                  </div>
                  <p className="text-2xl font-bold text-yellow-500">{averageRating.toFixed(1)}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="text-yellow-500 mr-2" size={18} />
                    <h3 className="font-medium text-gray-700">Total Spent</h3>
                  </div>
                  <p className="text-2xl font-bold text-yellow-500">${totalSpent}</p>
                </div>
              </div>
            </div>
            
            {/* Recent Rides */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Recent Rides</h2>
                <Link href="/ride-history" className="text-yellow-500 hover:underline text-sm font-medium">
                  View All
                </Link>
              </div>
              
              {rideHistory.length > 0 ? (
                <div className="space-y-3">
                  {rideHistory.slice(0, 3).map(ride => (
                    <div key={ride.id} className="border-b pb-3 last:border-b-0">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{ride.from} to {ride.to}</p>
                          <p className="text-sm text-gray-500">{ride.date} • Driver: {ride.driverName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-yellow-500">{ride.amount}</p>
                          {ride.rating && (
                            <div className="flex items-center justify-end">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={14} 
                                  className={i < ride.rating! ? "text-yellow-500" : "text-gray-300"} 
                                  fill={i < ride.rating! ? "currentColor" : "none"}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No ride history available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 