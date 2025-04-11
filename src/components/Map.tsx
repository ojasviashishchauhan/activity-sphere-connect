
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useActivity } from '@/context/ActivityContext';
import { Activity, Location } from '@/types';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Search, Navigation, Plus, Minus, MapPin } from 'lucide-react';

// Fix for Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Control component to update view when center changes
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

  // Default center (San Francisco)
  const defaultCenter: [number, number] = [37.7749, -122.4194];
  const mapCenter: [number, number] = userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter;
  
  // Get user location
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

  // Handle address search
  const handleAddressSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressInput.trim()) return;
    
    try {
      // Using Nominatim API for geocoding (OpenStreetMap's geocoder)
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

  // Update radius
  const handleRadiusChange = (value: number[]) => {
    updateMapConfig({ radius: value[0] });
  };

  // Custom activity marker icon based on category
  const getActivityIcon = (category: string) => {
    const categoryColors: Record<string, string> = {
      'sports': '#FF5733', // Red-Orange
      'art': '#33FFA8', // Mint Green
      'music': '#3380FF', // Blue
      'outdoor': '#E033FF', // Purple
      'food': '#FFD700', // Gold
      'education': '#40E0D0', // Turquoise
      'other': '#808080', // Gray
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
  
  // Handle activity marker click
  const handleMarkerClick = (activity: Activity) => {
    selectActivity(activity);
  };

  useEffect(() => {
    // Set map as loaded
    setMapLoaded(true);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[500px]">
      <div className="absolute top-4 left-4 z-10 w-full max-w-md">
        <form onSubmit={handleAddressSearch} className="flex space-x-2">
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
        
        {userLocation && (
          <div className="mt-4 p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Search Radius: {mapConfig.radius} km</span>
            </div>
            <Slider
              defaultValue={[mapConfig.radius]}
              max={50}
              step={1}
              onValueChange={handleRadiusChange}
            />
          </div>
        )}
      </div>
      
      <div className="absolute bottom-4 right-4 z-10 flex flex-col space-y-2">
        <Button variant="outline" size="icon" onClick={getUserLocation} className="bg-white/90 backdrop-blur-sm">
          <MapPin className="w-4 h-4" />
        </Button>
      </div>
      
      <MapContainer 
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
        zoomControl={false}
        className="leaflet-container"
      >
        {/* Add initial center and zoom with SetViewOnChange component */}
        <SetViewOnChange center={mapCenter} zoom={mapConfig.zoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
            radius={mapConfig.radius * 1000} // Convert km to meters
          />
        )}
        
        {filteredActivities.map((activity) => (
          <Marker
            key={activity.id}
            position={[activity.location.lat, activity.location.lng]}
            eventHandlers={{
              click: () => handleMarkerClick(activity),
            }}
            icon={getActivityIcon(activity.category)}
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
  );
};

export default Map;
