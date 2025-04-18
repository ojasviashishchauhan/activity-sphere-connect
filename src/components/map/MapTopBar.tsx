
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
    <div className="absolute top-4 left-4 right-4 z-[90] flex flex-col space-y-2">
      <div className="flex items-center justify-between gap-2">
        <MapSearch setUserLocation={setUserLocation} />
        
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              className="bg-white/80 hover:bg-white/90 backdrop-blur-md rounded-full shadow-sm border border-gray-200/50"
            >
              <span className="font-medium text-[#1A1F2C]">{mapConfig.radius} km</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-4 z-[100] bg-white/80 backdrop-blur-md rounded-xl border border-gray-200/50 shadow-lg">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#1A1F2C]">Search Radius</span>
                <span className="text-sm font-medium text-[#1A1F2C]">{mapConfig.radius} km</span>
              </div>
              <Slider
                defaultValue={[mapConfig.radius]}
                max={50}
                step={1}
                onValueChange={handleRadiusChange}
                className="[&_[role=slider]]:bg-[#9b87f5] [&_[role=slider]]:border-[#9b87f5]"
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default MapTopBar;
