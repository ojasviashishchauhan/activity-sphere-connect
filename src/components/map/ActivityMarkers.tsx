
import React from 'react';
import { Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Activity, Location } from '@/types';

interface ActivityMarkersProps {
  activities: Activity[];
  userLocation: Location | null;
  radiusInKm: number;
  onMarkerClick: (activity: Activity) => void;
  hoveredActivityId?: string | null;
}

const ActivityMarkers: React.FC<ActivityMarkersProps> = ({ 
  activities, 
  userLocation, 
  radiusInKm,
  onMarkerClick,
  hoveredActivityId
}) => {
  const getActivityIcon = (category: string, isHovered: boolean) => {
    const categoryColors: Record<string, string> = {
      'sports': '#FF5733',
      'arts': '#33FFA8',
      'education': '#40E0D0',
      'social': '#3380FF',
      'outdoors': '#E033FF',
      'other': '#808080',
    };
    
    const color = categoryColors[category] || '#3B82F6';
    const size = isHovered ? 40 : 30;
    const iconSize = isHovered ? [40, 40] : [30, 30];
    const iconAnchor = isHovered ? [20, 20] : [15, 15];
    
    return L.divIcon({
      className: `activity-marker category-${category}`,
      html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.2); transition: all 0.3s ease">
              ${getIconSvg(category, isHovered ? '#FFFFFF' : '#FFFFFF')}
            </div>`,
      iconSize: iconSize,
      iconAnchor: iconAnchor,
      popupAnchor: [0, -15],
    });
  };

  const getIconSvg = (category: string, color: string) => {
    const iconSize = '60%';
    switch(category) {
      case 'sports':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.7 6.7c-.8-.8-.8-2 0-2.8s2-.8 2.8 0C13.3 7.7 16 12.5 16 18v4"/><path d="M8.8 15c-1.3-1.3-1.3-3.5 0-4.8s3.5-1.3 4.8 0c2.8 2.8 5.4 7 5.4 11v2"/></svg>`;
      case 'arts':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/></svg>`;
      case 'education':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>`;
      case 'social':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`;
      case 'outdoors':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>`;
      default:
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
    }
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
          // Use the correct Circle prop format
          radius={radiusInKm * 1000}
        />
      )}
      
      {activities.map((activity) => {
        const isHovered = hoveredActivityId === activity.id;
        // Create the marker icon
        const markerIcon = getActivityIcon(activity.category, isHovered);
        
        return (
          <Marker
            key={activity.id}
            position={[activity.location.lat, activity.location.lng]}
            // Use the correct Marker prop format
            eventHandlers={{
              click: () => onMarkerClick(activity)
            }}
            zIndexOffset={isHovered ? 1000 : 0}
            icon={markerIcon}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-semibold text-lg">{activity.title}</h3>
                <p className="text-sm text-gray-600">{activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default ActivityMarkers;
