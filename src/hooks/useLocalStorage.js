import { useState, useEffect } from 'react';
import * as Sentry from '@sentry/browser';

function useLocalStorage(key, initialValue) {
  // Create state based on checking localStorage
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      Sentry.captureException(error);
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      Sentry.captureException(error);
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Update stored value if the key changes
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
      Sentry.captureException(error);
      console.error(`Error updating localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue];
}

export default useLocalStorage;