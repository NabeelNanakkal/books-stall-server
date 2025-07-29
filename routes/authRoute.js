const express = require("express");
const userController = require("../controllers/authController");
const authmiddleware = require("../middleware/authMiddleware");

const { registerUser, userLogin, changePassword } = userController;

const router = express.Router();

router.post('/registration', registerUser);
router.post('/login', userLogin);
router.post('/resetPassword', authmiddleware, changePassword);


module.exports = router;
