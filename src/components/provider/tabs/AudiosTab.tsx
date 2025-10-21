import React from 'react';
import AudioUploadManager from '../AudioUploadManager';

const AudiosTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Meditation Audio Files</h2>
        <p className="text-muted-foreground">
          Upload and manage meditation audio files for patients to use in the Mindfulness section.
        </p>
      </div>
      <AudioUploadManager />
    </div>
  );
};

export default AudiosTab;
