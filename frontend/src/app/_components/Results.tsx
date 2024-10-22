import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';
import { Detection } from '../../types/detection';
import { hasErrors, capitalize, requiredDrawingTypes } from '../../utils/helpers';
import SubmissionValidation from './SubmissionValidation';

interface ResultsProps {
  results: Detection[];
}

const Results: React.FC<ResultsProps> = ({ results }) => {
  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
      <h2 className="font-semibold text-lg mb-4">Resultater fra CADAiD</h2>

      {/* Submission Validation */}
      {results.length > 0 && (
        <SubmissionValidation results={results} />
      )}

      {results.length === 0 && (
        <div >
          For en søknad trenger man følgende tegninger:
            <ul className="list-disc list-inside ml-5">
                {requiredDrawingTypes.map((type) => (
                <li key={type}>{capitalize(type)}</li>
                ))}
            </ul>
        </div>
      )}

      <ul className="space-y-2">
        {results.map((result) => (
          <li key={result.file_name} className="flex flex-col p-3 border rounded-lg">
            {/* Display Drawing Types */}
            {result.drawing_type && (
              <div className="mb-2">
                <div className="flex items-center">
                  {hasErrors(result) ? (
                    <>
                      <FaExclamationTriangle className="text-red-500 mr-1" />
                      <p className="font-medium">
                        {Array.isArray(result.drawing_type) ? capitalize(result.drawing_type.join(', ')) : result.drawing_type}
                      </p>
                      <p className="text-red-500 ml-2">
                        {result.cardinal_direction}
                        {result.scale}
                        {result.room_names}
                      </p>
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="text-green-500 mr-1" />
                      <p className="font-medium">
                        {Array.isArray(result.drawing_type) ? capitalize(result.drawing_type.join(', ')) : result.drawing_type}
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
