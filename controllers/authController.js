const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const registerUser = async (req, res) => {
  try {
    // 1. Extracting required fields from request body
    const { userName, email, password, role } = req.body;

    // 2. Basic validation for required fields
    if (!userName?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: "All fields (userName, email, password) are required.",
      });
    }

    // 3. Check if the user already exists in the database
    const isExistingUser = await User.findOne({ email: email.toLowerCase() });

    if (isExistingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists.",
      });
    }

    // 4. Generate a salt and hash the password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Create a new user instance (default role: 'user' if not provided)
    const newUser = new User({
      userName: userName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role ?? "user",
    });

    // 6. Save the new user to the database
    const savedUser = await newUser.save();

    // 7. Respond based on success or failure
    if (savedUser) {
      return res.status(201).json({
        success: true,
        message: "User registered successfully.",
        data: {
          id: savedUser._id,
          userName: savedUser.userName,
          email: savedUser.email,
          role: savedUser.role,
        },
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Unable to register user.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message ?? "Internal server error.",
    });
  }
};

const userLogin = async (req, res) => {
  try {
    // 1. Extract required fields from request body
    const { email, password } = req.body;

    // 2. Validate input
    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Both email and password are required.",
      });
    }

    // 3. Find user by email (case-insensitive)
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // 4. Compare password with hashed password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // 5. Generate JWT token
    const accessToken = jwt.sign(
      {
        userId: existingUser._id,
        name: existingUser.userName,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.JWT_SCRT_KEY,
      { expiresIn: "30m" }
    );

    // 6. Send success response
    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal server error.",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userId;

    console.log('userIduserId', userId);
    

    const oldPassWord = req.body?.oldPassWord;
    const newPassWord = req.body?.newPassWord;

    if(!oldPassWord?.trim() || !newPassWord.trim()){
      return res.status(400).json({
        success: false,
        message: "New password and old password must required ",
      });
    }

    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }

    const oldPasswordCorrect = await bcrypt.compare(
      oldPassWord,
      currentUser.password
    );

    if (!oldPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Old password is not correct.",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedNewPassword = await bcrypt.hash(newPassWord, salt);

    currentUser.password = hashedNewPassword;

    await currentUser.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal server error.",
    });
  }
};

module.exports = {
  registerUser,
  userLogin,
  changePassword,
};
