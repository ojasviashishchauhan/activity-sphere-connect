
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Activity, ActivityRequest } from '@/types';
import { useActivity } from '@/context/ActivityContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, MapPin, X, Star, ChevronLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReviewList from './ReviewList';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface ActivityDetailProps {
  onClose: () => void;
}

interface JoinRequestForm {
  note: string;
}

const ActivityDetail: React.FC<ActivityDetailProps> = ({ onClose }) => {
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const { 
    selectedActivity, 
    requestToJoinActivity,
    approveActivityRequest,
    rejectActivityRequest
  } = useActivity();
  
  const form = useForm<JoinRequestForm>({
    defaultValues: {
      note: ''
    }
  });
  
  if (!selectedActivity) return null;
  
  const isHost = selectedActivity.hostId === 'current-user';
  const pending = selectedActivity.requests?.filter(request => request.status === 'pending') || [];
  const approved = selectedActivity.requests?.filter(request => request.status === 'approved') || [];
  const rejected = selectedActivity.requests?.filter(request => request.status === 'rejected') || [];
  
  const handleRequestJoin = (data: JoinRequestForm) => {
    requestToJoinActivity(selectedActivity.id, data.note);
    setShowJoinDialog(false);
    form.reset();
  };
  
  const handleApprove = (request: ActivityRequest) => {
    approveActivityRequest(selectedActivity.id, request.id);
  };
  
  const handleReject = (request: ActivityRequest) => {
    rejectActivityRequest(selectedActivity.id, request.id);
  };
  
  const isFull = selectedActivity.currentParticipants >= selectedActivity.capacity;
  
  return (
    <div className="p-5 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Badge className={`category-${selectedActivity.category}`}>
              {selectedActivity.category}
            </Badge>
            {selectedActivity.reviews && selectedActivity.reviews.length > 0 && (
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">
                  {(selectedActivity.reviews.reduce((sum, review) => 
                    sum + ((review.hostRating + review.activityRating) / 2), 0) / 
                    selectedActivity.reviews.length).toFixed(1)}
                </span>
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold">{selectedActivity.title}</h2>
          <div className="flex items-center mt-2">
            <img 
              src={selectedActivity.hostImage} 
              alt={selectedActivity.hostName}
              className="w-6 h-6 rounded-full mr-2"
            />
            <span className="text-sm">Hosted by {selectedActivity.hostName}</span>
          </div>
        </div>
        
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            {isHost && <TabsTrigger value="requests">
              Requests {pending.length > 0 && `(${pending.length})`}
            </TabsTrigger>}
          </TabsList>
          
          <TabsContent value="details" className="mt-6 space-y-6">
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-3 text-gray-500" />
                <span>{format(new Date(selectedActivity.date), 'EEEE, MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-3 text-gray-500" />
                <span>{selectedActivity.time}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-3 text-gray-500" />
                <span>
                  {selectedActivity.currentParticipants}/{selectedActivity.capacity} participants
                  {isFull && <span className="ml-2 text-red-500">(Full)</span>}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                <span>San Francisco</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{selectedActivity.description}</p>
            </div>
            
            <Separator />
            
            {!isHost && (
              <div>
                <AlertDialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      className="w-full"
                      disabled={isFull}
                    >
                      {isFull ? 'Activity Full' : 'Request to Join'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Request to Join {selectedActivity.title}</AlertDialogTitle>
                      <AlertDialogDescription>
                        Write a note to the host explaining why you want to join this activity.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleRequestJoin)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="note"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your note to the host</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="I'm interested in joining because..." 
                                  {...field} 
                                  className="min-h-[100px]"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction type="submit">Send Request</AlertDialogAction>
                        </AlertDialogFooter>
                      </form>
                    </Form>
                  </AlertDialogContent>
                </AlertDialog>
                
                <p className="text-sm text-gray-500 mt-2 text-center">
                  You'll receive details once the host approves your request
                </p>
              </div>
            )}
            
            {selectedActivity.reviews && selectedActivity.reviews.length > 0 && (
              <>
                <Separator />
                <ReviewList reviews={selectedActivity.reviews} />
              </>
            )}
          </TabsContent>
          
          {isHost && (
            <TabsContent value="requests" className="mt-6 space-y-6">
              {pending.length > 0 ? (
                <div>
                  <h3 className="font-semibold mb-3">Pending Requests ({pending.length})</h3>
                  <div className="space-y-3">
                    {pending.map(request => (
                      <div key={request.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <img 
                            src={request.userImage}
                            alt={request.userName}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                          <div>
                            <div className="font-medium">{request.userName}</div>
                            <div className="text-xs text-gray-500">
                              {format(new Date(request.createdAt), 'MMM d, yyyy')}
                            </div>
                          </div>
                        </div>
                        
                        {request.note && (
                          <div className="bg-white p-3 rounded mb-3 text-sm">
                            {request.note}
                          </div>
                        )}
                        
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleReject(request)}
                          >
                            Decline
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleApprove(request)}
                          >
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No pending requests
                </div>
              )}
              
              {approved.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Approved Requests ({approved.length})</h3>
                  <div className="space-y-3">
                    {approved.map(request => (
                      <div key={request.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <img 
                            src={request.userImage}
                            alt={request.userName}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                          <div>
                            <div className="font-medium">{request.userName}</div>
                            <div className="text-xs text-gray-500">
                              Approved on {format(new Date(request.createdAt), 'MMM d, yyyy')}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default ActivityDetail;
