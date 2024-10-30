import React from 'react';

interface FilePreviewProps {
  files: File[];
}

const FilePreview: React.FC<FilePreviewProps> = ({ files}) => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  /**
   * Sets the selected file for preview.
   * @param fileName - The name of the file to select.
   */
  const handleSelectFile = (fileName: string) => {
    const file = files.find(file => file.name === fileName) ?? null;
    setSelectedFile(file);
  };


  return (
    <div className="mb-6 bg-white p-4 rounded-lg h-full">
      <div className="flex flex-col sm:flex-row items-start">
        <h2 className="font-semibold text-lg mb-4 sm:mb-0 sm:text-xl">Forhåndsvisning av</h2>
        <select
          className="block border border-black bg-inherit rounded-lg mb-4 sm:mb-0 sm:ml-4 text-gray-700 w-full sm:w-auto"
          onChange={(e) => handleSelectFile(e.target.value)}
          value={selectedFile?.name ?? ''}
          aria-label="Select file to preview"
        >
          <option value="">Velg fil å vise</option>
          {files.map((file) => (
            <option key={file.name} value={file.name}>
              {file.name}
            </option>
          ))}
        </select>
      </div>

      {selectedFile && (
        <div
          className="border p-4 rounded-lg mt-2 bg-gray-50"
          role="region"
          aria-labelledby="file-preview-heading"
        >
          <h3 id="file-preview-heading" className="font-semibold mb-2">
            Preview of: {selectedFile.name}
          </h3>
          {/* Placeholder for file preview */}
          <p>File content would be shown here (mock).</p>
        </div>
      )}
    </div>
  );
};

export default FilePreview;
