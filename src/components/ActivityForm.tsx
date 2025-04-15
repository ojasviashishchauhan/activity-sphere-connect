
import React, { useState, useEffect } from 'react';
import { useActivity } from '@/context/ActivityContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ActivityCategory, Location } from '@/types';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';

interface ActivityFormProps {
  onClose: () => void;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ onClose }) => {
  const { createActivity, userLocation } = useActivity();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('social');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [capacity, setCapacity] = useState('10');
  const [addressInput, setAddressInput] = useState('');
  const [location, setLocation] = useState<Location | null>(userLocation);
  
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  useEffect(() => {
    if (userLocation) {
      setLocation(userLocation);
    }
  }, [userLocation]);

  const handleAddressSearch = async () => {
    if (!addressInput.trim()) return;
    
    setSearching(true);
    
    try {
      // Use OpenStreetMap Nominatim for geocoding since it doesn't require API key
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressInput)}&limit=5`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        // Format results to match our expected format
        const formattedResults = data.map((item: any) => ({
          id: item.place_id,
          place_name: item.display_name,
          center: [parseFloat(item.lon), parseFloat(item.lat)]
        }));
        
        setSearchResults(formattedResults);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching address:', error);
    } finally {
      setSearching(false);
    }
  };
  
  const handleSelectLocation = (feature: any) => {
    setLocation({
      lng: feature.center[0],
      lat: feature.center[1],
      address: feature.place_name,
    });
    setAddressInput(feature.place_name);
    setSearchResults([]);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!title || !description || !date || !time || !location) {
      alert('Please fill in all required fields');
      return;
    }
    
    createActivity({
      title,
      description,
      category,
      date: new Date(date),
      time,
      capacity: parseInt(capacity),
      location,
    });
    
    onClose();
  };
  
  return (
    <div className="p-5 h-full overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Create a New Activity</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Title*</label>
          <Input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Activity title"
            required
          />
        </div>
        
        <div>
          <label className="block font-medium mb-1">Category*</label>
          <Select 
            value={category} 
            onValueChange={(value) => setCategory(value as ActivityCategory)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent position="item-aligned" className="z-50">
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="arts">Arts</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="social">Social</SelectItem>
              <SelectItem value="outdoors">Outdoors</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block font-medium mb-1">Description*</label>
          <Textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe your activity"
            rows={4}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Date*</label>
            <div className="relative">
              <Input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="pl-10"
                required
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            </div>
          </div>
          
          <div>
            <label className="block font-medium mb-1">Time*</label>
            <div className="relative">
              <Input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="pl-10"
                required
              />
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            </div>
          </div>
        </div>
        
        <div>
          <label className="block font-medium mb-1">Capacity*</label>
          <div className="relative">
            <Input
              type="number"
              value={capacity}
              onChange={e => setCapacity(e.target.value)}
              min="1"
              max="100"
              className="pl-10"
              required
            />
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          </div>
        </div>
        
        <div>
          <label className="block font-medium mb-1">Location*</label>
          <div className="relative">
            <Input
              value={addressInput}
              onChange={e => setAddressInput(e.target.value)}
              placeholder="Search for an address"
              className="pl-10 pr-20"
            />
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7"
              onClick={handleAddressSearch}
              disabled={searching}
            >
              {searching ? 'Searching...' : 'Search'}
            </Button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
              {searchResults.map(feature => (
                <div 
                  key={feature.id} 
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectLocation(feature)}
                >
                  <p className="text-sm">{feature.place_name}</p>
                </div>
              ))}
            </div>
          )}
          
          {location && (
            <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm">
              <p><strong>Selected Location:</strong> {location.address || `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`}</p>
            </div>
          )}
        </div>
        
        <div className="pt-4 flex space-x-3 justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Create Activity
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ActivityForm;
