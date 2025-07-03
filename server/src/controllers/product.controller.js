const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function addAggregateData(products, userId) {
  // Pastikan products adalah array
  const productArray = Array.isArray(products) ? products : [products];

  return Promise.all(
    productArray.map(async (product) => {
      // Ambil data agregat
      const aggregate = await prisma.review.aggregate({
        _avg: { rating: true },
        where: { productId: product.id },
      });

      // Cek apakah user saat ini menyukai produk ini
      const isLiked = userId
        ? (await prisma.productLike.count({
            where: { productId: product.id, userId: userId },
          })) > 0
        : false;

      return {
        ...product,
        // Gunakan _count yang sudah ada dari query awal
        likes: product._count?.likes ?? 0,
        reviewsCount: product._count?.reviews ?? 0,
        averageRating: aggregate._avg.rating
          ? parseFloat(aggregate._avg.rating.toFixed(1))
          : 0,
        isLiked: isLiked,
        _count: undefined,
      };
    })
  );
}

// PUBLIC: Get semua produk dengan data agregat
exports.getAllProducts = async (req, res) => {
  const userId = req.user?.userId; // Ambil userId dari optionalAuth
  try {
    const products = await prisma.product.findMany({
      include: {
        seller: { select: { id: true, name: true } },
        _count: { select: { likes: true, reviews: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Gunakan helper function untuk memproses data
    const productsWithData = await addAggregateData(products, userId);
    res.json(productsWithData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUBLIC: Get produk tunggal berdasarkan ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.userId; // Ambil userId dari optionalAuth
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        seller: { select: { id: true, name: true } },
        reviews: {
          // Tetap sertakan reviews lengkap untuk halaman detail
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { likes: true, reviews: true } },
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    // Gunakan helper function untuk memproses data
    const [productDetail] = await addAggregateData(product, userId);

    // Gabungkan detail review dari query asli
    res.json({
      ...productDetail,
      reviews: product.reviews,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// SELLER ONLY: Mengambil semua produk milik seller yang login
exports.getMyProducts = async (req, res) => {
  const sellerId = req.user.userId; // Dari token
  try {
    const products = await prisma.product.findMany({
      where: { sellerId: sellerId },
      include: {
        // Sertakan data dari tabel Category yang berelasi
        category: {
          select: {
            name: true,
          },
        },
        _count: { select: { likes: true, reviews: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Kita bisa gunakan helper yang sama untuk menghitung rating rata-rata
    const productsWithAvgRating = await Promise.all(
      products.map(async (p) => {
        const aggregate = await prisma.review.aggregate({
          _avg: { rating: true },
          where: { productId: p.id },
        });
        return {
          ...p,
          likesCount: p._count.likes,
          reviewsCount: p._count.reviews,
          averageRating: aggregate._avg.rating
            ? parseFloat(aggregate._avg.rating.toFixed(1))
            : 0,
          _count: undefined, // Hapus _count agar response lebih bersih
        };
      })
    );

    res.json(productsWithAvgRating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// SELLER ONLY: Membuat produk baru
exports.createProduct = async (req, res) => {
  const { name, description, price, stock, imageUrl, categoryId } = req.body; // Tambah 'category' jika ada
  const sellerId = req.user.userId; // Didapat dari middleware otentikasi

  // Validasi dasar
  if (!name || !price || !stock) {
    return res
      .status(400)
      .json({ message: "Nama, harga, dan stok wajib diisi." });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        imageUrl,
        sellerId,
        categoryId: categoryId ? parseInt(categoryId) : null,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// SELLER ONLY: Memperbarui produk
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, imageUrl, categoryId } = req.body;
  const sellerId = req.user.userId;

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    // Otorisasi: Pastikan produk ini milik seller yang sedang login
    if (product.sellerId !== sellerId) {
      return res
        .status(403)
        .json({ message: "Akses ditolak. Anda bukan pemilik produk ini." });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        imageUrl,
        categoryId: categoryId ? parseInt(categoryId) : null,
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// SELLER ONLY: Menghapus produk
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  const sellerId = req.user.userId;

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    // Otorisasi
    if (product.sellerId !== sellerId) {
      return res
        .status(403)
        .json({ message: "Akses ditolak. Anda bukan pemilik produk ini." });
    }

    // Hapus data terkait terlebih dahulu (likes, reviews) sebelum menghapus produk
    // Prisma akan menangani ini jika onDelete: Cascade diatur di schema.prisma
    // Jika tidak, lakukan secara manual:
    // await prisma.productLike.deleteMany({ where: { productId: parseInt(id) } });
    // await prisma.review.deleteMany({ where: { productId: parseInt(id) } });

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send(); // 204 No Content, artinya berhasil tapi tidak ada body response
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
