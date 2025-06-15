
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, BookmarkPlus } from 'lucide-react';
import { Resource } from '@/types/resource';
import ResourceCard from './ResourceCard';

interface ResourceListProps {
  resources: Resource[];
  savedResources: string[];
  currentView: 'all' | 'saved';
  onToggleSave: (resourceId: string) => void;
  onBrowseAll: () => void;
}

const ResourceList: React.FC<ResourceListProps> = ({
  resources,
  savedResources,
  currentView,
  onToggleSave,
  onBrowseAll,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#7e868b]">
          <BookOpen className="h-5 w-5" />
          Available Resources ({resources.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {currentView === 'saved' && savedResources.length === 0 ? (
          <div className="text-center py-8">
            <BookmarkPlus className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold mb-2 text-[#7e868b]">No Saved Resources</h3>
            <p className="text-gray-500 mb-4">You haven't saved any resources yet. Browse all resources and save your favorites!</p>
            <Button 
              onClick={onBrowseAll} 
              className="bg-mental-blue hover:bg-mental-blue/80"
            >
              Browse All Resources
            </Button>
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No resources found matching your criteria</p>
            <p className="text-sm text-gray-400">Try adjusting your search terms or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map(resource => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                isSaved={savedResources.includes(resource.id)}
                onToggleSave={onToggleSave}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResourceList;
