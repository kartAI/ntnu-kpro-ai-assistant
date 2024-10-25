"use client";

import React, { useState } from 'react';
import FileList from './FileList';
import Results from './Results';
import FilePreview from './FilePreview';
import { api } from '~/trpc/react';
import type { Detection } from '~/types/detection';

const CadaidPage: React.FC = () => {
  const utils = api.useUtils(); 
  async function fetchDetection(formData: FormData): Promise<Detection[]> {
    const result = await utils.cadaid.fetchDetections.fetch({
      files: formData,
    });
  
    return result.data ?? [];
  }
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
        formData.append('file', file);
      });

      try {
        console.log(formData);
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
    <div className="p-6 min-h-screen flex flex-col md:flex-row" data-cy="main-container">
      {/* Left Column */}
      <div className="w-full md:w-1/3 md:pr-4" data-cy="left-column">
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
      <div className="w-full md:w-2/3" data-cy="right-column">
        <FilePreview files={files} />
      </div>
    </div>
  );
};

export default CadaidPage;
