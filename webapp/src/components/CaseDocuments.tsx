'use client'
import React from 'react';

interface Document {
  name: string;
  url: string;
}

interface DocumentsComponentProps {
  documents: Document[];
}

const CaseDocumentsComponent: React.FC<DocumentsComponentProps> = ({ documents }) => {
  return (
    <div className="border rounded-lg p-4 max-w-lg mx-auto">
      <h2 className="flex justify-center text-lg font-semibold mb-4" data-cy="case-documents-header">Sakens dokumenter</h2>
      <ul>
        {documents.map((doc, index) => (
          <li
            key={index}
            className="flex justify-between items-center py-2 border-b last:border-none"
          >
            <span className="text-gray-700">{doc.name}</span>
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              {/* Icon placeholder for Tailwind */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7H7v10h10v-6m-1-6h5v5m0 0L10 16m4-4l-6 6"
                />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CaseDocumentsComponent;