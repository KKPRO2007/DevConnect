const Comment = require("../models/Comment");
const Post = require("../models/Post");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

const getCommentsByPost = catchAsync(async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate("author", "name email avatarUrl")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Comments fetched successfully",
    comments
  });
});

const createComment = catchAsync(async (req, res) => {
  if (!req.body.content) {
    throw new ApiError(400, "Comment content is required");
  }

  const post = await Post.findById(req.params.postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const comment = await Comment.create({
    content: req.body.content,
    author: req.user._id,
    post: req.params.postId
  });

  await comment.populate("author", "name email avatarUrl");

  res.status(201).json({
    success: true,
    message: "Comment added successfully",
    comment
  });
});

const updateComment = catchAsync(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only update your own comment");
  }

  if (!req.body.content) {
    throw new ApiError(400, "Comment content is required");
  }

  comment.content = req.body.content;
  await comment.save();
  await comment.populate("author", "name email avatarUrl");

  res.status(200).json({
    success: true,
    message: "Comment updated successfully",
    comment
  });
});

const deleteComment = catchAsync(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own comment");
  }

  await comment.deleteOne();

  res.status(200).json({
    success: true,
    message: "Comment deleted successfully"
  });
});

module.exports = {
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment
};
