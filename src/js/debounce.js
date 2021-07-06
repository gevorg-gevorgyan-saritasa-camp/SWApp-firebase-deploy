/**
 * Debounce function
 *
 * @param {Function} func Function to debounce
 * @param {number} delayTime Time to delay execution of function
 * @returns {Function} Debounced function
 */
export const debounce = (func, delayTime) => {
  let timeout;
  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  return function(...args) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, delayTime);
  };
};