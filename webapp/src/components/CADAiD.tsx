"use client";

import React, { useState } from 'react';
import FileList from './FileList';
import Results from './Results';
import FilePreview from './FilePreview';
import type { Detection } from '~/types/detection';

async function fetchDetection(formData: FormData): Promise<Detection[]> {
  const response = await fetch('http://localhost:5001/detect/', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to upload files');
  }

  return response.json() as Promise<Detection[]>;
}

const CadaidPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<Detection[]>([]);
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

      setIsLoading(true);
      setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);

      const formData = new FormData();
      uploadedFiles.forEach((file) => {
        formData.append('uploaded_files', file);
      });

      try {
        const detections = await fetchDetection(formData);
        setResults((prevResults) => [...prevResults, ...detections]);
      } catch (error) {
        console.error(error);
        setErrorMessage('An error occurred while uploading files.');
      } finally {
        setIsLoading(false); // Ensure loading state is reset
      }
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

  return (
    <div className="px-20 min-h-screen flex flex-col md:flex-row" data-cy="main-container">
      {/* Left Column */}
      <div className="w-full md:w-1/3 md:pr-4 " data-cy="left-column">
        <FileList files={files} onRemove={handleFileRemove} onUpload={handleFileUpload}/>
        
        {isLoading && (
          <div className="mb-4 flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

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
      <div className="w-full md:w-2/3 pt-10" data-cy="right-column">
        <FilePreview files={files} />
      </div>
    </div>
  );
};

export default CadaidPage;
