const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createOrder = async (req, res) => {
  const buyerId = req.user.userId; // Ambil ID pembeli dari token JWT
  const { items } = req.body; // Ambil daftar item dari body request

  if (!items || items.length === 0) {
    return res
      .status(400)
      .json({ message: "Keranjang belanja tidak boleh kosong." });
  }

  try {
    // Gunakan Prisma Transaction untuk memastikan semua operasi berhasil atau tidak sama sekali
    const newOrder = await prisma.$transaction(async (prisma) => {
      // 1. Ambil data produk asli dari DB untuk mendapatkan harga yang valid (mencegah manipulasi harga)
      const productIds = items.map((item) => item.productId);
      const productsFromDb = await prisma.product.findMany({
        where: { id: { in: productIds } },
      });

      // 2. Hitung total harga di backend agar aman
      let calculatedTotal = 0;
      for (const item of items) {
        const product = productsFromDb.find((p) => p.id === item.productId);
        if (!product) {
          throw new Error(
            `Produk dengan ID ${item.productId} tidak ditemukan.`
          );
        }
        if (product.stock < item.quantity) {
          throw new Error(
            `Stok untuk produk "${product.name}" tidak mencukupi.`
          );
        }
        calculatedTotal += product.price * item.quantity;
      }

      // 3. Buat record Order utama
      const order = await prisma.order.create({
        data: {
          buyerId: buyerId,
          total: calculatedTotal,
          status: "PAID", // Anggap langsung lunas
        },
      });

      // 4. Buat semua record OrderItem yang terhubung ke Order utama
      await prisma.orderItem.createMany({
        data: items.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: productsFromDb.find((p) => p.id === item.productId).price, // Simpan harga saat itu
        })),
      });

      // 5. Kurangi stok setiap produk
      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return order;
    });

    res
      .status(201)
      .json({ message: "Pesanan berhasil dibuat", orderId: newOrder.id });
  } catch (error) {
    console.error("Gagal membuat pesanan:", error);
    res
      .status(500)
      .json({
        error:
          error.message || "Terjadi kesalahan internal saat membuat pesanan.",
      });
  }
};
