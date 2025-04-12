
import React, { useState } from 'react';
import { useActivity } from '@/context/ActivityContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Calendar, Users, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { ActivityRequest } from '@/types';

interface MyActivitiesProps {
  onClose: () => void;
}

const MyActivities: React.FC<MyActivitiesProps> = ({ onClose }) => {
  const { 
    activities, 
    approveActivityRequest, 
    rejectActivityRequest 
  } = useActivity();
  const [activeTab, setActiveTab] = useState('my-activities');
  
  // Filter activities hosted by the current user
  // In a real app, you'd use the actual user ID
  const myActivities = activities.filter(activity => activity.hostId === 'current-user');
  
  // Get all pending requests for my activities
  const pendingRequests = myActivities.flatMap(activity => 
    (activity.requests || [])
      .filter(request => request.status === 'pending')
      .map(request => ({ ...request, activity }))
  );
  
  const handleApprove = (activityId: string, requestId: string) => {
    approveActivityRequest(activityId, requestId);
  };
  
  const handleReject = (activityId: string, requestId: string) => {
    rejectActivityRequest(activityId, requestId);
  };
  
  return (
    <div className="p-5 h-full overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">My Activities</h2>
      
      <Tabs defaultValue="my-activities" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="my-activities">
            My Activities
          </TabsTrigger>
          <TabsTrigger value="requests" className="relative">
            Requests
            {pendingRequests.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 min-w-5 flex items-center justify-center">
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-activities" className="space-y-4">
          {myActivities.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-md">
              <p className="text-gray-500">You haven't created any activities yet.</p>
              <Button className="mt-4" onClick={onClose}>Create Activity</Button>
            </div>
          ) : (
            myActivities.map(activity => (
              <Card key={activity.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle>{activity.title}</CardTitle>
                  <CardDescription>
                    Created {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>
                        {new Date(activity.date).toLocaleDateString()} at {activity.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>
                        {activity.currentParticipants} / {activity.capacity} participants
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="truncate">
                        {activity.location.address || `${activity.location.lat.toFixed(6)}, ${activity.location.lng.toFixed(6)}`}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {activity.category}
                    </Badge>
                    {(activity.requests || []).filter(req => req.status === 'pending').length > 0 && (
                      <Badge>
                        {(activity.requests || []).filter(req => req.status === 'pending').length} pending
                      </Badge>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="requests" className="space-y-4">
          {pendingRequests.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-md">
              <p className="text-gray-500">No pending requests</p>
            </div>
          ) : (
            pendingRequests.map(request => (
              <RequestCard 
                key={request.id} 
                request={request} 
                onApprove={handleApprove} 
                onReject={handleReject} 
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface RequestCardProps {
  request: ActivityRequest & { activity: any };
  onApprove: (activityId: string, requestId: string) => void;
  onReject: (activityId: string, requestId: string) => void;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, onApprove, onReject }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{request.userName}</CardTitle>
            <CardDescription>
              For: {request.activity.title}
            </CardDescription>
          </div>
          <div className="flex -space-x-2">
            <img 
              src={request.userImage} 
              alt={request.userName} 
              className="h-8 w-8 rounded-full border-2 border-white"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {request.note ? (
          <div className="bg-gray-50 p-3 rounded-md text-sm">
            <p className="italic">"{request.note}"</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No note provided</p>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full space-x-2">
          <Button 
            variant="outline" 
            className="flex-1 flex items-center justify-center space-x-1"
            onClick={() => onReject(request.activity.id, request.id)}
          >
            <XCircle className="h-4 w-4" />
            <span>Decline</span>
          </Button>
          <Button 
            className="flex-1 flex items-center justify-center space-x-1"
            onClick={() => onApprove(request.activity.id, request.id)}
          >
            <CheckCircle className="h-4 w-4" />
            <span>Approve</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MyActivities;
