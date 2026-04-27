const Post = require("../models/Post");
const Comment = require("../models/Comment");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const buildPostQuery = require("../services/postQueryService");

function isPageRequest(req) {
  return !req.originalUrl.startsWith("/api/") && req.accepts("html");
}

const createPost = catchAsync(async (req, res) => {
  const { title, content, excerpt, tags } = req.body;

  if (!title || !content) {
    throw new ApiError(400, "Title and content are required");
  }

  const post = await Post.create({
    title,
    content,
    excerpt: excerpt || content.slice(0, 140),
    tags: Array.isArray(tags)
      ? tags
      : typeof tags === "string" && tags.trim()
        ? tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : [],
    author: req.user._id
  });

  const populatedPost = await post.populate("author", "name email bio avatarUrl");

  if (isPageRequest(req)) {
    return res.redirect(`/posts/${post._id}?success=Post created successfully`);
  }

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    post: populatedPost
  });
});

const getAllPosts = catchAsync(async (req, res) => {
  const { filters, page, limit, skip } = buildPostQuery(req.query);

  const [posts, total] = await Promise.all([
    Post.find(filters)
      .populate("author", "name email bio avatarUrl")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Post.countDocuments(filters)
  ]);

  res.status(200).json({
    success: true,
    message: "Posts fetched successfully",
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    posts
  });
});

const getPostById = catchAsync(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author", "name email bio avatarUrl");

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const comments = await Comment.find({ post: post._id })
    .populate("author", "name email avatarUrl")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Post fetched successfully",
    post,
    comments
  });
});

const updatePost = catchAsync(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only update your own post");
  }

  const fields = ["title", "content", "excerpt"];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      post[field] = req.body[field];
    }
  });

  if (req.body.tags !== undefined) {
    post.tags = Array.isArray(req.body.tags)
      ? req.body.tags
      : String(req.body.tags)
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
  }

  await post.save();
  await post.populate("author", "name email bio avatarUrl");

  res.status(200).json({
    success: true,
    message: "Post updated successfully",
    post
  });
});

const deletePost = catchAsync(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own post");
  }

  await Comment.deleteMany({ post: post._id });
  await post.deleteOne();

  res.status(200).json({
    success: true,
    message: "Post deleted successfully"
  });
});

const toggleLikePost = catchAsync(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const userId = req.user._id.toString();
  const existingLike = post.likes.find((like) => like.toString() === userId);

  if (existingLike) {
    post.likes = post.likes.filter((like) => like.toString() !== userId);
  } else {
    post.likes.push(req.user._id);
  }

  await post.save();

  res.status(200).json({
    success: true,
    message: existingLike ? "Post unliked" : "Post liked",
    likesCount: post.likes.length,
    liked: !existingLike
  });
});

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLikePost
};
