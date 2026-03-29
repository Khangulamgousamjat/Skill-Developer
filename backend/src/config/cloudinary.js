import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Uploads a file (Buffer or Path) to Cloudinary.
 * @param {Buffer|string} file - The file content or path.
 * @param {string} folder - Destination folder on Cloudinary.
 * @returns {Promise<Object>} - Cloudinary upload result.
 */
export const uploadToCloudinary = async (file, folder = 'ssllm/certificates') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    
    // If it's a Buffer, we use standard streams
    if (Buffer.isBuffer(file)) {
      stream.end(file);
    } else {
      // If it's a URL/path, use direct upload
      cloudinary.uploader.upload(file, { folder }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    }
  });
};

export default cloudinary;
