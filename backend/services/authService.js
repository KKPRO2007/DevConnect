const ApiError = require("../utils/ApiError");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const sanitizeUser = require("../utils/sanitizeUser");

async function registerUser(payload) {
  const { name, email, password, bio, avatarUrl } = payload;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(409, "User already exists with this email");
  }

  const user = await User.create({
    name,
    email,
    password,
    bio,
    avatarUrl
  });

  const token = generateToken(user._id.toString());

  return {
    token,
    user: sanitizeUser(user)
  };
}

async function loginUser(payload) {
  const { email, password } = payload;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user._id.toString());

  return {
    token,
    user: sanitizeUser(user)
  };
}

module.exports = {
  registerUser,
  loginUser
};
