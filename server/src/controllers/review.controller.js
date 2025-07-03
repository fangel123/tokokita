const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Fungsi untuk membuat review baru
exports.createReview = async (req, res) => {
  // Ambil data dari request
  const { productId } = req.params; // ID produk dari URL
  const userId = req.user.userId; // ID user dari token (didapat dari authMiddleware)
  const { rating, comment } = req.body; // Rating & komentar dari body request

  // Validasi dasar di backend
  if (!rating || !comment) {
    return res
      .status(400)
      .json({ message: "Rating dan komentar wajib diisi." });
  }

  try {
    // Simpan review baru ke database
    const newReview = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment,
        productId: parseInt(productId),
        userId: userId,
      },
      include: {
        // Kirim kembali data review dengan info user
        user: {
          select: { name: true },
        },
      },
    });

    res.status(201).json(newReview);
  } catch (error) {
    // Tangani kemungkinan error (misal: produk tidak ada)
    console.error("Error saat membuat review:", error);
    res
      .status(500)
      .json({ message: "Gagal membuat review.", error: error.message });
  }
};
