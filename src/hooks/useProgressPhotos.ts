import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProgressPhoto {
  id: string;
  user_id: string;
  photo_url: string;
  caption?: string;
  category?: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export const useProgressPhotos = () => {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchPhotos = async () => {
      const { data, error } = await supabase
        .from('progress_photos')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching progress photos:', error);
      } else {
        setPhotos(data || []);
      }
      setLoading(false);
    };

    fetchPhotos();
  }, [user]);

  const uploadPhoto = useCallback(async (
    file: File,
    caption?: string,
    category?: string,
    date?: string
  ) => {
    if (!user) {
      toast.error('Please sign in to upload photos');
      return;
    }

    setUploading(true);
    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('progress-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('progress-photos')
        .getPublicUrl(fileName);

      // Save photo record to database
      const { data, error } = await supabase
        .from('progress_photos')
        .insert({
          user_id: user.id,
          photo_url: publicUrl,
          caption,
          category: category || 'General',
          date: date || new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setPhotos(prev => [data, ...prev]);
        toast.success('Photo uploaded successfully');
        return data;
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  }, [user]);

  const updatePhoto = useCallback(async (id: string, updates: Partial<ProgressPhoto>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('progress_photos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating photo:', error);
      toast.error('Failed to update photo');
      return;
    }

    if (data) {
      setPhotos(prev => prev.map(photo => photo.id === id ? data : photo));
      toast.success('Photo updated');
    }
  }, [user]);

  const deletePhoto = useCallback(async (id: string, photoUrl: string) => {
    if (!user) return;

    try {
      // Extract file path from URL
      const urlParts = photoUrl.split('/progress-photos/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('progress-photos')
          .remove([filePath]);

        if (storageError) {
          console.error('Error deleting from storage:', storageError);
        }
      }

      // Delete from database
      const { error } = await supabase
        .from('progress_photos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPhotos(prev => prev.filter(photo => photo.id !== id));
      toast.success('Photo deleted');
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Failed to delete photo');
    }
  }, [user]);

  return {
    photos,
    loading,
    uploading,
    uploadPhoto,
    updatePhoto,
    deletePhoto
  };
};
