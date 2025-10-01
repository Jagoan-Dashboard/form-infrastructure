/**
 * Centralized error handling utility
 * Mengurangi code duplication dalam error handling
 */

/**
 * Extract error message dari berbagai format error response
 */
export const extractErrorMessage = (error: any, defaultMessage?: string): string => {
  const fallback = defaultMessage || "Terjadi kesalahan saat mengirim data";

  // Axios error response
  if (error.response?.data) {
    const data = error.response.data;

    // Standard API response format: { success, message, data }
    if (data.message) {
      return data.message;
    }

    // FastAPI validation error format: { detail }
    if (data.detail) {
      // Detail bisa berupa string atau array
      if (typeof data.detail === 'string') {
        return data.detail;
      }

      // Array of validation errors
      if (Array.isArray(data.detail)) {
        return data.detail
          .map((err: any) => {
            if (typeof err === 'string') return err;
            if (err.msg) return `${err.loc?.join('.') || 'Field'}: ${err.msg}`;
            return JSON.stringify(err);
          })
          .join(', ');
      }

      return JSON.stringify(data.detail);
    }

    // Generic error object
    if (typeof data === 'object') {
      return JSON.stringify(data);
    }

    return data.toString();
  }

  // Network error atau timeout
  if (error.code === 'ECONNABORTED') {
    return 'Request timeout. Silakan coba lagi.';
  }

  if (error.code === 'ERR_NETWORK') {
    return 'Network error. Periksa koneksi internet Anda.';
  }

  // Error.message (jika ada)
  if (error.message) {
    return error.message;
  }

  return fallback;
};

/**
 * Determine if error is a client error (4xx)
 */
export const isClientError = (error: any): boolean => {
  const status = error.response?.status;
  return status >= 400 && status < 500;
};

/**
 * Determine if error is a server error (5xx)
 */
export const isServerError = (error: any): boolean => {
  const status = error.response?.status;
  return status >= 500 && status < 600;
};

/**
 * Determine if error is a network/timeout error
 */
export const isNetworkError = (error: any): boolean => {
  return error.code === 'ECONNABORTED' ||
    error.code === 'ERR_NETWORK' ||
    error.message?.includes('Network Error');
};

/**
 * Format error untuk logging (development only)
 */
export const formatErrorForLogging = (error: any): object => {
  return {
    message: extractErrorMessage(error),
    status: error.response?.status,
    statusText: error.response?.statusText,
    data: error.response?.data,
    code: error.code,
    config: {
      url: error.config?.url,
      method: error.config?.method,
      baseURL: error.config?.baseURL,
    },
  };
};
