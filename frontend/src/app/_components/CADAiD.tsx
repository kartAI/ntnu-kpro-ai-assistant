// CadaidPage.tsx
"use client";

import React, { useState } from 'react';
import type { Detection } from '../../types/detection';
import FileList from './FileList';
import Results from './Results';
import FilePreview from './FilePreview';

async function fetchDetection(formData: FormData): Promise<Detection[]> {
  const response = await fetch('http://localhost:5001/detect/', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to upload files');
  }

  return response.json();
}

const CadaidPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<Detection[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Handles file upload by sending selected files to the backend.
   * @param event - The file input change event.
   */
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const uploadedFiles = Array.from(event.target.files);
      if (uploadedFiles.length === 0) {
        setErrorMessage('No files selected');
        return;
      }

      const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
      const invalidFiles = uploadedFiles.filter(file => !ALLOWED_FILE_TYPES.includes(file.type));
      if (invalidFiles.length > 0) {
        setErrorMessage('Invalid file type.');
        return;
      }
      setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);

      const formData = new FormData();
      uploadedFiles.forEach((file) => {
        formData.append('uploaded_files', file);
      });

      await fetchDetection(formData).then((detections) => {
        setResults((prevResults) => [...prevResults, ...detections]);
      }).catch((error) => { 
        console.error(error);
        setErrorMessage('An error occurred while uploading files.');
      });
    }
  };

  /**
   * Removes a file and its corresponding result from the state.
   * @param fileName - The name of the file to remove.
   */
  const handleFileRemove = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter(file => file.name !== fileName));
    setResults((prevResults) => prevResults.filter(result => result.file_name !== fileName));
  };

  /**
   * Sets the selected file for preview.
   * @param fileName - The name of the file to select.
   */
  const handleSelectFile = (fileName: string) => {
    const file = files.find(file => file.name === fileName) ?? null;
    setSelectedFile(file);
  };

  return (
    <div className="p-6 min-h-screen flex flex-col md:flex-row" data-cy="main-container">
      {/* Left Column */}
      <div className="w-full md:w-1/3 md:pr-4" data-cy="left-column">
        <FileList files={files} onRemove={handleFileRemove} onUpload={handleFileUpload}/>
        {errorMessage && (
          <div
            className="mb-4 p-2 text-red-700 bg-red-100 rounded"
            role="alert"
            aria-live="assertive"
            data-cy="submission-validation"
          >
            {errorMessage}
          </div>
        )}
        <Results results={results} />
      </div>

      {/* Right Column */}
      <div className="w-full md:w-2/3" data-cy="right-column">
        {/* File Preview */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md h-full">
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
            <FilePreview selectedFile={selectedFile} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CadaidPage;
