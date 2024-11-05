'use client'
import React, { useEffect, useState } from 'react';

export interface SubItem {
  id: string;
  description: string;
  isComplete: boolean;
}

export interface ChecklistItemProps {
  fileName: string;
  points: number;
  subItems: SubItem[];
  onToggleSubItem: (fileName: string, subItemId: string) => void;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ fileName, points, subItems, onToggleSubItem }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="checklist-item border border-gray-300 rounded-lg p-4 mb-4 shadow-sm">
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
            {subItems.map(subItem => (
              <li key={subItem.id} className="sub-item flex justify-between items-center mb-2">
                <span
                  className={`cursor-pointer ${
                    subItem.isComplete ? 'line-through text-gray-400' : 'text-black'
                  }`}
                  onClick={() => onToggleSubItem(fileName, subItem.id)}
                >
                  {subItem.description}
                </span>
                <span
                  className={`cursor-pointer text-2xl ${
                    subItem.isComplete ? 'text-green-500' : 'text-gray-500'
                  }`}
                  onClick={() => onToggleSubItem(fileName, subItem.id)}
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

const Checklist: React.FC<{ checklist: ChecklistItemData[] }> = ({ checklist }) => {
  // Initialize checklist as state to allow updates
  const [checklistState, setChecklistState] = useState<ChecklistItemData[]>(checklist);
  const [completedPoints, setCompletedPoints] = useState(0);

  useEffect(() => {
    // Calculate completed points whenever checklistState changes
    const totalCompleted = checklistState.reduce((sum, item) => {
      const completedSubItems = item.subItems.filter(subItem => subItem.isComplete);
      return sum + completedSubItems.length;
    }, 0);
    setCompletedPoints(totalCompleted);
  }, [checklistState]);

  // Handler to toggle sub-item completion
  const handleToggleSubItem = (fileName: string, subItemId: string) => {
    const updatedChecklist = checklistState.map(item => {
      if (item.fileName === fileName) {
        const updatedSubItems = item.subItems.map(subItem =>
          subItem.id === subItemId ? { ...subItem, isComplete: !subItem.isComplete } : subItem
        );
        return { ...item, subItems: updatedSubItems };
      }
      return item;
    });
    setChecklistState(updatedChecklist);
  };

  const totalPoints = checklistState.reduce((sum, item) => sum + item.points, 0);

  return (
    <div className="w-full checklist mx-auto p-4 border border-gray-300 rounded-lg">
      <h3
        className="checklist-header text-xl font-bold mb-4 flex justify-center"
        data-cy="checklist-header"
      >
        Sjekkliste
      </h3>
      <p className="points-summary font-semibold text-gray-600 mb-4">
        Punkter sjekket: {completedPoints}/{totalPoints}
      </p>

      <div className="progress w-full bg-gray-200 rounded-full h-4 mb-6">
        <div
          className="progress-bar bg-green-500 h-4 rounded-full transition-all duration-300"
          style={{ width: `${(completedPoints / totalPoints) * 100}%` }}
          role="progressbar"
          aria-valuenow={completedPoints}
          aria-valuemin={0}
          aria-valuemax={totalPoints}
        />
      </div>

      <div className="checklist-items">
        {checklistState.map(item => (
          <ChecklistItem
            key={item.id}
            fileName={item.fileName}
            points={item.points}
            subItems={item.subItems}
            onToggleSubItem={handleToggleSubItem}
          />
        ))}
      </div>
    </div>
  );
};

export default Checklist;
