"use client";

import React, { useState } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';
import { Detection } from '../../types/detection';
import { hasErrors, requiredDrawingTypes } from '../../utils/helpers';
import FileList from './FileList';
import UploadButton from './UploadButton';
import Results from './Results';
import FilePreview from './FilePreview';

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
      setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);

      const formData = new FormData();
      uploadedFiles.forEach((file) => {
        formData.append('uploaded_files', file); // Ensure this matches your FastAPI parameter
      });

      try {
        const response = await fetch('http://localhost:5001/detect/', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload files');
        }

        const data: Detection[] = await response.json();
        setResults((prevResults) => [...prevResults, ...data]);
      } catch (error) {
        console.error('Error uploading files:', error);
        setErrorMessage('An error occurred while uploading files.');
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

  /**
   * Sets the selected file for preview.
   * @param fileName - The name of the file to select.
   */
  const handleSelectFile = (fileName: string) => {
    const file = files.find(file => file.name === fileName) || null;
    setSelectedFile(file);
  };

  return (
    <div className="p-6 min-h-screen flex flex-row">
      <div className="w-1/3 pr-4">
        <FileList files={files} onRemove={handleFileRemove} onUpload={handleFileUpload} />
        <Results results={results} />
      </div>

      <div className="w-2/3">
        {/* File Preview */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md h-full">
          <div className="flex items-start ">
            <h2 className="font-semibold text-lg mb-4">Forhåndsvisning av</h2>
            <select
              className="block border border-black bg-inherit rounded-lg mb-4 ml-4 text-gray-700"
              onChange={(e) => handleSelectFile(e.target.value)}
              value={selectedFile?.name || ''}
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
