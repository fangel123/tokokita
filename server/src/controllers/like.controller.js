const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.toggleLike = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.userId;

  try {
    // Cek apakah user sudah menyukai produk ini
    const existingLike = await prisma.productLike.findUnique({
      where: {
        userId_productId: {
          // Menggunakan index unik yang kita definisikan di schema
          userId: userId,
          productId: parseInt(productId),
        },
      },
    });

    if (existingLike) {
      // Jika sudah ada, hapus (unlike)
      await prisma.productLike.delete({
        where: {
          userId_productId: {
            userId: userId,
            productId: parseInt(productId),
          },
        },
      });
      res.json({ message: "Product unliked successfully." });
    } else {
      // Jika belum ada, buat (like)
      await prisma.productLike.create({
        data: {
          userId: userId,
          productId: parseInt(productId),
        },
      });
      res.json({ message: "Product liked successfully." });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Failed to toggle like." });
  }
};
