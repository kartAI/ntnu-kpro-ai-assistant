// SubmissionValidation.tsx
import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Detection } from '../../types/detection';
import { requiredDrawingTypes, capitalize } from '../../utils/helpers';

interface SubmissionValidationProps {
  results: Detection[];
}

const SubmissionValidation: React.FC<SubmissionValidationProps> = ({ results }) => {
  // Aggregate all drawing types from the results
  const allDrawingTypes = results
    .flatMap((result) =>
      Array.isArray(result.drawing_type) ? result.drawing_type : [result.drawing_type]
    )
    .filter(Boolean) as string[]; // Filter out undefined and null

  // Determine missing drawing types
  const missingDrawingTypes = requiredDrawingTypes.filter(
    (type) => !allDrawingTypes.includes(type)
  );

  if (results.length === 0) {
    return (
        <div >
          For en søknad trenger man følgende tegninger:
            <ul className="list-disc list-inside ml-5">
                {requiredDrawingTypes.map((type) => (
                <li key={type}>{capitalize(type)}</li>
                ))}
            </ul>
        </div>
    );
  }
  if (missingDrawingTypes.length === 0) {
    return (
      <div
        className="mb-4 p-2 text-green-700 bg-green-100 rounded"
        role="status"
        aria-live="polite"
        data-cy="submission-validation"
      >
        <div className="flex items-center">
          <FaCheckCircle className="text-green-500 mr-1" aria-hidden="true" />
          <span>Alle tegninger er tilstede.</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mb-4 p-2 text-red-700 bg-red-100 rounded"
      role="alert"
      aria-live="assertive"
      data-cy="submission-validation"
    >
      <strong>Manglende tegninger for søknad:</strong>
      <ul className="list-disc list-inside">
        {missingDrawingTypes.map((type) => (
          <li key={type} className="flex items-center">
            <FaTimesCircle className="text-red-500 mr-1" aria-hidden="true" />
            <span>{capitalize(type)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubmissionValidation;
