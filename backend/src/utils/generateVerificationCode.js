import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique verification code for certificates.
 * Format: GOUS-VER-XXXX-XXXX
 * @returns {string} - Verification code.
 */
export const generateVerificationCode = () => {
  const segment1 = uuidv4().split('-')[0].toUpperCase();
  const segment2 = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `GOUS-VER-${segment1}-${segment2}`;
};
