import React, { useState } from 'react';
import { ChecklistItemData } from './Checklist';

export interface FeedbackProps {
    checklist: ChecklistItemData[];
}

const FeedbackSender: React.FC<FeedbackProps> = ({ checklist }) => {
  const [feedbackText, setFeedbackText] = useState("");

  const handleSendFeedback = (status: string) => {
    const checklistSummary = checklist.map((checklist) => ({
      fileName: checklist.fileName,
      subItems: checklist.subItems.map((subItem) => ({
        id: subItem.id,
        description: subItem.description,
        isComplete: subItem.isComplete,
      })),
    }));

    alert(
      `Status: ${status}\nFeedback: ${feedbackText}\nChecklist: ${JSON.stringify(
        checklistSummary,
        null,
        2
      )}`
    );
  };

  return (
    <div className="border p-4 rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold" data-cy="feedback-header">Tilbakemeldinger til innsender</h2>
        <button className="bg-kartAI-blue text-white px-4 py-2 rounded-md">Send tilbakemelding</button>
      </div>
      <div className="mb-4">
        <h3 className='text-lg mb-2 font-semibold'>Oversikt over innsendte dokumenter og potensielle mangler:</h3>
        {checklist.map((checklistData) => (
          <div key={checklistData.id} className="mb-4 ml-10">
            <h3 className="font-semibold mb-2">{checklistData.fileName}</h3>
            {checklistData.subItems.map((subItem) => (
              <div key={subItem.id} className="flex items-center mb-2">
                <li>
                    <label>{subItem.description}</label>
                </li>
              </div>
            ))}
          </div>
        ))}
        <h3 className='text-lg mt-10 font-semibold'>Skriv tilbakemelding:</h3>
      </div>
      <textarea
        placeholder="Skriv her ..."
        className="w-full p-2 mb-4 border rounded-md"
        rows={4}
        value={feedbackText}
        onChange={(e) => setFeedbackText(e.target.value)}
      ></textarea>
      <div className="flex justify-around">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md"
          onClick={() => handleSendFeedback("Delvis godkjenn")}
        >
          Delvis godkjenn
        </button>
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded-md"
          onClick={() => handleSendFeedback("Delvis avslå søknad")}
        >
          Delvis avslå søknad
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md"
          onClick={() => handleSendFeedback("Avslå søknad")}
        >
          Avslå søknad
        </button>
      </div>
    </div>
  );
};

export default FeedbackSender;