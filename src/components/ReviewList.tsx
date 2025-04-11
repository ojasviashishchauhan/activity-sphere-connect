
import React from 'react';
import { format } from 'date-fns';
import { Review } from '@/types';
import { Star } from 'lucide-react';

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  return (
    <div>
      <h3 className="font-semibold mb-3">Reviews ({reviews.length})</h3>
      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src={review.userImage}
                  alt={review.userName}
                  className="w-8 h-8 rounded-full mr-3"
                />
                <div>
                  <div className="font-medium">{review.userName}</div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(review.createdAt), 'MMM d, yyyy')}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">
                  {((review.hostRating + review.activityRating) / 2).toFixed(1)}
                </span>
              </div>
            </div>
            
            <div className="mt-3">
              <div className="flex space-x-4 mb-2 text-sm">
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">Host:</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i}
                        className={`w-3 h-3 ${i < review.hostRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">Activity:</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i}
                        className={`w-3 h-3 ${i < review.activityRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 text-sm">{review.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
