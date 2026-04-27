const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

function getPageMessage(req) {
  return {
    error: req.query.error || "",
    success: req.query.success || ""
  };
}

function ensurePageAuth(req, res) {
  if (!req.currentUser) {
    res.redirect("/login?error=Please login to continue");
    return false;
  }

  return true;
}

async function renderHome(req, res, next) {
  try {
    const search = (req.query.search || "").trim();
    const filters = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } },
            { excerpt: { $regex: search, $options: "i" } }
          ]
        }
      : {};

    const [posts, users, totalUsers] = await Promise.all([
      Post.find(filters)
        .populate("author", "name avatarUrl")
        .sort({ createdAt: -1 })
        .limit(12),
      User.find()
        .select("name avatarUrl")
        .sort({ createdAt: -1 })
        .limit(12),
      User.countDocuments()
    ]);

    res.render("pages/dashboard", {
      pageTitle: "DevConnect",
      posts,
      users,
      totalUsers,
      search,
      ...getPageMessage(req)
    });
  } catch (error) {
    next(error);
  }
}

function renderLogin(req, res) {
  if (req.currentUser) {
    return res.redirect("/");
  }

  return res.render("pages/login", {
    pageTitle: "Login",
    formValues: {
      email: req.query.email || ""
    },
    ...getPageMessage(req)
  });
}

function renderRegister(req, res) {
  if (req.currentUser) {
    return res.redirect("/");
  }

  return res.render("pages/register", {
    pageTitle: "Register",
    formValues: {
      name: req.query.name || "",
      email: req.query.email || "",
      bio: req.query.bio || "",
      avatarUrl: req.query.avatarUrl || ""
    },
    ...getPageMessage(req)
  });
}

function renderCreatePost(req, res) {
  if (!ensurePageAuth(req, res)) {
    return;
  }

  res.render("pages/createPost", {
    pageTitle: "Create Post",
    formValues: {
      title: req.query.title || "",
      excerpt: req.query.excerpt || "",
      tags: req.query.tags || "",
      content: req.query.content || ""
    },
    ...getPageMessage(req)
  });
}

async function renderSinglePost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name bio avatarUrl email");

    if (!post) {
      return res.status(404).render("pages/post", {
        pageTitle: "Post Not Found",
        post: null,
        comments: [],
        commentDraft: "",
        ...getPageMessage(req)
      });
    }

    const comments = await Comment.find({ post: post._id })
      .populate("author", "name avatarUrl")
      .sort({ createdAt: -1 });

    return res.render("pages/post", {
      pageTitle: post.title,
      post,
      comments,
      commentDraft: req.query.commentDraft || "",
      ...getPageMessage(req)
    });
  } catch (error) {
    return next(error);
  }
}

async function renderProfile(req, res, next) {
  if (!ensurePageAuth(req, res)) {
    return;
  }

  try {
    const posts = await Post.find({ author: req.currentUser._id })
      .populate("author", "name avatarUrl")
      .sort({ createdAt: -1 })
      .limit(20);

    res.render("pages/profile", {
      pageTitle: "Your Profile",
      profileUser: req.currentUser,
      posts,
      formValues: {
        name: req.query.name || req.currentUser.name || "",
        bio: req.query.bio || req.currentUser.bio || "",
        avatarUrl: req.query.avatarUrl || req.currentUser.avatarUrl || ""
      },
      ...getPageMessage(req)
    });
  } catch (error) {
    next(error);
  }
}

async function renderPublicProfile(req, res, next) {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const posts = await Post.find({ author: user._id })
      .populate("author", "name avatarUrl")
      .sort({ createdAt: -1 })
      .limit(20);

    res.render("pages/userProfile", {
      pageTitle: user.name,
      profileUser: user,
      posts,
      ...getPageMessage(req)
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  renderHome,
  renderLogin,
  renderRegister,
  renderCreatePost,
  renderSinglePost,
  renderProfile,
  renderPublicProfile
};
