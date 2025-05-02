"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { DirectionsDataContext } from '@/context/directions-data-context';
import { useContext } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckOutForm from '@/components/Payment/check-out-form';
import { convertToSubcurrency } from "@/utils/subCurrency";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_PUBLISHABLE_KEY || '');

// Set to true to bypass actual payment processing (for demo purposes or regions with restrictions)
const DEMO_MODE = false;

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const { directionsData } = useContext(DirectionsDataContext) ?? {};
  const [isMounted, setIsMounted] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const amount = searchParams.get('amount') || '0.00';
  const carType = searchParams.get('carType') || 'Selected Car';
  
  // Convert amount to number for the checkout form
  const amountValue = parseFloat(amount);
  
  // Convert USD to INR (approximate conversion - in a real app, use an API)
  const inrAmount = (amountValue * 75).toFixed(2); // Approximate conversion rate

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const createPaymentIntent = async (amount: number) => {
    setIsLoading(true);
    try {
      // In demo mode, simulate successful payment intent
      if (DEMO_MODE) {
        // Simulate a delay like a real API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setShowCheckout(true);
        setIsLoading(false);
        return; // Don't make the actual API call
      }

      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: convertToSubcurrency(amount),
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }
      
      const data = await response.json();
      setClientSecret(data.clientSecret);
      setShowCheckout(true);
    } catch (err) {
      console.error("Error creating payment intent:", err);
      setError("Unable to process payment at this time. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentClick = () => {
    try {
      if (!amount || amount === '0.00') {
        setError('Please select a car and calculate the fare before proceeding to payment.');
        return;
      }

      if (!directionsData?.routes?.[0]?.legs?.[0]) {
        setError('Route information is missing. Please try selecting your route again.');
        return;
      }

      // Get the source and destination addresses from directions data
      const source = directionsData.routes[0].legs[0].start_address;
      const destination = directionsData.routes[0].legs[0].end_address;

      // Create a new booking
      const newBooking = {
        id: Date.now().toString(),
        amount: inrAmount,
        source,
        destination,
        carType,
        date: new Date().toISOString(),
        distance: directionsData.distance,
        duration: directionsData.duration
      };

      // Get existing bookings from localStorage
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      
      // Add the new booking
      const updatedBookings = [...existingBookings, newBooking];
      
      // Save to localStorage
      localStorage.setItem('bookings', JSON.stringify(updatedBookings));

      // Create payment intent - use INR amount
      createPaymentIntent(parseFloat(inrAmount) * 100);
    } catch (error) {
      console.error('Payment setup error:', error);
      setError('Failed to set up payment. Please try again.');
    }
  };

  // Function to simulate successful payment (for demo mode)
  const handleDemoPayment = () => {
    // Get the source and destination addresses from directions data
    const source = directionsData?.routes?.[0]?.legs?.[0]?.start_address || '';
    const destination = directionsData?.routes?.[0]?.legs?.[0]?.end_address || '';
    
    // Redirect to success page
    router.push(`/payment-success?amount=${inrAmount}&source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}&carType=${encodeURIComponent(carType)}`);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Complete Payment</h1>
        <h2 className="text-2xl">Amount to be paid</h2>

        <div className="bg-white p-2 rounded-md text-purple-500 mt-5 text-4xl font-bold">
          ₹{inrAmount}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {!showCheckout ? (
          <>
            <button
              onClick={handlePaymentClick}
              disabled={!amount || amount === '0.00' || isLoading}
              className={`mt-8 bg-white text-purple-500 px-8 py-3 rounded-md font-bold transition-colors flex items-center justify-center mx-auto ${!amount || amount === '0.00' || isLoading
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-100'
              }`}
            >
              {isLoading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </>
        ) : (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            {DEMO_MODE ? (
              <div className="text-gray-800">
                <p className="mb-4 text-lg">Demo Mode: No actual payment will be processed.</p>
                <button 
                  onClick={handleDemoPayment}
                  className="w-full bg-yellow-500 p-2 rounded-lg mt-2 font-bold hover:bg-yellow-600"
                >
                  Simulate Successful Payment
                </button>
                <p className="mt-4 text-sm text-gray-500">
                  Note: In a production environment, you would complete the payment through Stripe.
                </p>
              </div>
            ) : (
              <>
                {clientSecret ? (
                  <Elements 
                    stripe={stripePromise} 
                    options={{ 
                      clientSecret,
                      appearance: {
                        theme: 'stripe',
                        variables: {
                          colorPrimary: '#6366f1',
                          colorBackground: '#ffffff',
                          colorText: '#1f2937',
                          colorDanger: '#df1b41',
                          fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                          spacingUnit: '4px',
                          borderRadius: '4px'
                        }
                      }
                    }}
                  >
                    <CheckOutForm amount={parseFloat(inrAmount) * 100} />
                  </Elements>
                ) : (
                  <div className="flex items-center justify-center p-4">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-blue-500">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
