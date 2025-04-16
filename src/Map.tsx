
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useActivity } from '@/context/ActivityContext';
import { Activity } from '@/types';
import MapViewHandler from './components/map/MapViewHandler';
import MapTopBar from './components/map/MapTopBar';
import MapControls from './components/map/MapControls';
import ActivityMarkers from './components/map/ActivityMarkers';

// Fix Leaflet icon issue
const fixLeafletIcon = () => {
  // Delete the default icon
  delete L.Icon.Default.prototype._getIconUrl;
  
  // Set up icon information
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
};

// Set up Leaflet default icon
let DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

const Map: React.FC = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const {
    filteredActivities,
    selectedActivity,
    selectActivity,
    userLocation,
    setUserLocation,
    mapConfig,
    updateMapConfig,
    hoveredActivityId
  } = useActivity();

  useEffect(() => {
    fixLeafletIcon();
  }, []);

  const defaultCenter: [number, number] = [37.7749, -122.4194];
  const mapCenter: [number, number] = userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter;
  
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const userLoc = {
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
  
  const handleMarkerClick = (activity: Activity) => {
    selectActivity(activity);
  };

  useEffect(() => {
    setMapLoaded(true);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[500px]">
      <MapTopBar 
        mapConfig={mapConfig} 
        updateMapConfig={updateMapConfig} 
        setUserLocation={setUserLocation} 
      />
      
      <MapControls 
        mapConfig={mapConfig} 
        updateMapConfig={updateMapConfig} 
        getUserLocation={getUserLocation} 
      />
      
      <div className="absolute inset-0 z-5">
        <MapContainer 
          style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
          className="leaflet-container"
          zoom={mapConfig.zoom}
          center={defaultCenter}
        >
          <MapViewHandler center={mapCenter} zoom={mapConfig.zoom} />
          
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <ActivityMarkers 
            activities={filteredActivities} 
            userLocation={userLocation} 
            radiusInKm={mapConfig.radius}
            onMarkerClick={handleMarkerClick}
            hoveredActivityId={hoveredActivityId}
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
