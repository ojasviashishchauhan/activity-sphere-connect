
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Activity } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users } from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ 
  activity, 
  onClick,
  onMouseEnter,
  onMouseLeave
}) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };
  
  const formatLocation = (lat: number, lng: number, address?: string) => {
    if (address) return address;
    return `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div 
      className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{activity.title}</h3>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
            </p>
          </div>
          <Badge variant="outline" className="capitalize">
            {activity.category}
          </Badge>
        </div>
        
        <div className="mt-3 space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
            <span>{formatDate(activity.date)} at {activity.time}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
            <span className="truncate">
              {formatLocation(
                activity.location.lat, 
                activity.location.lng, 
                activity.location.address
              )}
            </span>
          </div>
          
          <div className="flex items-center text-sm">
            <Users className="w-4 h-4 mr-2 text-gray-500" />
            <span>{activity.currentParticipants} / {activity.capacity} participants</span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={activity.hostImage} alt={activity.hostName} />
            <AvatarFallback>{getInitials(activity.hostName)}</AvatarFallback>
          </Avatar>
          <span className="text-sm">Hosted by {activity.hostName}</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
