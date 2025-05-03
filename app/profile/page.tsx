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
      <div className="min-h-[90vh] flex flex-col items-center justify-center">
        <p className="mb-4 text-2xl">Please log in to view your profile</p>
        <Link href="/login" className="px-6 py-3 text-xl font-semibold bg-yellow-500 dark:0 rounded-md">
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
    <div className="min-h-screen py-10 px-6 md:px-10 text-base">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-4xl font-bold mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 shadow-all-lg p-7 rounded-lg ">
          {/* Profile Card */}
          <div className="col-span-1 dark:bg-gray-800 p-8 rounded-lg shadow-all-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Personal Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 hover:text-yellow-500"
              >
                <Edit2 size={20} />
              </button>
            </div>

            <div className="mb-8 flex justify-center">
              {user.image ? (
                <Image
                  src={user.image}
                  alt="Profile"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
              ) : (
                <div className="w-28 h-28 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <User size={44} className="text-yellow-500" />
                </div>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* All form fields */}
                {['firstName', 'lastName', 'email', 'phone', 'address'].map(field => (
                  <div key={field}>
                    <label className="block text-base font-medium capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                    <input
                      type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                      name={field}
                      value={(userData as any)[field]}
                      onChange={handleInputChange}
                      disabled={field === 'email'}
                      className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-all-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-all-md text-lg font-medium bg-yellow-50 dark:0 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="text-base text-gray-500">Username</p>
                  <p className="font-medium text-lg">{user.username}</p>
                </div>
                <div>
                  <p className="text-base text-gray-500">Name</p>
                  <p className="font-medium text-lg">{userData.firstName} {userData.lastName}</p>
                </div>
                <div>
                  <p className="text-base text-gray-500">Email</p>
                  <p className="font-medium text-lg">{userData.email}</p>
                </div>
                <div>
                  <p className="text-base text-gray-500">Phone</p>
                  <p className="font-medium text-lg">{userData.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-base text-gray-500">Address</p>
                  <p className="font-medium text-lg">{userData.address || 'Not provided'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Statistics & Recent Rides */}
          <div className="col-span-1 lg:col-span-2 space-y-10">
            {/* Statistics */}
            <div className="p-8 rounded-lg shadow-all-md">
              <h2 className="text-2xl font-semibold mb-6">Ride Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: MapPin, label: 'Total Rides', value: totalRides },
                  { icon: Star, label: 'Average Rating', value: averageRating.toFixed(1) },
                  { icon: Clock, label: 'Total Spent', value: `$${totalSpent}` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-yellow-50 dark:bg-gray-800 p-6 rounded-lg">
                    <div className="flex items-center mb-3">
                      <Icon className="text-yellow-500 mr-2" size={20} />
                      <h3 className="font-medium text-lg">{label}</h3>
                    </div>
                    <p className="text-3xl font-bold text-yellow-500">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Rides */}
            <div className="p-8 rounded-lg shadow-all-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Recent Rides</h2>
                <Link href="/ride-history" className="text-yellow-500 hover:underline text-base font-medium">
                  View All
                </Link>
              </div>

              {rideHistory.length > 0 ? (
                <div className="space-y-4">
                  {rideHistory.slice(0, 3).map(ride => (
                    <div key={ride.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium text-lg">{ride.from} to {ride.to}</p>
                          <p className="text-base text-gray-600">{ride.date} • Driver: {ride.driverName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-yellow-500 text-lg">{ride.amount}</p>
                          {ride.rating && (
                            <div className="flex items-center justify-end mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={i < (ride.rating ?? 0) ? "text-yellow-500" : "text-gray-300"}
                                  fill={i < (ride.rating ?? 0) ? "currentColor" : "none"}
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
                <p className="text-center py-6 text-base">No ride history available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}