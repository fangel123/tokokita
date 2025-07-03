import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Star } from "lucide-react";
import { useProductLike } from "../../hooks/useProductLike";

const ProductCard = ({ product }) => {
  const { isLiked, likeCount, handleLikeClick } = useProductLike(product);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300"
    >
      <Link to={`/products/${product.id}`}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {product.name}
          </h3>
          <p className="text-primary font-bold mt-1 text-xl">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(product.price)}
          </p>
          <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="ml-1">
                {product.averageRating || 0} ({product.reviewsCount || 0}{" "}
                reviews)
              </span>
            </div>
            <button
              onClick={handleLikeClick}
              className="flex items-center space-x-1 focus:outline-none"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isLiked ? "text-red-500 fill-current" : "text-gray-400"
                }`}
              />
              <span>{likeCount}</span>
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
