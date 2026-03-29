/**
 * Consistent API response helper.
 * @param {boolean} success - Operation success status.
 * @param {string} message - Descriptive message.
 * @param {Object|Array} data - Payload data.
 * @param {Object} pagination - Optional pagination details.
 * @returns {Object} - Formatted response.
 */
export const apiResponse = (success, message, data = {}, pagination = null) => {
  const response = { success, message, data };
  if (pagination) response.pagination = pagination;
  return response;
};

export default apiResponse;
