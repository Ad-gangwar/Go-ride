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
  
  useEffect(() => {
    if (user) {
      // Load ride history from localStorage
      const savedRides = localStorage.getItem('rideHistory');
      let rides: RideHistory[] = [];
      
      if (savedRides) {
        rides = JSON.parse(savedRides);
      } else {
        // Sample ride history data if none exists
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
  
  // Filter and sort rides
  useEffect(() => {
    let result = [...rideHistory];
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(ride => ride.status === filterStatus);
    }
    
    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      result = result.filter(ride => 
        ride.from.toLowerCase().includes(lowerCaseSearchTerm) ||
        ride.to.toLowerCase().includes(lowerCaseSearchTerm) ||
        ride.driverName.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
    
    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key] ?? '';
        const bValue = b[sortConfig.key] ?? '';
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
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
  
  // Export ride history as CSV
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
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Ride history exported successfully!');
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
        <p className="mb-4">Please log in to view your ride history</p>
        <Link href="/login" className="px-4 py-2 bg-yellow-500 rounded-md">
          Go to Login
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Ride History</h1>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search rides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 w-full"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 dark:text-gray-900" />
            </div>
            
            <div className="relative dark:text-gray-900">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 appearance-none"
              >
                <option value="all">All Rides</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 pointer-events-none" />
            </div>
            
            <button 
              onClick={exportToCSV}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 rounded-md hover:bg-yellow-600"
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
        
        {filteredRides.length > 0 ? (
          <div className="rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      <button
                        onClick={() => requestSort('date')}
                        className="flex items-center gap-1 hover:text-yellow-600"
                      >
                        <Calendar size={14} />
                        Date
                        {sortConfig?.key === 'date' && (
                          <ArrowUpDown size={14} className={sortConfig.direction === 'ascending' ? 'transform rotate-180' : ''} />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      <button
                        onClick={() => requestSort('driverName')}
                        className="flex items-center gap-1 hover:text-yellow-600"
                      >
                        Driver
                        {sortConfig?.key === 'driverName' && (
                          <ArrowUpDown size={14} className={sortConfig.direction === 'ascending' ? 'transform rotate-180' : ''} />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      <button
                        onClick={() => requestSort('amount')}
                        className="flex items-center gap-1 hover:text-yellow-600"
                      >
                        Amount
                        {sortConfig?.key === 'amount' && (
                          <ArrowUpDown size={14} className={sortConfig.direction === 'ascending' ? 'transform rotate-180' : ''} />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      <button
                        onClick={() => requestSort('status')}
                        className="flex items-center gap-1 hover:text-yellow-600"
                      >
                        Status
                        {sortConfig?.key === 'status' && (
                          <ArrowUpDown size={14} className={sortConfig.direction === 'ascending' ? 'transform rotate-180' : ''} />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Rating
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRides.map((ride) => (
                    <tr key={ride.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {ride.date}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="font-medium">{ride.from}</div>
                        <div className="">to</div>
                        <div className="font-medium">{ride.to}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {ride.driverName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-500">
                        {ride.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          ride.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {ride.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {ride.rating ? (
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={i < ride.rating! ? "text-yellow-500" : "text-gray-300"}
                                fill={i < ride.rating! ? "currentColor" : "none"}
                              />
                            ))}
                          </div>
                        ) : (
                          <span className="">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-lg shadow-md p-8 text-center">
            <p className="mb-4">No ride history found with the current filters.</p>
            {searchTerm || filterStatus !== 'all' ? (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                }}
                className="text-yellow-500 hover:underline"
              >
                Clear filters
              </button>
            ) : (
              <Link href="/" className="text-yellow-500 hover:underline">
                Book your first ride
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 