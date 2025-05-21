/**
 * Utility functions for working with localStorage
 */

/**
 * Set an item in localStorage with optional error handling
 * @param {string} key - The key to store the value under
 * @param {any} value - The value to store, will be JSON stringified
 * @param {Function} [onError] - Optional error handler
 * @returns {boolean} - True if successful, false otherwise
 */
export const setItem = (key, value, onError) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    if (onError && typeof onError === 'function') {
      onError(error);
    } else {
      console.error('Error storing data in localStorage:', error);
    }
    return false;
  }
};

/**
 * Get an item from localStorage with optional error handling
 * @param {string} key - The key to retrieve
 * @param {any} [defaultValue] - Default value if item doesn't exist or on error
 * @param {Function} [onError] - Optional error handler
 * @returns {any} - The parsed value or defaultValue
 */
export const getItem = (key, defaultValue = null, onError) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    if (onError && typeof onError === 'function') {
      onError(error);
    } else {
      console.error('Error retrieving data from localStorage:', error);
    }
    return defaultValue;
  }
};

/**
 * Get multiple items from localStorage at once
 * @param {string[]} keys - Array of keys to retrieve
 * @param {Object} [defaultValues] - Object with default values for each key
 * @param {Function} [onError] - Optional error handler
 * @returns {Object} - Object containing all requested key-value pairs
 */
export const getItems = (keys, defaultValues = {}, onError) => {
  const result = {};
  
  keys.forEach(key => {
    result[key] = getItem(
      key, 
      defaultValues[key] !== undefined ? defaultValues[key] : null,
      onError
    );
  });
  
  return result;
};

/**
 * Remove an item from localStorage
 * @param {string} key - The key to remove
 * @param {Function} [onError] - Optional error handler
 * @returns {boolean} - True if successful, false otherwise
 */
export const removeItem = (key, onError) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    if (onError && typeof onError === 'function') {
      onError(error);
    } else {
      console.error('Error removing data from localStorage:', error);
    }
    return false;
  }
};

/**
 * Clear all items from localStorage
 * @param {Function} [onError] - Optional error handler
 * @returns {boolean} - True if successful, false otherwise
 */
export const clearAll = (onError) => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    if (onError && typeof onError === 'function') {
      onError(error);
    } else {
      console.error('Error clearing localStorage:', error);
    }
    return false;
  }
};