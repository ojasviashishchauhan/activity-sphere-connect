
import React, { useEffect } from 'react';
import { Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Activity, Location } from '@/types';

interface ActivityMarkersProps {
  activities: Activity[];
  userLocation: Location | null;
  radiusInKm: number;
  onMarkerClick: (activity: Activity) => void;
  hoveredActivityId?: string | null;
}

// This component handles the creation of custom markers
const CustomMarkers: React.FC<{
  activities: Activity[];
  onMarkerClick: (activity: Activity) => void;
  hoveredActivityId?: string | null;
}> = ({ activities, onMarkerClick, hoveredActivityId }) => {
  const map = useMap();
  
  useEffect(() => {
    // Remove existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });
    
    // Add new markers
    activities.forEach((activity) => {
      const isHovered = hoveredActivityId === activity.id;
      const icon = getActivityIcon(activity.category, isHovered);
      
      const marker = L.marker([activity.location.lat, activity.location.lng], { icon })
        .addTo(map);
      
      const popupContent = `
        <div class="p-1">
          <h3 class="font-semibold text-lg">${activity.title}</h3>
          <p class="text-sm text-gray-600">${activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}</p>
        </div>
      `;
      
      marker.bindPopup(popupContent);
      marker.on('click', () => onMarkerClick(activity));
    });
    
    return () => {
      // Cleanup markers when component unmounts
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });
    };
  }, [map, activities, hoveredActivityId, onMarkerClick]);
  
  return null;
};

// Helper function to get the activity icon
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

// Main component
const ActivityMarkers: React.FC<ActivityMarkersProps> = ({ 
  activities, 
  userLocation, 
  radiusInKm,
  onMarkerClick,
  hoveredActivityId
}) => {
  const UserLocationCircle = () => {
    const map = useMap();
    
    useEffect(() => {
      if (!userLocation) return;
      
      // Remove existing circles
      map.eachLayer((layer) => {
        if (layer instanceof L.Circle) {
          map.removeLayer(layer);
        }
      });
      
      // Add new circle using the Leaflet API directly
      const circleOptions = {
        radius: radiusInKm * 1000,
        fillColor: '#3B82F6',
        fillOpacity: 0.1,
        color: '#3B82F6',
        weight: 1
      };
      
      const circle = L.circle(
        [userLocation.lat, userLocation.lng],
        circleOptions
      ).addTo(map);
      
      return () => {
        map.removeLayer(circle);
      };
    }, [map, userLocation, radiusInKm]);
    
    return null;
  };
  
  return (
    <>
      {userLocation && <UserLocationCircle />}
      <CustomMarkers 
        activities={activities} 
        onMarkerClick={onMarkerClick} 
        hoveredActivityId={hoveredActivityId} 
      />
    </>
  );
};

export default ActivityMarkers;
