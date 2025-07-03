const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Mengambil semua kategori yang ada
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data kategori." });
  }
};
