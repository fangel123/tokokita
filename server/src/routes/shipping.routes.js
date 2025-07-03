// const express = require("express");
// const router = express.Router();
// const shippingController = require("../controllers/shipping.controller");
// const authMiddleware = require("../middleware/auth.middleware");

// const requireLogin = authMiddleware(["Buyer", "Seller"]);

// // --- PERBAIKAN DI SINI ---
// // Rute untuk mendapatkan provinsi
// router.get("/provinces", requireLogin, shippingController.getProvinces);

// // Rute untuk mendapatkan kota berdasarkan ID provinsi
// router.get("/cities", requireLogin, shippingController.getCities);

// // Rute untuk menghitung ongkir
// router.post("/cost", requireLogin, shippingController.calculateCost);

// module.exports = router;

const express = require("express");
const router = express.Router();
const shippingController = require("../controllers/shipping.controller");
const authMiddleware = require("../middleware/auth.middleware");

const requireLogin = authMiddleware(["Buyer", "Seller"]);

// Rute untuk pencarian lokasi
router.get(
  "/destinations",
  requireLogin,
  shippingController.searchDestinations
);

// Rute untuk menghitung ongkir
router.post("/cost", requireLogin, shippingController.calculateCost);

module.exports = router;
