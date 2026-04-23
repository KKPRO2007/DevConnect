const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const sanitizeUser = require("../utils/sanitizeUser");

const getUserProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    success: true,
    message: "User profile fetched",
    user
  });
});

const updateUserProfile = catchAsync(async (req, res) => {
  if (req.user._id.toString() !== req.params.id) {
    throw new ApiError(403, "You can only update your own profile");
  }

  const updates = {
    name: req.body.name,
    bio: req.body.bio,
    avatarUrl: req.body.avatarUrl
  };

  if (req.body.password) {
    updates.password = req.body.password;
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      user[key] = value;
    }
  });

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: sanitizeUser(user)
  });
});

module.exports = {
  getUserProfile,
  updateUserProfile
};
