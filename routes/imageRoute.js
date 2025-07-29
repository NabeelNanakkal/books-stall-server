const express = require("express");
const authmiddleware = require("../middleware/authMiddleware");
const isAdminUser = require("../middleware/adminMiddleware");
const fileUploadMiddleWare = require("../middleware/fileUploadMiddleware");
const { uploadImage, fetchImages, deleteImage } = require("../controllers/imageController");

const router = express.Router();

router.post(
  "/upload",
  authmiddleware,
  isAdminUser,
  fileUploadMiddleWare.single("image"),
  uploadImage
);

router.get('/', authmiddleware, fetchImages);
router.delete('/delete/:id', authmiddleware, deleteImage);


module.exports = router;