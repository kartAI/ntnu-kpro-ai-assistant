import React from 'react';

interface FilePreviewProps {
  selectedFile: File | null;
}

const FilePreview: React.FC<FilePreviewProps> = ({ selectedFile }) => {
  return (
    <div className="border p-4 rounded-lg bg-gray-50">
      <h3 className="font-semibold mb-2">Preview of: {selectedFile?.name}</h3>
      {/* Placeholder for file preview */}
      <p>File content would be shown here (mock).</p>
    </div>
  );
};

export default FilePreview;
