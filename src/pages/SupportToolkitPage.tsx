import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Brain, Target, Heart, Camera, Loader2, Wrench } from 'lucide-react';

import { useResourceData } from '@/hooks/useResourceData';
import { useToolkitData } from '@/hooks/useToolkitData';
import { Resource } from '@/types/resource';

import ToolkitNav from '@/components/support-toolkit/ToolkitNav';
import ResourceFilter from '@/components/support-toolkit/ResourceFilter';
import ResourceCard from '@/components/support-toolkit/ResourceCard';
import CBTModules from '@/components/therapy/CBTModules';
import CopingSkillsLibrary from '@/components/therapy/CopingSkillsLibrary';
import ExposureTherapyTracker from '@/components/therapy/ExposureTherapyTracker';
import ProgressPhotography from '@/components/photography/ProgressPhotography';
import HowToUse from '@/components/support-toolkit/HowToUse';

// Map file_type to category and type
const mapFileTypeToCategory = (fileType: string): Resource['category'] => {
  const mapping: Record<string, Resource['category']> = {
    'pdf': 'guide',
    'worksheet': 'worksheet',
    'template': 'template',
    'reference': 'reference'
  };
  return mapping[fileType.toLowerCase()] || 'guide';
};

const mapFileTypeToType = (fileType: string): Resource['type'] => {
  const mapping: Record<string, Resource['type']> = {
    'pdf': 'PDF',
    'worksheet': 'Worksheet',
    'template': 'Guide',
    'reference': 'Article'
  };
  return mapping[fileType.toLowerCase()] || 'PDF';
};

const SupportToolkitPage = () => {
  const { resources: dbResources, loading: resourcesLoading } = useResourceData();
  const { toolkitItems, loading: toolkitLoading } = useToolkitData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [savedResources, setSavedResources] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<'all' | 'saved'>('all');
  
  const loading = resourcesLoading || toolkitLoading;

  // Transform Supabase resources to match ResourceCard expected format
  const resources: Resource[] = useMemo(() => {
    return dbResources.map(r => ({
      id: r.id,
      title: r.title,
      description: r.description,
      category: mapFileTypeToCategory(r.file_type),
      type: mapFileTypeToType(r.file_type),
      downloadUrl: r.url
    }));
  }, [dbResources]);

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
    <div className="space-y-6 max-w-4xl mx-auto">
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

      {/* Comprehensive Support Toolkit Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <BookOpen className="h-5 w-5" />
            Comprehensive Support Toolkit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Provider Toolkit Items */}
          {toolkitItems.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Quick Tools & Techniques ({toolkitItems.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {toolkitItems.map(item => (
                  <Card key={item.id} className="bg-mental-blue/10 border-none">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-mental-green/20">
                          <Wrench className="h-4 w-4 text-foreground" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground mb-1">{item.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                          {item.instructions && (
                            <p className="text-sm text-foreground/80 bg-background/50 p-2 rounded-md">
                              {item.instructions}
                            </p>
                          )}
                          <span className="inline-block mt-2 px-2 py-0.5 bg-mental-peach/30 text-foreground text-xs rounded-full">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Available Resources */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Available Resources ({filteredResources.length})
            </h3>
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-mental-blue" />
                <p className="text-muted-foreground">Loading resources...</p>
              </div>
            ) : currentView === 'saved' && savedResources.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                <h4 className="text-lg font-semibold mb-2 text-foreground">No Saved Resources</h4>
                <p className="text-muted-foreground mb-4">You haven't saved any resources yet. Browse all resources and save your favorites!</p>
              </div>
            ) : filteredResources.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-muted-foreground">No resources found matching your criteria</p>
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
          </div>

          {/* Therapeutic Tools & Exercises */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Therapeutic Tools & Exercises
            </h3>
            <CBTModules />
          </div>

          {/* Exposure Therapy Tracker */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <Target className="h-5 w-5" />
              Exposure Therapy Tracker
            </h3>
            <ExposureTherapyTracker />
          </div>

          {/* Coping Skills Library */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Coping Skills Library
            </h3>
            <CopingSkillsLibrary />
          </div>

          {/* Progress Photography */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Progress Photography
            </h3>
            <ProgressPhotography />
          </div>
        </CardContent>
      </Card>

      <HowToUse />
    </div>
  );
};

export default SupportToolkitPage;
