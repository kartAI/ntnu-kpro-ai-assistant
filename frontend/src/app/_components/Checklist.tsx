'use client'
import React, { useState } from 'react';


interface SubItem {
  id: number;
  description: string;
  isComplete: boolean;
}

interface ChecklistItemProps {
  fileName: string;
  points: number;
  subItems: SubItem[];  // New prop for sub-items
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ fileName, points, subItems }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [items, setItems] = useState(subItems);  // State to track sub-items

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleSubItemCompletion = (id: number) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, isComplete: !item.isComplete } : item
    );
    setItems(updatedItems);
  };

  return (
    <div className="checklist-item border border-gray-300 rounded-lg p-4 mb-4 shadow-sm cursor-pointer">
      <div className="checklist-item-header flex justify-between items-center" onClick={toggleExpand}>
        <span className="file-name font-semibold text-lg">{fileName}</span>
        <div className="flex items-center justify-end">
        <span className="points text-gray-500">
          {points} {points === 1 ? 'punkt' : 'punkter'}
        </span>
        <span className="text-gray-500 ml-2">{isExpanded ? '▲' : '▼'}</span>
      </div>
      </div>
      {isExpanded && (
        <div className="checklist-item-content mt-3">
          <ul className="sub-items-list list-none ml-3">
            {items.map(subItem => (
              <li key={subItem.id} className="sub-item flex justify-between items-center mb-2">
                <span
                  className={`cursor-pointer ${
                    subItem.isComplete ? 'line-through text-gray-400' : 'text-black'
                  }`}
                  onClick={() => toggleSubItemCompletion(subItem.id)}
                >
                  {subItem.description}
                </span>
                <span
                  className={`cursor-pointer text-2xl ${
                    subItem.isComplete ? 'text-green-500' : 'text-gray-500'
                  }`}
                  onClick={() => toggleSubItemCompletion(subItem.id)}
                >
                  {subItem.isComplete ? '✔️' : '⭕'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


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
    subItems: []
  },
  {
    id: 3,
    fileName: 'sau.jpg',
    points: 1,
    subItems: []
  }
];

const Checklist: React.FC = () => {
  const totalPoints = checklistData.reduce((sum, item) => sum + item.points, 0);

  return (
    <div className="checklist max-w-md mx-auto p-4 border border-gray-300 rounded-lg">
      <h3 className="checklist-header text-xl font-bold mb-4 flex justify-center"
          data-cy="checklist-header">Sjekkliste</h3>
      <p className="points-summary font-semibold text-gray-600 mb-4">Punkter sjekket: {totalPoints}/10</p>
      
      <div className="progress w-full bg-gray-200 rounded-full h-4 mb-6">
        <div 
          className="progress-bar bg-green-500 h-4 rounded-full transition-all duration-300"
          style={{ width: `${(totalPoints / 10) * 100}%` }}
          role="progressbar"
          aria-valuenow={totalPoints}
          aria-valuemin={0}
          aria-valuemax={10}
        />
      </div>

      <div className="checklist-items">
        {checklistData.map(item => (
          <ChecklistItem
            key={item.id}
            fileName={item.fileName}
            points={item.points}
            subItems={item.subItems}
          />
        ))}
      </div>
    </div>
  );
};

export default Checklist;
