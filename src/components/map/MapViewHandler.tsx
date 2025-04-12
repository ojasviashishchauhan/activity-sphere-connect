
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface MapViewHandlerProps {
  center: [number, number];
  zoom: number;
}

const MapViewHandler: React.FC<MapViewHandlerProps> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (map) {
      map.setView(center, zoom);
    }
  }, [map, center, zoom]);
  
  return null;
};

export default MapViewHandler;
