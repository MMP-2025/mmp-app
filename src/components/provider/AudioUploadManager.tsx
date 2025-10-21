import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, Trash2, Music } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface AudioFile {
  name: string;
  url: string;
  size: number;
  created_at: string;
}

const AudioUploadManager = () => {
  const [uploading, setUploading] = useState(false);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    loadAudioFiles();
  }, []);

  const loadAudioFiles = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('meditation-audios')
        .list();

      if (error) throw error;

      const files = data.map(file => ({
        name: file.name,
        url: supabase.storage.from('meditation-audios').getPublicUrl(file.name).data.publicUrl,
        size: file.metadata?.size || 0,
        created_at: file.created_at
      }));

      setAudioFiles(files);
    } catch (error: any) {
      toast.error('Failed to load audio files: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      toast.error('Please upload an audio file');
      return;
    }

    // Validate file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      toast.error('File size must be less than 20MB');
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('meditation-audios')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      toast.success('Audio file uploaded successfully');
      await loadAudioFiles();
      
      // Reset input
      event.target.value = '';
    } catch (error: any) {
      toast.error('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm('Are you sure you want to delete this audio file?')) return;

    try {
      const { error } = await supabase.storage
        .from('meditation-audios')
        .remove([fileName]);

      if (error) throw error;

      toast.success('Audio file deleted');
      await loadAudioFiles();
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
    return <LoadingSpinner size="lg" text="Loading audio files..." />;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="audio-upload" className="text-lg font-semibold">
              Upload Meditation Audio
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Upload MP3, WAV, or other audio files (max 20MB)
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Input
              id="audio-upload"
              type="file"
              accept="audio/*"
              onChange={handleUpload}
              disabled={uploading}
              className="flex-1"
            />
            {uploading && <LoadingSpinner size="sm" />}
          </div>
        </div>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-4">Uploaded Audio Files ({audioFiles.length})</h3>
        {audioFiles.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            <Music className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No audio files uploaded yet</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {audioFiles.map((file) => (
              <Card key={file.name} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Music className="w-8 h-8 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatSize(file.size)} • {new Date(file.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <audio controls className="max-w-xs">
                      <source src={file.url} type="audio/mpeg" />
                    </audio>
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

export default AudioUploadManager;
