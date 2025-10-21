import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, Trash2, FileText, ExternalLink } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface PDFFile {
  name: string;
  url: string;
  size: number;
  created_at: string;
}

const PDFUploadManager = () => {
  const [uploading, setUploading] = useState(false);
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    loadPDFFiles();
  }, []);

  const loadPDFFiles = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('resource-pdfs')
        .list();

      if (error) throw error;

      const files = data.map(file => ({
        name: file.name,
        url: supabase.storage.from('resource-pdfs').getPublicUrl(file.name).data.publicUrl,
        size: file.metadata?.size || 0,
        created_at: file.created_at
      }));

      setPdfFiles(files);
    } catch (error: any) {
      toast.error('Failed to load PDF files: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    // Validate file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      toast.error('File size must be less than 20MB');
      return;
    }

    setUploading(true);

    try {
      const fileName = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('resource-pdfs')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      toast.success('PDF file uploaded successfully');
      await loadPDFFiles();
      
      // Reset input
      event.target.value = '';
    } catch (error: any) {
      toast.error('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm('Are you sure you want to delete this PDF file?')) return;

    try {
      const { error } = await supabase.storage
        .from('resource-pdfs')
        .remove([fileName]);

      if (error) throw error;

      toast.success('PDF file deleted');
      await loadPDFFiles();
    } catch (error: any) {
      toast.error('Delete failed: ' + error.message);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading PDF files..." />;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="pdf-upload" className="text-lg font-semibold">
              Upload Resource PDF
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Upload therapeutic worksheets, guides, and resources (max 20MB)
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Input
              id="pdf-upload"
              type="file"
              accept="application/pdf"
              onChange={handleUpload}
              disabled={uploading}
              className="flex-1"
            />
            {uploading && <LoadingSpinner size="sm" />}
          </div>
        </div>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-4">Uploaded PDF Files ({pdfFiles.length})</h3>
        {pdfFiles.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No PDF files uploaded yet</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pdfFiles.map((file) => (
              <Card key={file.name} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="w-8 h-8 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatSize(file.size)} • {new Date(file.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(file.url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(file.name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFUploadManager;
