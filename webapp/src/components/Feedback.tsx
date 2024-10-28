import React from 'react';

interface SubItem {
  id: number;
  description: string;
  isComplete: boolean;
}

interface ChecklistItemData {
  id: number;
  fileName: string;
  points: number;
  subItems: SubItem[];
}

const checklistData: ChecklistItemData[] = [
  {
    id: 1,
    fileName: 'Plantegning.pdf',
    points: 3,
    subItems: [
      { id: 1, description: 'Mangler himmelretning', isComplete: false },
      { id: 2, description: 'Mangler målestokk', isComplete: true },
      { id: 3, description: 'Mangler rombenevnelse', isComplete: false }
    ]
  },
  {
    id: 2,
    fileName: 'byggesak.xml',
    points: 4,
    subItems: [
      { id: 1, description: 'Mangler eiendomsnummer', isComplete: false },
      { id: 2, description: 'Mangler målestokk', isComplete: true },
      { id: 3, description: 'Mangler rombenevnelse', isComplete: true },
      { id: 4, description: 'Eier og gårdsnummer stemmer ikke overens', isComplete: false }
    ]
  },
  {
    id: 3,
    fileName: 'sau.jpg',
    points: 1,
    subItems: []
  }
];

const Feedback: React.FC = () => {
  // Aggregate all incomplete subitems across all files
  const incompleteItems = checklistData
    .flatMap(item => item.subItems
      .filter(subItem => !subItem.isComplete)
      .map(subItem => ({ fileName: item.fileName, description: subItem.description }))
    );

  return (
    <div className="p-4 border rounded-lg shadow-md w-1/2">
      {/* Feedback Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-md font-semibold" data-cy="feedback-header">Tilbakemeldinger til innsender</h2>
        <button className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-700">
          Send tilbakemelding
        </button>
      </div>

      {/* Incomplete items list */}
      {incompleteItems.length > 0 ? (
        <div className="mt-3">
          <ul className="list-disc list-inside text-sm text-gray-800">
            {incompleteItems.map((item, index) => (
              <li key={index}>
                {item.fileName}: {item.description}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-green-600 mt-2">All items are complete!</p>
      )}

      {/* Textarea for comments */}
      <textarea
        className="w-full mt-3 p-2 border rounded-md text-sm"
        placeholder="Skriv her ..."
      />

      {/* Action buttons */}
      <div className="flex justify-between m-3 space-x-4">
        <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
          Delvis godkjenn
        </button>
        <button className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
          Delvis avslå søknad
        </button>
        <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
          Avslå søknad
        </button>
      </div>
    </div>
  );
};

export default Feedback;
