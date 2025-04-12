
export type ActivityCategory = 
  | 'sports' 
  | 'arts' 
  | 'education' 
  | 'social' 
  | 'outdoors' 
  | 'other';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface ActivityRequest {
  id: string;
  userId: string;
  activityId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  userName: string;
  userImage: string;
  note?: string;
}

export interface Review {
  id: string;
  userId: string;
  activityId: string;
  hostRating: number;
  activityRating: number;
  comment: string;
  createdAt: Date;
  userName: string;
  userImage: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  location: Location;
  date: Date;
  time: string;
  capacity: number;
  currentParticipants: number;
  hostId: string;
  hostName: string;
  hostImage: string;
  createdAt: Date;
  requests?: ActivityRequest[];
  reviews?: Review[];
  isFeatured?: boolean;
}

export interface User {
  id: string;
  name: string;
  image: string;
  hostedActivities?: Activity[];
  joinedActivities?: Activity[];
}

export interface MapConfig {
  zoom: number;
  center: [number, number];
  radius: number; // in kilometers
}
