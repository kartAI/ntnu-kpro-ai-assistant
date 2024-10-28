import React from 'react';
import { ChecklistItemData } from './Checklist';

export interface FeedbackProps {
    checklist: ChecklistItemData[];
}

const FeedbackSender: React.FC<FeedbackProps> = ({ checklist }) => {
  return (
    <div className="border p-4 rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Tilbakemeldinger til innsender</h2>
        <button className="bg-blue-900 text-white px-4 py-2 rounded-md">Send tilbakemelding</button>
      </div>
      <div className="mb-4">
        {checklist.map((checklistData) => (
          <div key={checklistData.id} className="mb-4">
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
      </div>
      <textarea
        placeholder="Skriv her ..."
        className="w-full p-2 mb-4 border rounded-md"
        rows={4}
      ></textarea>
      <div className="flex justify-around">
        <button className="bg-green-500 text-white px-4 py-2 rounded-md">Delvis godkjenn</button>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded-md">Delvis avslå søknad</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded-md">Avslå søknad</button>
      </div>
    </div>
  );
};

export default FeedbackSender;