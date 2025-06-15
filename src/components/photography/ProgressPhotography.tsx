
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { StorageManager } from '@/utils/storage';
import { Camera, Image, Trash2, Download, Tag } from 'lucide-react';
import { toast } from 'sonner';

interface PhotoEntry {
  id: string;
  date: string;
  mood: string;
  image: string; // base64 or URL
  caption: string;
  tags: string[];
  timestamp: number;
}

const ProgressPhotography: React.FC = () => {
  const [photos, setPhotos] = useState<PhotoEntry[]>([]);
  const [currentCaption, setCurrentCaption] = useState('');
  const [currentTags, setCurrentTags] = useState('');
  const [selectedMood, setSelectedMood] = useState('');

  useEffect(() => {
    const savedPhotos = StorageManager.load<PhotoEntry[]>('progress_photos', []);
    setPhotos(savedPhotos);
  }, []);

  const moods = ['Happy', 'Peaceful', 'Motivated', 'Grateful', 'Hopeful', 'Confident'];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      savePhoto(imageData);
    };
    reader.readAsDataURL(file);
  };

  const savePhoto = (imageData: string) => {
    if (!selectedMood || !currentCaption.trim()) {
      toast.error('Please select a mood and add a caption');
      return;
    }

    const newPhoto: PhotoEntry = {
      id: `photo_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      mood: selectedMood,
      image: imageData,
      caption: currentCaption,
      tags: currentTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      timestamp: Date.now()
    };

    const updatedPhotos = [newPhoto, ...photos];
    setPhotos(updatedPhotos);
    StorageManager.save('progress_photos', updatedPhotos);

    // Reset form
    setCurrentCaption('');
    setCurrentTags('');
    setSelectedMood('');
    toast.success('Photo added to your mood board!');
  };

  const deletePhoto = (id: string) => {
    const updatedPhotos = photos.filter(photo => photo.id !== id);
    setPhotos(updatedPhotos);
    StorageManager.save('progress_photos', updatedPhotos);
    toast.success('Photo removed');
  };

  const exportMoodBoard = () => {
    const dataStr = JSON.stringify(photos, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mood-board-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Mood board exported!');
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/90">
        <h3 className="text-xl font-semibold mb-4" style={{color: '#737373'}}>Progress Photography</h3>
        <p className="text-sm mb-4" style={{color: '#737373'}}>
          Create a visual mood board to track your emotional journey through photos
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label className="mb-2 block" style={{color: '#737373'}}>Upload Photo</Label>
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4" style={{color: '#737373'}} />
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label className="mb-2 block" style={{color: '#737373'}}>Current Mood</Label>
            <div className="flex flex-wrap gap-2">
              {moods.map(mood => (
                <Badge
                  key={mood}
                  variant={selectedMood === mood ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedMood(mood)}
                >
                  {mood}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-2 block" style={{color: '#737373'}}>Caption</Label>
            <Textarea
              placeholder="Describe what this moment means to you..."
              value={currentCaption}
              onChange={e => setCurrentCaption(e.target.value)}
              className="h-20"
            />
          </div>

          <div>
            <Label className="mb-2 block" style={{color: '#737373'}}>Tags (comma-separated)</Label>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" style={{color: '#737373'}} />
              <Input
                placeholder="nature, progress, breakthrough..."
                value={currentTags}
                onChange={e => setCurrentTags(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={exportMoodBoard} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Mood Board
          </Button>
        </div>
      </Card>

      {photos.length > 0 && (
        <Card className="p-6 bg-white/90">
          <h4 className="text-lg font-semibold mb-4" style={{color: '#737373'}}>Your Mood Board</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map(photo => (
              <div key={photo.id} className="border rounded-lg p-3 bg-mental-peach/20">
                <img 
                  src={photo.image} 
                  alt={photo.caption}
                  className="w-full h-48 object-cover rounded mb-3"
                />
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary">{photo.mood}</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deletePhoto(photo.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm" style={{color: '#737373'}}>{photo.caption}</p>
                  {photo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {photo.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500">{photo.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProgressPhotography;
