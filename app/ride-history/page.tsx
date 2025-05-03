'use client';

import { useAuth } from '@/context/auth-context';
import { useState, useEffect } from 'react';
import { Loader2, Star, Search, ChevronDown, ArrowUpDown, Calendar, Download } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface RideHistory {
  id: string;
  date: string;
  from: string;
  to: string;
  amount: string;
  driverName: string;
  rating?: number;
  status: 'completed' | 'cancelled';
  paymentMethod: string;
  feedback?: string;
  feedbackSubmitted?: boolean;
}

export default function RideHistoryPage() {
  const { user, loading } = useAuth();
  const [rideHistory, setRideHistory] = useState<RideHistory[]>([]);
  const [filteredRides, setFilteredRides] = useState<RideHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof RideHistory;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'cancelled'>('all');
  const [selectedRide, setSelectedRide] = useState<RideHistory | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(0);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    if (user) {
      const savedRides = localStorage.getItem('rideHistory');
      let rides: RideHistory[] = [];

      if (savedRides) {
        rides = JSON.parse(savedRides);
      } else {
        rides = [
          {
            id: '1',
            date: '2023-10-20',
            from: '123 Main St',
            to: 'Downtown Plaza',
            amount: '$12.50',
            driverName: 'John Driver',
            rating: 4,
            status: 'completed',
            paymentMethod: 'Credit Card'
          },
          {
            id: '2',
            date: '2023-10-18',
            from: 'Office Complex',
            to: 'Shopping Mall',
            amount: '$18.25',
            driverName: 'Sarah Smith',
            rating: 5,
            status: 'completed',
            paymentMethod: 'PayPal'
          },
          {
            id: '3',
            date: '2023-10-15',
            from: 'Airport Terminal',
            to: 'Grand Hotel',
            amount: '$35.75',
            driverName: 'Mike Johnson',
            rating: 3,
            status: 'completed',
            paymentMethod: 'Cash'
          },
          {
            id: '4',
            date: '2023-10-12',
            from: 'University Campus',
            to: 'City Library',
            amount: '$8.90',
            driverName: 'Emily Davis',
            status: 'cancelled',
            paymentMethod: 'Credit Card'
          },
          {
            id: '5',
            date: '2023-10-10',
            from: 'Central Park',
            to: 'Museum of History',
            amount: '$15.30',
            driverName: 'Robert Wilson',
            rating: 4,
            status: 'completed',
            paymentMethod: 'Wallet'
          }
        ];
        localStorage.setItem('rideHistory', JSON.stringify(rides));
      }

      setRideHistory(rides);
      setFilteredRides(rides);
    }
  }, [user]);

  useEffect(() => {
    let result = [...rideHistory];

    if (filterStatus !== 'all') {
      result = result.filter(ride => ride.status === filterStatus);
    }

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      result = result.filter(ride =>
        ride.from.toLowerCase().includes(lowerCaseSearchTerm) ||
        ride.to.toLowerCase().includes(lowerCaseSearchTerm) ||
        ride.driverName.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key] ?? '';
        const bValue = b[sortConfig.key] ?? '';
        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }

    setFilteredRides(result);
  }, [rideHistory, searchTerm, sortConfig, filterStatus]);

  const requestSort = (key: keyof RideHistory) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const exportToCSV = () => {
    const headers = ['Date', 'From', 'To', 'Amount', 'Driver', 'Status', 'Payment Method', 'Rating'];
    const csvRows = [
      headers.join(','),
      ...filteredRides.map(ride =>
        [
          ride.date,
          `"${ride.from}"`,
          `"${ride.to}"`,
          ride.amount,
          `"${ride.driverName}"`,
          ride.status,
          ride.paymentMethod,
          ride.rating || 'N/A'
        ].join(',')
      )
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'ride_history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Ride history exported successfully!');
  };

  const handleFeedbackSubmit = (ride: RideHistory) => {
    const updatedRides = rideHistory.map(r => {
      if (r.id === ride.id) {
        return {
          ...r,
          rating,
          feedback: feedbackText,
          feedbackSubmitted: true
        };
      }
      return r;
    });

    setRideHistory(updatedRides);
    localStorage.setItem('rideHistory', JSON.stringify(updatedRides));
    setShowFeedbackModal(false);
    setFeedbackText('');
    setRating(0);
    toast.success('Feedback submitted successfully!');
  };

  const openFeedbackModal = (ride: RideHistory) => {
    setSelectedRide(ride);
    setRating(ride.rating || 0);
    setFeedbackText(ride.feedback || '');
    setShowFeedbackModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-lg">
        <p className="mb-4">Please log in to view your ride history</p>
        <Link href="/login" className="px-4 py-2 bg-yellow-500 rounded-md text-lg font-semibold">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 mt-5 md:px-8 text-lg">
      <div className="max-w-[1500px] mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <h1 className="text-4xl font-bold mb-4 md:mb-0">Ride History</h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search rides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-lg pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 w-full"
              />
              <Search className="absolute left-3 top-3 h-5 w-5 dark:text-gray-900" />
            </div>
            <div className="relative dark:text-gray-900">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="text-lg pl-4 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 appearance-none"
              >
                <option value="all">All Rides</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 h-5 w-5 pointer-events-none" />
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 rounded-md hover:bg-yellow-600 text-lg font-medium"
            >
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        {filteredRides.length > 0 ? (
          <div className="rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-lg">
                <thead>
                  <tr className="bg-yellow-500">
                    <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">
                      <button onClick={() => requestSort('date')} className="flex items-center gap-2 hover:text-yellow-600">
                        <Calendar size={18} /> Date
                        {sortConfig?.key === 'date' && (
                          <ArrowUpDown size={18} className={sortConfig.direction === 'ascending' ? 'rotate-180' : ''} />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">Route</th>
                    <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">
                      <button onClick={() => requestSort('driverName')} className="flex items-center gap-2 hover:text-yellow-600">
                        Driver
                        {sortConfig?.key === 'driverName' && (
                          <ArrowUpDown size={18} className={sortConfig.direction === 'ascending' ? 'rotate-180' : ''} />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">
                      <button onClick={() => requestSort('amount')} className="flex items-center gap-2 hover:text-yellow-600">
                        Amount
                        {sortConfig?.key === 'amount' && (
                          <ArrowUpDown size={18} className={sortConfig.direction === 'ascending' ? 'rotate-180' : ''} />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">
                      <button onClick={() => requestSort('status')} className="flex items-center gap-2 hover:text-yellow-600">
                        Status
                        {sortConfig?.key === 'status' && (
                          <ArrowUpDown size={18} className={sortConfig.direction === 'ascending' ? 'rotate-180' : ''} />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRides.map((ride) => (
                    <tr key={ride.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{ride.date}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{ride.from}</div>
                        <div>to</div>
                        <div className="font-medium">{ride.to}</div>
                      </td>
                      <td className="px-6 py-4">{ride.driverName}</td>
                      <td className="px-6 py-4 font-medium text-yellow-600">{ride.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 inline-flex font-semibold rounded-full ${
                          ride.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">{ride.paymentMethod}</td>
                      <td className="px-6 py-4">
                        {ride.rating ? (
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={18}
                                className={i < ride.rating ? "text-yellow-500" : "text-gray-300"}
                                fill={i < ride.rating ? "currentColor" : "none"}
                              />
                            ))}
                          </div>
                        ) : (
                          <span>N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {ride.status === 'completed' && !ride.feedbackSubmitted && (
                          <button
                            onClick={() => openFeedbackModal(ride)}
                            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                          >
                            Give Feedback
                          </button>
                        )}
                        {ride.feedbackSubmitted && (
                          <span className="text-green-600 font-medium">Feedback Submitted</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-lg shadow-md p-8 text-center text-xl font-medium">
            <p className="mb-4">No ride history found with the current filters.</p>
          </div>
        )}

        {/* Feedback Modal */}
        {showFeedbackModal && selectedRide && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Rate Your Ride</h3>
              <div className="mb-4">
                <p className="mb-2">Driver: {selectedRide.driverName}</p>
                <p className="mb-2">Route: {selectedRide.from} to {selectedRide.to}</p>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Rating:</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Feedback:</label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  rows={4}
                  placeholder="Share your experience..."
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleFeedbackSubmit(selectedRide)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
