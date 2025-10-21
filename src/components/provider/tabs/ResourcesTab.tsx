import React from 'react';
import PDFUploadManager from '../PDFUploadManager';

const ResourcesTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Resource PDF Files</h2>
        <p className="text-muted-foreground">
          Upload and manage therapeutic worksheets, guides, and educational resources for patients.
        </p>
      </div>
      <PDFUploadManager />
    </div>
  );
};

export default ResourcesTab;
