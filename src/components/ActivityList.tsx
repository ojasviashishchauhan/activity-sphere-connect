
import React from 'react';
import { useActivity } from '@/context/ActivityContext';
import ActivityCard from './ActivityCard';
import ActivityFilters from './ActivityFilters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ActivityListProps {
  onCreateActivity: () => void;
}

const ActivityList: React.FC<ActivityListProps> = ({ onCreateActivity }) => {
  const { filteredActivities } = useActivity();
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Activities</h2>
        <Button onClick={onCreateActivity} className="flex items-center gap-1">
          <Plus className="w-4 h-4" />
          <span>Create</span>
        </Button>
      </div>
      
      <ActivityFilters />
      
      <div className="mt-4 flex-1 overflow-y-auto">
        {filteredActivities.length > 0 ? (
          <div className="space-y-4">
            {filteredActivities.map(activity => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-gray-500 mb-4">No activities match your filters</p>
            <Button variant="outline" onClick={onCreateActivity}>
              Create an Activity
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityList;
