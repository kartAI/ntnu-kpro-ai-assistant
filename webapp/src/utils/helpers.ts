import { ChecklistItemData, SubItem } from "~/components/Checklist";
import type { Detection } from "../types/detection";
import { v4 as uuidv4 } from 'uuid';

export const requiredDrawingTypes: string[] = [
  "plantegning",
  "fasade",
  "situasjonskart",
  "snitt",
];

const NON_VALID_DRAWING_TYPES_VALUES = [
  "Er du sikker på at dette er en byggesakstegning?",
];
/**
 * Checks if a Detection object contains any error fields.
 * @param result - The Detection object to check.
 * @returns True if there are errors, false otherwise.
 */
export const hasErrors = (result: Detection): boolean => {
  return (
    result.scale !== undefined ||
    result.room_names !== undefined ||
    result.cardinal_direction !== undefined ||
    NON_VALID_DRAWING_TYPES_VALUES.includes(
      result.drawing_type?.toString() ?? "",
    )
  );
};

/**
 * Capitalizes the first letter of a string.
 * @param str - The string to capitalize.
 * @returns The capitalized string.
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};


export const transformDetectionToChecklist = (detections: Detection[]): ChecklistItemData[] => {
  const checklistData: ChecklistItemData[] = [] 
  detections.forEach((detection) => {
    const subItems: SubItem[] = transformDetectionToSubItem(detection);
    checklistData.push({
      id: uuidv4(),
      fileName: detection.file_name,
      points: subItems.length, 
      subItems: subItems,
    });
  })
  return checklistData;
}

const transformDetectionToSubItem = (detection: Detection): SubItem[] => {
  const points = [detection.scale, detection.cardinal_direction, detection.room_names].filter(Boolean).length
  const isComplete: Boolean = points == 0;

  const subItemScale = {
    id: uuidv4(),
    description: detection.scale ?? "",
    isComplete: !!detection.scale,
  }
  const subItemCardinalDirection = {
    id: uuidv4(),
    description: detection.cardinal_direction ?? "",
    isComplete: !!detection.cardinal_direction,
  }
  const subItemRoomNames = {
    id: uuidv4(),
    description: detection.room_names ?? "",
    isComplete: !!detection.room_names,
  }

  return [subItemCardinalDirection, subItemScale, subItemRoomNames].filter((item) => !item.isComplete);

}