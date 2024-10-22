import React from 'react';
import { FaTrash } from 'react-icons/fa';
import UploadButton from './UploadButton';

interface FileListProps {
  files: File[];
  onRemove: (fileName: string) => void;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileList: React.FC<FileListProps> = ({ files, onRemove, onUpload }) => {
  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
      <h1 className="font-bold mb-4">CADAiD</h1>
      <ul className="space-y-2">
        {files.map((file) => (
          <li key={file.name} className="flex items-center justify-between p-3 border rounded-lg">
            <span className="font-medium">{file.name}</span>
              <button
                className="cursor-pointer hover:text-red-700"
                onClick={() => onRemove(file.name)}
                aria-label={`Remove file ${file.name}`}
              >
                <FaTrash />
              </button>
          </li>
        ))}
      </ul>
      <UploadButton onFileChange={onUpload} />
    </div>
  );
};

export default FileList;
