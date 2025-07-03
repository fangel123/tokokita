const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const optionalAuth = require("../middleware/optionalAuth.middleware");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", optionalAuth, productController.getAllProducts);

router.get(
  "/my-products",
  authMiddleware(["Seller"]),
  productController.getMyProducts
);

router.get("/:id", optionalAuth, productController.getProductById);

router.post("/", authMiddleware(["Seller"]), productController.createProduct);

router.put("/:id", authMiddleware(["Seller"]), productController.updateProduct);

router.delete(
  "/:id",
  authMiddleware(["Seller"]),
  productController.deleteProduct
);

module.exports = router;
