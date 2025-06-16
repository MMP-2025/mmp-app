
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Brain, Target, Heart, Camera } from 'lucide-react';

import { resources } from '@/data/resources';
import { Resource } from '@/types/resource';

import ToolkitNav from '@/components/support-toolkit/ToolkitNav';
import ResourceFilter from '@/components/support-toolkit/ResourceFilter';
import ResourceCard from '@/components/support-toolkit/ResourceCard';
import CBTModules from '@/components/therapy/CBTModules';
import CopingSkillsLibrary from '@/components/therapy/CopingSkillsLibrary';
import ExposureTherapyTracker from '@/components/therapy/ExposureTherapyTracker';
import ProgressPhotography from '@/components/photography/ProgressPhotography';
import HowToUse from '@/components/support-toolkit/HowToUse';

const SupportToolkitPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [savedResources, setSavedResources] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<'all' | 'saved'>('all');

  const toggleSaved = (resourceId: string) => {
    setSavedResources(prev => {
      const isCurrentlySaved = prev.includes(resourceId);
      if (isCurrentlySaved) {
        toast.success('Resource removed from saved');
        return prev.filter(id => id !== resourceId);
      } else {
        toast.success('Resource saved!');
        return [...prev, resourceId];
      }
    });
  };

  const getDisplayedResources = () => {
    let filtered = resources;
    
    if (currentView === 'saved') {
      filtered = resources.filter(resource => savedResources.includes(resource.id));
    }
    
    return filtered.filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  const filteredResources = getDisplayedResources();

  return (
    <div className="container mx-auto p-6 space-y-6 ml-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Support Toolkit</h1>
        <p className="text-foreground">Access comprehensive mental health resources, therapeutic tools, and support materials for your wellbeing journey.</p>
      </div>
      
      <ToolkitNav 
        currentView={currentView}
        setCurrentView={setCurrentView}
        savedResourcesCount={savedResources.length}
      />

      <ResourceFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Available Resources Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#7e868b]">
            <BookOpen className="h-5 w-5" />
            Available Resources ({filteredResources.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentView === 'saved' && savedResources.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold mb-2 text-[#7e868b]">No Saved Resources</h3>
              <p className="text-gray-500 mb-4">You haven't saved any resources yet. Browse all resources and save your favorites!</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No resources found matching your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map(resource => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  isSaved={savedResources.includes(resource.id)}
                  onToggleSave={toggleSaved}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Therapeutic Tools & Exercises Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Brain className="h-5 w-5" />
            Therapeutic Tools & Exercises
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">CBT Modules</h3>
              <CBTModules />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exposure Therapy Tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Target className="h-5 w-5" />
            Exposure Therapy Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ExposureTherapyTracker />
        </CardContent>
      </Card>

      {/* Coping Skills Library */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Heart className="h-5 w-5" />
            Coping Skills Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CopingSkillsLibrary />
        </CardContent>
      </Card>

      {/* Progress Photography */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Camera className="h-5 w-5" />
            Progress Photography
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressPhotography />
        </CardContent>
      </Card>

      <HowToUse />
    </div>
  );
};

export default SupportToolkitPage;
