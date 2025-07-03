const express = require("express");
const likeController = require("../controllers/like.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router({ mergeParams: true });

// Hanya user yang login yang bisa like
router.post(
  "/",
  authMiddleware(["Buyer", "Seller"]),
  likeController.toggleLike
);

module.exports = router;
