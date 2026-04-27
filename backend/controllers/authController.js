const catchAsync = require("../utils/catchAsync");
const { registerUser, loginUser } = require("../services/authService");
const { isPageRequest, buildPageRedirect } = require("../utils/pageResponse");

function getAuthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  };
}

function setAuthCookie(res, token) {
  res.cookie("token", token, {
    ...getAuthCookieOptions(),
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

const register = catchAsync(async (req, res) => {
  try {
    const result = await registerUser(req.body);

    if (isPageRequest(req)) {
      setAuthCookie(res, result.token);
      return res.redirect(buildPageRedirect("/", { success: "Account created successfully" }));
    }

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      ...result
    });
  } catch (error) {
    if (isPageRequest(req)) {
      return res.redirect(
        buildPageRedirect("/register", {
          error: error.message,
          formValues: {
            name: req.body.name,
            email: req.body.email,
            bio: req.body.bio,
            avatarUrl: req.body.avatarUrl
          }
        })
      );
    }

    throw error;
  }
});

const login = catchAsync(async (req, res) => {
  try {
    const result = await loginUser(req.body);

    if (isPageRequest(req)) {
      setAuthCookie(res, result.token);
      return res.redirect(buildPageRedirect("/", { success: "Welcome back" }));
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      ...result
    });
  } catch (error) {
    if (isPageRequest(req)) {
      return res.redirect(
        buildPageRedirect("/login", {
          error: error.message,
          formValues: {
            email: req.body.email
          }
        })
      );
    }

    throw error;
  }
});

const me = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Current user profile fetched",
    user: req.user
  });
});

const logout = (req, res) => {
  res.clearCookie("token", getAuthCookieOptions());

  if (isPageRequest(req)) {
    return res.redirect(buildPageRedirect("/login", { success: "Logged out successfully" }));
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
