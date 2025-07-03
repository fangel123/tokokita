import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "../../contexts/ProductContext";
import ProductCard from "../../components/common/ProductCard";
import { Search, SlidersHorizontal } from "lucide-react";
import api from "../../lib/api";

const ProductsPage = () => {
  const { products, loading, error, fetchProducts } = useProducts();
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Panggil fetchProducts() sekali saat komponen pertama kali dimuat.
  // Context akan menyimpan data ini untuk komponen lain.
  useEffect(() => {
    // Ambil produk dari context
    if (products.length === 0) {
      fetchProducts();
    }
    // Ambil daftar kategori dari API
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data);
      } catch (err) {
        console.error("Gagal memuat kategori untuk filter", err);
      }
    };
    fetchCategories();
  }, [fetchProducts, products.length]);
  const filteredProducts = useMemo(() => {
    let tempProducts = products;

    // Filter berdasarkan kategori
    if (selectedCategory !== "All") {
      // Bandingkan categoryId produk dengan ID kategori yang dipilih (di-parse ke integer)
      tempProducts = tempProducts.filter(
        (p) => p.categoryId === parseInt(selectedCategory)
      );
    }

    // Filter berdasarkan pencarian
    if (searchTerm) {
      tempProducts = tempProducts.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return tempProducts;
  }, [products, searchTerm, selectedCategory]);

  if (loading)
    return (
      <div className="text-center py-10 text-xl font-semibold">
        Memuat produk...
      </div>
    );
  if (error)
    return (
      <div className="text-center py-10 text-xl text-red-600">{error}</div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Katalog Produk
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Temukan semua produk favorit Anda di sini.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-white rounded-lg shadow-md sticky top-[81px] z-40">
        <div className="relative flex-grow">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Cari produk..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <SlidersHorizontal
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <select
            className="w-full md:w-56 pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <AnimatePresence>
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center text-gray-500 text-xl py-10"
            >
              Oops! Produk yang Anda cari tidak ditemukan.
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductsPage;
