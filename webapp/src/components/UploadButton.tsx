import React from 'react';

interface UploadButtonProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ onFileChange }) => {
  const handleButtonClick = () => {
    const fileInput = document.getElementById('file-upload-input');
    fileInput?.click();
  };

  return (
    <div className="mt-4">
      <label className="block mb-2" htmlFor="file-upload-input">
        <button
          type="button"
          className="bg-kartAI-blue text-white px-4 py-2 rounded-lg"
          onClick={handleButtonClick}
          aria-label="Upload Files"
        >
          + Last opp
        </button>
        <input
          id="file-upload-input"
          type="file"
          className="hidden"
          multiple
          onChange={onFileChange}
          aria-hidden="true"
        />
      </label>
    </div>
  );
};

export default UploadButton;
