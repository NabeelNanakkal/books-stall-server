const express = require("express");
const bookController = require("../controllers/bookController");
const authmiddleware = require("../middleware/authMiddleware");
const isAdminUser = require('../middleware/adminMiddleware');

const router = express.Router();

const { getAllBooks, getBookById, createBook, uploadMultipleBooks, updateBookById, deleteBookById } =
  bookController;

router.get("/get", authmiddleware, getAllBooks);
router.get("/get/:id", authmiddleware, getBookById);
router.post("/create", authmiddleware, isAdminUser, createBook);
router.post("/create/bulk", authmiddleware, isAdminUser, uploadMultipleBooks);
router.patch("/update/:id", authmiddleware, isAdminUser, updateBookById);
router.delete("/delete/:id", authmiddleware, isAdminUser, deleteBookById);

module. exports = router;