
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MapPin } from 'lucide-react';
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
  const handleRadiusChange = (value: number[]) => {
    updateMapConfig({ radius: value[0] });
  };

  return (
    <div className="absolute bottom-4 right-4 z-[1000] flex flex-col space-y-2">
      <Button variant="outline" size="icon" onClick={getUserLocation} className="bg-white/90 backdrop-blur-sm">
        <MapPin className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default MapControls;
