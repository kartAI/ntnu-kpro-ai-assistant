import type { Detection } from "../types/detection";

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
