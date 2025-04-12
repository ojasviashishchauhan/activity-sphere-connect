
import React from 'react';
import { useActivity } from '@/context/ActivityContext';
import ActivityFilters from './ActivityFilters';
import ActivityCard from './ActivityCard';
import { Button } from '@/components/ui/button';
import { Plus, UserCircle } from 'lucide-react';

interface ActivityListProps {
  onCreateActivity: () => void;
  onShowMyActivities: () => void;
}

const ActivityList: React.FC<ActivityListProps> = ({ 
  onCreateActivity,
  onShowMyActivities
}) => {
  const { 
    filteredActivities, 
    selectActivity, 
    setHoveredActivityId
  } = useActivity();

  const handleActivityClick = (activityId: string) => {
    const activity = filteredActivities.find(a => a.id === activityId);
    if (activity) {
      selectActivity(activity);
    }
  };

  const handleMouseEnter = (activityId: string) => {
    setHoveredActivityId(activityId);
  };

  const handleMouseLeave = () => {
    setHoveredActivityId(null);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="lg:hidden flex flex-col mb-4">
        <div className="flex gap-2 mb-4">
          <Button 
            onClick={onShowMyActivities} 
            variant="outline" 
            className="flex-1 flex items-center justify-center"
          >
            <UserCircle className="w-4 h-4 mr-2" />
            My Activities
          </Button>
          <Button 
            onClick={onCreateActivity} 
            className="flex-1 flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Activity
          </Button>
        </div>
      </div>
      
      <ActivityFilters />
      
      <div className="mt-4 flex-1 overflow-auto">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No activities found.</p>
            <Button onClick={onCreateActivity}>Create New Activity</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActivities.map(activity => (
              <ActivityCard 
                key={activity.id}
                activity={activity}
                onClick={() => handleActivityClick(activity.id)}
                onMouseEnter={() => handleMouseEnter(activity.id)}
                onMouseLeave={handleMouseLeave}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityList;
