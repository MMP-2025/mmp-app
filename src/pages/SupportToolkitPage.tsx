
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Trash2, Download, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProviderResource {
  id: string;
  name: string;
  type: string;
  category: 'worksheet' | 'guide' | 'template' | 'reference';
  description: string;
  uploadDate: string;
}

const SupportToolkitPage = () => {
  const [resources, setResources] = useState<ProviderResource[]>([]);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProviderResource['category']>('worksheet');
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const newResource: ProviderResource = {
        id: Date.now() + Math.random().toString(),
        name: file.name,
        type: file.type,
        category: category,
        description: description || 'No description provided',
        uploadDate: new Date().toLocaleDateString()
      };

      setResources(prev => [...prev, newResource]);
    });

    setDescription('');
    toast({
      title: "Resources uploaded successfully",
      description: `${files.length} resource(s) added to your toolkit`,
    });
  };

  const handleDeleteResource = (id: string) => {
    setResources(prev => prev.filter(resource => resource.id !== id));
    toast({
      title: "Resource deleted",
      description: "The resource has been removed from your toolkit",
    });
  };

  const categoryColors = {
    worksheet: 'bg-blue-100 text-blue-800',
    guide: 'bg-green-100 text-green-800',
    template: 'bg-purple-100 text-purple-800',
    reference: 'bg-orange-100 text-orange-800'
  };

  return (
    <div className="container mx-auto p-6 space-y-6 ml-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#7e868b] mb-2">Provider Support Toolkit</h1>
        <p className="text-[#7e868b]">Upload and manage resources, worksheets, and materials for your practice.</p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#7e868b]">
            <Upload className="h-5 w-5" />
            Upload New Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#7e868b] mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProviderResource['category'])}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="worksheet">Worksheet</option>
                <option value="guide">Guide</option>
                <option value="template">Template</option>
                <option value="reference">Reference Material</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#7e868b] mb-2">
                Description
              </label>
              <Input
                placeholder="Brief description of the resource..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">
                Click to upload files or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PDF, DOC, TXT, JPG, PNG files supported
              </p>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Resources Library */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#7e868b]">
            <FileText className="h-5 w-5" />
            Your Resource Library ({resources.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {resources.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No resources uploaded yet</p>
              <p className="text-sm text-gray-400">Upload your first resource to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {resources.map(resource => (
                <div key={resource.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="h-6 w-6 text-blue-500" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-[#7e868b]">{resource.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs ${categoryColors[resource.category]}`}>
                          {resource.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{resource.description}</p>
                      <p className="text-xs text-gray-500">
                        Uploaded {resource.uploadDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast({ title: "Download", description: "Download functionality would be implemented here" })}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteResource(resource.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportToolkitPage;
