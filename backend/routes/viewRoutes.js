const express = require("express");

const viewController = require("../controllers/viewController");

const router = express.Router();

router.get("/", viewController.renderHome);
router.get("/login", viewController.renderLogin);
router.get("/register", viewController.renderRegister);
router.get("/create-post", viewController.renderCreatePost);
router.get("/posts/:id/view", viewController.renderSinglePost);

module.exports = router;
