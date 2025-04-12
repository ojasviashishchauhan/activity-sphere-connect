
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
    
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressInput)}&limit=1`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        
        const userLoc: Location = {
          lat,
          lng,
          address: data[0].display_name,
        };
        setUserLocation(userLoc);
        setAddressInput(data[0].display_name);
      }
    } catch (error) {
      console.error('Error searching address:', error);
    }
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
      </div>
      <Button type="submit" variant="default">Search</Button>
      <Button type="button" variant="outline" onClick={getUserLocation}>
        <Navigation className="w-4 h-4" />
      </Button>
    </form>
  );
};

export default MapSearch;
