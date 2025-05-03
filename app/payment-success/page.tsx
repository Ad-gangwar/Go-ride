'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CheckCircle2, Clock, MapPin, Car } from 'lucide-react';

export default function PaymentSuccessPage({
  searchParams: { amount, source, destination, carType },
}: Readonly<{
  searchParams: { amount: string; source: string; destination: string; carType: string };
}>) {
  const router = useRouter();
  const formattedAmount = amount ? parseFloat(amount).toFixed(2) : "0.00";

  useEffect(() => {
    // Redirect to home after 10 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen my-12 flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-8 text-white text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold mb-2">Payment Successful!</h1>
          <div className="text-3xl font-bold mt-4">
            ₹{formattedAmount}
          </div>
        </div>

        <div className="p-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <MapPin className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">From</p>
                <p className="font-medium">{source || 'Pickup Location'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <MapPin className="w-6 h-6 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">To</p>
                <p className="font-medium">{destination || 'Drop Location'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Car className="w-6 h-6 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-500">Vehicle</p>
                <p className="font-medium">{carType || 'Selected Car'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Clock className="w-6 h-6 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Booking Time</p>
                <p className="font-medium">{new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={() => router.push('/')}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Go to Home
            </button>
            <button
              onClick={() => router.push('/ride-history')}
              className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              View Ride History
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            You will be redirected to the home page in 10 seconds...
          </p>
        </div>
      </div>
    </main>
  );
}
