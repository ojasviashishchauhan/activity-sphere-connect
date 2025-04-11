
import { Activity, ActivityCategory, Location, ActivityRequest, Review } from '@/types';

// Generate a random location near a center point with a given radius
const getRandomLocation = (center: Location, radiusKm: number): Location => {
  // Earth's radius in kilometers
  const earthRadius = 6371;
  
  // Convert radius from kilometers to radians
  const radiusInRad = radiusKm / earthRadius;
  
  // Random angle
  const randomAngle = Math.random() * Math.PI * 2;
  
  // Random radius (adjusted to get even distribution)
  const randomRadius = Math.sqrt(Math.random()) * radiusInRad;
  
  // Convert center to radians
  const centerLatRad = (center.lat * Math.PI) / 180;
  const centerLngRad = (center.lng * Math.PI) / 180;
  
  // Calculate new position
  const newLatRad = Math.asin(
    Math.sin(centerLatRad) * Math.cos(randomRadius) +
    Math.cos(centerLatRad) * Math.sin(randomRadius) * Math.cos(randomAngle)
  );
  
  const newLngRad = centerLngRad + Math.atan2(
    Math.sin(randomAngle) * Math.sin(randomRadius) * Math.cos(centerLatRad),
    Math.cos(randomRadius) - Math.sin(centerLatRad) * Math.sin(newLatRad)
  );
  
  // Convert back to degrees
  const newLat = (newLatRad * 180) / Math.PI;
  const newLng = (newLngRad * 180) / Math.PI;
  
  return { lat: newLat, lng: newLng };
};

// For development, use San Francisco as a center
const sfCenter: Location = { lat: 37.7749, lng: -122.4194 };

// Generate random locations around SF
const generateLocations = (count: number): Location[] => {
  return Array.from({ length: count }, () => getRandomLocation(sfCenter, 5));
};

// Generate random dates in the future
const generateFutureDate = (): Date => {
  const now = new Date();
  const futureDate = new Date(now);
  futureDate.setDate(now.getDate() + Math.floor(Math.random() * 30) + 1);
  return futureDate;
};

// Generate random time string
const generateRandomTime = (): string => {
  const hours = Math.floor(Math.random() * 12) + 1;
  const minutes = Math.floor(Math.random() * 4) * 15;
  const ampm = Math.random() > 0.5 ? 'AM' : 'PM';
  return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

// Categories
const categories: ActivityCategory[] = ['sports', 'arts', 'education', 'social', 'outdoors', 'other'];

// Activity titles by category
const activityTitlesByCategory: Record<ActivityCategory, string[]> = {
  sports: ['Basketball Game', 'Soccer Match', 'Tennis Tournament', 'Yoga in the Park', 'Running Group'],
  arts: ['Painting Workshop', 'Pottery Class', 'Photography Walk', 'Live Music Jam', 'Dance Class'],
  education: ['Book Club Meeting', 'Language Exchange', 'Coding Meetup', 'History Lecture', 'Science Discussion'],
  social: ['Happy Hour Meetup', 'Board Game Night', 'Networking Event', 'Dinner Party', 'Coffee Meetup'],
  outdoors: ['Hiking Trip', 'Beach Cleanup', 'Camping Weekend', 'Kayaking Adventure', 'Bird Watching'],
  other: ['Meditation Circle', 'Cooking Class', 'Wine Tasting', 'Movie Night', 'Volunteering'],
};

// Generate host images
const hostImages = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1961&q=80',
];

// Generate host names
const hostNames = [
  'Alex Johnson',
  'Jamie Smith',
  'Taylor Williams',
  'Jordan Brown',
  'Casey Garcia',
  'Riley Martinez',
  'Morgan Lee',
  'Drew Wilson',
  'Quinn Anderson',
  'Avery Thomas',
];

