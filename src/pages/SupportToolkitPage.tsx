
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Trash2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  description: string;
}

const SupportToolkitPage = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const newFile: UploadedFile = {
        id: Date.now() + Math.random().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date().toLocaleDateString(),
        description: description || 'No description provided'
      };

      setUploadedFiles(prev => [...prev, newFile]);
    });

    setDescription('');
    toast({
      title: "Files uploaded successfully",
      description: `${files.length} file(s) added to your toolkit`,
    });
  };

  const handleDeleteFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
    toast({
      title: "File deleted",
      description: "The file has been removed from your toolkit",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#7e868b] mb-2">Support Toolkit</h1>
        <p className="text-[#7e868b]">Upload and manage your personal worksheets, resources, and therapeutic materials.</p>
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
          <div>
            <label className="block text-sm font-medium text-[#7e868b] mb-2">
              Description (optional)
            </label>
            <Textarea
              placeholder="Describe this resource or worksheet..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mb-4"
            />
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

      {/* Uploaded Files Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#7e868b]">
            <FileText className="h-5 w-5" />
            Your Resources ({uploadedFiles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {uploadedFiles.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No resources uploaded yet</p>
              <p className="text-sm text-gray-400">Upload your first worksheet or resource to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {uploadedFiles.map(file => (
                <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="h-6 w-6 text-blue-500" />
                    <div className="flex-1">
                      <h4 className="font-medium text-[#7e868b]">{file.name}</h4>
                      <p className="text-sm text-gray-600">{file.description}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)} • Uploaded {file.uploadDate}
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
                      onClick={() => handleDeleteFile(file.id)}
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

      {/* Quick Access Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#7e868b]">Quick Access Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Mood Tracking Worksheet',
              'Anxiety Management Techniques',
              'Daily Reflection Template',
              'Goal Setting Worksheet',
              'Coping Strategies List',
              'Breathing Exercise Guide'
            ].map(template => (
              <Button
                key={template}
                variant="outline"
                className="h-auto p-4 text-left justify-start"
                onClick={() => toast({ title: "Template", description: `${template} would be downloaded` })}
              >
                <div>
                  <FileText className="h-5 w-5 mb-2" />
                  <p className="font-medium">{template}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportToolkitPage;
