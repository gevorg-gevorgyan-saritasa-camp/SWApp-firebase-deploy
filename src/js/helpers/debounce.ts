/**
 * Debounce function
 *
 * @param {Function} func Function to debounce
 * @param {number} delayTime Time to delay execution of function
 * @returns {Function} Debounced function
 */
export function debounce<TArgs extends any[]>(fn: (this: void, ...args: TArgs) => unknown, delay: number): (...args: TArgs) => void {
  let timeoutID: number | null = null;
  return (...args: TArgs) => {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
    timeoutID = window.setTimeout(() => {
      fn(...args);
    }, delay);
  };
};