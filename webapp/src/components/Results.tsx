import React from 'react';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import SubmissionValidation from './SubmissionValidation';
import { hasErrors } from '../utils/helpers';
import type { Detection } from '~/types/detection';

interface ResultsProps {
  results: Detection[];
}

const Results: React.FC<ResultsProps> = ({ results }) => {
  return (
    <div className="mb-6 bg-white p-4 rounded-lg">
      <h2 className="font-semibold text-lg mb-4">Resultater fra CADAiD</h2>

      <SubmissionValidation results={results} />

      <ul className="space-y-2">
        {results.map((result) => (
          <li
            key={result.file_name}
            className="flex flex-col p-3 border rounded-lg"
            aria-labelledby={`result-${result.file_name}`}
          >
            {/* Display Drawing Types */}
            {result.drawing_type && (
              <div className="mb-2">
                <b>{result.file_name}</b>
                <div className="flex items-center">
                  {hasErrors(result) ? (
                    <>
                      <FaExclamationTriangle
                        className="text-red-500 mr-1"
                        aria-hidden="true"
                      />
                      <p id={`result-${result.file_name}`} className="font-medium">
                        {Array.isArray(result.drawing_type)
                          ? result.drawing_type.join(', ')
                          : result.drawing_type}
                      </p>
                      <p className="text-red-500 ml-2">
                        {result.cardinal_direction}
                        {result.scale}
                        {result.room_names}
                      </p>
                    </>
                  ) : (
                    <>
                      <FaCheckCircle
                        className="text-green-500 mr-1"
                        aria-hidden="true"
                      />
                      <p id={`result-${result.file_name}`} className="font-medium">
                        {Array.isArray(result.drawing_type)
                          ? result.drawing_type.join(', ')
                          : result.drawing_type}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Results;