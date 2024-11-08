import React from "react";
import { FaTrash } from "react-icons/fa";
import UploadButton from "./UploadButton";

interface FileListProps {
  files: File[];
  onRemove: (fileName: string) => void;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileList: React.FC<FileListProps> = ({ files, onRemove, onUpload }) => {
  return (
    <div className="mb-6 rounded-lg bg-white">
      <ul className="mt-10" data-cy="file-list">
        {files.map((file) => (
          <li
            key={file.name}
            className="flex items-center justify-between rounded-lg border p-3"
          >
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
