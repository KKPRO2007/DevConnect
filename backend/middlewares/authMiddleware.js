const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { isPageRequest, buildPageRedirect } = require("../utils/pageResponse");

function getAuthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  };
}

const protect = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : req.cookies.token;

  if (!token) {
    if (isPageRequest(req)) {
      return res.redirect(
        buildPageRedirect("/login", { error: "Please login to continue" })
      );
    }

    throw new ApiError(401, "Authentication token is required");
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (isPageRequest(req)) {
      res.clearCookie("token", getAuthCookieOptions());
      return res.redirect(buildPageRedirect("/login", { error: "Session expired. Please login again" }));
    }

    throw new ApiError(401, "Invalid or expired authentication token");
  }

  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    if (isPageRequest(req)) {
      res.clearCookie("token", getAuthCookieOptions());
      return res.redirect(buildPageRedirect("/login", { error: "User no longer exists" }));
    }

    throw new ApiError(401, "User no longer exists");
  }

  req.user = user;
  next();
});

module.exports = protect;
