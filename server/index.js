require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Impor rute
const authRoutes = require("./src/routes/auth.routes");
const productRoutes = require("./src/routes/product.routes");
const shippingRoutes = require("./src/routes/shipping.routes");
const categoryRoutes = require("./src/routes/category.routes");
const reviewRoutes = require("./src/routes/review.routes");
const likeRoutes = require("./src/routes/like.routes");
const sellerRoutes = require("./src/routes/seller.routes");
const orderRoutes = require("./src/routes/order.routes");

const app = express();
const PORT = process.env.PORT || 5001;

// Konfigurasi CORS
const corsOptions = {
  origin: [
    "http://localhost:5173", // Untuk development di lokal
    "https://tokokita-hazel.vercel.app", // URL frontend produksi Anda
  ],
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json()); // Mem-parsing body request JSON

// Rute API
app.get("/", (req, res) => {
  res.send("Selamat datang di API TokoKita!");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products/:productId/reviews", reviewRoutes);
app.use("/api/products/:productId/like", likeRoutes);

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
