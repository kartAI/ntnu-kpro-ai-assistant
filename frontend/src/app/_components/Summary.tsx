'use client'

import React from 'react';

interface SummaryProps {
    summaryData: string[]; // Accepts an array of strings as props
}


const Summary: React.FC<SummaryProps> = ({ summaryData }) => {
    return (
        <div className="border border-gray-300 rounded-lg p-6 shadow-sm bg-blue-50 max-w-lg mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-black" data-cy="summary-header">
                Saken oppsummert:
            </h3>
            <ul className="list-disc space-y-3 pl-5">
                {summaryData.map((description, index) => (
                    <li key={index} className="summary-item text-sm text-gray-800">
                        <p>{description}</p>
                    </li>
                ))}
            </ul>
            <p className="text-xs text-gray-500 mt-6 text-center" data-cy="summary-warning">
                Oppsummering er laget av en KI-tjeneste og kan inneholde feil.
            </p>
        </div>
    );
}

export default Summary;
