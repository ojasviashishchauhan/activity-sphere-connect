import React, { useState } from 'react';
import { ActivityProvider } from '@/context/ActivityContext';
import Map from '@/components/Map';
import ActivityList from '@/components/ActivityList';
import ActivityDetail from '@/components/ActivityDetail';
import ActivityForm from '@/components/ActivityForm';
import MyActivities from '@/components/MyActivities';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Plus, MapPin, ListFilter, UserCircle } from 'lucide-react';

const Index = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [view, setView] = useState<'list' | 'map'>('map');
  const [showDetail, setShowDetail] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showMyActivities, setShowMyActivities] = useState(false);
  
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };
  
  const handleCreateActivity = () => {
    setShowCreateForm(true);
    setShowDetail(false);
    setShowMyActivities(false);
  };
  
  const handleShowMyActivities = () => {
    setShowMyActivities(true);
    setShowDetail(false);
    setShowCreateForm(false);
  };
  
  const handleCloseDetail = () => {
    setShowDetail(false);
  };
  
  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
  };
  
  const handleCloseMyActivities = () => {
    setShowMyActivities(false);
  };
  
  return (
    <ActivityProvider>
      <div className="h-screen flex flex-col bg-[#F6F6F7]">
        <header className="bg-white/70 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 px-4 py-3">
          <div className="flex items-center justify-between max-w-screen-xl mx-auto">
            <h1 className="text-xl font-semibold text-[#1A1F2C]">ActivitySphere</h1>
            
            <div className="lg:hidden flex">
              <div className="flex gap-2 bg-[#F1F0FB] p-1 rounded-full">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setView('map')}
                  className={`rounded-full px-4 ${
                    view === 'map'
                      ? 'bg-white shadow-sm text-[#1A1F2C]'
                      : 'text-gray-600'
                  }`}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Map
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setView('list')}
                  className={`rounded-full px-4 ${
                    view === 'list'
                      ? 'bg-white shadow-sm text-[#1A1F2C]'
                      : 'text-gray-600'
                  }`}
                >
                  <ListFilter className="w-4 h-4 mr-2" />
                  List
                </Button>
              </div>
            </div>
            
            <div className="hidden lg:flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleShowMyActivities}
                className="rounded-full bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-sm"
              >
                <UserCircle className="w-4 h-4 mr-2" />
                My Activities
              </Button>
              <Button 
                variant="default" 
                onClick={handleCreateActivity}
                className="rounded-full bg-[#9b87f5] hover:bg-[#7E69AB] text-white shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col lg:flex-row">
            <div className={`lg:hidden ${view === 'list' ? 'flex-1' : 'hidden'}`}>
              <div className="h-full p-4">
                <ActivityList 
                  onCreateActivity={handleCreateActivity}
                  onShowMyActivities={handleShowMyActivities}
                />
              </div>
            </div>
            
            <div className={`lg:hidden ${view === 'map' ? 'flex-1' : 'hidden'}`}>
              <div className="h-full">
                <Map />
              </div>
            </div>
            
            <div className="hidden lg:flex lg:w-1/3 border-r border-gray-200/50 bg-white/80 backdrop-blur-md p-4 overflow-y-auto">
              <ActivityList 
                onCreateActivity={handleCreateActivity}
                onShowMyActivities={handleShowMyActivities}
              />
            </div>
            <div className="hidden lg:flex lg:w-2/3">
              <Map />
            </div>
          </div>
        </main>
        
        <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
          <SheetContent side="left" className="p-0 w-[300px] sm:w-[350px] z-60 bg-white/80 backdrop-blur-md">
            <div className="h-full p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#1A1F2C]">Filters</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={toggleMobileSidebar}
                  className="rounded-full"
                >
                  Done
                </Button>
              </div>
              <ActivityList 
                onCreateActivity={handleCreateActivity}
                onShowMyActivities={handleShowMyActivities}
              />
            </div>
          </SheetContent>
        </Sheet>
        
        <Sheet open={showDetail} onOpenChange={setShowDetail}>
          <SheetContent 
            side="bottom" 
            className="p-0 h-[90vh] rounded-t-xl bg-white/80 backdrop-blur-md"
          >
            <ActivityDetail onClose={handleCloseDetail} />
          </SheetContent>
        </Sheet>
        
        <Sheet open={showCreateForm} onOpenChange={setShowCreateForm}>
          <SheetContent 
            side="bottom" 
            className="p-0 h-[90vh] rounded-t-xl bg-white/80 backdrop-blur-md"
          >
            <ActivityForm onClose={handleCloseCreateForm} />
          </SheetContent>
        </Sheet>
        
        <Sheet open={showMyActivities} onOpenChange={setShowMyActivities}>
          <SheetContent 
            side="bottom" 
            className="p-0 h-[90vh] rounded-t-xl bg-white/80 backdrop-blur-md"
          >
            <MyActivities onClose={handleCloseMyActivities} />
          </SheetContent>
        </Sheet>
      </div>
    </ActivityProvider>
  );
};

export default Index;
