
import React, { useState } from 'react';
import { toast } from 'sonner';

import { resources } from '@/data/resources';
import { Resource } from '@/types/resource';

import ResourceLibraryHeader from '@/components/support-toolkit/ResourceLibraryHeader';
import ToolkitNav from '@/components/support-toolkit/ToolkitNav';
import ResourceFilter from '@/components/support-toolkit/ResourceFilter';
import ResourceList from '@/components/support-toolkit/ResourceList';
import TherapeuticTools from '@/components/support-toolkit/TherapeuticTools';
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
      <ResourceLibraryHeader />
      
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

      <ResourceList 
        resources={filteredResources}
        savedResources={savedResources}
        currentView={currentView}
        onToggleSave={toggleSaved}
        onBrowseAll={() => setCurrentView('all')}
      />

      <TherapeuticTools />
      
      <HowToUse />
    </div>
  );
};

export default SupportToolkitPage;
