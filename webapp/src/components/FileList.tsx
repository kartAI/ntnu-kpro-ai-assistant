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
    <div className="mb-6 bg-white rounded-lg">
      <h1 className="mt-10 text-left text-3xl font-bold mb-5">CADAiD</h1>
      <span className="my-10 text-left text-xl">
        Her kan du laste opp og verifisere plantegningene dine.
      </span>
      <ul className="mt-10" data-cy="file-list">
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
