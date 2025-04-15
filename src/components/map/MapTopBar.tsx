
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MapConfig } from '@/types';
import MapSearch from './MapSearch';
import { Location } from '@/types';

interface MapTopBarProps {
  mapConfig: MapConfig;
  updateMapConfig: (config: Partial<MapConfig>) => void;
  setUserLocation: (location: Location | null) => void;
}

const MapTopBar: React.FC<MapTopBarProps> = ({ 
  mapConfig, 
  updateMapConfig, 
  setUserLocation 
}) => {
  const handleRadiusChange = (value: number[]) => {
    updateMapConfig({ radius: value[0] });
  };

  return (
    <div className="absolute top-4 left-4 right-4 z-10 flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <MapSearch setUserLocation={setUserLocation} />
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="ml-2 bg-white/80 hover:bg-white/90">
              <span className="font-medium">{mapConfig.radius} km</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-4 z-20">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Search Radius</span>
                <span className="text-sm font-medium">{mapConfig.radius} km</span>
              </div>
              <Slider
                defaultValue={[mapConfig.radius]}
                max={50}
                step={1}
                onValueChange={handleRadiusChange}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default MapTopBar;
