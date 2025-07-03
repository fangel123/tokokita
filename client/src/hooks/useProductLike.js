import { useCallback } from "react";
import { useAuth } from "./useAuth";
import { useProducts } from "../contexts/ProductContext";
import api from "../lib/api";

export const useProductLike = (product) => {
  const { isAuthenticated } = useAuth();
  const { updateProductInList } = useProducts();

  const handleLikeClick = useCallback(
    async (e) => {
      e?.preventDefault(); // e bisa undefined ketika dipanggil dari parent
      if (!isAuthenticated) {
        alert("Silakan login terlebih dahulu untuk menyukai produk");
        return false; // Return false untuk indikasi tidak berhasil
      }

      const originalProductState = {
        isLiked: product.isLiked,
        likes: product.likes,
      };

      // Optimistic Update
      const updatedProduct = {
        isLiked: !product.isLiked,
        likes: product.isLiked ? product.likes - 1 : product.likes + 1,
      };

      updateProductInList(product.id, updatedProduct);

      try {
        await api.post(`/products/${product.id}/like`);
        return true; // Return true untuk indikasi berhasil
      } catch (error) {
        console.error("Error toggling like:", error);
        alert("Gagal mengubah status like.");
        updateProductInList(product.id, originalProductState);
        return false;
      }
    },
    [
      isAuthenticated,
      product.id,
      product.isLiked,
      product.likes,
      updateProductInList,
    ]
  );

  return {
    isLiked: product.isLiked,
    likeCount: product.likes,
    handleLikeClick,
  };
};
