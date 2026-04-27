const express = require("express");

const viewController = require("../controllers/viewController");
const authController = require("../controllers/authController");
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");
const userController = require("../controllers/userController");
const protect = require("../middlewares/authMiddleware");
const validateObjectId = require("../middlewares/validateObjectId");

const router = express.Router();

router.get("/", viewController.renderHome);
router.get("/login", viewController.renderLogin);
router.get("/register", viewController.renderRegister);
router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/logout", authController.logout);
router.get("/create-post", viewController.renderCreatePost);
router.post("/create-post", protect, postController.createPost);
router.get("/profile", viewController.renderProfile);
router.post("/profile", protect, (req, res, next) => {
  req.params.id = req.user._id.toString();
  next();
}, userController.updateUserProfile);
router.get("/users/:id", validateObjectId("id"), viewController.renderPublicProfile);
router.get("/posts/:id", validateObjectId("id"), viewController.renderSinglePost);
router.post("/posts/:id/like", protect, validateObjectId("id"), postController.toggleLikePost);
router.post("/posts/:postId/comments", protect, validateObjectId("postId"), commentController.createComment);

module.exports = router;
