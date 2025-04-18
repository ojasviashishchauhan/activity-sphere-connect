
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
    <div className="absolute right-4 top-20 z-[100] flex flex-col space-y-2">
      <div className="flex flex-col space-y-[1px] bg-white/80 backdrop-blur-md rounded-xl shadow-sm overflow-hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => adjustZoom(1)} 
          className="bg-white/80 hover:bg-white/90"
        >
          <Plus className="h-4 w-4 text-[#1A1F2C]" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => adjustZoom(-1)} 
          className="bg-white/80 hover:bg-white/90"
        >
          <Minus className="h-4 w-4 text-[#1A1F2C]" />
        </Button>
      </div>
      
      <Button 
        variant="default" 
        size="icon" 
        onClick={getUserLocation} 
        className="rounded-full shadow-sm bg-white/80 hover:bg-white/90 backdrop-blur-md"
      >
        <Navigation className="w-4 h-4 text-[#1A1F2C]" />
      </Button>
    </div>
  );
};

export default MapControls;
