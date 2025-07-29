const express = require("express");
const authmiddleware = require("../middleware/authMiddleware");
const isAdminUser = require("../middleware/adminMiddleware");
const productController = require("../controllers/productController");

const { insertManyProducts, getProductStatus, getProductsAnalysis } = productController;

const router = express.Router();

router.post("/bulk-upload", authmiddleware, isAdminUser, insertManyProducts);
router.get("/stats", authmiddleware, getProductStatus);
router.get("/analysis", authmiddleware, getProductsAnalysis);


module.exports = router;
