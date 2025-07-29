const Image = require("../models/image");
const { uploadToCloudinary } = require("../helpers/cloudinaryHelper");
const fs = require("fs");
const cloudinary = require('../config.js/cloudinary');

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required, please upload image.",
      });
    }

    const { url, publicId } = await uploadToCloudinary(req.file.path);

    const newlyUploadedImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo?.userId,
    });

    await newlyUploadedImage.save();

    fs.unlinkSync(req.file.path);

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully.",
      image: newlyUploadedImage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message ?? "Internal server error.",
    });
  }
};

const fetchImages = async (req, res) => {
  try {
    
    const images = await Image.find({}).populate('uploadedBy');

    if (images) {
      return res.status(200).json({
        success: true,
        message: "Image fetched successfully.",
        data: images,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Image not found.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message ?? "Internal server error.",
    });
  }
};

const deleteImage = async (req, res) => {
  try {
    const imageToDelete = req.params.id;
    const deletingUser = req.userInfo?.userId;

    // Check if image exists
    const image = await Image.findById(imageToDelete);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found with the given ID.",
      });
    }

    // Authorization check
    if (image.uploadedBy.toString() !== deletingUser) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this image.",
      });
    }

    await cloudinary.uploader.destroy(image.publicId);

    // Delete the image
    const deletedImage = await Image.findByIdAndDelete(imageToDelete);

    return res.status(200).json({
      success: true,
      message: "Image has been deleted successfully.",
      data: deletedImage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal server error occurred while deleting the image.",
    });
  }
};


module.exports = {
  uploadImage,
  fetchImages,
  deleteImage,
};
