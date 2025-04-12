
import React, { useState } from 'react';
import { ActivityProvider } from '@/context/ActivityContext';
import Map from '@/components/Map';
import ActivityList from '@/components/ActivityList';
import ActivityDetail from '@/components/ActivityDetail';
import ActivityForm from '@/components/ActivityForm';
import MyActivities from '@/components/MyActivities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Menu, X, MapPin, ListFilter, UserCircle } from 'lucide-react';

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
      <div className="h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-[50] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="lg:hidden mr-2" onClick={toggleMobileSidebar}>
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-primary">ActivitySphere</h1>
          </div>
          
          <div className="lg:hidden flex">
            <Tabs value={view} onValueChange={(v) => setView(v as 'list' | 'map')}>
              <TabsList className="grid grid-cols-2 h-9">
                <TabsTrigger value="map" className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span className="sr-only sm:not-sr-only">Map</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-1">
                  <ListFilter className="w-4 h-4" />
                  <span className="sr-only sm:not-sr-only">List</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="hidden lg:flex gap-2">
            <Button variant="outline" onClick={handleShowMyActivities}>
              <UserCircle className="w-4 h-4 mr-2" />
              My Activities
            </Button>
            <Button variant="default" onClick={handleCreateActivity}>
              Create Activity
            </Button>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col lg:flex-row">
            {/* Mobile List View */}
            <div className={`lg:hidden ${view === 'list' ? 'flex-1' : 'hidden'}`}>
              <div className="h-full p-4">
                <ActivityList 
                  onCreateActivity={handleCreateActivity}
                  onShowMyActivities={handleShowMyActivities}
                />
              </div>
            </div>
            
            {/* Mobile Map View */}
            <div className={`lg:hidden ${view === 'map' ? 'flex-1' : 'hidden'}`}>
              <div className="h-full">
                <Map />
              </div>
            </div>
            
            {/* Desktop Layout */}
            <div className="hidden lg:flex lg:w-1/3 border-r p-4 overflow-y-auto">
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
        
        {/* Mobile Sidebar */}
        <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
          <SheetContent side="left" className="p-0 w-[300px] sm:w-[350px] z-[60]">
            <div className="h-full p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Filters</h2>
                <Button variant="ghost" size="icon" onClick={toggleMobileSidebar}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <ActivityList 
                onCreateActivity={handleCreateActivity}
                onShowMyActivities={handleShowMyActivities}
              />
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Activity Detail Sheet */}
        <Sheet open={showDetail} onOpenChange={setShowDetail}>
          <SheetContent side="right" className="p-0 w-[350px] sm:w-[450px] z-[60]">
            <ActivityDetail onClose={handleCloseDetail} />
          </SheetContent>
        </Sheet>
        
        {/* Create Activity Sheet */}
        <Sheet open={showCreateForm} onOpenChange={setShowCreateForm}>
          <SheetContent side="right" className="p-0 w-[350px] sm:w-[450px] z-[60]">
            <ActivityForm onClose={handleCloseCreateForm} />
          </SheetContent>
        </Sheet>
        
        {/* My Activities Sheet */}
        <Sheet open={showMyActivities} onOpenChange={setShowMyActivities}>
          <SheetContent side="right" className="p-0 w-[350px] sm:w-[450px] z-[60]">
            <MyActivities onClose={handleCloseMyActivities} />
          </SheetContent>
        </Sheet>
      </div>
    </ActivityProvider>
  );
};

export default Index;
