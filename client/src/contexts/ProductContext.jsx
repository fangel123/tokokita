import { createContext, useState, useCallback, useContext } from "react";
import api from "../lib/api";

export const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (err) {
      setError("Gagal memuat produk.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fungsi ini akan memperbarui satu produk di dalam state global `products`
  const updateProductInList = useCallback((productId, updatedData) => {
    setProducts((currentProducts) =>
      currentProducts.map((p) =>
        p.id === productId ? { ...p, ...updatedData } : p
      )
    );
  }, []);

  const value = {
    products,
    loading,
    error,
    fetchProducts,
    updateProductInList, // <-- Ekspor fungsi aksi ini
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
