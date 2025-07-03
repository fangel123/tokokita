import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import api from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";
import { useProducts } from "../../contexts/ProductContext";
import { Star, Heart } from "lucide-react";
import Button from "../../components/ui/Button";
import { useProductLike } from "../../hooks/useProductLike";
import { useCart } from "../../contexts/CartContext";

const reviewSchema = z.object({
  rating: z.coerce.number().min(1, "Rating harus diisi").max(5),
  comment: z.string().min(5, "Komentar minimal 5 karakter.").max(500),
});

const LikeButton = ({ product, onLikeSuccess }) => {
  const { isLiked, likeCount, handleLikeClick } = useProductLike(product);

  const handleClick = async (e) => {
    const success = await handleLikeClick(e);
    if (success && onLikeSuccess) {
      onLikeSuccess();
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center text-gray-500 cursor-pointer"
    >
      <Heart
        className={`w-6 h-6 transition-colors ${
          isLiked ? "text-red-500 fill-current" : "text-gray-400"
        }`}
      />
      <span className="ml-1 text-lg">{likeCount}</span>
    </div>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate;
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart(); // <-- 3. Ambil fungsi addToCart
  const { fetchProducts } = useProducts();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [reviewErrors, setReviewErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fungsi ini hanya untuk mengambil detail produk spesifik untuk halaman ini
  const fetchProductDetail = useCallback(async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (err) {
      setError("Produk tidak ditemukan atau gagal dimuat.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    fetchProductDetail();
  }, [fetchProductDetail]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewErrors({});
    setIsSubmitting(true);
    const reviewData = { rating: newRating, comment: newComment };

    const result = reviewSchema.safeParse(reviewData);
    if (!result.success) {
      setReviewErrors(result.error.format());
      setIsSubmitting(false);
      return;
    }

    try {
      await api.post(`/products/${id}/reviews`, result.data);
      alert("Review Anda berhasil dikirim!");
      setNewRating(0);
      setNewComment("");

      // SINKRONISASI DATA SETELAH REVIEW
      await fetchProductDetail(); // 1. Refresh halaman detail ini
      await fetchProducts(); // 2. Refresh daftar produk global di context
    } catch (err) {
      alert("Gagal mengirim review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      alert(`"${product.name}" telah ditambahkan ke keranjang!`);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product);
      // Langsung arahkan ke halaman checkout
      navigate("/checkout");
    }
  };

  const handleLikeUpdate = async () => {
    await fetchProductDetail();
  };

  if (loading)
    return <div className="text-center py-10 font-semibold">Memuat...</div>;
  if (error || !product)
    return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <motion.img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                <span className="ml-2 text-xl font-semibold text-gray-700">
                  {product.averageRating || 0}
                </span>
                <span className="ml-2 text-gray-500">
                  ({product.reviews?.length || 0} reviews)
                </span>
              </div>
              <LikeButton
                product={product}
                onLikeSuccess={fetchProductDetail}
              />{" "}
            </div>
            <p className="text-3xl font-bold text-primary mb-6">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(product.price)}
            </p>
            <p className="text-gray-600 mb-6">{product.description}</p>
            <p className="text-md font-semibold text-gray-700">
              Sisa Stok: <span className="text-green-600">{product.stock}</span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Dijual oleh:{" "}
              <Link
                to={`/seller/${product.seller.id}`}
                className="text-primary hover:underline"
              >
                {product.seller.name}
              </Link>
            </p>
            <div className="mt-8 flex space-x-4">
              <Button onClick={handleAddToCart}>Tambah ke Keranjang</Button>
              <Button
                onClick={handleBuyNow}
                className="bg-green-500 hover:bg-green-600"
              >
                Beli Sekarang
              </Button>
            </div>
          </div>
        </div>

        {/* Bagian review */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 pb-2">
            Review Pelanggan
          </h2>
          {isAuthenticated ? (
            <motion.div layout className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">Tulis Review Anda</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Rating Anda:
                  </label>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-8 h-8 cursor-pointer ${
                          newRating >= star
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                        onClick={() => setNewRating(star)}
                      />
                    ))}
                  </div>
                  {reviewErrors.rating && (
                    <p className="text-red-500 text-sm mt-1">
                      {reviewErrors.rating._errors[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="comment" className="block text-gray-700 mb-2">
                    Komentar:
                  </label>
                  <textarea
                    id="comment"
                    rows="4"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={isSubmitting}
                  ></textarea>
                  {reviewErrors.comment && (
                    <p className="text-red-500 text-sm mt-1">
                      {reviewErrors.comment._errors[0]}
                    </p>
                  )}
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Mengirim..." : "Kirim Review"}
                </Button>
              </form>
            </motion.div>
          ) : (
            <p className="text-gray-500 bg-gray-100 p-4 rounded-md">
              <Link
                to="/login"
                className="font-semibold text-primary hover:underline"
              >
                Login
              </Link>{" "}
              untuk menulis review.
            </p>
          )}

          {/* Daftar review yang ada */}
          <div className="space-y-6">
            {product.reviews.length > 0 ? (
              product.reviews.map((review) => (
                <div key={review.id} className="border-b pb-4">
                  <div className="flex items-center mb-2">
                    <p className="font-bold mr-4">{review.user.name}</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < review.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                Belum ada review untuk produk ini.
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetailPage;
