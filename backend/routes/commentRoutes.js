const express = require("express");

const commentController = require("../controllers/commentController");
const protect = require("../middlewares/authMiddleware");
const validateObjectId = require("../middlewares/validateObjectId");

const router = express.Router();

router.patch("/:id", protect, validateObjectId("id"), commentController.updateComment);
router.delete("/:id", protect, validateObjectId("id"), commentController.deleteComment);

module.exports = router;
