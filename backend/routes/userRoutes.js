const express = require("express");

const userController = require("../controllers/userController");
const protect = require("../middlewares/authMiddleware");
const validateObjectId = require("../middlewares/validateObjectId");

const router = express.Router();

router.get("/stats", userController.getUserStats);
router.get("/", userController.getPublicUsers);
router.get("/:id", validateObjectId("id"), userController.getUserProfile);
router.put("/:id", protect, validateObjectId("id"), userController.updateUserProfile);

module.exports = router;
