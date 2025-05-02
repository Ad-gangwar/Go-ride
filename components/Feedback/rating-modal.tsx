'use client';

import { useState } from 'react';
import { Star, X, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverName: string;
  driverImage?: string;
  rideId: string;
  onSubmit: (rideId: string, rating: number, feedback: string) => void;
}

export default function RatingModal({
  isOpen,
  onClose,
  driverName,
  driverImage,
  rideId,
  onSubmit
}: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  
  if (!isOpen) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    onSubmit(rideId, rating, feedback);
    setRating(0);
    setFeedback('');
    
    // Show success message and close modal
    toast.success('Thank you for your feedback!');
    onClose();
  };
  
  const ratingLabels = [
    'Poor',
    'Below Average',
    'Average',
    'Good',
    'Excellent'
  ];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Rate Your Ride</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col items-center mb-6">
            {driverImage ? (
              <Image 
                src={driverImage} 
                alt={driverName} 
                width={60} 
                height={60} 
                className="rounded-full mb-2" 
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl text-gray-500 font-semibold">
                  {driverName.charAt(0)}
                </span>
              </div>
            )}
            <p className="text-gray-700">How was your ride with {driverName}?</p>
          </div>
          
          <div className="flex justify-center mb-2">
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              return (
                <button
                  type="button"
                  key={index}
                  className={`mx-1 focus:outline-none ${
                    starValue <= (hover || rating) ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHover(starValue)}
                  onMouseLeave={() => setHover(0)}
                >
                  <Star size={32} fill={starValue <= (hover || rating) ? 'currentColor' : 'none'} />
                </button>
              );
            })}
          </div>
          
          {(hover || rating) > 0 && (
            <p className="text-center text-sm text-gray-600 mb-4">
              {ratingLabels[(hover || rating) - 1]}
            </p>
          )}
          
          <div className="mb-6">
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Comments (Optional)
            </label>
            <textarea
              id="feedback"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Tell us about your experience..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 flex items-center"
            >
              <ThumbsUp size={16} className="mr-2" />
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 