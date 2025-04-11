
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useActivity } from '@/context/ActivityContext';
import { Activity, Location } from '@/types';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Search, Navigation, Plus, Minus } from 'lucide-react';

// We'll use user-provided token or default to empty string
let mapboxToken = '';

const Map: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const popups = useRef<{ [key: string]: mapboxgl.Popup }>({});
  
  const [addressInput, setAddressInput] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [showTokenDialog, setShowTokenDialog] = useState(true);
  const [tokenInput, setTokenInput] = useState('');
  const [mapError, setMapError] = useState<string | null>(null);
  
  const {
    filteredActivities,
    selectedActivity,
    selectActivity,
    userLocation,
    setUserLocation,
    mapConfig,
    updateMapConfig,
  } = useActivity();

  // Initialize map after token is provided
  const initializeMap = () => {
    if (!mapContainer.current || map.current) return;
    
    // Set the mapbox token
    mapboxgl.accessToken = mapboxToken;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: mapConfig.center,
        zoom: mapConfig.zoom,
      });
      
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      map.current.on('load', () => {
        setIsMapLoaded(true);
        setMapError(null);
        
        if (map.current) {
          // Add user location circle (radius)
          map.current.addSource('radius-circle', {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: mapConfig.center,
              },
              properties: {},
            },
          });
          
          map.current.addLayer({
            id: 'radius-circle-fill',
            type: 'circle',
            source: 'radius-circle',
            paint: {
              'circle-radius': {
                stops: [
                  [0, 0],
                  [20, 1000000], // Scale the radius based on zoom level
                ],
                base: 2,
              },
              'circle-color': '#3B82F6',
              'circle-opacity': 0.1,
              'circle-stroke-width': 1,
              'circle-stroke-color': '#3B82F6',
            },
          });
        }
      });

      map.current.on('error', (e) => {
        setMapError(e.error.message || 'Error loading map');
        console.error('Map error:', e);
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Error initializing map. Please check your token.');
    }
  };

  // Handle token submission
  const handleTokenSubmit = () => {
    if (tokenInput.trim()) {
      mapboxToken = tokenInput.trim();
      
      // Clean up existing map if any
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      
      // Initialize new map with token
      initializeMap();
      setShowTokenDialog(false);
    }
  };

  // Update user location and radius circle
  useEffect(() => {
    if (!isMapLoaded || !map.current) return;
    
    if (userLocation) {
      // Update the radius circle source
      const radiusSource = map.current.getSource('radius-circle') as mapboxgl.GeoJSONSource;
      if (radiusSource) {
        radiusSource.setData({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [userLocation.lng, userLocation.lat],
          },
          properties: {},
        });
      }
      
      // Update the circle radius
      map.current.setPaintProperty('radius-circle-fill', 'circle-radius', {
        stops: [
          [0, 0],
          [10, mapConfig.radius * 100], // Adjust based on zoom level
          [15, mapConfig.radius * 1000],
        ],
        base: 2,
      });
    }
  }, [isMapLoaded, userLocation, mapConfig.radius]);

  // Add markers for activities
  useEffect(() => {
    if (!isMapLoaded || !map.current) return;
    
    // Remove existing markers
    Object.values(markers.current).forEach(marker => marker.remove());
    markers.current = {};
    
    // Remove existing popups
    Object.values(popups.current).forEach(popup => popup.remove());
    popups.current = {};
    
    // Add new markers for filtered activities
    filteredActivities.forEach(activity => {
      const element = document.createElement('div');
      element.className = `marker category-${activity.category}`;
      element.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
      element.style.cursor = 'pointer';
      
      const popup = new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(`
        <div class="p-3">
          <h3 class="font-semibold text-lg">${activity.title}</h3>
          <p class="text-sm text-gray-600">${activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}</p>
        </div>
      `);
      
      const marker = new mapboxgl.Marker(element)
        .setLngLat([activity.location.lng, activity.location.lat])
        .setPopup(popup)
        .addTo(map.current!);
      
      element.addEventListener('click', () => {
        selectActivity(activity);
      });
      
      markers.current[activity.id] = marker;
      popups.current[activity.id] = popup;
    });
    
    // Show popup for selected activity
    if (selectedActivity && markers.current[selectedActivity.id]) {
      markers.current[selectedActivity.id].togglePopup();
      
      if (map.current) {
        map.current.flyTo({
          center: [selectedActivity.location.lng, selectedActivity.location.lat],
          zoom: 14,
          speed: 1.5,
        });
      }
    }
  }, [isMapLoaded, filteredActivities, selectedActivity, selectActivity]);

  // Get user location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const userLoc: Location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userLoc);
          
          if (map.current) {
            map.current.flyTo({
              center: [userLoc.lng, userLoc.lat],
              zoom: 14,
              speed: 1.5,
            });
          }
        },
        error => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser');
    }
  };

  // Handle address search
  const handleAddressSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressInput.trim() || !mapboxToken) return;
    
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(addressInput)}.json?access_token=${mapboxToken}&limit=1`)
      .then(response => response.json())
      .then(data => {
        if (data.features?.length > 0) {
          const [lng, lat] = data.features[0].center;
          const userLoc: Location = {
            lat,
            lng,
            address: data.features[0].place_name,
          };
          setUserLocation(userLoc);
          setAddressInput(data.features[0].place_name);
          
          if (map.current) {
            map.current.flyTo({
              center: [lng, lat],
              zoom: 14,
              speed: 1.5,
            });
          }
        }
      })
      .catch(error => {
        console.error('Error searching address:', error);
      });
  };

  // Update radius
  const handleRadiusChange = (value: number[]) => {
    updateMapConfig({ radius: value[0] });
  };

  // Zoom in/out
  const handleZoomIn = () => {
    if (map.current) {
      map.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (map.current) {
      map.current.zoomOut();
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px]">
      <Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your Mapbox Access Token</DialogTitle>
            <DialogDescription>
              To use the map functionality, you need to provide a Mapbox access token. 
              Visit <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">Mapbox.com</a>, 
              create an account, and get your public token from the dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="text"
              placeholder="Enter your Mapbox token here"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleTokenSubmit} disabled={!tokenInput.trim()}>
              Apply Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg text-center max-w-md">
            <p className="text-red-500 mb-2">{mapError}</p>
            <p className="mb-4">Please check your Mapbox token and try again.</p>
            <Button onClick={() => setShowTokenDialog(true)}>
              Enter New Token
            </Button>
          </div>
        </div>
      )}

      <div className="absolute top-4 left-4 z-10 w-full max-w-md">
        <form onSubmit={handleAddressSearch} className="flex space-x-2">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search for a location"
              value={addressInput}
              onChange={e => setAddressInput(e.target.value)}
              className="w-full pl-10 bg-white/90 backdrop-blur-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          </div>
          <Button type="submit" variant="default">Search</Button>
          <Button type="button" variant="outline" onClick={getUserLocation}>
            <Navigation className="w-4 h-4" />
          </Button>
        </form>
        
        {userLocation && (
          <div className="mt-4 p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Search Radius: {mapConfig.radius} km</span>
            </div>
            <Slider
              defaultValue={[mapConfig.radius]}
              max={50}
              step={1}
              onValueChange={handleRadiusChange}
            />
          </div>
        )}
      </div>
      
      <div className="absolute bottom-4 right-4 z-10 flex flex-col space-y-2">
        <Button type="button" variant="outline" size="icon" onClick={() => setShowTokenDialog(true)} className="bg-white/90 backdrop-blur-sm">
          <MapPin className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleZoomIn} className="bg-white/90 backdrop-blur-sm">
          <Plus className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleZoomOut} className="bg-white/90 backdrop-blur-sm">
          <Minus className="w-4 h-4" />
        </Button>
      </div>
      
      <div ref={mapContainer} className="w-full h-full rounded-lg shadow-lg" />
    </div>
  );
};

export default Map;
