
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, FileText, Download, Search, Filter } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'worksheet' | 'guide' | 'template' | 'reference';
  type: 'PDF' | 'Article' | 'Worksheet' | 'Guide';
  downloadUrl?: string;
}

const SupportToolkitPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Pre-populated resources for patients
  const resources: Resource[] = [
    {
      id: '1',
      title: 'Anxiety Management Worksheet',
      description: 'Learn practical techniques to manage anxiety and stress in daily life.',
      category: 'worksheet',
      type: 'Worksheet'
    },
    {
      id: '2',
      title: 'Depression Coping Strategies Guide',
      description: 'Evidence-based strategies for managing depression symptoms.',
      category: 'guide',
      type: 'Guide'
    },
    {
      id: '3',
      title: 'Mindfulness Daily Practice Template',
      description: 'A structured template to help you build a consistent mindfulness practice.',
      category: 'template',
      type: 'PDF'
    },
    {
      id: '4',
      title: 'Crisis Prevention Plan',
      description: 'Template to create your personal crisis prevention and management plan.',
      category: 'template',
      type: 'Worksheet'
    },
    {
      id: '5',
      title: 'Understanding Mental Health Conditions',
      description: 'Comprehensive reference material about common mental health conditions.',
      category: 'reference',
      type: 'Article'
    },
    {
      id: '6',
      title: 'Cognitive Behavioral Therapy Techniques',
      description: 'Learn CBT techniques you can practice at home.',
      category: 'guide',
      type: 'Guide'
    },
    {
      id: '7',
      title: 'Sleep Hygiene Checklist',
      description: 'Improve your sleep quality with this comprehensive checklist.',
      category: 'worksheet',
      type: 'Worksheet'
    },
    {
      id: '8',
      title: 'Building Healthy Relationships',
      description: 'Guide to developing and maintaining healthy relationships.',
      category: 'guide',
      type: 'Article'
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryColors = {
    worksheet: 'bg-blue-100 text-blue-800',
    guide: 'bg-green-100 text-green-800',
    template: 'bg-purple-100 text-purple-800',
    reference: 'bg-orange-100 text-orange-800'
  };

  const handleDownload = (resource: Resource) => {
    // In a real app, this would trigger an actual download
    console.log(`Downloading ${resource.title}`);
    // For now, just show a placeholder message
    alert(`Downloading ${resource.title}... (This would trigger a real download in production)`);
  };

  return (
    <div className="container mx-auto p-6 space-y-6 ml-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#7e868b] mb-2">Resource Library</h1>
        <p className="text-[#7e868b]">Access helpful mental health resources, worksheets, and guides to support your wellbeing journey.</p>
      </div>

      {/* Search and Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#7e868b]">
            <Search className="h-5 w-5" />
            Find Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#7e868b] mb-2">
                Search Resources
              </label>
              <Input
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#7e868b] mb-2">
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Categories</option>
                <option value="worksheet">Worksheets</option>
                <option value="guide">Guides</option>
                <option value="template">Templates</option>
                <option value="reference">Reference Materials</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources Library */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#7e868b]">
            <BookOpen className="h-5 w-5" />
            Available Resources ({filteredResources.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredResources.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No resources found matching your criteria</p>
              <p className="text-sm text-gray-400">Try adjusting your search terms or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map(resource => (
                <div key={resource.id} className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <FileText className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
                    <span className={`px-2 py-1 rounded-full text-xs ${categoryColors[resource.category]} ml-2`}>
                      {resource.category}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <h4 className="font-medium text-[#7e868b] mb-2">{resource.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {resource.type}
                    </span>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(resource)}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#7e868b]">How to Use These Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none text-[#7e868b]">
            <ul className="space-y-2">
              <li><strong>Worksheets:</strong> Interactive tools to help you practice specific skills and techniques.</li>
              <li><strong>Guides:</strong> Comprehensive materials explaining concepts and providing step-by-step instructions.</li>
              <li><strong>Templates:</strong> Structured formats you can customize for your personal use.</li>
              <li><strong>Reference Materials:</strong> Educational content to help you better understand mental health topics.</li>
            </ul>
            <p className="mt-4 text-sm">
              These resources are designed to complement your therapy sessions and support your mental health journey. 
              If you have questions about any resource, please discuss them with your healthcare provider.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportToolkitPage;
