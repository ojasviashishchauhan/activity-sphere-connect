
import React from 'react';
import { format } from 'date-fns';
import { Activity, ActivityRequest } from '@/types';
import { useActivity } from '@/context/ActivityContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, MapPin, X, Star, ChevronLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import ReviewList from './ReviewList';

interface ActivityDetailProps {
  onClose: () => void;
}

const ActivityDetail: React.FC<ActivityDetailProps> = ({ onClose }) => {
  const { 
    selectedActivity, 
    requestToJoinActivity,
    approveActivityRequest,
    rejectActivityRequest
  } = useActivity();
  
  if (!selectedActivity) return null;
  
  const pending = selectedActivity.requests?.filter(request => request.status === 'pending') || [];
  
  const handleRequestJoin = () => {
    requestToJoinActivity(selectedActivity.id);
  };
  
  const handleApprove = (request: ActivityRequest) => {
    approveActivityRequest(selectedActivity.id, request.id);
  };
  
  const handleReject = (request: ActivityRequest) => {
    rejectActivityRequest(selectedActivity.id, request.id);
  };
  
  const isFull = selectedActivity.currentParticipants >= selectedActivity.capacity;
  
  return (
    <div className="p-5 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Badge className={`category-${selectedActivity.category}`}>
              {selectedActivity.category}
            </Badge>
            {selectedActivity.reviews && selectedActivity.reviews.length > 0 && (
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">
                  {(selectedActivity.reviews.reduce((sum, review) => 
                    sum + ((review.hostRating + review.activityRating) / 2), 0) / 
                    selectedActivity.reviews.length).toFixed(1)}
                </span>
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold">{selectedActivity.title}</h2>
          <div className="flex items-center mt-2">
            <img 
              src={selectedActivity.hostImage} 
              alt={selectedActivity.hostName}
              className="w-6 h-6 rounded-full mr-2"
            />
            <span className="text-sm">Hosted by {selectedActivity.hostName}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-y-4 text-sm">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-3 text-gray-500" />
            <span>{format(new Date(selectedActivity.date), 'EEEE, MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-3 text-gray-500" />
            <span>{selectedActivity.time}</span>
          </div>
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-3 text-gray-500" />
            <span>
              {selectedActivity.currentParticipants}/{selectedActivity.capacity} participants
              {isFull && <span className="ml-2 text-red-500">(Full)</span>}
            </span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-3 text-gray-500" />
            <span>San Francisco</span>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-gray-700">{selectedActivity.description}</p>
        </div>
        
        <Separator />
        
        <div>
          <Button 
            onClick={handleRequestJoin} 
            className="w-full"
            disabled={isFull}
          >
            {isFull ? 'Activity Full' : 'Request to Join'}
          </Button>
          
          <p className="text-sm text-gray-500 mt-2 text-center">
            You'll receive details once the host approves your request
          </p>
        </div>
        
        {pending.length > 0 && (
          <>
            <Separator />
            
            <div>
              <h3 className="font-semibold mb-3">Pending Requests</h3>
              <div className="space-y-3">
                {pending.map(request => (
                  <div key={request.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <img 
                        src={request.userImage}
                        alt={request.userName}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <span>{request.userName}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReject(request)}
                      >
                        Decline
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleApprove(request)}
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        {selectedActivity.reviews && selectedActivity.reviews.length > 0 && (
          <>
            <Separator />
            <ReviewList reviews={selectedActivity.reviews} />
          </>
        )}
      </div>
    </div>
  );
};

export default ActivityDetail;
