import QRCode from 'qrcode';

/**
 * Generates a Data URL for a QR code representing the given text.
 * @param {string} text - The content of the QR code (e.g., verification URL).
 * @returns {Promise<string>} - Base64 Data URL of the QR code image.
 */
export const generateQRCode = async (text) => {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      margin: 1,
      color: {
        dark: '#1E3A5F', // Primary Dark Navy
        light: '#FFFFFF'
      }
    });
  } catch (err) {
    console.error('QR Generation Error:', err);
    throw new Error('Failed to generate verification QR code');
  }
};