// Generate descriptions
const generateDescription = (category: ActivityCategory, title: string): string => {
  const descriptions: Record<ActivityCategory, string[]> = {
    sports: [
      `Join us for a casual ${title} where all skill levels are welcome. Bring your energy and enthusiasm!`,
      `Looking for teammates for our ${title}. We focus on fun and fitness rather than competition.`,
    ],
    arts: [
      `Explore your creative side at our ${title}. All materials will be provided, just bring yourself!`,
      `Express yourself through art at this beginner-friendly ${title}. No experience necessary!`,
    ],
    education: [
      `Expand your knowledge at our interactive ${title}. Come with questions and curiosity!`,
      `Learn something new at this informative ${title}. Great for beginners and experts alike.`,
    ],
    social: [
      `Meet new friends at our ${title}. Relaxed atmosphere perfect for meaningful connections.`,
      `Connect with like-minded individuals at this fun ${title}. Everyone is welcome!`,
    ],
    outdoors: [
      `Enjoy nature with us during this ${title}. Don't forget to bring water and appropriate gear!`,
      `Experience the great outdoors at our ${title}. Beautiful scenery and great company guaranteed.`,
    ],
    other: [
      `Try something different at our unique ${title}. A perfect way to break your routine!`,
      `Join this exciting ${title} for a memorable experience with awesome people.`,
    ],
  };
  
  return descriptions[category][Math.floor(Math.random() * descriptions[category].length)];
};

// Generate mock activities
export const generateMockActivities = (count: number): Activity[] => {
  const locations = generateLocations(count);
  
  return Array.from({ length: count }, (_, i) => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const categoryTitles = activityTitlesByCategory[category];
    const title = categoryTitles[Math.floor(Math.random() * categoryTitles.length)];
    const hostIndex = Math.floor(Math.random() * hostNames.length);
    
    return {
      id: `activity-${i + 1}`,
      title,
      description: generateDescription(category, title),
      category,
      location: locations[i],
      date: generateFutureDate(),
      time: generateRandomTime(),
      capacity: Math.floor(Math.random() * 20) + 5,
      currentParticipants: Math.floor(Math.random() * 5),
      hostId: `host-${hostIndex + 1}`,
      hostName: hostNames[hostIndex],
      hostImage: hostImages[hostIndex % hostImages.length],
      createdAt: new Date(),
      isFeatured: Math.random() > 0.8,
    };
  });
};

// Generate mock activity requests
export const generateMockRequests = (activities: Activity[]): ActivityRequest[] => {
  const requests: ActivityRequest[] = [];
  
  activities.forEach(activity => {
    const requestCount = Math.floor(Math.random() * 3);
    
    for (let i = 0; i < requestCount; i++) {
      const userIndex = Math.floor(Math.random() * hostNames.length);
      
      requests.push({
        id: `request-${activity.id}-${i}`,
        userId: `user-${userIndex}`,
        activityId: activity.id,
        status: Math.random() > 0.3 ? 'pending' : (Math.random() > 0.5 ? 'approved' : 'rejected'),
        createdAt: new Date(),
        userName: hostNames[userIndex],
        userImage: hostImages[userIndex % hostImages.length],
      });
    }
  });
  
  return requests;
};

// Generate mock reviews
export const generateMockReviews = (activities: Activity[]): Review[] => {
  const reviews: Review[] = [];
  
  activities.forEach(activity => {
    if (Math.random() > 0.7) {
      const reviewCount = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < reviewCount; i++) {
        const userIndex = Math.floor(Math.random() * hostNames.length);
        
        reviews.push({
          id: `review-${activity.id}-${i}`,
          userId: `user-${userIndex}`,
          activityId: activity.id,
          hostRating: Math.floor(Math.random() * 3) + 3, // 3-5 rating
          activityRating: Math.floor(Math.random() * 3) + 3, // 3-5 rating
          comment: 'Great activity! Really enjoyed the experience and meeting new people.',
          createdAt: new Date(),
          userName: hostNames[userIndex],
          userImage: hostImages[userIndex % hostImages.length],
        });
      }
    }
  });
  
  return reviews;
};

// Initial mock data
const mockActivities = generateMockActivities(30);
const mockRequests = generateMockRequests(mockActivities);
const mockReviews = generateMockReviews(mockActivities);

// Attach requests and reviews to activities
mockActivities.forEach(activity => {
  activity.requests = mockRequests.filter(request => request.activityId === activity.id);
  activity.reviews = mockReviews.filter(review => review.activityId === activity.id);
});

export const activities = mockActivities;
export const requests = mockRequests;
export const reviews = mockReviews;
