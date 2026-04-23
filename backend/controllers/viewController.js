const Post = require("../models/Post");

async function renderHome(req, res, next) {
  try {
    const posts = await Post.find()
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .limit(10);

    res.render("pages/dashboard", {
      pageTitle: "DevConnect Dashboard",
      posts
    });
  } catch (error) {
    next(error);
  }
}

function renderLogin(req, res) {
  res.render("pages/login", {
    pageTitle: "Login"
  });
}

function renderRegister(req, res) {
  res.render("pages/register", {
    pageTitle: "Register"
  });
}

function renderCreatePost(req, res) {
  res.render("pages/createPost", {
    pageTitle: "Create Post"
  });
}

async function renderSinglePost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name bio");

    if (!post) {
      return res.status(404).render("pages/post", {
        pageTitle: "Post Not Found",
        post: null
      });
    }

    return res.render("pages/post", {
      pageTitle: post.title,
      post
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  renderHome,
  renderLogin,
  renderRegister,
  renderCreatePost,
  renderSinglePost
};
