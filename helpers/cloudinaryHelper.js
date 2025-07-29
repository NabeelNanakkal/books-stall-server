

const cloudinary = require("../config.js/cloudinary");

const uploadToCloudinary = async (filePath) => {

  try {
    // FIX 1: Add 'await' - cloudinary.uploader.upload returns a Promise
    const result = await cloudinary.uploader.upload(filePath);
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    throw new Error("Cloudinary image upload error");
  }
};

module.exports = { uploadToCloudinary }; 