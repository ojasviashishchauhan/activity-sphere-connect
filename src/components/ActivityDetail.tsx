
import React, { useState } from 'react';
import { useActivity } from '@/context/ActivityContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import ReviewList from './ReviewList';
import { Calendar, Clock, Users, MapPin, MessagesSquare, Star } from 'lucide-react';

interface ActivityDetailProps {
  onClose: () => void;
}

const ActivityDetail: React.FC<ActivityDetailProps> = ({ onClose }) => {
  const { selectedActivity: activity, requestToJoinActivity } = useActivity();
  const [activeTab, setActiveTab] = useState('details');
  const [joinNote, setJoinNote] = useState('');
  const [isJoinRequested, setIsJoinRequested] = useState(false);
  
  if (!activity) {
    return null;
  }
  
  const handleJoinRequest = () => {
    requestToJoinActivity(activity.id, joinNote);
    setIsJoinRequested(true);
  };
  
  const getAvatarInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="p-5 h-full overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-xl font-bold">{activity.title}</h2>
        <div className="flex items-center mt-1">
          <Badge variant="outline" className="capitalize mr-2">
            {activity.category}
          </Badge>
          <span className="text-sm text-gray-500">
            Posted {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
          </span>
        </div>
        <div className="flex items-center mt-4">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={activity.hostImage} alt={activity.hostName} />
            <AvatarFallback>{getAvatarInitials(activity.hostName)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Hosted by {activity.hostName}</p>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="participants">
            Participants ({activity.currentParticipants}/{activity.capacity})
          </TabsTrigger>
          <TabsTrigger value="reviews">
            Reviews ({(activity.reviews || []).length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <h3 className="font-medium">Date & Time</h3>
                <p className="text-gray-600">
                  {new Date(activity.date).toLocaleDateString()} at {activity.time}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <h3 className="font-medium">Location</h3>
                <p className="text-gray-600">
                  {activity.location.address || `${activity.location.lat.toFixed(6)}, ${activity.location.lng.toFixed(6)}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <h3 className="font-medium">Capacity</h3>
                <p className="text-gray-600">
                  {activity.currentParticipants} out of {activity.capacity} spots filled
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{activity.description}</p>
          </div>
          
          {!isJoinRequested ? (
            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-2">Want to join?</h3>
              <Textarea
                placeholder="Add a note to the host (optional)"
                className="mb-3"
                value={joinNote}
                onChange={(e) => setJoinNote(e.target.value)}
              />
              <Button className="w-full" onClick={handleJoinRequest}>
                Request to Join
              </Button>
            </div>
          ) : (
            <div className="border-t pt-4 mt-4">
              <div className="bg-green-50 p-3 rounded-md text-green-800 text-center">
                Your request to join has been sent to the host!
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="participants">
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={activity.hostImage} alt={activity.hostName} />
                  <AvatarFallback>{getAvatarInitials(activity.hostName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{activity.hostName}</p>
                  <p className="text-xs text-gray-500">Host</p>
                </div>
              </div>
            </div>
            
            {/* We'd normally show all participants here */}
            <p className="text-sm text-gray-500 text-center py-4">
              {activity.currentParticipants > 1 
                ? `Plus ${activity.currentParticipants - 1} other participants` 
                : "No other participants yet"
              }
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="reviews">
          <ReviewList reviews={activity.reviews || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ActivityDetail;
