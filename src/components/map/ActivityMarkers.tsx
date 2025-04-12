
import React from 'react';
import { Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Activity, Location } from '@/types';

interface ActivityMarkersProps {
  activities: Activity[];
  userLocation: Location | null;
  radiusInKm: number;
  onMarkerClick: (activity: Activity) => void;
}

const ActivityMarkers: React.FC<ActivityMarkersProps> = ({ 
  activities, 
  userLocation, 
  radiusInKm,
  onMarkerClick 
}) => {
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

  return (
    <>
      {userLocation && (
        <Circle
          center={[userLocation.lat, userLocation.lng]} 
          pathOptions={{ 
            fillColor: '#3B82F6', 
            fillOpacity: 0.1, 
            color: '#3B82F6', 
            weight: 1 
          }}
          radius={radiusInKm * 1000} // Convert km to meters for the Circle component
        />
      )}
      
      {activities.map((activity) => (
        <Marker
          key={activity.id}
          position={[activity.location.lat, activity.location.lng]}
          eventHandlers={{
            click: () => onMarkerClick(activity)
          }}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-semibold text-lg">{activity.title}</h3>
              <p className="text-sm text-gray-600">{activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default ActivityMarkers;
