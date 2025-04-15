
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Navigation } from 'lucide-react';
import { Location } from '@/types';

interface MapSearchProps {
  setUserLocation: (location: Location | null) => void;
}

const MapSearch: React.FC<MapSearchProps> = ({ setUserLocation }) => {
  const [addressInput, setAddressInput] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const userLoc: Location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userLoc);
        },
        error => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser');
    }
  };

  const handleAddressSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressInput.trim()) return;
    
    setSearching(true);
    
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressInput)}&limit=5`);
      const data = await response.json();
      
      if (data && data.length > 0) {
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
    setUserLocation({
      lng: feature.center[0],
      lat: feature.center[1],
      address: feature.place_name,
    });
    setAddressInput(feature.place_name);
    setSearchResults([]);
  };

  return (
    <form onSubmit={handleAddressSearch} className="flex-1 flex space-x-2">
      <div className="relative flex-grow">
        <Input
          type="text"
          placeholder="Search for a location"
          value={addressInput}
          onChange={e => setAddressInput(e.target.value)}
          className="w-full pl-10 bg-white/90 backdrop-blur-sm"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
        
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
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
      </div>
      <Button type="submit" variant="default" disabled={searching}>
        {searching ? 'Searching...' : 'Search'}
      </Button>
      <Button type="button" variant="outline" onClick={getUserLocation}>
        <Navigation className="w-4 h-4" />
      </Button>
    </form>
  );
};

export default MapSearch;
