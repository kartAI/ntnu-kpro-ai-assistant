"use client";

import { has } from 'node_modules/cypress/types/lodash';
import React, { useState } from 'react';
import { FaTrash, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';

interface Detection {
  file_name: string;
  drawing_type?: string | string[]; // Could be a string or an array of strings
  scale?: string;
  room_names?: string;
  cardinal_direction?: string;
}

const requiredDrawingTypes: string[] = ['plantegning', 'fasade', 'situasjonskart', 'snitt'];

const CadaidPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<Detection[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const uploadedFiles = Array.from(event.target.files);
      setFiles([...files, ...uploadedFiles]);

      // Create a FormData object to send files
      const formData = new FormData();
      uploadedFiles.forEach((file) => {
        formData.append('uploaded_files', file); // Ensure this matches your FastAPI parameter
      });

      try {
        // Send the files to the FastAPI server
        const response = await fetch('http://localhost:5001/detect/', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload files');
        }

        const data: Detection[] = await response.json();
        console.log('Detection results:', data);
        // Update the results state with the response
        setResults((prevResults) => [...prevResults, ...data]);
      } catch (error) {
        console.error('Error uploading files:', error);
        setErrorMessage('An error occurred while uploading files.');
      }
    }
  };

  const handleFileRemove = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName));
    setResults(results.filter(result => result.file_name !== fileName));
  };

  const handleSelectFile = (fileName: string) => {
    const file = files.find(file => file.name === fileName);
    setSelectedFile(file || null);
  };

  // Helper function to check if a Detection object has errors
  const hasErrors = (result: Detection): boolean => {
    // If there are any fields other than file_name and drawing_type, it's an error
    return (
      result.scale !== undefined ||
      result.room_names !== undefined ||
      result.cardinal_direction !== undefined
      // Add more fields if necessary
    );
  };

  return (
    <div className="p-6 min-h-screen flex flex-row">
      <div className="w-1/3 pr-4">
        {/* File List */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
          <h1 className="font-bold mb-4">CADAiD</h1>
          <ul className="space-y-2">
            {files.map((file) => (
              <li key={file.name} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">{file.name}</span>
                <FaTrash
                  className="cursor-pointer hover:text-red-700"
                  onClick={() => handleFileRemove(file.name)}
                />
              </li>
            ))}
          </ul>
         
          <div className="mt-4">
            <label className="block mb-2">
              <button
                className="bg-kartAI-blue text-white px-4 py-2 rounded-lg"
                onClick={() => document.getElementById('file-upload-input')?.click()}
              >
                + Last opp
              </button>
              <input
                id="file-upload-input"
                type="file"
                className="hidden"
                multiple
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
          <h2 className="font-semibold text-lg mb-4">Results from CADAiD</h2>
          

          <ul className="space-y-2">
            {results.map((result) => (
              <li key={result.file_name} className="flex flex-col p-3 border rounded-lg">
                {/* Display Drawing Types */}
                {result.drawing_type && (
                  <div className="mb-2">
                    <div className='flex'>
                      {hasErrors(result) ? (
                        <>
                          <FaExclamationTriangle className="text-red-500 mr-1" />
                          <p>{result.drawing_type}</p>
                          <p className='text-red-500'> {result.cardinal_direction} {result.scale} {result.room_names}</p>
                        </>
                        ) : (
                          <>
                          <FaCheckCircle className="text-green-500 mr-1" />
                          <p>{result.drawing_type}</p>
                        </>
                        )}
                    </div>
                  </div>
                )}

              </li>
            ))}
          </ul>
            {/* Submission Validation */}
            {results.length > 0 && (
              <SubmissionValidation results={results} />
            )}
  
            {errorMessage && (
              <div className="text-red-500 mb-4">
                {errorMessage}
              </div>
            )}
            
        </div>
      </div>

      <div className="w-2/3">
        {/* File Preview */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md h-full">
          <div className="flex items-start ">
            <h2 className="font-semibold text-lg mb-4">Forhåndsvisning av </h2>
            <select
              className="block border border-black bg-inherit rounded-lg mb-4 text-gray-00"
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
            <div className="border p-4 rounded-lg bg-gray-50">
              <h3 className="font-semibold mb-2">Preview of: {selectedFile.name}</h3>
              {/* Placeholder for file preview */}
              <p>File content would be shown here (mock).</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


interface SubmissionValidationProps {
  results: Detection[];
}

const SubmissionValidation: React.FC<SubmissionValidationProps> = ({ results }) => {
  // Aggregate all drawing types from the results
  const allDrawingTypes = results.flatMap((result) =>
    Array.isArray(result.drawing_type) ? result.drawing_type : [result.drawing_type]
  ).filter(Boolean) as string[]; // Filter out undefined

  // Determine missing drawing types
  const missingDrawingTypes = requiredDrawingTypes.filter(
    (type) => !allDrawingTypes.includes(type)
  );


  return (
    <div className="mb-4 p-2 text-red-700 rounded">
      {missingDrawingTypes.map((type) => (
        <div key={type} className="flex items-center">
          <FaTimesCircle className="text-red-500 mr-1" />
          {type}
        </div>
      ))}
    </div>
  );
};

export default CadaidPage;
