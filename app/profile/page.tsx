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

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  [key: string]: string;
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

      const savedRides = localStorage.getItem('rideHistory');
      if (savedRides) {
        setRideHistory(JSON.parse(savedRides));
      } else {
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
    localStorage.setItem('userPhone', userData.phone);
    localStorage.setItem('userAddress', userData.address);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[90vh] flex flex-col items-center justify-center">
        <p className="mb-4 text-xl">Please log in to view your profile</p>
        <Link href="/login" className="px-5 py-2.5 text-base font-semibold bg-yellow-500 dark:0 rounded-md">
          Go to Login
        </Link>
      </div>
    );
  }

  const totalRides = rideHistory.length;
  const totalSpent = rideHistory.reduce((sum, ride) =>
    sum + parseFloat(ride.amount.replace('$', '')), 0).toFixed(2);
  const averageRating = rideHistory
    .filter(ride => ride.rating)
    .reduce((sum, ride) => sum + (ride.rating || 0), 0) /
    rideHistory.filter(ride => ride.rating).length || 0;

  return (
    <div className="min-h-screen py-8 px-4 md:px-8 text-sm">
      <div className="max-w-5xl w-full mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 shadow-all-lg p-6 rounded-lg ">
          <div className="col-span-1 dark:bg-gray-800 p-6 rounded-lg shadow-all-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-1.5 hover:text-yellow-500"
              >
                <Edit2 size={18} />
              </button>
            </div>

            <div className="mb-6 flex justify-center">
              {user.image ? (
                <Image
                  src={user.image}
                  alt="Profile"
                  width={90}
                  height={90}
                  className="rounded-full"
                />
              ) : (
                <div className="w-24 h-24 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <User size={36} className="text-yellow-500" />
                </div>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                {['firstName', 'lastName', 'email', 'phone', 'address'].map(field => (
                  <div key={field}>
                    <label className="block font-medium capitalize text-sm">{field.replace(/([A-Z])/g, ' $1')}</label>
                    <input
                      type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                      name={field}
                      value={(userData as UserData)[field]}
                      onChange={handleInputChange}
                      disabled={field === 'email'}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-all-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 text-sm"
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-3 border border-transparent rounded-md shadow-all-md font-medium bg-yellow-50 dark:0 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 text-sm"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="space-y-5">
                <div>
                  <p className="text-gray-500 text-sm">Username</p>
                  <p className="font-medium">{user.username}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Name</p>
                  <p className="font-medium">{userData.firstName} {userData.lastName}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Email</p>
                  <p className="font-medium">{userData.email}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Phone</p>
                  <p className="font-medium">{userData.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Address</p>
                  <p className="font-medium">{userData.address || 'Not provided'}</p>
                </div>
              </div>
            )}
          </div>

          <div className="col-span-1 lg:col-span-2 space-y-8">
            <div className="p-6 rounded-lg shadow-all-md">
              <h2 className="text-xl font-semibold mb-5">Ride Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { icon: MapPin, label: 'Total Rides', value: totalRides },
                  { icon: Star, label: 'Average Rating', value: averageRating.toFixed(1) },
                  { icon: Clock, label: 'Total Spent', value: `$${totalSpent}` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-yellow-50 dark:bg-gray-800 p-5 rounded-lg">
                    <div className="flex items-center mb-2.5">
                      <Icon className="text-yellow-500 mr-1.5" size={18} />
                      <h3 className="font-medium text-sm">{label}</h3>
                    </div>
                    <p className="text-2xl font-bold text-yellow-500">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-lg shadow-all-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recent Rides</h2>
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
                          <p className="text-sm text-gray-600">{ride.date} • Driver: {ride.driverName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-yellow-500 text-sm">{ride.amount}</p>
                          {ride.rating && (
                            <div className="flex items-center justify-end mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
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
                <p className="text-center py-4 text-sm">No ride history available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
