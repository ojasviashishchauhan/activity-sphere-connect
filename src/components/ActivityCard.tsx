
import React from 'react';
import { format } from 'date-fns';
import { Activity } from '@/types';
import { useActivity } from '@/context/ActivityContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Calendar, Clock, Users, MapPin, Star } from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  variant?: 'default' | 'compact';
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, variant = 'default' }) => {
  const { 
    selectActivity, 
    requestToJoinActivity,
    selectedActivity,
    setHoveredActivityId
  } = useActivity();
  
  const isSelected = selectedActivity?.id === activity.id;
  
  const handleClick = () => {
    selectActivity(activity);
  };
  
  const handleRequestJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    requestToJoinActivity(activity.id);
  };

  const handleMouseEnter = () => {
    setHoveredActivityId(activity.id);
  };

  const handleMouseLeave = () => {
    setHoveredActivityId(null);
  };
  
  const getAverageRating = () => {
    if (!activity.reviews || activity.reviews.length === 0) return null;
    
    const total = activity.reviews.reduce((sum, review) => 
      sum + ((review.hostRating + review.activityRating) / 2), 0);
    return (total / activity.reviews.length).toFixed(1);
  };
  
  const averageRating = getAverageRating();
  
  if (variant === 'compact') {
    return (
      <Card 
        className={`cursor-pointer hover:shadow-md transition-shadow ${isSelected ? 'ring-2 ring-primary' : ''}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-base line-clamp-1">{activity.title}</h3>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                <span>{format(new Date(activity.date), 'MMM d')}</span>
                <span className="mx-1">•</span>
                <Clock className="w-3 h-3 mr-1" />
                <span>{activity.time}</span>
              </div>
            </div>
            <Badge className={`category-${activity.category}`}>
              {activity.category}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center">
              <Users className="w-3 h-3 mr-1 text-gray-500" />
              <span className="text-xs text-gray-500">
                {activity.currentParticipants}/{activity.capacity}
              </span>
            </div>
            
            {averageRating && (
              <div className="flex items-center">
                <Star className="w-3 h-3 mr-1 text-yellow-500 fill-yellow-500" />
                <span className="text-xs">{averageRating}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-shadow ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{activity.title}</h3>
          <Badge className={`category-${activity.category}`}>
            {activity.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{activity.description}</p>
        
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
            <span>{format(new Date(activity.date), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-gray-500" />
            <span>{activity.time}</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-gray-500" />
            <span>{activity.currentParticipants}/{activity.capacity} participants</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
            <span className="truncate">San Francisco</span>
          </div>
        </div>
        
        {averageRating && (
          <div className="mt-3 flex items-center">
            <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
            <span className="font-medium">{averageRating}</span>
            <span className="text-gray-500 text-sm ml-1">
              ({activity.reviews?.length} {activity.reviews?.length === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src={activity.hostImage} 
            alt={activity.hostName}
            className="w-6 h-6 rounded-full mr-2"
          />
          <span className="text-sm">Hosted by {activity.hostName}</span>
        </div>
        <Button size="sm" onClick={handleRequestJoin}>Join</Button>
      </CardFooter>
    </Card>
  );
};

export default ActivityCard;
