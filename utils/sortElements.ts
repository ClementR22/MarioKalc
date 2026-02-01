// utils/sortElements.ts
import { TFunction } from "i18next";

// Define a common interface for elements that can be sorted.
// This interface should reflect the properties available on your actual ElementDataCharacterMK8D, ElementDataBody, etc.
// Add all properties you might need for sorting (like various speed/handling stats).

/**
 * Sorts an array of elements based on a given order number and language.
 *
 * @param elements The array of elements to sort.
 * @param sortNumber A number representing the sorting strategy (even for ascending, odd for descending).
 * @param language The language to use for alphabetical sorting.
 * @returns A new array with the elements sorted according to the specified strategy.
 */

const sortMap = [
  "id",
  "name",
  "speedGround",
  "speedAntiGravity",
  "speedWater",
  "speedAir",
  "handlingGround",
  "handlingAntiGravity",
  "handlingWater",
  "handlingAir",
  "acceleration",
  "weight",
  "traction",
  "miniTurbo",
  "coin",
] as const;

export const sortElements = <T>(
  elements: T[],
  sortNumber: number,
  t: TFunction = ((key: string) => key) as unknown as TFunction,
): T[] => {
  const sortKey = sortMap[Math.floor(sortNumber / 2)] as keyof T;
  const ascending = sortNumber % 2 === 0;

  if (!sortKey) {
    console.warn(`Unknown sortNumber: ${sortNumber}. Returning unsorted elements.`);
    return [...elements];
  }

  const sorted = [...elements];

  sorted.sort((a, b) => {
    const aValue = a[sortKey] as unknown;
    const bValue = b[sortKey] as unknown;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return ascending ? t(aValue).localeCompare(t(bValue)) : t(bValue).localeCompare(t(aValue));
    }

    return ascending ? Number(aValue ?? 0) - Number(bValue ?? 0) : Number(bValue ?? 0) - Number(aValue ?? 0);
  });

  return sorted;
};
