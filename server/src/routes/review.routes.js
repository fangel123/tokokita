const express = require("express");
const reviewController = require("../controllers/review.controller");
const authMiddleware = require("../middleware/auth.middleware");

// PENTING: Gunakan { mergeParams: true } agar bisa mengakses :productId dari router induk
const router = express.Router({ mergeParams: true });

// Rute untuk membuat review baru
// Hanya user yang sudah login (Buyer atau Seller) yang bisa membuat review
router.post(
  "/",
  authMiddleware(["Buyer", "Seller"]),
  reviewController.createReview
);

module.exports = router;
