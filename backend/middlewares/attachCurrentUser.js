const jwt = require("jsonwebtoken");

const User = require("../models/User");

async function attachCurrentUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    res.locals.currentUser = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    req.currentUser = user || null;
    res.locals.currentUser = user || null;
  } catch (error) {
    req.currentUser = null;
    res.locals.currentUser = null;
    res.clearCookie("token");
  }

  return next();
}

module.exports = attachCurrentUser;
