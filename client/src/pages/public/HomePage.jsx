import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useProducts } from "../../contexts/ProductContext";
import ProductCard from "../../components/common/ProductCard";
import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";

const HomePage = () => {
  // Ambil data dan fungsi dari ProductContext
  const { products, loading, error, fetchProducts } = useProducts();

  // Ambil data produk saat komponen pertama kali dimuat jika belum ada
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  // Gunakan useMemo untuk mengambil 4 produk pertama.
  // Ini akan otomatis diperbarui jika 'products' di context berubah.
  const featuredProducts = useMemo(() => products.slice(0, 4), [products]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <section className="text-center bg-white p-10 rounded-lg shadow-md mb-12">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-4xl font-extrabold text-gray-800 mb-4"
        >
          Selamat Datang di TokoKita
        </motion.h1>
        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
          Platform e-commerce modern untuk menemukan produk favorit Anda dan
          mendukung penjual lokal.
        </p>
        <Link to="/products">
          <Button>Jelajahi Semua Produk</Button>
        </Link>
      </section>

      {/* Featured Products Section */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Produk Unggulan
        </h2>
        {loading && <p>Memuat produk unggulan...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </motion.div>
  );
};

export default HomePage;
