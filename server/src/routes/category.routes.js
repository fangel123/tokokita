const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");

// Endpoint ini bersifat publik, siapa saja bisa melihat daftar kategori
router.get("/", categoryController.getAllCategories);

module.exports = router;
