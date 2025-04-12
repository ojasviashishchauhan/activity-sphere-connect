import React, { createContext, useContext, useState, useEffect } from 'react';
import { Activity, ActivityCategory, Location, ActivityRequest, Review, MapConfig } from '@/types';
import { activities as mockActivities, requests as mockRequests, reviews as mockReviews } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

// Default map configuration (San Francisco)
const DEFAULT_MAP_CONFIG: MapConfig = {
  zoom: 12,
  center: [-122.4194, 37.7749],
  radius: 5, // 5 km radius
};

interface ActivityContextType {
  activities: Activity[];
  filteredActivities: Activity[];
  selectedActivity: Activity | null;
  userLocation: Location | null;
  mapConfig: MapConfig;
  categoryFilter: ActivityCategory | 'all';
  searchQuery: string;
  hoveredActivityId: string | null;
  
  selectActivity: (activity: Activity | null) => void;
  setUserLocation: (location: Location | null) => void;
  updateMapConfig: (config: Partial<MapConfig>) => void;
  setCategoryFilter: (category: ActivityCategory | 'all') => void;
  setSearchQuery: (query: string) => void;
  setHoveredActivityId: (id: string | null) => void;
  
  createActivity: (activity: Partial<Activity>) => void;
  requestToJoinActivity: (activityId: string, note?: string) => void;
  approveActivityRequest: (activityId: string, requestId: string) => void;
  rejectActivityRequest: (activityId: string, requestId: string) => void;
  submitActivityReview: (review: Partial<Review>) => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [mapConfig, setMapConfig] = useState<MapConfig>(DEFAULT_MAP_CONFIG);
  const [categoryFilter, setCategoryFilter] = useState<ActivityCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredActivityId, setHoveredActivityId] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Initialize with mock data
  useEffect(() => {
    setActivities(mockActivities);
  }, []);

  // Filter activities based on category, search query, and radius
  useEffect(() => {
    let filtered = [...activities];
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(activity => activity.category === categoryFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        activity => 
          activity.title.toLowerCase().includes(query) || 
          activity.description.toLowerCase().includes(query)
      );
    }
    
    // Apply radius filter if user location is available
    if (userLocation) {
      filtered = filtered.filter(activity => {
        const distance = calculateDistance(
          userLocation.lat, 
          userLocation.lng, 
          activity.location.lat, 
          activity.location.lng
        );
        return distance <= mapConfig.radius;
      });
    }
    
    setFilteredActivities(filtered);
  }, [activities, categoryFilter, searchQuery, userLocation, mapConfig.radius]);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  };

  const selectActivity = (activity: Activity | null) => {
    setSelectedActivity(activity);
  };

  const updateMapConfig = (config: Partial<MapConfig>) => {
    setMapConfig(prev => ({ ...prev, ...config }));
  };

  const createActivity = (activityData: Partial<Activity>) => {
    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      title: activityData.title || 'Untitled Activity',
      description: activityData.description || '',
      category: activityData.category || 'other',
      location: activityData.location || { lat: 0, lng: 0 },
      date: activityData.date || new Date(),
      time: activityData.time || '12:00 PM',
      capacity: activityData.capacity || 10,
      currentParticipants: 1, // Host is the first participant
      hostId: 'current-user', // Would be replaced with actual user ID
      hostName: 'Current User', // Would be replaced with actual user name
      hostImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80',
      createdAt: new Date(),
      requests: [],
      reviews: [],
    };
    
    setActivities(prev => [...prev, newActivity]);
    toast({
      title: "Activity Created",
      description: "Your activity has been successfully created.",
    });
  };

  const requestToJoinActivity = (activityId: string, note?: string) => {
    const newRequest: ActivityRequest = {
      id: `request-${Date.now()}`,
      userId: 'current-user',
      activityId,
      status: 'pending',
      createdAt: new Date(),
      userName: 'Current User',
      userImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80',
      note: note || ''
    };
    
    setActivities(prev => 
      prev.map(activity => 
        activity.id === activityId
          ? { ...activity, requests: [...(activity.requests || []), newRequest] }
          : activity
      )
    );
    
    toast({
      title: "Request Sent",
      description: "Your request to join this activity has been sent.",
    });
  };

  const approveActivityRequest = (activityId: string, requestId: string) => {
    setActivities(prev => 
      prev.map(activity => {
        if (activity.id === activityId) {
          const updatedRequests = (activity.requests || []).map(request => 
            request.id === requestId ? { ...request, status: 'approved' as const } : request
          );
          
          return { 
            ...activity, 
            requests: updatedRequests,
            currentParticipants: activity.currentParticipants + 1
          };
        }
        return activity;
      })
    );
    
    toast({
      title: "Request Approved",
      description: "You've approved the request to join your activity.",
    });
  };

  const rejectActivityRequest = (activityId: string, requestId: string) => {
    setActivities(prev => 
      prev.map(activity => {
        if (activity.id === activityId) {
          const updatedRequests = (activity.requests || []).map(request => 
            request.id === requestId ? { ...request, status: 'rejected' as const } : request
          );
          
          return { ...activity, requests: updatedRequests };
        }
        return activity;
      })
    );
    
    toast({
      title: "Request Rejected",
      description: "You've rejected the request to join your activity.",
    });
  };

  const submitActivityReview = (reviewData: Partial<Review>) => {
    if (!reviewData.activityId) return;
    
    const newReview: Review = {
      id: `review-${Date.now()}`,
      userId: 'current-user',
      activityId: reviewData.activityId,
      hostRating: reviewData.hostRating || 5,
      activityRating: reviewData.activityRating || 5,
      comment: reviewData.comment || '',
      createdAt: new Date(),
      userName: 'Current User',
      userImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80',
    };
    
    setActivities(prev => 
      prev.map(activity => 
        activity.id === reviewData.activityId
          ? { ...activity, reviews: [...(activity.reviews || []), newReview] }
          : activity
      )
    );
    
    toast({
      title: "Review Submitted",
      description: "Your review has been successfully submitted.",
    });
  };

  return (
    <ActivityContext.Provider
      value={{
        activities,
        filteredActivities,
        selectedActivity,
        userLocation,
        mapConfig,
        categoryFilter,
        searchQuery,
        hoveredActivityId,
        
        selectActivity,
        setUserLocation,
        updateMapConfig,
        setCategoryFilter,
        setSearchQuery,
        setHoveredActivityId,
        
        createActivity,
        requestToJoinActivity,
        approveActivityRequest,
        rejectActivityRequest,
        submitActivityReview,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = (): ActivityContextType => {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};
