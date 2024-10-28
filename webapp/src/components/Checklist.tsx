'use client'
import React, { useState } from 'react';

export interface SubItem {
  id: string;
  description: string;
  isComplete: boolean;
}

export interface ChecklistItemProps {
  fileName: string;
  points: number;
  subItems: SubItem[];
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ fileName, points, subItems }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [items, setItems] = useState(subItems);  // State to track sub-items

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleSubItemCompletion = (id: string) => {
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


export interface ChecklistItemData {
  id: string;
  fileName: string;
  points: number;
  subItems: SubItem[];
}


const Checklist: React.FC<{checklist : ChecklistItemData[]}> = ({ checklist }) => {
  const totalPoints = checklist.reduce((sum, item) => sum + item.points, 0);

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
        {checklist.map(item => (
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
