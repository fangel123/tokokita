const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Endpoint ini harus diproteksi, hanya user yang login yang bisa membuat pesanan
router.post(
  "/",
  authMiddleware(["Buyer", "Seller"]),
  orderController.createOrder
);

module.exports = router;
