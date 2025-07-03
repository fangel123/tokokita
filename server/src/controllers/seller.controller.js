const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 1. Endpoint untuk Statistik Ringkasan
exports.getStats = async (req, res) => {
  const sellerId = req.user.userId;
  try {
    // Ambil ID semua produk milik seller
    const sellerProducts = await prisma.product.findMany({
      where: { sellerId },
      select: { id: true },
    });
    const productIds = sellerProducts.map((p) => p.id);

    // Hitung total produk
    const totalProducts = productIds.length;

    // Hitung total pesanan masuk yang mengandung produk seller
    const totalOrders = await prisma.order.count({
      where: {
        items: {
          some: {
            productId: { in: productIds },
          },
        },
      },
    });

    // Hitung rating rata-rata dari semua produk seller
    const avgRating = await prisma.review.aggregate({
      where: { productId: { in: productIds } },
      _avg: { rating: true },
    });

    res.json({
      totalProducts,
      totalOrders,
      averageRating: avgRating._avg.rating
        ? parseFloat(avgRating._avg.rating.toFixed(1))
        : 0,
    });
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil statistik." });
  }
};

// 2. Endpoint untuk Daftar Pesanan
exports.getOrders = async (req, res) => {
  const sellerId = req.user.userId;
  try {
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            product: { sellerId: sellerId },
          },
        },
      },
      include: {
        buyer: { select: { name: true } },
        items: {
          where: {
            product: { sellerId: sellerId },
          },
          include: {
            product: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil pesanan." });
  }
};

// 3. Endpoint untuk Daftar Review
exports.getReviews = async (req, res) => {
  const sellerId = req.user.userId;
  try {
    const reviews = await prisma.review.findMany({
      where: {
        product: { sellerId: sellerId },
      },
      include: {
        user: { select: { name: true } },
        product: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil review." });
  }
};
