const express = require("express");

const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");
const protect = require("../middlewares/authMiddleware");
const validateObjectId = require("../middlewares/validateObjectId");

const router = express.Router();

router.route("/")
  .get(postController.getAllPosts)
  .post(protect, postController.createPost);

router.get("/:id", validateObjectId("id"), postController.getPostById);
router.patch("/:id", protect, validateObjectId("id"), postController.updatePost);
router.delete("/:id", protect, validateObjectId("id"), postController.deletePost);
router.post("/:id/like", protect, validateObjectId("id"), postController.toggleLikePost);

router.get("/:postId/comments", validateObjectId("postId"), commentController.getCommentsByPost);
router.post("/:postId/comments", protect, validateObjectId("postId"), commentController.createComment);

module.exports = router;
