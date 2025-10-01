/**
 * API-related constants
 * Centralized constants untuk menghindari magic values
 */

/**
 * Floor count mapping untuk TataBangunan
 */
export const FLOOR_COUNT_MAPPING = {
  lainnya: 4,
} as const;

/**
 * Default values untuk form fields
 */
export const DEFAULT_VALUES = {
  reporter: {
    name: 'Default Reporter',
    role: 'Public',
    village: 'Default Village',
    district: 'Default District',
  },
  phone: '000000000000',
} as const;

/**
 * API Response status
 */
export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

/**
 * HTTP Status codes yang sering digunakan
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
