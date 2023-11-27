const jwt = require("jsonwebtoken");
const { errorHandler } = require("./error");

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) return next(errorHandler(401, "Unauthorized user"));
    const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
    if (!verifiedUser) return next(errorHandler(401, "Unauthorized user"));
    req.user = verifiedUser;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = verifyToken;
