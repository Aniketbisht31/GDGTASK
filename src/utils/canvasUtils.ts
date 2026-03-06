/**
 * Utility functions for canvas element manipulation and formatting
 */

/** Generate a unique ID for new elements */
export const generateId = (): string => crypto.randomUUID();

/** Format numbers for display in the UI (e.g. coordinates, dimensions) */
export const formatLabelValue = (val: number): number => Math.round(val);

/** Generate a random HSL color string */
export const generateRandomColor = (): string => {
    return `hsl(${Math.floor(Math.random() * 360)}, 65%, 65%)`;
};

/** Get a default name for an element based on its type */
export const getDefaultName = (type: string, count: number): string => {
    return `${type.charAt(0).toUpperCase() + type.slice(1)} ${count}`;
};
