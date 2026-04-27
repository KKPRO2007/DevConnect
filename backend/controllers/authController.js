const catchAsync = require("../utils/catchAsync");
const { registerUser, loginUser } = require("../services/authService");

function isPageRequest(req) {
  return !req.originalUrl.startsWith("/api/") && req.accepts("html");
}

function setAuthCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

const register = catchAsync(async (req, res) => {
  const result = await registerUser(req.body);

  if (isPageRequest(req)) {
    setAuthCookie(res, result.token);
    return res.redirect("/");
  }

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    ...result
  });
});

const login = catchAsync(async (req, res) => {
  const result = await loginUser(req.body);

  if (isPageRequest(req)) {
    setAuthCookie(res, result.token);
    return res.redirect("/");
  }

  res.status(200).json({
    success: true,
    message: "Login successful",
    ...result
  });
});

const me = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Current user profile fetched",
    user: req.user
  });
});

const logout = (req, res) => {
  res.clearCookie("token");

  if (isPageRequest(req)) {
    return res.redirect("/login");
  }

  return res.status(200).json({
    success: true,
    message: "Logout successful"
  });
};

module.exports = {
  register,
  login,
  me,
  logout
};
