const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/seller.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Semua rute di sini diproteksi hanya untuk Seller
router.use(authMiddleware(["Seller"]));

router.get("/stats", sellerController.getStats);
router.get("/orders", sellerController.getOrders);
router.get("/reviews", sellerController.getReviews);

module.exports = router;
