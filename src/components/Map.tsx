
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useActivity } from '@/context/ActivityContext';
import { Activity, Location } from '@/types';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Search, Navigation, MapPin } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

let DefaultIcon = L.icon({
  iconUrl: 'leaflet/dist/images/marker-icon.png',
  shadowUrl: 'leaflet/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

const SetViewOnChange = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom]);
  
  return null;
};

const Map: React.FC = () => {
  const [addressInput, setAddressInput] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const {
    filteredActivities,
    selectedActivity,
    selectActivity,
    userLocation,
    setUserLocation,
    mapConfig,
    updateMapConfig,
  } = useActivity();

  const defaultCenter: [number, number] = [37.7749, -122.4194];
  const mapCenter: [number, number] = userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter;
  
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

  const handleRadiusChange = (value: number[]) => {
    updateMapConfig({ radius: value[0] });
  };

  const getActivityIcon = (category: string) => {
    const categoryColors: Record<string, string> = {
      'sports': '#FF5733',
      'art': '#33FFA8',
      'music': '#3380FF',
      'outdoor': '#E033FF',
      'food': '#FFD700',
      'education': '#40E0D0',
      'other': '#808080',
    };
    
    const color = categoryColors[category] || '#3B82F6';
    
    return L.divIcon({
      className: `activity-marker category-${category}`,
      html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.2)"></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15],
    });
  };
  
  const handleMarkerClick = (activity: Activity) => {
    selectActivity(activity);
  };

  useEffect(() => {
    setMapLoaded(true);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[500px]">
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-col space-y-2">
        <div className="flex items-center justify-between">
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
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="ml-2 bg-white/80 hover:bg-white/90">
                <span className="font-medium">{mapConfig.radius} km</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Search Radius</span>
                  <span className="text-sm font-medium">{mapConfig.radius} km</span>
                </div>
                <Slider
                  defaultValue={[mapConfig.radius]}
                  max={50}
                  step={1}
                  onValueChange={handleRadiusChange}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="absolute bottom-4 right-4 z-[1000] flex flex-col space-y-2">
        <Button variant="outline" size="icon" onClick={getUserLocation} className="bg-white/90 backdrop-blur-sm">
          <MapPin className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="absolute inset-0 z-0">
        <MapContainer 
          style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
          className="leaflet-container"
        >
          <SetViewOnChange center={mapCenter} zoom={mapConfig.zoom} />
          
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {userLocation && (
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              pathOptions={{ 
                fillColor: '#3B82F6', 
                fillOpacity: 0.1, 
                color: '#3B82F6', 
                weight: 1 
              }}
              radius={mapConfig.radius * 1000}
            />
          )}
          
          {filteredActivities.map((activity) => (
            <Marker
              key={activity.id}
              position={[activity.location.lat, activity.location.lng]}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-semibold text-lg">{activity.title}</h3>
                  <p className="text-sm text-gray-600">{activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
