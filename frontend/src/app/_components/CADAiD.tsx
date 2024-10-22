"use client";

import React, { useState } from 'react';
import { FaTrash, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';

interface FileType {
  name: string;
  type: 'complete' | 'deficient' | 'missing';
}

const CadaidPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<FileType[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles([...files, ...Array.from(event.target.files)]);
    }
  };

  const handleFileRemove = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName));
  };

  const handleSelectFile = (fileName: string) => {
    const file = files.find(file => file.name === fileName);
    setSelectedFile(file || null);
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
              <li key={result.name} className="flex items-center p-3 border rounded-lg">
                {result.type === 'complete' && (
                  <FaCheckCircle className="text-green-500 mr-2" />
                )}
                {result.type === 'deficient' && (
                  <FaExclamationTriangle className="text-orange-500 mr-2" />
                )}
                {result.type === 'missing' && (
                  <FaTimesCircle className="text-red-500 mr-2" />
                )}
                <span className="font-medium">{result.name}</span>
              </li>
            ))}
          </ul>
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

export default CadaidPage;
