
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface SetViewOnChangeProps {
  center: [number, number];
  zoom: number;
}

const MapViewHandler: React.FC<SetViewOnChangeProps> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

export default MapViewHandler;
