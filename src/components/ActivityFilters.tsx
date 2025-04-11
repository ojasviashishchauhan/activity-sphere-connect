
import React from 'react';
import { useActivity } from '@/context/ActivityContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { 
  Search, 
  Dumbbell, 
  Paintbrush, 
  GraduationCap, 
  Users, 
  Mountain, 
  MoreHorizontal 
} from 'lucide-react';

const ActivityFilters: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    categoryFilter, 
    setCategoryFilter 
  } = useActivity();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value as any);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search activities..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Categories</h3>
        <ToggleGroup 
          type="single" 
          value={categoryFilter}
          onValueChange={handleCategoryChange}
          className="justify-start flex-wrap"
        >
          <ToggleGroupItem value="all" aria-label="All categories">
            All
          </ToggleGroupItem>
          <ToggleGroupItem value="sports" aria-label="Sports category" className="flex items-center gap-1">
            <Dumbbell className="w-3 h-3" />
            <span>Sports</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="arts" aria-label="Arts category" className="flex items-center gap-1">
            <Paintbrush className="w-3 h-3" />
            <span>Arts</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="education" aria-label="Education category" className="flex items-center gap-1">
            <GraduationCap className="w-3 h-3" />
            <span>Education</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="social" aria-label="Social category" className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>Social</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="outdoors" aria-label="Outdoors category" className="flex items-center gap-1">
            <Mountain className="w-3 h-3" />
            <span>Outdoors</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="other" aria-label="Other categories" className="flex items-center gap-1">
            <MoreHorizontal className="w-3 h-3" />
            <span>Other</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default ActivityFilters;
