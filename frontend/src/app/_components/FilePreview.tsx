import React from 'react';

interface FilePreviewProps {
  selectedFile: File | null;
}

const FilePreview: React.FC<FilePreviewProps> = ({ selectedFile }) => {
  if (!selectedFile) {
    return null;
  }

  return (
    <div
      className="border p-4 rounded-lg bg-gray-50"
      role="region"
      aria-labelledby="file-preview-heading"
    >
      <h3 id="file-preview-heading" className="font-semibold mb-2">
        Preview of: {selectedFile.name}
      </h3>
      {/* Placeholder for file preview */}
      <p>File content would be shown here (mock).</p>
    </div>
  );
};

export default FilePreview;
