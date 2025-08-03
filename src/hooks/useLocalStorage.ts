import { useState, useEffect, useCallback } from 'react';
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storageUtils';

/**
 * Generic hook for localStorage operations
 * @param key - The localStorage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns [value, setValue, removeValue]
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  // Initialize state with value from localStorage or default
  const [value, setValue] = useState<T>(() => {
    return getStorageItem(key, defaultValue);
  });

  // Update localStorage whenever value changes
  useEffect(() => {
    setStorageItem(key, value);
  }, [key, value]);

  // Function to remove the item from localStorage
  const removeValue = useCallback(() => {
    removeStorageItem(key);
    setValue(defaultValue);
  }, [key, defaultValue]);

  return [value, setValue, removeValue] as const;
}