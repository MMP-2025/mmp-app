import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download, BookmarkPlus, BookmarkCheck, File } from 'lucide-react';
import { Resource } from '@/types/resource';
import { toast } from 'sonner';
import { useAnalytics } from '@/hooks/useAnalytics';
interface ResourceCardProps {
  resource: Resource;
  isSaved: boolean;
  onToggleSave: (resourceId: string) => void;
}
const categoryColors: {
  [key: string]: string;
} = {
  worksheet: 'bg-accent/20 text-accent-foreground',
  // mental-blue
  guide: 'bg-secondary/20 text-secondary-foreground',
  // mental-green
  template: 'bg-card/50 text-card-foreground',
  // mental-peach
  reference: 'bg-primary/20 text-primary-foreground',
  // mental-beige
  default: 'bg-muted text-muted-foreground'
};
const getFileSize = (url: string): string => {
  // Estimate file sizes for placeholders - in real app this would come from API
  const estimates: Record<string, string> = {
    'anxiety-management-worksheet.pdf': '1.2 MB',
    'depression-coping-strategies-guide.pdf': '2.1 MB',
    'mindfulness-daily-practice-template.pdf': '850 KB',
    'crisis-prevention-plan.pdf': '950 KB',
    'understanding-mental-health-conditions.pdf': '3.4 MB',
    'cbt-techniques-guide.pdf': '2.8 MB',
    'sleep-hygiene-checklist.pdf': '720 KB',
    'building-healthy-relationships.pdf': '1.8 MB'
  };
  const filename = url.split('/').pop() || '';
  return estimates[filename] || '~ 1 MB';
};
const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  isSaved,
  onToggleSave
}) => {
  const { trackResourceDownload } = useAnalytics();
  const categoryStyle = categoryColors[resource.category] || categoryColors.default;

  const handleDownload = (resource: Resource) => {
    if (resource.downloadUrl) {
      trackResourceDownload(resource.id, resource.title, resource.category);
      const a = document.createElement('a');
      a.href = resource.downloadUrl;
      a.download = '';
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success(`${resource.title} is being downloaded.`);
    } else {
      toast.info('No attachment available for this resource yet.');
    }
  };
  return <div className="p-4 border rounded-lg transition-colors bg-card">
      <div className="flex items-start justify-between mb-3">
        <FileText className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
        <div className="flex gap-2 ml-2">
          <span className={`px-2 py-1 rounded-full text-xs ${categoryStyle}`}>
            {resource.category}
          </span>
          <Button variant="ghost" size="sm" onClick={() => onToggleSave(resource.id)} className="p-1">
            {isSaved ? <BookmarkCheck className="h-5 w-5 text-accent" /> : <BookmarkPlus className="h-5 w-5 text-muted-foreground" />}
          </Button>
        </div>
      </div>
      
      <div className="mb-3">
        <h4 className="font-medium text-foreground mb-2">{resource.title}</h4>
        <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
        <div className="flex items-center gap-2 mb-2">
          <span className={`inline-block px-2 py-1 rounded-full text-xs ${categoryStyle}`}>
            {resource.type}
          </span>
          {resource.downloadUrl && (
            <>
              <File className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {getFileSize(resource.downloadUrl)}
              </span>
            </>
          )}
        </div>
      </div>
      
      <Button size="sm" onClick={() => handleDownload(resource)} className="w-full bg-primary text-primary-foreground hover:opacity-90" disabled={!resource.downloadUrl}>
        <Download className="h-4 w-4 mr-2" />
        {resource.downloadUrl ? 'Download' : 'No Attachment'}
      </Button>
    </div>;
};
export default ResourceCard;