import React from 'react';
import { useNavigate } from 'react-router-dom';

interface StatusCardProps {
    title: string;
    status: 'success' | 'failure';
    feedback: string;
    reportUrl: string;
}

const ResultAI: React.FC<StatusCardProps> = ({ title, status, feedback, reportUrl }) => {
    const navigate = useNavigate();

    // Handle the click event for navigating to the report page
    const handleClick = () => {
        navigate(reportUrl);
    };

    return (
        <div 
            className="border rounded-md p-4 shadow-md hover:shadow-lg transition-all cursor-pointer" 
            onClick={handleClick}
            data-test="component"
        >
            {/* Title Section */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold" data-test="component-title">
                    {title}
                </h2>
                <button 
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-all"
                    onClick={(e) => {
                        // Prevent the click from bubbling up to the parent div
                        e.stopPropagation();
                        alert('Status sent!');
                    }}
                >
                    Send Status
                </button>
            </div>

            {/* Status Section */}
            <div className="flex items-center mt-4">
                {status === 'success' ? (
                    <div className="flex items-center text-green-600" data-test="status-indicator">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth="1.5" 
                            stroke="currentColor" 
                            className="w-6 h-6 icon-checkmark"
                            data-test="icon"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span className="ml-2 text-base" data-test="feedback-text">
                            {feedback}
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center text-red-600" data-test="status-indicator">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth="1.5" 
                            stroke="currentColor" 
                            className="w-6 h-6 icon-warning"
                            data-test="icon"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M12 3.75a8.25 8.25 0 100 16.5 8.25 8.25 0 000-16.5z" />
                        </svg>
                        <span className="ml-2 text-base" data-test="feedback-text">
                            {feedback}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultAI;
