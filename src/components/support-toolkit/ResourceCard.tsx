
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download, BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { Resource } from '@/types/resource';
import { toast } from 'sonner';

interface ResourceCardProps {
  resource: Resource;
  isSaved: boolean;
  onToggleSave: (resourceId: string) => void;
}

const categoryColors: { [key: string]: string } = {
  worksheet: 'bg-accent/20 text-accent-foreground', // mental-blue
  guide: 'bg-secondary/20 text-secondary-foreground', // mental-green
  template: 'bg-card/50 text-card-foreground', // mental-peach
  reference: 'bg-primary/20 text-primary-foreground', // mental-beige
  default: 'bg-muted text-muted-foreground'
};

const handleDownload = (resource: Resource) => {
  console.log(`Downloading ${resource.title}`);
  toast.info(`Downloading: ${resource.title}`, {
    description: 'This is a placeholder for a real file download.'
  });
};

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, isSaved, onToggleSave }) => {
  const categoryStyle = categoryColors[resource.category] || categoryColors.default;

  return (
    <div className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <FileText className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
        <div className="flex gap-2 ml-2">
          <span className={`px-2 py-1 rounded-full text-xs ${categoryStyle}`}>
            {resource.category}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleSave(resource.id)}
            className="p-1"
          >
            {isSaved ? (
              <BookmarkCheck className="h-5 w-5 text-accent" />
            ) : (
              <BookmarkPlus className="h-5 w-5 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>
      
      <div className="mb-3">
        <h4 className="font-medium text-[#7e868b] mb-2">{resource.title}</h4>
        <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
        <span className={`inline-block px-2 py-1 rounded-full text-xs ${categoryStyle}`}>
          {resource.type}
        </span>
      </div>
      
      <Button
        size="sm"
        onClick={() => handleDownload(resource)}
        className="w-full bg-mental-blue hover:bg-mental-blue/80"
      >
        <Download className="h-4 w-4 mr-2" />
        Download
      </Button>
    </div>
  );
};

export default ResourceCard;
