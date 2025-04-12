
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Navigation } from 'lucide-react';
import { MapConfig } from '@/types';

interface MapControlsProps {
  mapConfig: MapConfig;
  updateMapConfig: (config: Partial<MapConfig>) => void;
  getUserLocation: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({ 
  mapConfig, 
  updateMapConfig, 
  getUserLocation 
}) => {
  const adjustZoom = (amount: number) => {
    updateMapConfig({ zoom: Math.min(Math.max(mapConfig.zoom + amount, 3), 18) });
  };

  return (
    <div className="absolute right-4 top-20 z-8 flex flex-col space-y-2">
      <div className="flex flex-col space-y-1 bg-white/80 backdrop-blur-sm rounded-md shadow">
        <Button variant="ghost" size="icon" onClick={() => adjustZoom(1)} className="rounded-b-none">
          <Plus className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => adjustZoom(-1)} className="rounded-t-none">
          <Minus className="h-4 w-4" />
        </Button>
      </div>
      
      <Button 
        variant="default" 
        size="icon" 
        onClick={getUserLocation} 
        className="rounded-full shadow-md"
      >
        <Navigation className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MapControls;
