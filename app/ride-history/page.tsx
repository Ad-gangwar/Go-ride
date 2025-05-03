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

type FilterStatus = 'all' | 'completed' | 'cancelled';

export default function RideHistoryPage() {
  const { user, loading } = useAuth();
  const [rideHistory, setRideHistory] = useState<RideHistory[]>([]);
  const [filteredRides, setFilteredRides] = useState<RideHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof RideHistory;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
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
      <div className="min-h-[90vh] flex flex-col items-center justify-center text-lg">
        <p className="mb-4 text-2xl">Please log in to view your ride history</p>
        <Link href="/login" className="px-6 py-3 bg-yellow-500 rounded-md text-xl font-semibold">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 px-4 mt-4 md:px-6 text-base">
      <div className="max-w-5xl w-full mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">Ride History</h1>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search rides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-sm pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 w-full"
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 dark:text-gray-900" />
            </div>
            <div className="relative dark:text-gray-900">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                className="text-sm pl-3 pr-8 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 appearance-none"
              >
                <option value="all">All Rides</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 pointer-events-none" />
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-yellow-500 rounded-md hover:bg-yellow-600 text-sm font-medium"
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {filteredRides.length > 0 ? (
          <div className="rounded-lg shadow-md overflow-hidden max-w-full">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-yellow-500">
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-xs">
                      <button onClick={() => requestSort('date')} className="flex items-center gap-1 hover:text-yellow-600">
                        <Calendar size={14} /> Date
                        {sortConfig?.key === 'date' && (
                          <ArrowUpDown size={14} className={sortConfig.direction === 'ascending' ? 'rotate-180' : ''} />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-xs">Route</th>
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-xs">
                      <button onClick={() => requestSort('driverName')} className="flex items-center gap-1 hover:text-yellow-600">
                        Driver
                        {sortConfig?.key === 'driverName' && (
                          <ArrowUpDown size={14} className={sortConfig.direction === 'ascending' ? 'rotate-180' : ''} />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-xs">
                      <button onClick={() => requestSort('amount')} className="flex items-center gap-1 hover:text-yellow-600">
                        Amount
                        {sortConfig?.key === 'amount' && (
                          <ArrowUpDown size={14} className={sortConfig.direction === 'ascending' ? 'rotate-180' : ''} />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-xs">
                      <button onClick={() => requestSort('status')} className="flex items-center gap-1 hover:text-yellow-600">
                        Status
                        {sortConfig?.key === 'status' && (
                          <ArrowUpDown size={14} className={sortConfig.direction === 'ascending' ? 'rotate-180' : ''} />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-xs">Payment</th>
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-xs">Rating</th>
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRides.map((ride) => (
                    <tr key={ride.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{ride.date}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-xs">{ride.from}</div>
                        <div className="text-xs">to</div>
                        <div className="font-medium text-xs">{ride.to}</div>
                      </td>
                      <td className="px-4 py-3">{ride.driverName}</td>
                      <td className="px-4 py-3 font-medium text-yellow-600">{ride.amount}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                          ride.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">{ride.paymentMethod}</td>
                      <td className="px-4 py-3">
                        {ride.rating ? (
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={i < (ride.rating ?? 0) ? "text-yellow-500" : "text-gray-300"}
                                fill={i < (ride.rating ?? 0) ? "currentColor" : "none"}
                              />
                            ))}
                          </div>
                        ) : (
                          <span>N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {ride.status === 'completed' && !ride.feedbackSubmitted && (
                          <button
                            onClick={() => openFeedbackModal(ride)}
                            className="px-3 py-1.5 bg-yellow-500 text-white text-xs rounded-md hover:bg-yellow-600 transition-colors"
                          >
                            Give Feedback
                          </button>
                        )}
                        {ride.feedbackSubmitted && (
                          <span className="text-green-600 font-medium text-xs">Feedback Submitted</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-lg shadow-md p-6 text-center text-base font-medium">
            <p className="mb-3">No ride history found with the current filters.</p>
          </div>
        )}

        {/* Feedback Modal */}
        {showFeedbackModal && selectedRide && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg max-w-md w-full">
              <h3 className="text-lg font-semibold mb-3">Rate Your Ride</h3>
              <div className="mb-3">
                <p className="mb-1 text-sm">Driver: {selectedRide.driverName}</p>
                <p className="mb-1 text-sm">Route: {selectedRide.from} to {selectedRide.to}</p>
              </div>
              <div className="mb-3">
                <label className="block mb-1 text-sm">Rating:</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <label className="block mb-1 text-sm">Feedback:</label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  rows={3}
                  placeholder="Share your experience..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-3 py-1.5 text-sm bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleFeedbackSubmit(selectedRide)}
                  className="px-3 py-1.5 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
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
