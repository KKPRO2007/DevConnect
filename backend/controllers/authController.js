const catchAsync = require("../utils/catchAsync");
const { registerUser, loginUser } = require("../services/authService");

const register = catchAsync(async (req, res) => {
  const result = await registerUser(req.body);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    ...result
  });
});

const login = catchAsync(async (req, res) => {
  const result = await loginUser(req.body);

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

module.exports = {
  register,
  login,
  me
};
