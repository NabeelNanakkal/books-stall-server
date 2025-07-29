var jwt = require("jsonwebtoken");

const authmiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const accessToken = authHeader && authHeader.split(" ")[1];

  if (!accessToken?.trim()) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  try {
    const decodedToken = jwt.verify(accessToken, process.env.JWT_SCRT_KEY);
    req.userInfo = decodedToken;
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  next();
};

module.exports = authmiddleware;
