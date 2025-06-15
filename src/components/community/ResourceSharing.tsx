
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Share2, BookOpen, ExternalLink, Heart, MessageCircle, Star, ThumbsUp, Search, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface SharedResource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'book' | 'app' | 'video' | 'podcast' | 'website';
  url?: string;
  category: string;
  tags: string[];
  sharedBy: string;
  sharedAt: number;
  rating: number;
  ratingCount: number;
  likes: number;
  comments: number;
  userRating?: number;
  liked: boolean;
}

const ResourceSharing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showShareForm, setShowShareForm] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    type: 'article',
    url: '',
    category: '',
    tags: ''
  });

  const [resources] = useState<SharedResource[]>([
    {
      id: 'resource_1',
      title: 'The Anxiety and Worry Workbook',
      description: 'A comprehensive guide with practical exercises for managing anxiety and worry. Highly recommended by therapists.',
      type: 'book',
      url: 'https://example.com/book',
      category: 'anxiety',
      tags: ['anxiety', 'self-help', 'workbook', 'CBT'],
      sharedBy: 'Sarah M.',
      sharedAt: Date.now() - 86400000,
      rating: 4.7,
      ratingCount: 23,
      likes: 45,
      comments: 12,
      liked: false
    },
    {
      id: 'resource_2',
      title: 'Headspace: Meditation Made Simple',
      description: 'Great app for beginners to meditation. Offers guided sessions and tracks your progress.',
      type: 'app',
      url: 'https://headspace.com',
      category: 'mindfulness',
      tags: ['meditation', 'app', 'guided', 'beginner-friendly'],
      sharedBy: 'Mike T.',
      sharedAt: Date.now() - 172800000,
      rating: 4.5,
      ratingCount: 67,
      likes: 89,
      comments: 24,
      liked: true
    },
    {
      id: 'resource_3',
      title: 'The Power of Now - Eckhart Tolle',
      description: 'Life-changing perspective on mindfulness and present-moment awareness. Transformed my approach to stress.',
      type: 'book',
      category: 'mindfulness',
      tags: ['mindfulness', 'spirituality', 'present-moment', 'transformation'],
      sharedBy: 'Jennifer L.',
      sharedAt: Date.now() - 259200000,
      rating: 4.8,
      ratingCount: 156,
      likes: 234,
      comments: 67,
      liked: false
    },
    {
      id: 'resource_4',
      title: 'Mental Health Toolkit Podcast',
      description: 'Weekly episodes with practical mental health strategies from leading experts. Easy to listen to during commutes.',
      type: 'podcast',
      url: 'https://example.com/podcast',
      category: 'general',
      tags: ['podcast', 'expert-advice', 'weekly', 'practical'],
      sharedBy: 'Alex R.',
      sharedAt: Date.now() - 345600000,
      rating: 4.6,
      ratingCount: 89,
      likes: 156,
      comments: 43,
      liked: true
    }
  ]);

  const resourceTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'article', label: 'Articles' },
    { value: 'book', label: 'Books' },
    { value: 'app', label: 'Apps' },
    { value: 'video', label: 'Videos' },
    { value: 'podcast', label: 'Podcasts' },
    { value: 'website', label: 'Websites' }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleLike = (resourceId: string) => {
    toast.success('Resource liked!');
  };

  const handleRate = (resourceId: string, rating: number) => {
    toast.success(`Rated ${rating} stars!`);
  };

  const handleShareResource = () => {
    if (!newResource.title || !newResource.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    toast.success('Resource shared successfully! It will be reviewed before appearing to the community.');
    setNewResource({
      title: '',
      description: '',
      type: 'article',
      url: '',
      category: '',
      tags: ''
    });
    setShowShareForm(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'book': return '📚';
      case 'app': return '📱';
      case 'video': return '🎥';
      case 'podcast': return '🎧';
      case 'website': return '🌐';
      default: return '📄';
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card className="p-4 bg-white/90">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {resourceTypes.map(type => (
              <Button
                key={type.value}
                variant={selectedType === type.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(type.value)}
                className="text-xs"
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>
        <Button 
          onClick={() => setShowShareForm(!showShareForm)} 
          className="bg-mental-green hover:bg-mental-green/80"
        >
          <Plus className="h-4 w-4 mr-2" />
          Share a Resource
        </Button>
      </Card>

      {/* Share Resource Form */}
      {showShareForm && (
        <Card className="p-6 bg-mental-green/10">
          <h3 className="text-lg font-semibold mb-4" style={{color: '#737373'}}>Share a Resource</h3>
          <div className="space-y-4">
            <Input
              placeholder="Resource title *"
              value={newResource.title}
              onChange={(e) => setNewResource({...newResource, title: e.target.value})}
            />
            <Textarea
              placeholder="Description and why you recommend it *"
              value={newResource.description}
              onChange={(e) => setNewResource({...newResource, description: e.target.value})}
              className="min-h-[100px]"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newResource.type}
                onChange={(e) => setNewResource({...newResource, type: e.target.value})}
              >
                <option value="article">Article</option>
                <option value="book">Book</option>
                <option value="app">App</option>
                <option value="video">Video</option>
                <option value="podcast">Podcast</option>
                <option value="website">Website</option>
              </select>
              <Input
                placeholder="Category (e.g., anxiety, depression)"
                value={newResource.category}
                onChange={(e) => setNewResource({...newResource, category: e.target.value})}
              />
            </div>
            <Input
              placeholder="URL (optional)"
              value={newResource.url}
              onChange={(e) => setNewResource({...newResource, url: e.target.value})}
            />
            <Input
              placeholder="Tags (comma-separated)"
              value={newResource.tags}
              onChange={(e) => setNewResource({...newResource, tags: e.target.value})}
            />
            <div className="flex gap-2">
              <Button onClick={handleShareResource} className="bg-mental-green hover:bg-mental-green/80">
                Share Resource
              </Button>
              <Button onClick={() => setShowShareForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Resources List */}
      <div className="grid gap-4">
        {filteredResources.map(resource => (
          <Card key={resource.id} className="p-6 bg-white/90">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{getTypeIcon(resource.type)}</span>
                  <h3 className="text-lg font-semibold" style={{color: '#737373'}}>{resource.title}</h3>
                  <Badge variant="outline" className="text-xs capitalize">
                    {resource.type}
                  </Badge>
                </div>
                
                <p className="text-sm mb-3" style={{color: '#737373'}}>{resource.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {resource.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center gap-4 text-sm mb-3" style={{color: '#737373'}}>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    {resource.rating.toFixed(1)} ({resource.ratingCount} reviews)
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className={`h-4 w-4 ${resource.liked ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                    {resource.likes}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {resource.comments}
                  </div>
                </div>
                
                <div className="text-xs" style={{color: '#737373'}}>
                  Shared by {resource.sharedBy} • {formatTimeAgo(resource.sharedAt)}
                </div>
              </div>
              
              <div className="flex flex-col gap-2 ml-4">
                {resource.url && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Open
                    </a>
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleLike(resource.id)}
                  className="flex items-center gap-1"
                >
                  <ThumbsUp className="h-4 w-4" />
                  {resource.liked ? 'Liked' : 'Like'}
                </Button>
              </div>
            </div>
            
            {/* Rating Section */}
            <div className="border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{color: '#737373'}}>Rate this resource:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => handleRate(resource.id, rating)}
                      className="hover:scale-110 transition-transform"
                    >
                      <Star 
                        className={`h-4 w-4 ${
                          rating <= (resource.userRating || 0) 
                            ? 'text-yellow-500 fill-yellow-500' 
                            : 'text-gray-300'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <Card className="p-8 text-center bg-white/90">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2" style={{color: '#737373'}}>No resources found</h3>
          <p style={{color: '#737373'}}>
            Try adjusting your search terms or browse different resource types.
          </p>
        </Card>
      )}
    </div>
  );
};

export default ResourceSharing;
